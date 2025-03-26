// stores/modalStore.ts
import { defineStore } from 'pinia'
import { createApp, h, ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'

export const useModalStore = defineStore('modalStore', () => {
  const componentMap = ref(new Map())
  componentMap.value.set('edit-dashboard', {
    component: () => import('@/components/Modals/EditDashboardModal.vue'),
    baseProps: {},
  })

  async function open(name: string, props = {}): Promise<void> {
    console.log('open', name)
    const entry = componentMap.value.get(name)
    const modalLoader = entry?.component
    if (!modalLoader) {
      console.error(`Modal ${name} not found`)
      return
    }
  
    return new Promise<void>(async (resolve) => {
      try {
        const modalComponent = (await modalLoader()).default
  
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
                .submit()
                .then(() => {
                  close()
                })
                .catch(() => {
                  console.log('submit failed')
                })
            }
  
            return () =>
              h(
                BaseModal,
                { onClose: close, onSubmit: submit, ...entry.baseProps },
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
  

  return { open, componentMap }
})
