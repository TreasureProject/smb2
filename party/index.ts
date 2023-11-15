import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}
  options: Party.ServerOptions = {
    hibernate: true
  };

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    const country = ctx.request.cf?.country ?? null;

    // Stash the country in the websocket attachment
    conn.serializeAttachment({
      ...conn.deserializeAttachment(),
      country: country
    });

    this.party.broadcast(
      JSON.stringify({
        type: "connect",
        count: [...this.party.getConnections()].length
      })
    );
  }

  getConnectedCount() {
    return [...this.party.getConnections()].length;
  }

  onMessage(message: string, sender: Party.Connection) {
    const msg = JSON.parse(message as string);

    if (msg.type === "poke") {
      const connections = [...this.party.getConnections()].filter(
        (ws) => ws.id !== sender.id
      );

      if (connections.length === 0) {
        sender.send(
          JSON.stringify({
            type: "no-one-available"
          })
        );

        return;
      }

      const randomConnection =
        connections[Math.floor(Math.random() * connections.length)];

      sender.send(
        JSON.stringify({
          type: "sent",
          country: randomConnection.deserializeAttachment().country
        })
      );

      randomConnection.send(
        JSON.stringify({
          type: "poke"
        })
      );
    }
  }

  onClose(connection: Party.Connection): void | Promise<void> {
    this.party.broadcast(
      JSON.stringify({
        type: "disconnect",
        count: [...this.party.getConnections()].length
      })
    );
  }
}

Server satisfies Party.Worker;
