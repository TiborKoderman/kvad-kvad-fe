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

  console.log('componentMap', componentMap)


  function register(name: string, component: () => Promise<any>) {
    componentMap.value.set(name,  component)
  }

  //for each component in the folder, register it

  async function open(name: string, props = {}): Promise<any> {
    // console.log('open', name)
    // console.log('props', props)
    const entry = componentMap.value.get(name)
    const modalLoader = entry
    if (!modalLoader) {
      console.error(`Modal ${name} not found`)
      return
    }

    return new Promise<any>(async (resolve, reject) => {
      try {
        const modalComponent = (await modalLoader()).default


        // console.log('modalComponent', modalComponent);
        // console.log('modalComponent.baseProps', modalComponent.baseProps);
        

        const modalRef = ref(null)
        const mountTarget = document.createElement('div')
        document.body.appendChild(mountTarget)

        const app = createApp({
          setup() {
            const close = (returnValue?: any) => {
              app.unmount()
              mountTarget.remove()
              resolve(returnValue)
            }

            const submit = () => {
              console.log('submit clicked')
              return modalRef.value
                ?.submit()
                ?.then((value) => {
                  console.log('submit success', value)
                  close()
                  return value
                })
                ?.catch((error) => {
                  console.log('submit failed', error)
                  reject(error)
                })
            }

            return () =>
              h(
                BaseModal,
                { onClose: close, onSubmit: submit, ...modalComponent?.baseProps?.({...props }) },
                {
                  default: () => h(modalComponent, { ref: modalRef, ...props }),
                },
              )
          },
        })

        app.mount(mountTarget)
      } catch (error) {
        console.error(`Failed to load modal ${name}:`, error)
        reject(error)
      }
    })
  }

  return { open, register, componentMap }
})