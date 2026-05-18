// /**
//  * Discord风格的权限系统
//  * 使用64位位掩码表示权限
//  */


// // 权限位定义
// export const PERMISSIONS = {
//   // === 通用权限 ===
//   CREATE_INSTANT_INVITE: BigInt(1) << BigInt(0),
//   MANAGE_CHANNELS: BigInt(1) << BigInt(1),
//   MANAGE_COMMUNITY: BigInt(1) << BigInt(2),
//   VIEW_AUDIT_LOG: BigInt(1) << BigInt(3),
//   VIEW_COMMUNITY_INSIGHTS: BigInt(1) << BigInt(4),

//   // === 文本权限 ===
//   VIEW_CHANNELS: BigInt(1) << BigInt(10),
//   SEND_MESSAGES: BigInt(1) << BigInt(11),
//   SEND_TTS_MESSAGES: BigInt(1) << BigInt(12),
//   MANAGE_MESSAGES: BigInt(1) << BigInt(13),
//   EMBED_LINKS: BigInt(1) << BigInt(14),
//   ATTACH_FILES: BigInt(1) << BigInt(15),
//   READ_MESSAGE_HISTORY: BigInt(1) << BigInt(16),
//   MENTION_EVERYONE: BigInt(1) << BigInt(17),
//   USE_EXTERNAL_EMOJIS: BigInt(1) << BigInt(18),
//   ADD_REACTIONS: BigInt(1) << BigInt(19),
//   USE_SLASH_COMMANDS: BigInt(1) << BigInt(20),

//   // === 语音权限 ===
//   CONNECT: BigInt(1) << BigInt(21),
//   SPEAK: BigInt(1) << BigInt(22),
//   MUTE_MEMBERS: BigInt(1) << BigInt(23),
//   DEAFEN_MEMBERS: BigInt(1) << BigInt(24),
//   MOVE_MEMBERS: BigInt(1) << BigInt(25),
//   USE_VAD: BigInt(1) << BigInt(26),
//   PRIORITY_SPEAKER: BigInt(1) << BigInt(27),

//   // === 管理权限 ===
//   MANAGE_NICKNAMES: BigInt(1) << BigInt(28),
//   MANAGE_ROLES: BigInt(1) << BigInt(29),
//   MANAGE_WEBHOOKS: BigInt(1) << BigInt(30),
//   MANAGE_EMOJIS: BigInt(1) << BigInt(31),

//   // === 高级权限 ===
//   KICK_MEMBERS: BigInt(1) << BigInt(40),
//   BAN_MEMBERS: BigInt(1) << BigInt(41),
//   ADMIN: BigInt(1) << BigInt(42),

//   // === 项目特定权限 ===
//   MANAGE_PROJECT: BigInt(1) << BigInt(50),
//   UPLOAD_FILES: BigInt(1) << BigInt(51),
//   MANAGE_VERSIONS: BigInt(1) << BigInt(52),
//   REVIEW_SUBMISSIONS: BigInt(1) << BigInt(53),
//   MANAGE_DEPENDENCIES: BigInt(1) << BigInt(54),
//   VIEW_ANALYTICS: BigInt(1) << BigInt(55),
// } as const;

// // 权限组合
// export const PermissionPresets = {
//   VIEW_ONLY: PERMISSIONS.VIEW_CHANNELS | PERMISSIONS.READ_MESSAGE_HISTORY,
//   MEMBER:
//     PERMISSIONS.VIEW_CHANNELS |
//     PERMISSIONS.SEND_MESSAGES |
//     PERMISSIONS.ADD_REACTIONS |
//     PERMISSIONS.ATTACH_FILES |
//     PERMISSIONS.READ_MESSAGE_HISTORY |
//     PERMISSIONS.USE_SLASH_COMMANDS,
//   CONTRIBUTOR:
//     PERMISSIONS.VIEW_CHANNELS |
//     PERMISSIONS.SEND_MESSAGES |
//     PERMISSIONS.ADD_REACTIONS |
//     PERMISSIONS.ATTACH_FILES,
//   MAINTAINER:
//     PERMISSIONS.VIEW_CHANNELS |
//     PERMISSIONS.SEND_MESSAGES |
//     PERMISSIONS.ADD_REACTIONS |
//     PERMISSIONS.ATTACH_FILES |
//     PERMISSIONS.READ_MESSAGE_HISTORY |
//     PERMISSIONS.USE_SLASH_COMMANDS |
//     PERMISSIONS.UPLOAD_FILES |
//     PERMISSIONS.MANAGE_VERSIONS |
//     PERMISSIONS.MANAGE_MESSAGES |
//     PERMISSIONS.MANAGE_CHANNELS |
//     PERMISSIONS.KICK_MEMBERS |
//     PERMISSIONS.REVIEW_SUBMISSIONS,
//   OWNER: PERMISSIONS.ADMIN,
//   DEFAULT_ROLE:
//     PERMISSIONS.VIEW_CHANNELS |
//     PERMISSIONS.SEND_MESSAGES |
//     PERMISSIONS.READ_MESSAGE_HISTORY,
// } as const;

