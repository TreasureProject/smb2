import { useRouteLoaderData } from "@remix-run/react";
import usePartySocket from "partysocket/react";
import { createContext, useContext, useEffect, useState } from "react";
import { loader } from "~/root";

const SocketContext = createContext<{
  ws: ReturnType<typeof usePartySocket>;
  users: number;
  flicked: boolean;
  pokedTargetLocation: string | null;
} | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};

export const SocketContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState(0);
  const [flicked, setFlicked] = useState(false);
  const [pokedTargetLocation, setPokedTargetLocation] = useState<
    string | "none" | null
  >(null);

  useEffect(() => {
    if (!flicked) return;

    const id = setTimeout(() => {
      setFlicked(false);
    }, 5000);

    return () => clearTimeout(id);
  }, [flicked]);

  useEffect(() => {
    if (!pokedTargetLocation) return;

    const id = setTimeout(() => {
      setPokedTargetLocation(null);
    }, 5000);

    return () => clearTimeout(id);
  }, [pokedTargetLocation]);

  const ws = usePartySocket({
    host: import.meta.env.VITE_PARTYKIT_URL || "localhost:1999",
    room: "my-room",

    onMessage(e) {
      const msg = JSON.parse(e.data);
      if (msg.type === "connect" || msg.type === "disconnect") {
        setUsers(msg.count);
      }

      if (msg.type === "poke") {
        setFlicked(true);
      }

      if (msg.type === "sent") {
        setPokedTargetLocation(msg.country);
      }

      if (msg.type === "no-one-available") {
        setPokedTargetLocation("none");
      }
    }
  });

  return (
    <SocketContext.Provider
      value={{
        ws,
        users,
        flicked,
        pokedTargetLocation
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
