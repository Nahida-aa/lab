/** @jsx h */
/** @jsxFrag Fragment */
import { html, h } from 'hono/html'

export default function Home() {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body>
        <div id="now-time"></div>
        {html`
          <script>
            const ws = new WebSocket('ws://localhost:8000/ws')
            const $nowTime = document.getElementById('now-time')
            ws.onmessage = (event) => {
              $nowTime.textContent = event.data
            }
          </script>
        `}
      </body>
    </html>
  )
}
// app.get('/', (c: Context) => {
//   return c.html(
//     <html>
//       <head>
//         <meta charset='UTF-8' />
//       </head>
//       <body>
//         <div id='now-time'></div>
//         {html`
//           <script>
//             const ws = new WebSocket('ws://localhost:8000/ws')
//             const $nowTime = document.getElementById('now-time')
//             ws.onmessage = (event) => {
//               $nowTime.textContent = event.data
//             }
//           </script>
//         `}
//       </body>
//     </html>
//   )
// })