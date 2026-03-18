import { defineStore } from 'pinia'
import { createApp, h, ref } from 'vue'
import AlertBase from '@/components/alert/AlertBase.vue'
import type { AlertConfig } from '@/components/alert/alert'

export const useAlertStore = defineStore('alertStore', () => {
  const alerts = ref<any[]>([])

  function open(config: AlertConfig): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const mountTarget = document.createElement('div')
      document.body.appendChild(mountTarget)

      // Add default close action if no actions provided
      const finalConfig = {
        ...config,
        actions: config.actions || {
          close: () => {}
        }
      }

      const app = createApp({
        setup() {
          const handleAction = (actionKey: string, returnValue?: any) => {
            app.unmount()
            mountTarget.remove()

            // Remove from alerts array
            const index = alerts.value.findIndex(a => a.mountTarget === mountTarget)
            if (index !== -1) {
              alerts.value.splice(index, 1)
            }

            if (actionKey === 'ok' || actionKey === 'confirm') {
              resolve(returnValue)
            } else if (actionKey === 'cancel' || actionKey === 'close') {
              reject(new Error('Alert cancelled'))
            } else {
              resolve(returnValue)
            }
          }

          return () => h(AlertBase, {
            ...finalConfig,
            onAction: handleAction
          })
        },
      })

      app.mount(mountTarget)

      // Track mounted alerts
      alerts.value.push({ mountTarget, config: finalConfig })
    })
  }

  return { open, alerts }
})
