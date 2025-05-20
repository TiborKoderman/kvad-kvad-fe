<template>
  <transition name="fade" @after-leave="handleAfterLeave">
    <div @click.self="close" v-if="isVisible" class="base-modal-backdrop">
      <div
        class="base-modal-dialog"
        :class="{
          fullscreen: fullscreen,
        }"
        role="dialog"
        aria-hidden="true"
      >
        <div class="base-modal-content">
          <div class="base-modal-header">
            <h4 class="base-modal-title">{{ title }}</h4>
            <button
              type="button"
              class="btn btn-close"
              @click="close"
              aria-label="Close"
            ></button>
          </div>
          <div class="base-modal-body">
            <slot></slot>
          </div>

          <div class="base-modal-footer">
            <button type="button" class="btn btn-outline-dark" @click="close">
              {{ noOk ? 'Close' : 'Cancel' }}
            </button>
            <template v-if="!$slots.footer && !props.noOk">
              <button
                type="button"
                class="btn"
                :class="props.delete ? 'btn-danger' : 'btn-primary'"
                @click="submit"
              >
                {{ props.delete ? 'Delete' : 'Submit' }}
              </button>
            </template>
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const isMounted = ref(false)
const isVisible = ref(false)

onMounted(() => {
  isMounted.value = true
  isVisible.value = true
})

onBeforeUnmount(() => {
  // Only hide visibility - actual unmounting will happen after animation
  isVisible.value = false
})

const emit = defineEmits(['close', 'submit'])

const props = defineProps({
  title: {
    type: String,
    default: 'Are you sure?',
  },
  noOk: {
    type: Boolean,
    default: false,
    required: false,
  },
  delete: {
    type: Boolean,
    default: false,
    required: false,
  },
  fullscreen: {
    type: Boolean,
    default: true,
    required: false,
  },
})

function handleAfterLeave() {
  // This fires after the fade animation completes
  isMounted.value = false
}

function open() {
  isVisible.value = true
}

function submit() {
  emit('submit')
}

function close() {
  isVisible.value = false
  emit('close')
}

defineExpose({
  open,
  close,
  submit,
})
</script>

<style scoped lang="scss">
.base-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

$border-color: rgba(#000000, 0.25);

.base-modal-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  min-width: 500px;
  max-width: 100vw;
  max-height:100vh;
  border-radius: var(--bs-border-radius);
}

.base-modal-body {
  padding: 1rem;
}


.base-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $border-color;
  padding: 1rem;
}
.base-modal-title {
  margin: 0;
}

.base-modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid $border-color;
  gap: 0.5rem;
  padding: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
