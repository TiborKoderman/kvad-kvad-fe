<template>
  <div class="p-4">
    <h2>Button Component Tests</h2>

    <div class="mb-4">
      <h3>Disabled State Tests</h3>
      <p>Click counter: {{ clickCount }}</p>

      <div class="d-flex gap-2 flex-wrap">
        <Button primary @click="increment">Enabled (should increment)</Button>
        <Button primary disabled @click="increment"
          >Disabled (should NOT increment)</Button
        >
        <Button success :disabled="false" @click="increment"
          >Enabled via :disabled="false"</Button
        >
        <Button success :disabled="true" @click="increment"
          >Disabled via :disabled="true"</Button
        >
        <Button danger :disabled="isDisabled" @click="increment">
          Computed disabled ({{ isDisabled ? 'disabled' : 'enabled' }})
        </Button>
      </div>

      <button @click="toggleDisabled" class="btn btn-secondary mt-2">
        Toggle Computed Disabled
      </button>
    </div>

    <div class="mb-4">
      <h3>Color Variants</h3>
      <div class="d-flex gap-2 flex-wrap">
        <Button light @click="log('light')">Light</Button>
        <Button dark @click="log('dark')">Dark</Button>
        <Button primary @click="log('primary')">Primary</Button>
        <Button secondary @click="log('secondary')">Secondary</Button>
        <Button info @click="log('info')">Info</Button>
        <Button success @click="log('success')">Success</Button>
        <Button warning @click="log('warning')">Warning</Button>
        <Button danger @click="log('danger')">Danger</Button>
      </div>
    </div>

    <div class="mb-4">
      <h3>Outline Variants</h3>
      <div class="d-flex gap-2 flex-wrap">
        <Button primary outline @click="log('outline-primary')">Primary</Button>
        <Button secondary outline @click="log('outline-secondary')"
          >Secondary</Button
        >
        <Button success outline @click="log('outline-success')">Success</Button>
        <Button danger outline @click="log('outline-danger')">Danger</Button>
      </div>
    </div>

    <div class="mb-4">
      <h3>Size Variants</h3>
      <div class="d-flex gap-2 align-items-center flex-wrap">
        <Button primary size="sm" @click="log('small')">Small</Button>
        <Button primary @click="log('normal')">Normal</Button>
        <Button primary size="lg" @click="log('large')">Large</Button>
      </div>
    </div>

    <div class="mb-4">
      <h3>Disabled Variants</h3>
      <div class="d-flex gap-2 flex-wrap">
        <Button primary disabled @click="log('should not fire')"
          >Primary Disabled</Button
        >
        <Button success disabled @click="log('should not fire')"
          >Success Disabled</Button
        >
        <Button danger outline disabled @click="log('should not fire')"
          >Outline Disabled</Button
        >
        <Button warning size="lg" disabled @click="log('should not fire')"
          >Large Disabled</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/formItems/Button.vue'

const clickCount = ref(0)
const isDisabled = ref(true)

const increment = () => {
  clickCount.value++
  console.log('Button clicked! Count:', clickCount.value)
}

const toggleDisabled = () => {
  isDisabled.value = !isDisabled.value
}

const log = (msg: string) => {
  console.log('Button clicked:', msg)
}
</script>

<style scoped>
h2 {
  margin-bottom: 1.5rem;
}

h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
