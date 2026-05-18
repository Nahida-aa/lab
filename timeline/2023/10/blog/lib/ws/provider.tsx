"use client";
// lib/ws/provider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { io as ioClient, type Socket } from "socket.io-client";
import { wsPath } from "../config";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";
import { toast } from "@/app/a/ui/toast";

// type Transport = "polling" | "websocket" | "N/A";
interface IoClient extends Socket<ServerToClientEvents, ClientToServerEvents> {}
const SocketIoContext = createContext({
  io: null as IoClient | null,
  isConnected: false,
  transport: "N/A",
});
export const useSocketIo = () => {
  return useContext(SocketIoContext);
};

export const SocketIoProvider = ({ children }: { children: React.ReactNode }) => {
  const [io, setIo] = useState<IoClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  useEffect(() => {
    const socket: IoClient = ioClient(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: wsPath,
      addTrailingSlash: false,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    });
    socket.on("disconnect", () => {
      // socket.emit("");
      setIsConnected(false);
      setTransport("N/A");
    });
    socket.on("friend_request", (data) => {
      toast.msg(data.username, data.image, data.msg);
    });
    setIo(socket);
    return () => {
      socket.disconnect();
    };
  }, []);
  const value = { io, isConnected, transport };

  return <SocketIoContext.Provider value={value}>{children}</SocketIoContext.Provider>;
};
