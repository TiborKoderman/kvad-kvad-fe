<template>
  <Teleport to="body">
    <Transition name="tooltip-fade">
      <div
        v-if="visible"
        ref="tooltipRef"
        class="tooltip-container"
        :class="[`tooltip-${position}`, { 'tooltip-html': allowHtml }]"
        :style="tooltipStyle"
        role="tooltip"
      >
        <div class="tooltip-arrow" :class="`arrow-${position}`"></div>
        <div class="tooltip-content">
          <div v-if="allowHtml" v-html="content"></div>
          <template v-else>{{ content }}</template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  visible: boolean
  content: string
  targetElement: HTMLElement | null
  position?: 'top' | 'bottom' | 'left' | 'right'
  allowHtml?: boolean
  offset?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  allowHtml: false,
  offset: 8
})

const tooltipRef = ref<HTMLElement | null>(null)

const tooltipStyle = computed(() => {
  if (!props.visible || !props.targetElement || !tooltipRef.value) {
    return { opacity: 0, pointerEvents: 'none' }
  }

  const targetRect = props.targetElement.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()

  let top = 0
  let left = 0

  switch (props.position) {
    case 'top':
      top = targetRect.top - tooltipRect.height - props.offset
      left = targetRect.left + (targetRect.width - tooltipRect.width) / 2
      break
    case 'bottom':
      top = targetRect.bottom + props.offset
      left = targetRect.left + (targetRect.width - tooltipRect.width) / 2
      break
    case 'left':
      top = targetRect.top + (targetRect.height - tooltipRect.height) / 2
      left = targetRect.left - tooltipRect.width - props.offset
      break
    case 'right':
      top = targetRect.top + (targetRect.height - tooltipRect.height) / 2
      left = targetRect.right + props.offset
      break
  }

  // Keep tooltip within viewport
  const padding = 8
  top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding))
  left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding))

  return {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 9999
  }
})

// Force update position on visibility change
watch(() => props.visible, () => {
  if (props.visible) {
    // Trigger recalculation after render
    setTimeout(() => {
      if (tooltipRef.value) {
        tooltipRef.value.style.opacity = '1'
      }
    }, 0)
  }
})
</script>

<style scoped>
.tooltip-container {
  position: fixed;
  max-width: 300px;
  padding: 0.5rem 0.75rem;
  background: var(--t-dark, #370748);
  color: var(--txt-dark, #ffffff);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  pointer-events: none;
  word-wrap: break-word;
}

.tooltip-content {
  position: relative;
  z-index: 1;
}

.tooltip-html :deep(strong) {
  font-weight: 600;
  color: var(--t-primary, #b00b69);
}

.tooltip-html :deep(em) {
  font-style: italic;
  color: var(--t-info, #f37e10);
}

.tooltip-html :deep(code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.85em;
}

.tooltip-html :deep(ul),
.tooltip-html :deep(ol) {
  margin: 0.25rem 0;
  padding-left: 1.25rem;
}

.tooltip-html :deep(li) {
  margin: 0.125rem 0;
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.arrow-top {
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0 6px;
  border-color: var(--t-dark, #370748) transparent transparent transparent;
}

.arrow-bottom {
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 6px 6px 6px;
  border-color: transparent transparent var(--t-dark, #370748) transparent;
}

.arrow-left {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 0 6px 6px;
  border-color: transparent transparent transparent var(--t-dark, #370748);
}

.arrow-right {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 6px 6px 0;
  border-color: transparent var(--t-dark, #370748) transparent transparent;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.15s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}
</style>
