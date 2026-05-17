'use client'
import React, { useState, useEffect, useRef } from 'react';
// 开发: ws://localhost:8000/api/ws, 生产: ws://api.nahida-aa.us.kg/api/ws
// const WS_url = process.env.NODE_ENV === 'development' ? 'ws://localhost:3000/api/ws' : 'wss://api.nahida-aa.us.kg/api/ws';
const WS_url = process.env.NODE_ENV === 'development' ? 'ws://127.0.0.1:8787/ws' : 'wss://api.nahida-aa.us.kg/api/ws';
// const WS_url = process.env.NODE_ENV === 'development' ? 'wss://mcc-hono-cf.nahida-aa.workers.dev/ws' : 'wss://api.nahida-aa.us.kg/api/ws';

export default function WSPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(WS_url)

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    ws.current.onmessage = function(event) {
      setMessages(prevMessages => [...prevMessages, event.data]);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    if (inputRef.current && ws.current) {
      const event_data = {
        type: 'broadcast',
        value: inputRef.current.value
      }
      ws.current.send(JSON.stringify(event_data));
      inputRef.current.value = '';
    }
  }

  return <div>
    {isConnected ? <div>Connected</div> : <div>Disconnected</div>}
    <form onSubmit={sendMessage}>
      <input type="text" id="messageText" ref={inputRef} />
      <button type="submit">Send</button>
    </form>
    <ul id='messages'>
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  </div>
}