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
    <script src="/static/chat.js"></script>
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