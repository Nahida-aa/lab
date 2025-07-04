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
div.textContent = `[${data.time || ''}] ${data.user ? data.user + ': ' : ''}${data.text}`
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