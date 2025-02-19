export class WebSocketClient {
    private socket: WebSocket | null = null;
    private readonly baseUrl: string;
    private readonly endpoint: string;
    private readonly token: string;

    // Public event handlers (just like native WebSocket)
    public onopen: (() => void) | null = null;
    public onmessage: ((event: MessageEvent) => void) | null = null;
    public onclose: (() => void) | null = null;
    public onerror: ((event: Event) => void) | null = null;

    constructor(endpoint: string) {
        this.baseUrl = import.meta.env.VITE_WS_URL // Change to your actual WebSocket server URL
        this.endpoint = endpoint;
        this.token = localStorage.getItem("token") || ""; // Retrieve JWT token
    }

    /**
     * Connects to the WebSocket server.
     */
    connect() {
        if (this.socket) {
            console.warn("WebSocket is already connected.");
            return;
        }

        const url = `${this.baseUrl}/${this.endpoint}?token=${this.token}`;
        this.socket = new WebSocket(url);

        // Assign event handlers
        this.socket.onopen = () => {
            console.log(`Connected to WebSocket: ${this.endpoint}`);
            if (this.onopen) this.onopen();
        };

        this.socket.onmessage = (event) => {
            if (this.onmessage) this.onmessage(event);
        };

        this.socket.onclose = () => {
            console.log(`WebSocket closed: ${this.endpoint}`);
            if (this.onclose) this.onclose();
            this.socket = null; // Cleanup
        };

        this.socket.onerror = (event) => {
            console.error(`WebSocket error: ${this.endpoint}`, event);
            if (this.onerror) this.onerror(event);
        };
    }

    /**
     * Sends a message to the WebSocket server.
     * @param message - Data to send (Object will be stringified).
     */
    send(message: unknown) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn("Cannot send message. WebSocket is not connected.");
        }
    }

    /**
     * Closes the WebSocket connection.
     */
    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}
