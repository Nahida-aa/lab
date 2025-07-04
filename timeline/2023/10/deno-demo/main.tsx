import { Hono } from 'hono'
import type { Context } from 'hono'
import { upgradeWebSocket } from 'hono/deno'
import { html } from 'hono/html'
import type { PropsWithChildren } from 'hono/jsx'
import { WSContext } from "hono/ws";

const app = new Hono()

const Layout = ({ title, children }: PropsWithChildren<{ title: string }>) => {
  return (<html>
    <meta charset='UTF-8' />
    <title>{title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <body class="bg-gray-50 min-h-screen">
      <div class="max-w-lg mx-auto mt-8 shadow-lg rounded-lg bg-white p-6">
        <h2 class="text-2xl font-bold mb-4 text-center text-blue-700">{title}</h2>
        {children}
      </div>
    </body>
  </html>)
}

app.get('/', (c: Context) => {
  return c.html(<Layout title={'chat room'}>
    <div class="flex items-center gap-4 mb-4">
      <span
        id="status"
        class="inline-block px-4 py-1 rounded-full text-white bg-gray-400 transition-colors font-mono"
      >
        <span id="seconds">0</span>s
      </span>
    </div>

    <div class="mb-3 flex items-center gap-2">
      <span id="login-area" class="flex items-center gap-2">
        <span class="text-gray-600">用户名</span>
        <input id="username" autocomplete="off" class="border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-400" />
        <button id="login-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition">登录</button>
      </span>
      <span id="logout-area" style="display:none;" class="flex items-center gap-2">
        <span id="current-user" class="text-green-600 font-semibold"></span>
        <button id="logout-btn" class="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition">退出</button>
      </span>
    </div>

    <div class="mb-2 text-sm text-gray-600">
      在线用户：<span id="users" class="text-blue-600"></span>
    </div>
    <div
      id="chat"
      class="mb-2 bg-gray-100 border rounded p-3 h-52 overflow-y-auto text-sm shadow-inner"
      style="min-height:120px;"
    ></div>
    <input
      id="msg"
      placeholder="输入消息并回车发送"
      autocomplete="off"
      disabled
      class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400 bg-white"
    />

    {html`<script>
      let ws = null
      let username = ''
      const $chat = document.getElementById('chat')
      const $msg = document.getElementById('msg')
      const $users = document.getElementById('users')
      const $loginArea = document.getElementById('login-area')
      const $logoutArea = document.getElementById('logout-area')
      const $username = document.getElementById('username')
      const $loginBtn = document.getElementById('login-btn')
      const $logoutBtn = document.getElementById('logout-btn')
      const $currentUser = document.getElementById('current-user')
      const $status = document.getElementById('status')
      const $seconds = document.getElementById('seconds')
      let timer = null
      let seconds = 0

      window.onload = () => {
        const saved = localStorage.getItem('chat-username')
        if (saved) {
          username = saved
          $username.value = saved
          connect()
          $loginArea.style.display = 'none'
          $logoutArea.style.display = ''
          $currentUser.textContent = '当前用户：' + username
          $msg.disabled = false
          $msg.focus()
        }
      }
      function renderMsg(data) {
        const div = document.createElement('div')
        div.textContent = \`[\${data.time || ''}] \${data.user ? data.user + ': ' : ''}\${data.text}\`
        if (data.type === 'system') div.style.color = '#888'
        $chat.appendChild(div)
        $chat.scrollTop = $chat.scrollHeight
      }

      function updateStatus(online) {
        if (online) {
          $status.style.background = '#4caf50'
          $status.style.color = '#fff'
          seconds = 0
          $seconds.textContent = seconds
          if (timer) clearInterval(timer)
          timer = setInterval(() => {
            seconds++
            $seconds.textContent = seconds
          }, 1000)
        } else {
          $status.style.background = '#f44336'
          $status.style.color = '#fff'
          if (timer) clearInterval(timer)
          timer = null
          seconds = 0
          $seconds.textContent = seconds
        }
      }
      function connect() {
        const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
        ws = new WebSocket(protocol + '://' + location.host + '/ws')
        ws.onopen = () => {
          ws.send(JSON.stringify({type: 'login', user: username}))
          updateStatus(true)
        }
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'msg' || data.type === 'system') {
          renderMsg(data)
        } else if (data.type === 'users') {
          $users.textContent = data.users.join(', ')
        }
      }
        ws.onclose = () => {
          $msg.disabled = true
          $loginArea.style.display = ''
          $logoutArea.style.display = 'none'
          $users.textContent = ''
          $chat.innerHTML = ''
          updateStatus(false)
        }
      }

      $loginBtn.onclick = () => {
        username = $username.value.trim()
        if (!username) return alert('请输入用户名')
        localStorage.setItem('chat-username', username) // 保存
        connect()
        $loginArea.style.display = 'none'
        $logoutArea.style.display = ''
        $currentUser.textContent = '当前用户：' + username
        $msg.disabled = false
        $msg.focus()
      }

      $logoutBtn.onclick = () => {
        if (ws) {
          ws.send(JSON.stringify({type: 'logout'}))
          ws.close()
        }
        localStorage.removeItem('chat-username') // 清除
        $loginArea.style.display = ''
        $logoutArea.style.display = 'none'
        $msg.disabled = true
        $username.value = ''
        username = ''
        $users.textContent = ''
        $chat.innerHTML = ''
        updateStatus(false)
      }

      $msg.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && $msg.value.trim() && ws && ws.readyState === 1) {
          ws.send(JSON.stringify({type: 'msg', text: $msg.value}))
          $msg.value = ''
        }
      })
    </script>`}
  </Layout>)
})

// 存储所有已连接的 WebSocket 客户端及用户名
const clients = new Map<WSContext<WebSocket>, string>()

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    let user = ''
    return {
      onOpen: (event) => {// 等待客户端发送登录信息
      },
      onMessage(event, ws) {
        try {
          const data = JSON.parse(event.data.toString())
          if (data.type === 'login') {
            user = data.user
            clients.set(ws, user)
            broadcastUsers()
            broadcastSystemMsg(`${user} 加入了聊天室`)
          } else if (data.type === 'msg') {
            if (user) broadcastMsg(user, data.text)
          } else if (data.type === 'logout') {
            ws.close()
          }
        } catch { }
      },
      onClose: (event, ws) => {
        if (clients.has(ws)) {
          broadcastSystemMsg(`${clients.get(ws)} 离开了聊天室`)
        }
        clients.delete(ws)
        broadcastUsers()
      },
      onError: (event, ws) => {
        clients.delete(ws)
        broadcastUsers()
      }
    }
  })
)

// 广播聊天消息
function broadcastMsg(user: string, text: string) {
  const msg = JSON.stringify({ type: 'msg', user, text, time: new Date().toLocaleTimeString() })
  for (const ws of clients.keys()) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg)
    }
  }
}

// 广播系统消息
function broadcastSystemMsg(text: string) {
  const msg = JSON.stringify({ type: 'system', text, time: new Date().toLocaleTimeString() })
  for (const ws of clients.keys()) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg)
    }
  }
}

// 广播在线用户列表
function broadcastUsers() {
  const users = Array.from(clients.values())
  const msg = JSON.stringify({ type: 'users', users })
  for (const ws of clients.keys()) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg)
    }
  }
}

// 获取本机局域网IP并打印 deno run -A main.tsx
const nets = Deno.networkInterfaces?.() ?? [];
let lanIps: string[] = [];
for (const net of nets) {
  if (net.family === "IPv4") {
    lanIps.push(net.address);
  }
}
console.log("本机局域网IP地址：");
lanIps.forEach(ip => {
  console.log(`  http://${ip}:8000`);
});
Deno.serve(app.fetch)  // Deno.serve({ hostname: "0.0.0.0", port: 8000 }, app.fetch)