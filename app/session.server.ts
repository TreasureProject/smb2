import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  hasBurned: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__smb2SkinBurned",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET as string],
      secure: process.env.NODE_ENV === "production" // enable this in prod only
    }
  });

export { getSession, commitSession, destroySession };
