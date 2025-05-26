<template>
    <div class="customizer">
        <div class="row">
            <label>Fill:</label>
            <input type="color" v-model="fill" />
            <input type="text" v-model="fill" placeholder="Fill color (CSS)" />
            <label>Stroke:</label>
            <input type="color" v-model="stroke" />
            <input type="text" v-model="stroke" placeholder="Stroke color (CSS)" />
        </div>
        <div class="row">
            <label>Display:</label>
            <select v-model="display">
                <option value="">(default)</option>
                <option value="inline">inline</option>
                <option value="block">block</option>
                <option value="none">none</option>
                <option value="inherit">inherit</option>
            </select>
        </div>
        <div class="row">
            <label>Other styles:</label>
        </div>
        <textarea
            v-model="otherStyles"
            class="other-styles"
            rows="5"
            placeholder="e.g. opacity: 0.5; filter: blur(2px);"
        ></textarea>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fill = ref('#000000')
const stroke = ref('#000000')
const display = ref('')
const otherStyles = ref('')
</script>

<style scoped>
.customizer {
  display: flex;
  flex-direction: column;
  gap: 1em;
  max-width: 400px;
}
.row {
  display: flex;
  align-items: center;
  gap: 0.5em;
}
label {
  min-width: 70px;
  font-weight: 500;
}
input[type="color"] {
  width: 2em;
  height: 2em;
  border: none;
  background: none;
  padding: 0;
}
input[type="text"] {
  flex: 1 1 0;
  min-width: 0;
  padding: 0.3em 0.5em;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font: inherit;
  background: #fff;
}
select {
  flex: 1 1 0;
  min-width: 0;
  padding: 0.3em 0.5em;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font: inherit;
  background: #fff;
}
.other-styles {
  width: 100%;
  min-height: 5em;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font: inherit;
  padding: 0.5em;
  background: #fff;
  resize: vertical;
}
</style>