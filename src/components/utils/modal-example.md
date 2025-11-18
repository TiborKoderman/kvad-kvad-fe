# Modal Helper Usage Examples

The Modal helper provides a flexible way to display any Vue component in a modal dialog with automatic submit detection and custom button support.

## Basic Usage

### 1. Simple Modal with Auto-Detection

```typescript
import { Modal } from '@/components/utils/modal'
import MyFormComponent from './MyFormComponent.vue'

// Opens modal and auto-detects if component has a submit method
const result = await Modal.open(MyFormComponent, {
  title: 'Edit User',
  props: {
    userId: 123,
  },
})

console.log('Modal returned:', result)
```

### 2. Confirmation Modal (Always shows Submit button)

```typescript
import { Modal } from '@/components/utils/modal'
import ConfirmDeleteComponent from './ConfirmDeleteComponent.vue'

// Always shows both Cancel and Submit buttons
const confirmed = await Modal.confirm(ConfirmDeleteComponent, {
  title: 'Confirm Deletion',
  props: {
    itemName: 'User Account',
  },
})

if (confirmed) {
  // User clicked submit
}
```

### 3. Info Modal (Only shows Close button)

```typescript
import { Modal } from '@/components/utils/modal'
import InfoComponent from './InfoComponent.vue'

// Only shows Close button
await Modal.info(InfoComponent, {
  title: 'Information',
  props: {
    message: 'Operation completed successfully',
  },
})
```

### 4. Custom Buttons

```typescript
import { Modal } from '@/components/utils/modal'
import CustomComponent from './CustomComponent.vue'

const result = await Modal.open(CustomComponent, {
  title: 'Custom Actions',
  props: { data: someData },
  buttons: [
    {
      label: 'Save Draft',
      class: 'btn-secondary',
      onClick: async modalInstance => {
        // Access the component instance
        if (modalInstance && typeof modalInstance.saveDraft === 'function') {
          await modalInstance.saveDraft()
        }
      },
    },
    {
      label: 'Publish',
      class: 'btn-success',
      onClick: async modalInstance => {
        if (modalInstance && typeof modalInstance.publish === 'function') {
          await modalInstance.publish()
        }
      },
    },
  ],
})
```

### 5. Delete Confirmation Modal

```typescript
import { Modal } from '@/components/utils/modal'
import DeleteConfirmComponent from './DeleteConfirmComponent.vue'

const confirmed = await Modal.open(DeleteConfirmComponent, {
  title: 'Delete Item',
  delete: true, // Shows red delete button instead of primary
  noOk: false, // Ensures submit button is shown
  props: {
    itemId: 456,
  },
})
```

## Component Requirements

### For Auto-Submit Detection

Your component should expose a `submit` method using `defineExpose`:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({ name: '', email: '' })

async function submit() {
  // Validate and process form
  if (!formData.value.name) {
    throw new Error('Name is required')
  }

  // Return the result that will be passed to the modal's promise
  return formData.value
}

// Expose the submit method so modal can detect it
defineExpose({ submit })
</script>
```

### For Custom Actions

Expose any methods you want to call from custom buttons:

```vue
<script setup lang="ts">
async function saveDraft() {
  // Save draft logic
  return { saved: true, draft: true }
}

async function publish() {
  // Publish logic
  return { saved: true, published: true }
}

defineExpose({ saveDraft, publish })
</script>
```

## Modal Options

```typescript
interface ModalOptions {
  // Modal title
  title?: string

  // Props to pass to the component
  props?: Record<string, unknown>

  // Custom buttons to display
  buttons?: ModalButton[]

  // Whether modal should be fullscreen
  fullscreen?: boolean

  // Hide the submit/ok button
  noOk?: boolean

  // Show delete-styled button instead of primary
  delete?: boolean

  // Auto-detect submit functionality (default: true)
  autoDetectSubmit?: boolean
}

interface ModalButton {
  label: string
  class?: string // CSS classes (e.g., 'btn-primary', 'btn-danger')
  onClick: (
    modalInstance: ComponentPublicInstance | null,
  ) => void | Promise<void>
}
```

## Integration with Existing Code

This modal helper works alongside your existing modal store. You can use it directly without registering components:

```typescript
// Old way (requires pre-registration)
import { useModalStore } from '@/stores/modals'
const modalStore = useModalStore()
await modalStore.open('AddUserModal', { editUser: user })

// New way (direct component import)
import { Modal } from '@/components/utils/modal'
import AddUserModal from '@/components/modals/AddUserModal.vue'
await Modal.open(AddUserModal, {
  title: 'Add User',
  props: { editUser: user },
})
```
