<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="modal fade"
      tabindex="-1"
      :class="{ show: isOpen }"
    >
      <div
        class="modal-dialog"
        :class="{ 'modal-fullscreen-sm-down': fullscreen }"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" @click="cancel"></button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancel">
              Cancel
            </button>
            <template v-if="!$slots.footer">
              <button type="button" class="btn btn-primary" @click="confirm">
                Confirm
              </button>
            </template>
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['cancel', 'confirm'])

const isOpen = ref(false)


function open() {
  console.log('Modal opened')
  isOpen.value = true
}

function confirm() {
  isOpen.value = false
  emit('confirm')
}

function cancel() {
  isOpen.value = false
  emit('cancel')
}

defineExpose({
  open,
  cancel,
})

defineProps({
  callback: {
    type: Function,
    default: () => {},
  },
  title: {
    type: String,
    default: 'Are you sure?',
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.modal {
  display: block;
  overflow: hidden;
  outline: 0;
  background: rgba(0, 0, 0, 0.5);
}
</style>
