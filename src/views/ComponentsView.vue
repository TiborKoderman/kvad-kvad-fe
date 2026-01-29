<template>
  <div class="components-view p-4">
    <h1 class="mb-4">Component Library</h1>

    <!-- Controls -->
    <div class="mb-4 p-3 bg-light border rounded">
      <div class="d-flex gap-3 flex-wrap align-items-center">
        <label class="form-check-label">
          <input
            type="checkbox"
            class="form-check-input me-2"
            v-model="outlineMode"
          />
          Outline Mode
        </label>

        <div>
          <label class="me-2">Size:</label>
          <select
            v-model="globalSize"
            class="form-select form-select-sm d-inline-block"
            style="width: auto"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">XL</option>
            <option value="xxl">XXL</option>
          </select>
        </div>

        <div>
          <label class="me-2">Variant:</label>
          <select
            v-model="globalVariant"
            class="form-select form-select-sm d-inline-block"
            style="width: auto"
          >
            <option v-for="v in variants" :key="v" :value="v">
              {{ capitalize(v) }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Buttons Section -->
    <section class="mb-5">
      <h2 class="mb-3">Buttons</h2>

      <div class="mb-4">
        <h3 class="h5 mb-2">All Variants (Boolean Props)</h3>
        <div class="d-flex gap-2 flex-wrap mb-3">
          <Button
            v-for="variant in variants"
            :key="variant"
            v-bind="{ [variant]: true, outline: outlineMode }"
            @click="log(`${variant} button clicked`)"
          >
            {{ capitalize(variant) }}
          </Button>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Using :v Prop (String Variant)</h3>
        <div class="d-flex gap-2 flex-wrap mb-3">
          <Button :v="'primary'" :outline="outlineMode" @click="log('v prop')">
            :v="primary"
          </Button>
          <Button
            :v="globalVariant"
            :outline="outlineMode"
            @click="log('dynamic v')"
          >
            :v="{{ globalVariant }}"
          </Button>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">All Sizes (:s Prop)</h3>
        <div class="d-flex gap-2 align-items-center flex-wrap mb-3">
          <Button primary :outline="outlineMode" s="sm" @click="log('sm')">
            Small
          </Button>
          <Button primary :outline="outlineMode" s="md" @click="log('md')">
            Medium
          </Button>
          <Button primary :outline="outlineMode" s="lg" @click="log('lg')">
            Large
          </Button>
          <Button primary :outline="outlineMode" s="xl" @click="log('xl')">
            XL
          </Button>
          <Button primary :outline="outlineMode" s="xxl" @click="log('xxl')">
            XXL
          </Button>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Disabled State</h3>
        <div class="d-flex gap-2 flex-wrap mb-3">
          <Button
            primary
            :outline="outlineMode"
            disabled
            @click="log('should not fire')"
          >
            Disabled
          </Button>
          <Button
            success
            :outline="outlineMode"
            :disabled="computedDisabled"
            @click="log('should not fire')"
          >
            Computed: {{ computedDisabled }}
          </Button>
          <Button secondary size="sm" @click="toggleComputedDisabled">
            Toggle
          </Button>
        </div>
      </div>
    </section>

    <!-- Badges Section -->
    <section class="mb-5">
      <h2 class="mb-3">Badges</h2>

      <div class="mb-4">
        <h3 class="h5 mb-2">All Variants</h3>
        <div class="d-flex gap-2 flex-wrap mb-3">
          <Badge
            v-for="variant in variants"
            :key="variant"
            v-bind="{ [variant]: true, outline: outlineMode }"
          >
            {{ capitalize(variant) }}
          </Badge>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Using :v Prop</h3>
        <div class="d-flex gap-2 flex-wrap mb-3">
          <Badge :v="globalVariant" :outline="outlineMode">
            :v="{{ globalVariant }}"
          </Badge>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">All Sizes</h3>
        <div class="d-flex gap-2 align-items-center flex-wrap mb-3">
          <Badge primary :outline="outlineMode" s="sm">SM</Badge>
          <Badge primary :outline="outlineMode" s="md">MD</Badge>
          <Badge primary :outline="outlineMode" s="lg">LG</Badge>
          <Badge primary :outline="outlineMode" s="xl">XL</Badge>
          <Badge primary :outline="outlineMode" s="xxl">XXL</Badge>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">In Context</h3>
        <h4 class="h6">
          Messages <Badge danger :outline="outlineMode" s="md">12</Badge>
        </h4>
        <h4 class="h6">
          Notifications <Badge primary :outline="outlineMode">4</Badge>
        </h4>
      </div>
    </section>

    <!-- Pills Section -->
    <section class="mb-5">
      <h2 class="mb-3">Pills</h2>

      <div class="mb-4">
        <h3 class="h5 mb-2">All Variants</h3>
        <div class="d-flex gap-2 flex-wrap mb-3">
          <Pill
            v-for="variant in variants"
            :key="variant"
            v-bind="{ [variant]: true, outline: outlineMode }"
          >
            {{ capitalize(variant) }}
          </Pill>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">All Sizes</h3>
        <div class="d-flex gap-2 align-items-center flex-wrap mb-3">
          <Pill info :outline="outlineMode" s="sm">Small</Pill>
          <Pill info :outline="outlineMode" s="md">Medium</Pill>
          <Pill info :outline="outlineMode" s="lg">Large</Pill>
          <Pill info :outline="outlineMode" s="xl">XL</Pill>
          <Pill info :outline="outlineMode" s="xxl">XXL</Pill>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Tags Example</h3>
        <div class="d-flex gap-2 flex-wrap mb-3">
          <Pill primary :outline="outlineMode">JavaScript</Pill>
          <Pill secondary :outline="outlineMode">TypeScript</Pill>
          <Pill info :outline="outlineMode">Vue.js</Pill>
          <Pill success :outline="outlineMode">Active</Pill>
          <Pill warning :outline="outlineMode">Pending</Pill>
        </div>
      </div>
    </section>

    <!-- Alerts Section -->
    <section class="mb-5">
      <h2 class="mb-3">Alerts</h2>

      <div class="mb-4">
        <h3 class="h5 mb-2">All Variants</h3>
        <Alert
          v-for="variant in variants.slice(2)"
          :key="variant"
          v-bind="{ [variant]: true, outline: outlineMode }"
          class="mb-2"
        >
          <strong>{{ capitalize(variant) }} Alert:</strong>
          This is a {{ variant }} alert with important information.
        </Alert>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">With Icons</h3>
        <Alert success :outline="outlineMode" icon="check-circle" class="mb-2">
          <strong>Success!</strong> Your operation completed successfully.
        </Alert>
        <Alert
          warning
          :outline="outlineMode"
          icon="exclamation-triangle"
          class="mb-2"
        >
          <strong>Warning!</strong> Please review before proceeding.
        </Alert>
        <Alert danger :outline="outlineMode" icon="x-circle" class="mb-2">
          <strong>Error!</strong> Something went wrong.
        </Alert>
        <Alert info :outline="outlineMode" icon="info-circle">
          <strong>Info:</strong> Here's some helpful information.
        </Alert>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Different Sizes</h3>
        <Alert primary icon="bell" s="sm" class="mb-2">Small alert</Alert>
        <Alert primary icon="bell" s="md" class="mb-2">Medium alert</Alert>
        <Alert primary icon="bell" s="lg" class="mb-2">Large alert</Alert>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Using :v Prop</h3>
        <Alert :v="globalVariant" :outline="outlineMode" icon="star">
          Alert using :v="{{ globalVariant }}"
        </Alert>
      </div>
    </section>

    <!-- Flex Layout Section -->
    <section class="mb-5">
      <h2 class="mb-3">Flex Layout</h2>

      <div class="mb-4">
        <h3 class="h5 mb-2">Horizontal with Gap</h3>
        <Flex gap="3" class="border p-3">
          <div class="bg-primary text-white p-2">Item 1</div>
          <div class="bg-secondary text-white p-2">Item 2</div>
          <div class="bg-info text-white p-2">Item 3</div>
        </Flex>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Vertical (col)</h3>
        <Flex col gap="2" class="border p-3">
          <div class="bg-primary text-white p-2">Item 1</div>
          <div class="bg-secondary text-white p-2">Item 2</div>
          <div class="bg-info text-white p-2">Item 3</div>
        </Flex>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Justify & Align</h3>
        <Flex
          justify="between"
          align="center"
          class="border p-3 mb-2"
          style="min-height: 80px"
        >
          <div class="bg-primary text-white p-2">Left</div>
          <div class="bg-secondary text-white p-2">Center</div>
          <div class="bg-info text-white p-2">Right</div>
        </Flex>

        <Flex
          justify="center"
          align="center"
          class="border p-3"
          style="min-height: 80px"
        >
          <div class="bg-success text-white p-2">Centered</div>
        </Flex>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Fill & Wrap</h3>
        <Flex wrap gap="2" class="border p-3">
          <div class="bg-primary text-white p-2">Item 1</div>
          <div class="bg-secondary text-white p-2">Item 2</div>
          <div class="bg-info text-white p-2">Item 3</div>
          <div class="bg-success text-white p-2">Item 4</div>
          <div class="bg-warning text-dark p-2">Item 5</div>
          <div class="bg-danger text-white p-2">Item 6</div>
        </Flex>
      </div>
    </section>

    <!-- Card Section -->
    <section class="mb-5">
      <h2 class="mb-3">Cards</h2>

      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <Card>
            <template #header>
              <h5 class="mb-0">Default Card</h5>
            </template>
            This is a basic card with header and footer slots.
            <template #footer>
              <Button primary s="sm">Action</Button>
            </template>
          </Card>
        </div>

        <div class="col-md-4 mb-3">
          <Card primary>
            <template #header>
              <h5 class="mb-0 text-white">Primary Card</h5>
            </template>
            <div class="text-white">Card with primary variant.</div>
          </Card>
        </div>

        <div class="col-md-4 mb-3">
          <Card success outline>
            <template #header>
              <h5 class="mb-0">Outline Card</h5>
            </template>
            Card with outline style.
            <template #footer>
              <small class="text-muted">Footer text</small>
            </template>
          </Card>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Using :v Prop</h3>
        <Card :v="globalVariant" :outline="outlineMode">
          <template #header>
            <h5 class="mb-0">Dynamic Variant</h5>
          </template>
          This card uses :v="{{ globalVariant }}"
          {{ outlineMode ? 'outline' : '' }}
        </Card>
      </div>
    </section>

    <!-- Form Elements Section -->
    <section class="mb-5">
      <h2 class="mb-3">Form Elements</h2>

      <div class="mb-4">
        <h3 class="h5 mb-2">Input</h3>
        <div class="row">
          <div class="col-md-4 mb-3">
            <label class="form-label">Small Input</label>
            <Input v-model="formData.name" placeholder="Name" s="sm" />
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Medium Input (default)</label>
            <Input
              v-model="formData.email"
              placeholder="Email"
              type="email"
              s="md"
            />
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Large Input</label>
            <Input v-model="formData.phone" placeholder="Phone" s="lg" />
          </div>
        </div>
        <div class="alert alert-light">
          <strong>Values:</strong> name={{ formData.name }}, email={{
            formData.email
          }}, phone={{ formData.phone }}
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Textarea</h3>
        <Textarea
          v-model="formData.description"
          placeholder="Description"
          rows="3"
          s="md"
        />
        <div class="alert alert-light mt-2">
          <strong>Value:</strong> {{ formData.description || '(empty)' }}
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Select</h3>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Small Select</label>
            <Select v-model="formData.country" s="sm">
              <option value="">Choose...</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
            </Select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Large Select</label>
            <Select v-model="formData.category" s="lg">
              <option value="">Choose...</option>
              <option value="tech">Technology</option>
              <option value="business">Business</option>
              <option value="science">Science</option>
            </Select>
          </div>
        </div>
        <div class="alert alert-light">
          <strong>Values:</strong> country={{ formData.country || '(none)' }},
          category={{ formData.category || '(none)' }}
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Checkbox</h3>
        <Checkbox
          v-model="formData.agree"
          label="I agree to the terms and conditions"
        />
        <Checkbox
          v-model="formData.newsletter"
          label="Subscribe to newsletter"
          class="mt-2"
        />
        <div class="alert alert-light mt-2">
          <strong>Values:</strong> agree={{ formData.agree }}, newsletter={{
            formData.newsletter
          }}
        </div>
      </div>

      <div class="mb-4">
        <h3 class="h5 mb-2">Radio</h3>
        <Radio
          v-model="formData.plan"
          value="free"
          label="Free Plan"
          name="plan"
        />
        <Radio
          v-model="formData.plan"
          value="pro"
          label="Pro Plan"
          name="plan"
          class="mt-2"
        />
        <Radio
          v-model="formData.plan"
          value="enterprise"
          label="Enterprise Plan"
          name="plan"
          class="mt-2"
        />
        <div class="alert alert-light mt-2">
          <strong>Selected:</strong> {{ formData.plan || '(none)' }}
        </div>
      </div>
    </section>

    <!-- Event Log -->
    <section class="mb-5">
      <h2 class="mb-3">Event Log</h2>
      <div class="border rounded p-3 bg-light">
        <div v-if="clickLog.length === 0" class="text-muted fst-italic">
          No events yet. Click some buttons to see events here.
        </div>
        <div v-else>
          <div v-for="(entry, index) in clickLog" :key="index" class="mb-1">
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
import { themeVariants } from '@/assets/themes/theme-config'
import Button from '@/components/formItems/forms/Button.vue'
import Badge from '@/components/formItems/display/Badge.vue'
import Pill from '@/components/formItems/display/Pill.vue'
import Alert from '@/components/formItems/feedback/Alert.vue'
import Flex from '@/components/formItems/layout/Flex.vue'
import Card from '@/components/formItems/layout/Card.vue'
import Input from '@/components/formItems/forms/Input.vue'
import Textarea from '@/components/formItems/forms/Textarea.vue'
import Select from '@/components/formItems/forms/Select.vue'
import Checkbox from '@/components/formItems/forms/Checkbox.vue'
import Radio from '@/components/formItems/forms/Radio.vue'

const variants = [...themeVariants]
const outlineMode = ref(false)
const globalSize = ref('md')
const globalVariant = ref('primary')
const computedDisabled = ref(true)
const clickLog = ref<Array<{ time: string; message: string }>>([])

const formData = ref({
  name: '',
  email: '',
  phone: '',
  description: '',
  country: '',
  category: '',
  agree: false,
  newsletter: false,
  plan: '',
})

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const toggleComputedDisabled = () => {
  computedDisabled.value = !computedDisabled.value
}

const log = (message: string) => {
  const time = new Date().toLocaleTimeString()
  clickLog.value.unshift({ time, message })
  console.log(`[${time}] ${message}`)

  // Keep only last 20 entries
  if (clickLog.value.length > 20) {
    clickLog.value = clickLog.value.slice(0, 20)
  }
}

const clearLog = () => {
  clickLog.value = []
}
</script>

<style scoped>
.components-view {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: var(--t-primary);
  border-bottom: 2px solid var(--t-primary);
  padding-bottom: 0.5rem;
}

h2 {
  color: var(--t-dark);
  border-bottom: 1px solid var(--t-border-color);
  padding-bottom: 0.5rem;
}

section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.gap-2 {
  gap: 0.5rem;
}
</style>
