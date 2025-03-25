// stores/modalStore.ts
import { defineStore } from 'pinia'
import { createApp, h, ref } from 'vue'
import  BaseModal  from '@/components/BaseModal.vue'

export const useModalStore = defineStore('modalStore', () => {
  const componentMap = ref(new Map().set('edit-dashboard', () => import('@/components/Modals/EditDashboardModal.vue')))

  async function open(name: string, props = {}) {
    console.log('open', name);
    const modalLoader = componentMap.value.get(name);
    if (!modalLoader) {
      console.error(`Modal ${name} not found`);
      return;
    }

    try {
      const modal = (await modalLoader()).default;

      const modalRef = ref(null);
      const app = createApp({
        setup() {
          const close = () => {
            app.unmount();
            modalRef.value?.remove();
          };

          return () => h(BaseModal, { onClose: close }, {
            default: () => h(modal, props)
          });
        }
      });

      const div = document.createElement('div');
      modalRef.value = div;
      document.body.appendChild(div);
      app.mount(div);
    } catch (error) {
      console.error(`Failed to load modal ${name}:`, error);
    }
  }

  return { open, componentMap };
});
