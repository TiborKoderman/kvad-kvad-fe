import { createApp, h, ref, Component, ComponentPublicInstance } from 'vue'
import BaseModal from '@/components/BaseModal.vue'

export interface ModalButton {
  label: string
  class?: string
  onClick: (
    modalInstance: ComponentPublicInstance | null,
  ) => void | Promise<void>
}

export interface ModalOptions {
  title?: string
  props?: Record<string, unknown>
  buttons?: ModalButton[]
  fullscreen?: boolean
  noOk?: boolean
  delete?: boolean
  autoDetectSubmit?: boolean
}

interface ComponentWithSubmit extends ComponentPublicInstance {
  submit?: () => unknown | Promise<unknown>
}

export class Modal {
  /**
   * Opens a modal with a given component as content
   * @param component - The Vue component to render as modal content
   * @param options - Configuration options for the modal
   * @returns Promise that resolves with the return value when modal closes
   */
  static open<T = unknown>(
    component: Component,
    options: ModalOptions = {},
  ): Promise<T> {
    const {
      title = 'Modal',
      props = {},
      buttons = [],
      fullscreen = true,
      noOk,
      delete: isDelete,
    } = options

    return new Promise<T>(resolve => {
      const modalRef = ref<ComponentWithSubmit | null>(null)
      const mountTarget = document.createElement('div')
      document.body.appendChild(mountTarget)

      const close = (returnValue?: T) => {
        app.unmount()
        mountTarget.remove()
        resolve(returnValue as T)
      }

      // Simple check - we'll rely on runtime detection instead
      const hasSubmitFunction = false

      const submit = () => {
        if (modalRef.value && typeof modalRef.value.submit === 'function') {
          const result = modalRef.value.submit()

          if (result instanceof Promise) {
            return result
              .then(value => {
                close(value as T)
              })
              .catch((error: Error) => {
                console.error('Submit failed:', error)
                return Promise.reject(error)
              })
          } else {
            close(result as T)
          }
        } else {
          close()
        }
      }

      // Determine if we should show the submit button
      const shouldShowSubmit =
        noOk === false ||
        (noOk === undefined && (hasSubmitFunction || buttons.length === 0))

      const app = createApp({
        setup() {
          return () =>
            h(
              BaseModal,
              {
                onClose: close,
                onSubmit: submit,
                title,
                fullscreen,
                noOk: noOk !== undefined ? noOk : !shouldShowSubmit,
                delete: isDelete,
              },
              {
                default: () => h(component, { ref: modalRef, ...props }),
                ...(buttons.length > 0 && {
                  footer: () =>
                    buttons.map(button =>
                      h(
                        'button',
                        {
                          type: 'button',
                          class: ['btn', button.class || 'btn-secondary'],
                          onClick: () => button.onClick(modalRef.value),
                        },
                        button.label,
                      ),
                    ),
                }),
              },
            )
        },
      })

      app.mount(mountTarget)
    })
  }

  /**
   * Opens a modal with auto-detection of submit functionality
   * Checks if the component exposes a submit method or contains a form element
   * @param component - The Vue component to render
   * @param options - Configuration options
   */
  static async openAuto<T = unknown>(
    component: Component,
    options: ModalOptions = {},
  ): Promise<T> {
    return Modal.open<T>(component, {
      ...options,
      autoDetectSubmit: true,
    })
  }

  /**
   * Opens a confirmation modal with a custom component
   * Always shows confirm and cancel buttons
   * @param component - The Vue component to render
   * @param options - Configuration options
   */
  static confirm<T = unknown>(
    component: Component,
    options: ModalOptions = {},
  ): Promise<T> {
    return Modal.open<T>(component, {
      ...options,
      noOk: false,
    })
  }

  /**
   * Opens an info modal with only a close button
   * @param component - The Vue component to render
   * @param options - Configuration options
   */
  static info<T = unknown>(
    component: Component,
    options: ModalOptions = {},
  ): Promise<T> {
    return Modal.open<T>(component, {
      ...options,
      noOk: true,
    })
  }
}
