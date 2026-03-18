import type * as Party from "partykit/server";
import z from "zod";
import type { Poll } from "@/app/types";

const UserSchema = z.object({
  id: z.string(),
  avatarUrl: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  location: z
    .object({
      workshopTitle: z.string().nullable().optional(),
      exercise: z
        .object({
          type: z
            .union([z.literal("problem"), z.literal("solution")])
            .nullable()
            .optional(),
          exerciseNumber: z.number().nullable().optional(),
          stepNumber: z.number().nullable().optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable()
    .optional(),
});

type User = z.infer<typeof UserSchema>;
const MessageSchema = z
  .object({
    type: z.literal("remove-user"),
    payload: z.object({ id: z.string() }),
  })
  .or(z.object({ type: z.literal("add-user"), payload: UserSchema }))
  .or(
    z.object({
      type: z.literal("add-anonymous-user"),
      payload: z.object({ id: z.string() }),
    }),
  )
  .or(
    z.object({
      type: z.literal("presence"),
      payload: z.object({ users: z.array(UserSchema) }),
    }),
  );
type Message = z.infer<typeof MessageSchema>;

const getUsers = (connections: Iterable<Party.Connection<unknown>>) => {
  const users = new Map<string, z.infer<typeof UserSchema>>();

  for (const connection of connections) {
    const state = getConnectionState(connection);
    if (state?.user) {
      users.set(state.user.id, state.user);
    }
  }

  return Array.from(users.values());
};
const getPresenceMessage = (
  connections: Iterable<Party.Connection<unknown>>,
) => {
  return {
    type: "presence",
    payload: { users: getUsers(connections) },
  } satisfies Message;
};
const updateUsers = (
  connections: Iterable<Party.Connection<unknown>>,
  message: Message,
) => {
  const presenceMessage = JSON.stringify(message);
  for (const connection of connections) {
    connection.send(presenceMessage);
  }
};
const ConnectionStateSchema = z
  .object({
    user: UserSchema.nullable().optional(),
  })
  .nullable();

type ConnectionState = z.infer<typeof ConnectionStateSchema>;
function getConnectionState(connection: Party.Connection) {
  const result = ConnectionStateSchema.safeParse(connection.state);
  if (result.success) {
    return result.data;
  } else {
    setConnectionState(connection, null);
    return null;
  }
}
function setConnectionState(
  connection: Party.Connection,
  state:
    | ConnectionState
    | ((prev: ConnectionState | null) => ConnectionState | null),
) {
  if (typeof state !== "function") {
    return connection.setState(state);
  }
  connection.setState((prev: any) => {
    const prevParseResult = ConnectionStateSchema.safeParse(prev);
    if (prevParseResult.success) {
      return state(prevParseResult.data);
    } else {
      return state(null);
    }
  });
}
function shallowMergeConnectionState(
  connection: Party.Connection,
  state: ConnectionState,
) {
  setConnectionState(connection, (prev) => ({ ...prev, ...state }));
}

export default class Server implements Party.Server {
  options: Party.ServerOptions = {
    hibernate: true, // 不启用休眠模式：每个房间最多可连接 100 台设备; 启用休眠模式：每个房间最多可支持32,000 个连接
  };
  constructor(readonly room: Party.Room) {}

  poll: Poll | undefined;

  async onStart() {
    this.poll = await this.room.storage.get<Poll>("poll");
  }
  async savePoll() {
    if (this.poll) {
      await this.room.storage.put<Poll>("poll", this.poll);
    }
    this.room.getConnections();
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`,
    );

    // let's send a message to the connection
    // conn.send("hello from server");
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    const { data, success } = MessageSchema.safeParse(JSON.parse(message));
    if (!success) return;
    if (!this.poll) return;
    // as well as broadcast it to all the other connections in the room...
    const event = JSON.parse(message);
    if (event.type === "vote") {
      this.poll.votes![event.option] += 1;
      this.room.broadcast(JSON.stringify(this.poll));
      this.savePoll();
    }
    // this.room.broadcast(
    //   `${sender.id}: ${message}`,
    //   // ...except for the connection it came from
    //   [sender.id],
    // );
  }
  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const poll = (await req.json()) as Poll;
      this.poll = { ...poll, votes: poll.options.map(() => 0) };
      this.savePoll();
    }
    console.log(this.poll);
    if (this.poll) {
      return new Response(JSON.stringify(this.poll), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  }
}

Server satisfies Party.Worker;
