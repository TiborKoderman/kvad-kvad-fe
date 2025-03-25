<template>
    <div
      class="modal show"
      tabindex="-1"
      aria-hidden="false"
      @click.self="close"
    >
      <div
        class="modal-dialog modal-dialog-centered"
        :class="{ 'modal-fullscreen-sm-down': fullscreen }"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ props.title }}</h5>
            <button type="button" class="btn-close" @click="close"></button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark" @click="close">
              {{ noOk ? 'Close' : 'Cancel' }}
            </button>
            <template v-if="!$slots.footer && !props.noOk">
              <button type="button" class="btn btn-primary" @click="confirm">
                Confirm
              </button>
            </template>
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import {inject, ref} from 'vue'

const eventBus = inject('eventBus', ref(new Map()))

const emit = defineEmits([
  'close',
  'confirm',
  'update:isOpen',
  'update:isVisible',
])

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
  fullscreen: {
    type: Boolean,
    default: true,
    required: false,
  },
})

function open() {
  // console.log('Modal opened')
  emit('update:isOpen', true)
}

function confirm() {
  eventBus.value.set('confirm', true)
  emit('confirm')
  emit('update:isOpen', false)
}

function close() {
  emit('close')
  emit('update:isOpen', false)
}

function hide() {
  emit('update:isVisible', false)
}

function show() {
  emit('update:isVisible', true)
}

defineExpose({
  open,
  close,
  confirm,
  hide,
  show,
})
</script>

<style scoped>
.modal {
  display: block;
  overflow: hidden;
  outline: 0;
  background: rgba(0, 0, 0, 0.5);
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
