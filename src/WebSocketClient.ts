/* ===========================================================
 * WebSocketClient with frame-aware send/receive
 * =========================================================== */

import { decodeWsData, encodeFrame, FrameFactory, type Frame } from "./FrameProtocol";

type MessageListener = (frame: Frame) => void;
type TopicListener = (frame: Frame) => void;

export class WebSocketClient {
  private socket: WebSocket | null = null;
  private readonly baseUrl: string;
  private readonly endpoint: string;
  private readonly token: string;

  // Public event handlers
  public onopen: (() => void) | null = null;
  public onclose: (() => void) | null = null;
  public onerror: ((event: Event) => void) | null = null;

  // High-level listeners
  private anyMessageListeners: Set<MessageListener> = new Set();
  private topicListeners: Map<string, Set<TopicListener>> = new Map();

  constructor(endpoint: string) {
    this.baseUrl = import.meta.env.VITE_WS_URL;
    this.endpoint = endpoint.replace(/^\/+/, "");
    this.token = localStorage.getItem("token") || "";
  }

  get ready(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  private connectPromise: Promise<void> | null = null;

  async connect(): Promise<void> {
    if (this.connectPromise) {
      return this.connectPromise;
    }
    this.connectPromise = new Promise<void>((resolve, reject) => {
      if (this.socket) {
        if (this.socket.readyState === WebSocket.OPEN) {
          console.warn("WebSocket already connected.");
          resolve();
          this.connectPromise = null;
          return;
        }
      }
      const url = `${this.baseUrl}/${this.endpoint}?token=${encodeURIComponent(this.token)}`;
      const ws = new WebSocket(url);
      ws.binaryType = "arraybuffer";
      this.socket = ws;

      ws.onopen = () => {
        this.onopen?.();
        resolve();
        this.connectPromise = null;
      };

      ws.onmessage = async (event) => {
        try {
          const frame = await decodeWsData(event.data);
          for (const cb of this.anyMessageListeners) cb(frame);
          if (frame.command.toUpperCase() === "MESSAGE") {
            const topic = frame.headers["topic"] || frame.headers["Topic"];
            if (topic && this.topicListeners.has(topic)) {
              for (const cb of this.topicListeners.get(topic)!) cb(frame);
            }
          }
        } catch (err) {
          console.error("Failed to decode WS frame:", err);
        }

      };

      ws.onclose = () => {
        this.onclose?.();
        this.socket = null;
        this.connectPromise = null;
      };

      ws.onerror = (ev) => {
        this.onerror?.(ev);
        reject(ev);
        this.connectPromise = null;
      };
    });
    return this.connectPromise;
  }

  disconnect(): void {
    this.socket?.close();
  }

  /* ---------- Frame send helpers ---------- */

  private sendFrame(frame: Frame): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected.");
      return;
    }
    const payload = encodeFrame(frame);
    this.socket.send(payload);
  }

  ping(): void {
    this.sendFrame(FrameFactory.text("PING", ""));
  }

  /** Subscribe to a topic. Optional scope=user to get per-user namespaces. */
  subscribe(topic: string, scope?: "user" | "global"): void {
    const headers: Record<string, string> = { topic };
    if (scope === "user") headers["scope"] = "user";
    this.sendFrame(FrameFactory.text("SUBSCRIBE", "", headers));
  }

  unsubscribe(topic: string, scope?: "user" | "global"): void {
    const headers: Record<string, string> = { topic };
    if (scope === "user") headers["scope"] = "user";
    this.sendFrame(FrameFactory.text("UNSUBSCRIBE", "", headers));
  }

  /** Publish JSON payload to a topic. */
  publishJson(topic: string, obj: unknown, opts?: { scope?: "user" | "global"; headers?: Record<string, string> }) {
    const headers: Record<string, string> = { topic, ...(opts?.headers ?? {}) };
    if (opts?.scope === "user") headers["scope"] = "user";
    this.sendFrame(FrameFactory.json("PUBLISH", obj, headers));
  }

  /** Publish text payload to a topic. */
  publishText(topic: string, text: string, opts?: { scope?: "user" | "global"; headers?: Record<string, string> }) {
    const headers: Record<string, string> = { topic, ...(opts?.headers ?? {}) };
    if (opts?.scope === "user") headers["scope"] = "user";
    this.sendFrame(FrameFactory.text("PUBLISH", text, headers));
  }

  /** Publish binary payload to a topic. */
  publishBinary(topic: string, bytes: Uint8Array, opts?: { scope?: "user" | "global"; headers?: Record<string, string> }) {
    const headers: Record<string, string> = { topic, ...(opts?.headers ?? {}) };
    if (opts?.scope === "user") headers["scope"] = "user";
    this.sendFrame(FrameFactory.binary("PUBLISH", bytes, headers));
  }

  /* ---------- Listener registration ---------- */

  /** Receive all frames (including CONNECTED, ERROR, etc.). */
  onAnyMessage(cb: MessageListener): () => void {
    this.anyMessageListeners.add(cb);
    return () => this.anyMessageListeners.delete(cb);
  }


  /** Receive only MESSAGE frames for a specific topic. */
  onTopic(topic: string, cb: TopicListener): () => void {
    let set = this.topicListeners.get(topic);
    const isFirst = !set;
    if (!set) {
      set = new Set();
      this.topicListeners.set(topic, set);
    }
    set.add(cb);
    if (isFirst) {
      this.subscribe(topic);
    }
    return () => {
      set!.delete(cb);
      if (set!.size === 0) {
        this.topicListeners.delete(topic);
        this.unsubscribe(topic);
      }
    };
  }
}
