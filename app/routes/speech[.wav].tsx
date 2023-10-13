import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import say from "say";
import { promises as fs } from "fs";
import path from "path";

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const targetSmolId = url.searchParams.get("id") || "1";

  const data = await fetch(
    `https://cloudflare-ipfs.com/ipfs/Qmae8GCKXTCKz1AipamMyGNbMQiGJgDcVBgAv7pADLkJfg/${targetSmolId}.json`
  );

  const voicemail = await data.json();

  const targetVoicemail = voicemail.Voicemail;

  const text =
    targetVoicemail ??
    `Hello, I am smol ${targetSmolId} you have reached the voicemail of number one six three. I am unavailable to come to my banana phone so please leave a message at the EEEEEE and I will call you back when I am available.`;
  const filePath = path.join(process.cwd(), "output.wav");

  await new Promise((resolve, reject) => {
    say.export(text, undefined, 1, filePath, async (err) => {
      if (err) {
        console.log({ err });
        reject(json({ error: "Error generating speech." }, { status: 500 }));
      } else {
        resolve(null);
      }
    });
  });

  const stat = await fs.stat(filePath);
  const fileSize = stat.size;
  const range = request.headers.get("range");

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const fileBuffer = await fs.readFile(filePath);
    const chunk = fileBuffer.subarray(start, end + 1);

    await fs.unlink(filePath);

    return new Response(chunk, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": String(chunksize),
        "Content-Type": "audio/wav"
      }
    });
  } else {
    const fileBuffer = await fs.readFile(filePath);
    await fs.unlink(filePath);

    return new Response(fileBuffer, {
      headers: {
        "Content-Length": String(fileSize),
        "Content-Type": "audio/wav"
      }
    });
  }
};
