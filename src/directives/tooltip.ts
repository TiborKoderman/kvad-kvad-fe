import { createApp, h, ref, type Directive, type DirectiveBinding } from 'vue'
import Tooltip from '@/components/formItems/display/Tooltip.vue'

interface TooltipOptions {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  html?: boolean
  delay?: number
}

interface TooltipInstance {
  app: ReturnType<typeof createApp>
  container: HTMLElement
  showTimeout?: number
  visible: ReturnType<typeof ref<boolean>>
  content: ReturnType<typeof ref<string>>
  position: ReturnType<typeof ref<'top' | 'bottom' | 'left' | 'right'>>
  allowHtml: ReturnType<typeof ref<boolean>>
}

const tooltipInstances = new WeakMap<HTMLElement, TooltipInstance>()

function createTooltipInstance(el: HTMLElement, options: TooltipOptions): TooltipInstance {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const visible = ref(false)
  const content = ref(options.content)
  const position = ref<'top' | 'bottom' | 'left' | 'right'>(options.position || 'top')
  const allowHtml = ref(options.html || false)

  const app = createApp({
    setup() {
      return () => h(Tooltip, {
        visible: visible.value,
        content: content.value,
        targetElement: el,
        position: position.value,
        allowHtml: allowHtml.value
      })
    }
  })

  app.mount(container)

  return { app, container, visible, content, position, allowHtml }
}

function showTooltip(el: HTMLElement, options: TooltipOptions) {
  let instance = tooltipInstances.get(el)

  if (!instance) {
    instance = createTooltipInstance(el, options)
    tooltipInstances.set(el, instance)
  }

  // Clear any existing timeout
  if (instance.showTimeout) {
    clearTimeout(instance.showTimeout)
  }

  // Update content and options
  instance.content.value = options.content
  instance.position.value = options.position || 'top'
  instance.allowHtml.value = options.html || false

  // Show immediately (or with small delay if specified)
  const delay = options.delay || 0
  instance.showTimeout = window.setTimeout(() => {
    if (instance) {
      instance.visible.value = true
    }
  }, delay)
}

function hideTooltip(el: HTMLElement) {
  const instance = tooltipInstances.get(el)
  if (instance) {
    // Clear any pending show
    if (instance.showTimeout) {
      clearTimeout(instance.showTimeout)
    }

    instance.visible.value = false
  }
}

function destroyTooltip(el: HTMLElement) {
  const instance = tooltipInstances.get(el)
  if (instance) {
    if (instance.showTimeout) {
      clearTimeout(instance.showTimeout)
    }
    instance.app.unmount()
    instance.container.remove()
    tooltipInstances.delete(el)
  }
}

function parseBinding(binding: DirectiveBinding): TooltipOptions {
  if (typeof binding.value === 'string') {
    return { content: binding.value }
  }
  return binding.value as TooltipOptions
}

export const vTooltip: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const options = parseBinding(binding)

    if (!options.content) return

    el.addEventListener('mouseenter', () => showTooltip(el, options))
    el.addEventListener('mouseleave', () => hideTooltip(el))
    el.addEventListener('click', () => hideTooltip(el))
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const options = parseBinding(binding)

    if (!options.content) {
      destroyTooltip(el)
      return
    }

    // Update content if tooltip exists
    const instance = tooltipInstances.get(el)
    if (instance) {
      const tooltipComponent = instance.app._instance?.proxy
      if (tooltipComponent) {
        tooltipComponent.$props.content = options.content
        tooltipComponent.$props.position = options.position || 'top'
      instance.content.value = options.content
      instance.position.value = options.position || 'top'
      instance.allowHtml.value = options.html || falsented(el: HTMLElement) {
    destroyTooltip(el)
  }
}

export default vTooltip
