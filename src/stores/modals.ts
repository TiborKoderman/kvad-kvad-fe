// stores/modalStore.ts
import { defineStore } from 'pinia'
import { createApp, h, ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'

export const useModalStore = defineStore('modalStore', () => {
  const componentMap = ref(new Map())

  const modalModules = import.meta.glob('@/components/modals/*.vue')
  console.log('modalModules', modalModules)

  // Register all components in the modals folder
  for (const path in modalModules) {
    const name = path.match(/([^/]+)\.vue$/)?.[1]
    console.log('registering', path)
    if (name) {
      modalModules[path]().then(module => {
        register(name, () => import(path))
      })
    }
  }

  function register(name: string, component: () => Promise<any>) {
    componentMap.value.set(name,  component)
  }

  //for each component in the folder, register it

  async function open(name: string, props = {}): Promise<void> {
    console.log('open', name)
    console.log('props', props)
    const entry = componentMap.value.get(name)
    const modalLoader = entry
    if (!modalLoader) {
      console.error(`Modal ${name} not found`)
      return
    }

    return new Promise<void>(async resolve => {
      try {
        const modalComponent = (await modalLoader()).default


        // console.log('modalComponent', modalComponent);
        console.log('modalComponent.baseProps', modalComponent.baseProps);
        

        const modalRef = ref(null)
        const mountTarget = document.createElement('div')
        document.body.appendChild(mountTarget)

        const app = createApp({
          setup() {
            const close = () => {
              app.unmount()
              mountTarget.remove()
              resolve() // <-- Fulfill the promise when the modal closes
            }

            const submit = () => {
              console.log('submit clicked')
              modalRef.value
                ?.submit()
                ?.then(() => {
                  close()
                })
                ?.catch(() => {
                  console.log('submit failed')
                })
            }

            return () =>
              h(
                BaseModal,
                { onClose: close, onSubmit: submit, ...modalComponent.baseProps?.({...props}) },
                {
                  default: () => h(modalComponent, { ref: modalRef, ...props }),
                },
              )
          },
        })

        app.mount(mountTarget)
      } catch (error) {
        console.error(`Failed to load modal ${name}:`, error)
      }
    })
  }

  return { open, register, componentMap }
})
