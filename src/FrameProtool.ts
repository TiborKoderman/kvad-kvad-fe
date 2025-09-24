/* -----------------------------------------------------------
 * Frame protocol (LF only):
 *
 * COMMAND\n
 * Key: Value\n
 * Key: Value\n
 * \n
 * [payload bytes...]
 * ----------------------------------------------------------- */

export type Command =
  | "CONNECTED" | "ERROR" | "PING" | "PONG" | "DISCONNECT"
  | "SUBSCRIBE" | "UNSUBSCRIBE" | "SUBSCRIBED" | "UNSUBSCRIBED"
  | "PUBLISH" | "PUBLISHED" | "SEND" | "MESSAGE";

export type DataType = "text" | "json" | "binary";

export interface Frame {
  command: Command | string;
  headers: Record<string, string>;
  /** Always stored as Uint8Array (even for text/json); use helpers to read. */
  payload: Uint8Array;
}

const utf8 = new TextEncoder();
const utf8d = new TextDecoder();

/** Build a header string (LF only). */
function encodeHeader(command: string, headers: Record<string, string>): Uint8Array {
  let head = command + "\n";
  for (const [k, v] of Object.entries(headers)) {
    head += `${k}: ${v}\n`;
  }
  head += `\n`;
  return utf8.encode(head);
}

/** Parse header lines (LF-only tolerant; trims a trailing CR per line). */
function parseHeaderBytes(buf: Uint8Array): { command: string; headers: Record<string, string> } {
  // Split on LF, trim a single CR at end of each line.
  const text = utf8d.decode(buf);
  const lines = text.split("\n");
  const command = (lines[0] ?? "").replace(/\r$/, "");
  const headers: Record<string, string> = {};
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, "");
    if (line.length === 0) break; // safety; the caller already split before blank line
    const idx = line.indexOf(":");
    if (idx > 0) {
      const k = line.slice(0, idx).trim();
      const v = line.slice(idx + 1).trim();
      if (k) headers[k] = v;
    }
  }
  return { command, headers };
}

/** Find the header/body separator index in binary buffer. Prefers LF LF, tolerates CRLF CRLF. */
function findDoubleNewline(buf: Uint8Array): number {
  // Prefer LF LF
  for (let i = 0; i + 1 < buf.length; i++) {
    if (buf[i] === 0x0a && buf[i + 1] === 0x0a) return i; // '\n\n'
  }
  // Tolerate CRLF CRLF
  for (let i = 0; i + 3 < buf.length; i++) {
    if (buf[i] === 0x0d && buf[i + 1] === 0x0a && buf[i + 2] === 0x0d && buf[i + 3] === 0x0a) {
      return i + 1; // treat position as if it were '\n\n' at i+1
    }
  }
  return -1;
}

/** Create frames */
export const FrameFactory = {
  text(command: Command | string, text: string, headers: Record<string, string> = {}): Frame {
    const h = { ...headers, DataType: "text" };
    return { command, headers: h, payload: utf8.encode(text) };
  },
  json<T>(command: Command | string, obj: T, headers: Record<string, string> = {}): Frame {
    const h = { ...headers, DataType: "json", ContentType: "application/json", Type: (obj as any)?.constructor?.name ?? "Object" };
    return { command, headers: h, payload: utf8.encode(JSON.stringify(obj)) };
  },
  binary(command: Command | string, bytes: Uint8Array, headers: Record<string, string> = {}): Frame {
    const h = { ...headers, DataType: "binary", ContentLength: String(bytes.byteLength) };
    return { command, headers: h, payload: bytes };
  },
};

/** Encode frame into what should be sent via WebSocket.send(). */
export function encodeFrame(frame: Frame): string | Blob {
  const head = encodeHeader(String(frame.command), frame.headers);
  const dt = (frame.headers["DataType"] || "").toLowerCase();
  if (dt === "binary") {
    // Send a single Blob: [headers][payload]
    return new Blob([new Uint8Array(head), new Uint8Array(frame.payload)], { type: "application/octet-stream" });
  } else {
    // Send as Text: [headers][payload-string]
    const payloadText = (dt === "json")
      ? utf8d.decode(frame.payload) // already json string
      : utf8d.decode(frame.payload); // plain text
    return utf8d.decode(head) + payloadText;
  }
}

/** Decode incoming WebSocket event.data to a Frame. */
export async function decodeWsData(data: string | ArrayBuffer | Blob): Promise<Frame> {
  if (typeof data === "string") {
    // Split once on \n\n for headers/payload
    const idx = data.indexOf("\n\n");
    const headerText = idx >= 0 ? data.slice(0, idx + 1) /* include last \n for safe parse */ : data;
    const payloadText = idx >= 0 ? data.slice(idx + 2) : "";

    const { command, headers } = parseHeaderBytes(utf8.encode(headerText));
    const dt = (headers["DataType"] || "").toLowerCase();
    const payloadBytes = utf8.encode(payloadText);
    // Respect ContentLength if present
    const cl = +(headers["ContentLength"] || -1);
    const payload = (cl >= 0 && cl <= payloadBytes.length) ? payloadBytes.slice(0, cl) : payloadBytes;

    return { command, headers, payload };
  }

  const buf = data instanceof Blob ? new Uint8Array(await data.arrayBuffer())
           : data instanceof ArrayBuffer ? new Uint8Array(data)
           : new Uint8Array();

  const sep = findDoubleNewline(buf);
  if (sep < 0) {
    // No header separator: assume whole thing is payload of an unknown command
    return { command: "MESSAGE", headers: {}, payload: buf };
  }
  const headerBytes = buf.slice(0, sep + 1); // include that '\n' so parser is happy
  const payload = buf.slice(sep + 2);         // skip the two '\n'

  const { command, headers } = parseHeaderBytes(headerBytes);

  // Respect ContentLength for binary
  const cl = +(headers["ContentLength"] || -1);
  const slicedPayload = (cl >= 0 && cl <= payload.length) ? payload.slice(0, cl) : payload;

  return { command, headers, payload: slicedPayload };
}

/** Helpers to read frame payloads */
export function frameText(frame: Frame): string {
  return utf8d.decode(frame.payload);
}
export function frameJson<T = unknown>(frame: Frame): T {
  return JSON.parse(utf8d.decode(frame.payload)) as T;
}
