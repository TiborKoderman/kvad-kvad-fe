<template>
  <Teleport to="body">
    <transition name="fade">
      <div
      v-if="isOpen"
      v-show="isVisible"
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
              <h5 class="modal-title">{{ title }}</h5>
              <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
              <slot></slot>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-dark" @click="close">
                {{ noOk ? 'Close' : 'Cancel' }}
              </button>
              <template v-if="!$slots.footer && !noOk">
                <button type="button" class="btn btn-primary" @click="confirm">
                  Confirm
                </button>
              </template>
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
const emit = defineEmits(['close', 'confirm', 'update:isOpen', 'update:isVisible'])

const props = defineProps({
  callback: {
    type: Function,
    default: () => {},
  },
  title: {
    type: String,
    default: 'Are you sure?',
  },
  isOpen: {
    type: Boolean,
    default: false,
    required: false,
  },
  isVisible: {
    type: Boolean,
    default: true,
    required: false,
  },
  noOk: {
    type: Boolean,
    default: false,
    required: false,
  },
  fullscreen: {
    type: Boolean,
    default: false,
    required: false,
  },

})


function open() {
  // console.log('Modal opened')
  emit('update:isOpen', true)
}

function confirm() {
  props.callback().then(() => {
    emit('confirm')
    emit('update:isOpen', false)
  }).catch(() => {
    close()
  })

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
  show
})


</script>

<style scoped>
.modal {
  display: block;
  overflow: hidden;
  outline: 0;
  background: rgba(0, 0, 0, 0.5);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
