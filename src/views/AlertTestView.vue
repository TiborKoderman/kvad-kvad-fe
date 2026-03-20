<template>
  <div class="alert-test-view p-4">
    <h1 class="mb-4">Alert System Test</h1>

    <!-- Info Box -->
    <div class="alert alert-info mb-4">
      <strong>💡 Keyboard Shortcuts:</strong>
      <ul class="mb-0 mt-2">
        <li><kbd>Enter</kbd> - Triggers OK/Confirm button</li>
        <li><kbd>Escape</kbd> - Triggers Cancel/Close button</li>
        <li><strong>Click outside:</strong> Only closes if the ONLY action is Cancel/Close</li>
        <li>Focus automatically moves to OK/Confirm button when alert opens</li>
      </ul>
    </div>

    <!-- Basic Variants -->
    <section class="mb-5">
      <h2 class="mb-3">Basic Variants (with default close button)</h2>
      <p class="text-muted mb-3">All alerts automatically include a close button if no actions are specified. Close/cancel buttons use the dark outline variant.</p>
      <div class="d-flex gap-2 flex-wrap">
        <Button primary @click="testInfo">Info Alert</Button>
        <Button success @click="testSuccess">Success Alert</Button>
        <Button warning @click="testWarning">Warning Alert</Button>
        <Button danger @click="testDanger">Danger Alert</Button>
        <Button secondary @click="testSecondary">Secondary Alert</Button>
      </div>

      <div class="code-example mt-3">
        <pre><code>// Simple usage - automatically includes a "Close" button
Alert.info("This is an informational message")
Alert.success("Operation completed successfully")
Alert.warning("Please review this warning")
Alert.danger("An error occurred")

// Close/cancel buttons are styled with dark outline variant
// Keyboard shortcuts: Enter = OK/Confirm, Escape = Cancel/Close
// Click outside only closes if ONLY action is cancel/close</code></pre>
      </div>
    </section>

    <!-- With Descriptions -->
    <section class="mb-5">
      <h2 class="mb-3">With Descriptions</h2>
      <div class="d-flex gap-2 flex-wrap">
        <Button info @click="testWithDescription">Info with Details</Button>
        <Button success @click="testSuccessWithDescription">Success with Details</Button>
      </div>

      <div class="code-example mt-3">
        <pre><code>// With description
Alert.info(
  "File uploaded",
  "Your file has been uploaded and will be processed shortly."
)</code></pre>
      </div>
    </section>

    <!-- With Actions -->
    <section class="mb-5">
      <h2 class="mb-3">With Actions</h2>
      <div class="d-flex gap-2 flex-wrap">
        <Button primary @click="testSimpleActions">Simple Actions</Button>
        <Button warning @click="testCustomActions">Custom Actions</Button>
        <Button danger @click="testMultipleActions">Multiple Actions</Button>
      </div>

      <div class="code-example mt-3">
        <pre><code>// With actions (cancel/close buttons use dark outline variant)
Alert.warning("Delete this item?", {
  confirm: () => {
    console.log("Deleted!")
  },
  cancel: () => {
    console.log("Cancelled")
  }
})

// Custom actions with custom button variants
Alert.info("Save changes?", {
  "save": {
    handler: () => saveData(),
    label: "Save Now",
    variant: "success"
  },
  "save-and-close": {
    handler: () => saveAndClose(),
    label: "Save & Close",
    variant: "primary"
  },
  "cancel": () => {}
})</code></pre>
      </div>
    </section>

    <!-- Promise-based -->
    <section class="mb-5">
      <h2 class="mb-3">Promise-based Usage</h2>
      <div class="d-flex gap-2 flex-wrap">
        <Button primary @click="testConfirm">Confirm Dialog</Button>
        <Button info @click="testPromiseChain">Promise Chain</Button>
      </div>

      <div class="code-example mt-3">
        <pre><code>// Confirm dialog
Alert.confirm("Are you sure?", "This action cannot be undone")
  .then(() => {
    console.log("User confirmed")
  })
  .catch(() => {
    console.log("User cancelled")
  })

// Any alert can be chained
Alert.success("Item saved!", {
  ok: () => "returned value"
})
  .then(value => {
    console.log("Alert closed with:", value)
  })</code></pre>
      </div>
    </section>

    <!-- Custom Configuration -->
    <section class="mb-5">
      <h2 class="mb-3">Custom Configuration</h2>
      <div class="d-flex gap-2 flex-wrap">
        <Button primary @click="testCustomColor">Custom Color</Button>
        <Button secondary @click="testCustomIcon">Custom Icon</Button>
        <Button info @click="testFullConfig">Full Config</Button>
      </div>

      <div class="code-example mt-3">
        <pre><code>// Custom color and icon (icon, color, message, actions)
Alert.open("bi-heart-fill", "#ff6b6b", "We love you!", {
  ok: () => {}
})

