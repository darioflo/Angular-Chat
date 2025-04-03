import type { ServerWebSocket } from "bun";

/** C:\Users\yarcepadron\.bun\bin\bun */
interface ChatMessage {
  type: "message" | "join" | "send" | "leave";
  user: string;
  content: string;
  timeStamp: number;
}

const clients = new Map<ServerWebSocket<unknown>, { username: string }>();

const sendMessageToClients = (message: ChatMessage) => {
  clients.forEach((_, client) => {
    client.send(JSON.stringify(message));
  });
};

Bun.serve({
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    open() {
      console.log("Server started");
    },
    message(ws, message) {
      const data = JSON.parse(message as string) as ChatMessage;
      if (data.type === "join") {
        clients.set(ws, { username: data.user });
        sendMessageToClients({
          type: "join",
          user: data.user,
          content: `Bienvenido al chat ${data.user}`,
          timeStamp: Date.now(),
        });

        return;
      }

      if (data.type === "message") {
        const client = clients.get(ws)!;

        if (!client) return;

        sendMessageToClients({
          type: "message",
          user: client.username,
          content: data.content,
          timeStamp: Date.now(),
        });
      }
    },

    close(ws) {
      const client = clients.get(ws);

      if (!client) return;

      sendMessageToClients({
        type: "leave",
        user: client.username,
        content: `Adios ${client.username}`,
        timeStamp: Date.now(),
      });
    },
  }, // handlers
});
