import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}
  options: Party.ServerOptions = {
    hibernate: true,
  };

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    this.party.broadcast(
      JSON.stringify({
        type: "connect",
        count: [...this.party.getConnections()].length,
      })
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    const msg = JSON.parse(message as string);

    if (msg.type === "flickoff") {
      const connections = [...this.party.getConnections()].filter(
        (ws) => ws.id !== sender.id
      );

      const randomConnection =
        connections[Math.floor(Math.random() * connections.length)];
      randomConnection.send(
        JSON.stringify({
          type: "flickoff",
        })
      );
    }
  }

  onClose(connection: Party.Connection): void | Promise<void> {
    this.party.broadcast(
      JSON.stringify({
        type: "disconnect",
        count: [...this.party.getConnections()].length,
      })
    );
  }
}

Server satisfies Party.Worker;