// Full configuration
Alert.open({
  message: "Custom Alert",
  description: "This uses full configuration object",
  variant: "primary",
  icon: "bi-star-fill",
  color: "#ffd700",
  actions: {
    ok: () => {},
    cancel: () => {}
  }
})</code></pre>
      </div>
    </section>

    <!-- Keyboard Shortcuts & Focus -->
    <section class="mb-5">
      <h2 class="mb-3">Keyboard Shortcuts & Focus</h2>
      <p class="text-muted mb-3">
        Alerts automatically focus the OK/Confirm button. Press <kbd>Enter</kbd> to confirm or <kbd>Escape</kbd> to cancel.
        Click outside only closes alerts with a single cancel/close action.
      </p>
      <div class="d-flex gap-2 flex-wrap">
        <Button primary @click="testKeyboardShortcuts">Test Keyboard (Try Enter)</Button>
        <Button warning @click="testEscapeKey">Test Escape Key</Button>
        <Button info @click="testBackdropClick">Test Backdrop (Won't Close)</Button>
      </div>

      <div class="code-example mt-3">
        <pre><code>// Keyboard shortcuts work automatically
Alert.confirm("Press Enter to confirm", "Or Escape to cancel")
  .then(() => console.log("Confirmed with Enter"))
  .catch(() => console.log("Cancelled with Escape"))

// Backdrop click only closes if ONLY action is cancel/close
Alert.info("Try clicking outside", {
  ok: () => {},
  cancel: () => {}
})
// ^ Won't close on backdrop click (has multiple actions)

Alert.success("This will close on backdrop click")
// ^ Will close on backdrop click (only has close action)</code></pre>
      </div>
    </section>

    <!-- All Variants at Once -->
    <section class="mb-5">
      <h2 class="mb-3">All Theme Variants</h2>
      <div class="d-flex gap-2 flex-wrap">
        <Button
          v-for="variant in variants"
          :key="variant"
          v-bind="{ [variant]: true }"
          @click="testVariant(variant)"
        >
          {{ capitalize(variant) }}
        </Button>
      </div>
    </section>

    <!-- Event Log -->
    <section class="mb-5">
      <h2 class="mb-3">Event Log</h2>
      <div class="border rounded p-3 bg-light">
        <div v-if="eventLog.length === 0" class="text-muted fst-italic">
          No events yet. Try some alerts to see results here.
        </div>
        <div v-else>
          <div v-for="(entry, index) in eventLog" :key="index" class="mb-1 font-monospace small">
            <Badge secondary s="sm" class="me-2">{{ entry.time }}</Badge>
            {{ entry.message }}
          </div>
          <Button danger s="sm" class="mt-2" @click="clearLog">
            Clear Log
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Alert } from '@/components/alert/alert'
import { themeVariants } from '@/assets/themes/theme-config'
import Button from '@/components/formItems/forms/Button.vue'
import Badge from '@/components/formItems/display/Badge.vue'

const variants = [...themeVariants]
const eventLog = ref<Array<{ time: string; message: string }>>([])

const log = (message: string) => {
  const time = new Date().toLocaleTimeString()
  eventLog.value.unshift({ time, message })

  if (eventLog.value.length > 30) {
    eventLog.value = eventLog.value.slice(0, 30)
  }
}

