<template>
  <div class="container h-100 d-flex flex-column">
    <h1 class="mb-4">Your devices</h1>
    <DevicesTable />
  </div>
</template>

<script setup lang="ts">
import DevicesTable from '@/components/Views/DevicesView/DevicesTable.vue'
import { useRouter } from 'vue-router'
import { frameJson, frameText } from "../FrameProtool";
import { WebSocketClient } from "../WsTopics";

const ws = new WebSocketClient("ws");
ws.onopen = () => {
  ws.subscribe("device/state"); // or ws.subscribe("device/123/state", "user");
}.

const offAny = ws.onAnyMessage((frame) => {
  console.log("Any:", frame.command, frame.headers);
});

const offNews = ws.onTopic("device/state", (frame) => {
  if (frame.headers.DataType === "json") {
    const data = frameJson<{ msg: string }>(frame);
    console.log("NEWS:", data.msg);
  } else {
    console.log("NEWS (text):", frameText(frame));
  }
});

ws.connect();




const router = useRouter()
</script>

<style lang="scss" scoped></style>
