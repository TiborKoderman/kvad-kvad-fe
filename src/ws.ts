import { WebSocketClient } from "./WebSocketClient";

const ws = new WebSocketClient("ws");
await ws.connect();


export { ws };
// const offAny = ws.onAnyMessage((frame) => {
//   console.log("Any:", frame.command, frame.headers);
// });

// const offNews = ws.onTopic("device/state", (frame) => {
//   if (frame.headers.DataType === "json") {
//     const data = frameJson<{ msg: string }>(frame);
//     console.log("NEWS:", data.msg);
//   } else {
//     console.log("NEWS (text):", frameText(frame));
//   }
// });

// ws.connect();