const clearLog = () => {
  eventLog.value = []
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

// Test functions
const testInfo = () => {
  Alert.info("This is an informational message")
    .then(() => log("Info alert closed"))
    .catch(() => log("Info alert cancelled"))
}

const testSuccess = () => {
  Alert.success("Operation completed successfully!")
    .then(() => log("Success alert closed"))
    .catch(() => log("Success alert cancelled"))
}

const testWarning = () => {
  Alert.warning("Please review this warning carefully")
    .then(() => log("Warning alert closed"))
    .catch(() => log("Warning alert cancelled"))
}

const testDanger = () => {
  Alert.danger("An error occurred while processing your request")
    .then(() => log("Danger alert closed"))
    .catch(() => log("Danger alert cancelled"))
}

const testSecondary = () => {
  Alert.secondary("This is a secondary notification")
    .then(() => log("Secondary alert closed"))
    .catch(() => log("Secondary alert cancelled"))
}

const testWithDescription = () => {
  Alert.info(
    "File uploaded successfully",
    "Your file has been uploaded and will be processed in the background. You'll receive a notification when it's ready."
  )
    .then(() => log("Info with description closed"))
    .catch(() => log("Info with description cancelled"))
}

const testSuccessWithDescription = () => {
  Alert.success(
    "Account created",
    "Your account has been successfully created. Please check your email to verify your address."
  )
    .then(() => log("Success with description closed"))
    .catch(() => log("Success with description cancelled"))
}

const testSimpleActions = () => {
  Alert.warning("Are you sure you want to proceed?", {
    confirm: () => {
      log("User clicked Confirm")
      return true
    },
    cancel: () => {
      log("User clicked Cancel")
      return false
    }
  })
    .then(result => log(`Simple actions resolved: ${result}`))
    .catch(() => log("Simple actions cancelled"))
}

const testCustomActions = () => {
  Alert.info("Choose an action", {
    "save": {
      handler: () => {
        log("User clicked Save")
        return "saved"
      },
      label: "Save Now",
      variant: "success"
    },
    "discard": {
      handler: () => {
        log("User clicked Discard")
        return "discarded"
      },
      label: "Discard Changes",
      variant: "danger"
    },
    "cancel": () => {
      log("User clicked Cancel")
    }
  })
    .then(result => log(`Custom actions resolved: ${result}`))
    .catch(() => log("Custom actions cancelled"))
}

const testMultipleActions = () => {
  Alert.warning("Delete this item?", "This action cannot be undone", {
    "delete": {
      handler: () => {
        log("Item deleted")
        return "deleted"
      },
      label: "Delete",
      variant: "danger"
    },
    "archive": {
      handler: () => {
        log("Item archived")
        return "archived"
      },
      label: "Archive Instead",
      variant: "warning"
    },
    "keep": {
      handler: () => {
        log("Item kept")
        return "kept"
      },
      label: "Keep It",
      variant: "success"
    },
    "cancel": () => {
      log("Operation cancelled")
    }
  })
    .then(result => log(`Multiple actions resolved: ${result}`))
    .catch(() => log("Multiple actions cancelled"))
}

const testConfirm = () => {
  Alert.confirm("Delete user account?", "This action cannot be undone and all data will be permanently lost.")
    .then(() => {
      log("User confirmed deletion")
      Alert.success("Account deleted successfully")
    })
    .catch(() => {
      log("User cancelled deletion")
    })
}

const testPromiseChain = () => {
  Alert.success("Item saved successfully!", {
    ok: () => {
      return { id: 123, name: "Test Item" }
    }
  })
    .then((result) => {
      log(`Promise resolved with: ${JSON.stringify(result)}`)
      Alert.info("Do you want to create another?", {
        yes: () => {
          log("User wants to create another")
          return true
        },
        no: () => {
          log("User doesn't want to create another")
          return false
        }
      })
    })
    .catch(() => {
      log("Promise chain cancelled")
    })
}

const testCustomColor = () => {
  // Using the (icon, color, message, actions) signature
  Alert.open("bi-heart-fill", "#ff6b6b", "We love you!", {
    ok: () => log("Custom color alert closed")
  })
}

const testCustomIcon = () => {
  Alert.open({
    message: "Star rating received!",
    description: "Thank you for your feedback",
    variant: "warning",
    icon: "bi-star-fill",
    actions: {
      ok: () => log("Custom icon alert closed")
    }
  })
}

const testFullConfig = () => {
  Alert.open({
    message: "Fully configured alert",
    description: "This demonstrates all available configuration options working together",
    variant: "primary",
    icon: "bi-gear-fill",
    actions: {
      "primary-action": {
        handler: () => {
          log("Primary action executed")
          return "primary"
        },
        label: "Primary Button",
        variant: "primary"
      },
      "secondary-action": {
        handler: () => {
          log("Secondary action executed")
          return "secondary"
        },
        label: "Secondary Button",
        variant: "secondary"
      },
      "cancel": () => {
        log("Cancelled")
      }
    }
  })
}

const testKeyboardShortcuts = () => {
  Alert.confirm("Press Enter to confirm!", "Or press Escape to cancel. Focus is on the Confirm button.")
    .then(() => {
      log("User pressed Enter (confirmed)")
      Alert.success("You pressed Enter!")
    })
    .catch(() => {
      log("User pressed Escape (cancelled)")
    })
}

const testEscapeKey = () => {
  Alert.warning("This alert can be closed with Escape", "Try pressing the Escape key", {
    ok: () => {
      log("OK button clicked")
    },
    cancel: () => {
      log("Cancelled with Escape key")
    }
  })
}

const testBackdropClick = () => {
  Alert.info("Try clicking outside this alert", "It won't close because there are multiple actions!", {
    ok: () => {
      log("OK clicked - not backdrop")
    },
    cancel: () => {
      log("Cancel clicked - not backdrop")
    }
  })
    .then(() => log("Alert closed via button"))
    .catch(() => log("Alert cancelled via button"))
}

const testVariant = (variant: string) => {
  const method = Alert[variant as keyof typeof Alert] as any
  if (typeof method === 'function') {
    method(`This is a ${variant} alert`, {
      ok: () => log(`${capitalize(variant)} alert closed`)
    })
  }
}
</script>

<style scoped>
.alert-test-view {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: var(--t-primary);
  border-bottom: 2px solid var(--t-primary);
  padding-bottom: 0.5rem;
}

h2 {
  color: var(--t-body-color);
  border-bottom: 1px solid var(--t-border-color);
  padding-bottom: 0.5rem;
}

section {
  background: var(--t-card-bg);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--t-card-border-color);
}

.code-example {
  background: var(--t-body-bg);
  border: 1px solid var(--t-border-color);
  border-radius: 0.375rem;
  padding: 1rem;
}

.code-example pre {
  margin: 0;
  font-size: 0.875rem;
  color: var(--t-body-color);
}

.code-example code {
  color: var(--t-body-color);
  font-family: 'Courier New', monospace;
}

kbd {
  background-color: var(--t-input-bg);
  border: 1px solid var(--t-border-color);
  border-radius: 3px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 0.875rem;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}
</style>
