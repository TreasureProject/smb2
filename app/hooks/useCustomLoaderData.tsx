import type { LoaderFunction, SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useRef, useEffect } from "react";

// need to use this if using framer motion to do client side navigation animation
export function useCustomLoaderData<T extends LoaderFunction>() {
  const lastMessage = useRef<SerializeFrom<T> | null>(null);
  const data = useLoaderData<T>() || lastMessage.current;

  useEffect(() => {
    if (data) lastMessage.current = data;
  }, [data]);

  return data;
}
