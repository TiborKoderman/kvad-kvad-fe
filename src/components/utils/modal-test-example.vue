<template>
  <div>
    <h3>Modal Helper Test Examples</h3>

    <div class="btn-group">
      <button class="btn btn-primary" @click="openFormModal">
        Open Form Modal (Auto Submit)
      </button>

      <button class="btn btn-info" @click="openInfoModal">
        Open Info Modal (No Submit)
      </button>

      <button class="btn btn-warning" @click="openConfirmModal">
        Open Confirmation Modal
      </button>

      <button class="btn btn-success" @click="openCustomButtonsModal">
        Open Custom Buttons Modal
      </button>

      <button class="btn btn-danger" @click="openDeleteModal">
        Open Delete Modal
      </button>
    </div>

    <div v-if="lastResult" class="alert alert-success mt-3">
      <strong>Last Result:</strong>
      <pre>{{ JSON.stringify(lastResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent, h } from 'vue'
import { Modal, useModal } from './modal'

const lastResult = ref<unknown>(null)
type CustomModalInstance = {
  saveDraft?: () => Promise<unknown>
  publish?: () => Promise<unknown>
}

// Simple form component for testing
const TestFormComponent = defineComponent({
  name: 'TestFormComponent',
  props: {
    userName: String,
  },
  setup(props) {
    const modal = useModal<{ name: string; email: string }>()
    const formData = ref({
      name: props.userName || '',
      email: '',
    })

    async function submit() {
      if (!formData.value.name) {
        throw new Error('Name is required')
      }
      return formData.value
    }

    modal.onSubmit(() => submit())

    return () =>
      h(
        'form',
        {
          onSubmit: (e: Event) => {
            e.preventDefault()
            void modal.requestSubmit()
          },
        },
        [
          h('div', { class: 'form-group mb-3' }, [
            h('label', { for: 'name' }, 'Name'),
            h('input', {
              type: 'text',
              class: 'form-control',
              id: 'name',
              value: formData.value.name,
              onInput: (e: Event) => {
                formData.value.name = (e.target as HTMLInputElement).value
              },
            }),
          ]),
          h('div', { class: 'form-group' }, [
            h('label', { for: 'email' }, 'Email'),
            h('input', {
              type: 'email',
              class: 'form-control',
              id: 'email',
              value: formData.value.email,
              onInput: (e: Event) => {
                formData.value.email = (e.target as HTMLInputElement).value
              },
            }),
          ]),
        ],
      )
  },
})

// Simple info component
const TestInfoComponent = defineComponent({
  name: 'TestInfoComponent',
  props: {
    message: String,
  },
  setup(props) {
    return () =>
      h('div', { class: 'alert alert-info' }, [
        h('p', props.message || 'This is an informational message.'),
      ])
  },
})

// Component with custom actions
const TestCustomComponent = defineComponent({
  name: 'TestCustomComponent',
  setup(_, { expose }) {
    const data = ref({ status: 'draft' })

    async function saveDraft() {
      data.value.status = 'draft'
      return { action: 'saved_draft', data: data.value }
    }

    async function publish() {
      data.value.status = 'published'
      return { action: 'published', data: data.value }
    }

    expose({ saveDraft, publish })

    return () =>
      h('div', [
        h('p', 'Current status: ' + data.value.status),
        h('p', 'Use the custom buttons below to save as draft or publish.'),
      ])
  },
})

async function openFormModal() {
  try {
    const result = await Modal.open(TestFormComponent, 'Edit User', {
      userName: 'John Doe',
    })
    lastResult.value = result
  } catch (error) {
    console.error('Modal error:', error)
  }
}

async function openInfoModal() {
  try {
    await Modal.info(TestInfoComponent, {
      title: 'Information',
      props: {
        message: 'This is a simple info modal with only a close button.',
      },
    })
    lastResult.value = { action: 'closed' }
  } catch (error) {
    console.error('Modal error:', error)
  }
}

async function openConfirmModal() {
  try {
    const result = await Modal.confirm(TestInfoComponent, {
      title: 'Confirm Action',
      props: {
        message: 'Are you sure you want to proceed?',
      },
    })
    lastResult.value = { confirmed: true, result }
  } catch (error) {
    console.error('Modal error:', error)
  }
}

async function openCustomButtonsModal() {
  try {
    const result = await Modal.open(TestCustomComponent, {
      title: 'Custom Actions',
      actions: {
        saveDraft: {
          label: 'Save Draft',
          closeOnSuccess: false,
          handler: async ({ modal }) => {
            const customModal = modal as unknown as CustomModalInstance | null

            if (customModal && typeof customModal.saveDraft === 'function') {
              const value = await customModal.saveDraft()
              lastResult.value = value
              return value
            }

            return undefined
          },
        },
        publish: {
          label: 'Publish',
          variant: 'success',
          outline: false,
          handler: async ({ modal }) => {
            const customModal = modal as unknown as CustomModalInstance | null

            if (customModal && typeof customModal.publish === 'function') {
              const value = await customModal.publish()
              lastResult.value = value
              return value
            }

            return undefined
          },
        },
      },
    })
    if (result) {
      lastResult.value = result
    }
  } catch (error) {
    console.error('Modal error:', error)
  }
}

async function openDeleteModal() {
  try {
    const result = await Modal.open(TestInfoComponent, {
      title: 'Delete Item',
      props: {
        message: 'This action cannot be undone. Are you sure?',
      },
      actions: {
        delete: {
          label: 'Delete',
          variant: 'danger',
          outline: false,
          handler: () => true,
        },
      },
    })
    lastResult.value = { deleted: true, result }
  } catch (error) {
    console.error('Modal error:', error)
  }
}
</script>

<style scoped>
.btn-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow: auto;
}
</style>
