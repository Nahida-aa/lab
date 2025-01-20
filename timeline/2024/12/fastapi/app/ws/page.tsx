'use client'
import React, { useState, useEffect, useRef } from 'react';

export default function WSPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/api/ws");

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
      ws.current.send(inputRef.current.value);
      inputRef.current.value = '';
    }
  }

  return (
    <div>
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
  );
}