// // 工具函数（原 PermissionUtils 静态方法改为模块函数）
// export function hasPermission(userPermissions: bigint, permission: bigint): boolean {
//   if ((userPermissions & PERMISSIONS.ADMIN) === PERMISSIONS.ADMIN) {
//     return true;
//   }
//   return (userPermissions & permission) === permission;
// }

// export function addPermission(permissions: bigint, permission: bigint): bigint {
//   return permissions | permission;
// }

// export function removePermission(permissions: bigint, permission: bigint): bigint {
//   return permissions & ~permission;
// }

// export function togglePermission(permissions: bigint, permission: bigint): bigint {
//   return permissions ^ permission;
// }

// export function getPermissionList(permissions: bigint): string[] {
//   const permissionList: string[] = [];
//   for (const [name, value] of Object.entries(PERMISSIONS)) {
//     if (hasPermission(permissions, value)) {
//       permissionList.push(name);
//     }
//   }
//   return permissionList;
// }

// export function calculateChannelPermissions(
//   memberPermissions: bigint, // 用户在该社区或服务器的 基础权限(通常是角色组合后的权限位掩码)
//   channelOverwrites: Array<{ // 频道的权限覆盖列表: channel.permissionOverwrites
//     allow: string; // 允许的权限位
//     deny: string; // 拒绝的权限位
//     type: "role" | "member"; // 表示是针对角色还是针对用户
//     id: string; // 对应角色ID或用户ID
//   }>,
//   userId: string,
//   userRoles: string[], // 当前用户拥有的角色 ID 列表
// ): bigint {
//   let permissions = memberPermissions; // 初始化权限

//   // 应用角色覆写
//   for (const overwrite of channelOverwrites) {
//     if (overwrite.type === "role" && userRoles.includes(overwrite.id)) {
//       permissions = permissions & ~BigInt(overwrite.deny); // 移除被拒绝的权限
//       permissions = permissions | BigInt(overwrite.allow); // 添加允许的权限
//     }
//   }

//   // 应用用户覆写, 用户覆写优先级最高
//   for (const overwrite of channelOverwrites) {
//     if (overwrite.type === "member" && overwrite.id === userId) {
//       permissions = permissions & ~BigInt(overwrite.deny);
//       permissions = permissions | BigInt(overwrite.allow);
//     }
//   }

//   return permissions;
// }

// // 权限名称映射（UI显示用）
// export const PermissionNames: Record<string, string> = {
//   CREATE_INSTANT_INVITE: "创建邀请链接",
//   MANAGE_CHANNELS: "管理频道",
//   MANAGE_COMMUNITY: "管理社区",
//   VIEW_AUDIT_LOG: "查看审计日志",
//   VIEW_COMMUNITY_INSIGHTS: "查看社区统计",
//   VIEW_CHANNELS: "查看频道",
//   SEND_MESSAGES: "发送消息",
//   SEND_TTS_MESSAGES: "发送TTS消息",
//   MANAGE_MESSAGES: "管理消息",
//   EMBED_LINKS: "嵌入链接",
//   ATTACH_FILES: "附加文件",
//   READ_MESSAGE_HISTORY: "读取历史消息",
//   MENTION_EVERYONE: "提及所有人",
//   USE_EXTERNAL_EMOJIS: "使用外部表情",
//   ADD_REACTIONS: "添加反应",
//   USE_SLASH_COMMANDS: "使用命令",
//   CONNECT: "连接语音",
//   SPEAK: "语音发言",
//   MUTE_MEMBERS: "静音成员",
//   DEAFEN_MEMBERS: "耳聋成员",
//   MOVE_MEMBERS: "移动成员",
//   USE_VAD: "语音活动检测",
//   PRIORITY_SPEAKER: "优先发言",
//   MANAGE_NICKNAMES: "管理昵称",
//   MANAGE_ROLES: "管理角色",
//   MANAGE_WEBHOOKS: "管理Webhook",
//   MANAGE_EMOJIS: "管理表情",
//   KICK_MEMBERS: "踢出成员",
//   BAN_MEMBERS: "封禁成员",
//   ADMIN: "管理员",
//   MANAGE_PROJECT: "管理项目",
//   UPLOAD_FILES: "上传文件",
//   MANAGE_VERSIONS: "管理版本",
//   REVIEW_SUBMISSIONS: "审核提交",
//   MANAGE_DEPENDENCIES: "管理依赖",
//   VIEW_ANALYTICS: "查看数据分析",
// };
