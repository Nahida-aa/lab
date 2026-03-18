import app from "@/app"

app.get('/', (c) => c.text('Hello Cloudflare Workers!'))

export default app

// 