// "use client";

// import { Button } from "@heroui/button";
// import { useEffect, useState } from "react";
// import { useWebSocket } from "./ws.provider";
// import { ErrRes } from "../../api/app/utils";
// import cApi from "../../api/app/client";
// import { toast } from "../../app/a/ui/toast";

// export const Chat = ({
//   userId,
//   channelId,
// }: {
//   userId: string;
//   channelId: string;
// }) => {
//   const { socket, isConnected, sendData } = useWebSocket();
//   const [content, setContent] = useState<string>("");
//   const [messages, setMessages] = useState<any[]>([]);
//   const [isSending, setIsSending] = useState(false);
//   const [isAnonymous, setIsAnonymous] = useState(true);

//   // 监听消息和加入频道
//   useEffect(() => {
//     if (!socket || !isConnected) return;

//     // 加入频道
//     // if (isAnonymous) {
//     //   sendData({
//     //     op: "joinChannel",
//     //     d: {
//     //       channelId,
//     //       userId,
//     //     },
//     //   });
//     // }

//     // 监听新消息
//     const handleMessage = (event: MessageEvent) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.op === "newMessage") {
//           console.log("Chat::New message received:", data);
//           setMessages((prev) => [...prev, data.d]);
//         } else if (data.op === "userJoined") {
//           console.log("Chat::User joined:", data);
//         }
//       } catch (error) {
//         console.error("Error parsing message:", error);
//       }
//     };

//     socket.addEventListener("message", handleMessage);

//     return () => {
//       socket.removeEventListener("message", handleMessage);
//     };
//   }, [socket, isConnected, userId, channelId, sendData]);

//   const handleSendMessage = async () => {
//     if (!content.trim()) return;

//     try {
//       setIsSending(true);
//       const message = {
//         channelId,
//         userId,
//         content: content,
//         contentType: "text",
//       };

//       // 通过 HTTP API 发送消息（会触发 WebSocket 广播）
//       // const { data, error } = await cApi.channel.channel.message.$post(message);
//       const ret = await cApi.sendChannelMessage(message);

//       toast.success(`Message sent: ${ret}`);
//       setContent("");
//     } catch (error) {
//       console.error("Send message error:", error);
//       toast.error("Failed to send message");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center p-4 space-y-4">
//       <div className="w-full max-w-md">
//         <p>Connected: {isConnected ? "Yes" : "No"}</p>
//         <div>
//           <p>User ID: {userId}</p>
//           <p>Channel ID: {channelId}</p>
//           <p>Messages: {messages.length}</p>
//         </div>

//         {/* 消息列表 */}
//         <div className="border rounded p-4 h-64 overflow-y-auto mb-4">
//           {messages.map((msg, index) => (
//             <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
//               <strong>{msg.userId}:</strong> {msg.content}
//             </div>
//           ))}
//           {messages.length === 0 && (
//             <p className="text-gray-500">No messages yet...</p>
//           )}
//         </div>

//         {/* 输入框 */}
//         <div className="flex space-x-2">
//           <input
//             type="text"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Type your message..."
//             className="flex-1 px-3 py-2 border rounded"
//             onKeyPress={(e) => {
//               if (e.key === "Enter" && !isSending) {
//                 if (!userId) {
//                   toast.error("User ID is required to send messages");
//                   return;
//                 }
//                 handleSendMessage();
//               }
//             }}
//           />
//           <Button
//             onPress={handleSendMessage}
//             disabled={isSending || !content.trim()}
//           >
//             {isSending ? "Sending..." : "Send"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };
