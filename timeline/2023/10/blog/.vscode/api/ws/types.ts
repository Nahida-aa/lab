import type { WSContext } from "hono/ws";
import type { notificationType } from "../../lib/services/notification/index.t";
import type { MsgOut } from "@/lib/services/community/msg.t";

// 客户端发送的数据类型
export type ClientWsData =
  | {
      op: "identify"; // TODO: 确认, 服务端验证后 hello
    }
  | {
      op: "enterCommunity"; // 偏向 临时、状态性、随时可退出
      d: {
        communityId: string;
        userId: string;
      };
    };
// | {
//   op: "joinChannel" // 偏向 持久、记录、成为一部分; 暂时弃用, 让客户端用 http 发生 加入
//   d: {
//     channelId: string;
//     userId: string;
//   }
// }
// 服务器发送的数据类型
export type ServerWsData =
  // | {
  //   op: "ready" // TODO:
  //   d: {
  //     // communityList: CommunitySelect[];
  //     //
  //   }
  // }
  | {
      op: typeof notificationType.friend_request;
      d: {
        senderId: string;
        friendTableId: string;
        msg: string;
      };
    }
  | {
      op: "newMessage";
      d: MsgOut;
    }
  | {
      op: "userEnter";
      d: {
        communityId: string;
        userId: string;
      };
    }
  | {
      op: "userJoined";
      d: {
        communityId: string;
        userId: string;
      };
    };

// export interface CustomWSContext extends WSContext<WebSocket> {
//   channelId?: string;
//   userId?: string;
// }
export type CustomWSContext = WSContext<WebSocket>;
