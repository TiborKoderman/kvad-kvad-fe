// stores/modalStore.ts
import { defineStore } from 'pinia'
import { createApp, h, ref } from 'vue'
import  BaseModal  from '@/components/BaseModal.vue'

export const useModalStore = defineStore('modalStore', () => {
  const componentMap = ref(new Map())
  componentMap.value
  .set('edit-dashboard', { component: ()=> import('@/components/Modals/EditDashboardModal.vue'), baseProps: {} })


  async function open(name: string, props = {}) {
    console.log('open', name);
    const entry = componentMap.value.get(name);
    const modalLoader = entry.component;
    if (!modalLoader) {
      console.error(`Modal ${name} not found`);
      return;
    }
  
    try {
      const modalComponent = (await modalLoader()).default;
  
      const modalRef = ref(null); // <-- This is for your custom modal
      const mountTarget = document.createElement('div');
      document.body.appendChild(mountTarget);
  
      const app = createApp({
        setup() {
          const close = () => {
            app.unmount();
            mountTarget.remove();
          };
  
          const submit = () => {
            console.log('submit clicked');
            modalRef.value.submit(); // <-- Call exposed method
            close();
          };
  
          return () => h(BaseModal, { onClose: close, onSubmit: submit, ...entry.baseProps }, {
            default: () => h(modalComponent, { ref: modalRef, ...props }), // <-- Add ref here
          });
        }
      });
  
      app.mount(mountTarget);
    } catch (error) {
      console.error(`Failed to load modal ${name}:`, error);
    }
  }

  return { open, componentMap };
});
