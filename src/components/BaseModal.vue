<template>
  <transition name="fade">
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
              <button type="button" class="btn btn-primary" @click="submit">
                submit
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
  fullscreen: {
    type: Boolean,
    default: true,
    required: false,
  },
})

function open() {}

function submit() {
  emit('submit')
}

function close() {
  emit('close')
}

defineExpose({
  open,
  close,
  submit,
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
