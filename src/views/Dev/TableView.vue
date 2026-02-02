<template>
  <div class="table-view">
    <h1>Table Component Demo</h1>

    <div class="tooltip-demo mb-4">
      <h3>Tooltip Examples:</h3>
      <div class="d-flex gap-3 mt-2">
        <button
          class="btn btn-primary"
          v-tooltip="'Simple tooltip on top'"
        >
          Simple Tooltip
        </button>
        <button
          class="btn btn-secondary"
          v-tooltip="{ content: 'Tooltip on the right', position: 'right' }"
        >
          Right Tooltip
        </button>
        <button
          class="btn btn-info"
          v-tooltip="{
            content: '<strong>Styled</strong> tooltip with <em>HTML</em> and <code>code</code>',
            html: true,
            position: 'bottom'
          }"
        >
          HTML Tooltip
        </button>
        <button
          class="btn btn-success"
          v-tooltip="{
            content: '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
            html: true,
            position: 'left'
          }"
        >
          List Tooltip
        </button>
      </div>
    </div>

    <section>
      <h2>User Management Table</h2>
      <KTable
        :columns="userColumns"
        :data="userData"
        :striped="true"
        :hoverable="true"
        :bordered="true"
        @update:data="userData = $event"
      />
    </section>

    <section>
      <h2>Device Status Table</h2>
      <KTable
        :columns="deviceColumns"
        :data="deviceData"
        :striped="true"
        :hoverable="true"
        @update:data="deviceData = $event"
      />
    </section>

    <section>
      <h2>Large Dataset with Scrolling (Max Height: 400px)</h2>
      <KTable
        :columns="largeDataColumns"
        :data="largeData"
        :striped="true"
        :hoverable="true"
        :bordered="true"
        maxHeight="400px"
        @update:data="largeData = $event"
      />
    </section>

    <section>
      <h2>Compact Table (No Search, No Sort)</h2>
      <KTable
        :columns="compactColumns"
        :data="compactData"
        :striped="false"
        :hoverable="true"
        :sortable="false"
        :searchable="false"
        @update:data="compactData = $event"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KTable from '@/components/Table/KTable.vue'

const userColumns = [
  {
    title: 'ID',
    data: 'id',
    type: 'number' as const,
    editable: false
  },
  {
    title: 'Name',
    data: 'name',
    type: 'string' as const,
    editable: true
  },
  {
    title: 'Email',
    data: 'email',
    type: 'string' as const,
    editable: true
  },
  {
    title: 'Age',
    data: 'age',
    type: 'number' as const,
    editable: true,
    precision: 0
  },
  {
    title: 'Active',
    data: 'active',
    type: 'boolean' as const,
    editable: true
  },
  {
    title: 'Created At',
    data: 'createdAt',
    type: 'time' as const,
    editable: true
  },
  {
    title: 'Actions',
    data: 'actions',
    type: 'action' as const,
    actions: [
      {
        label: 'Edit',
        variant: 'primary',
        handler: (row: any) => {
          console.log('Edit user:', row)
          alert(`Editing user: ${row.name}`)
        }
      },
      {
        label: 'Delete',
        variant: 'danger',
        handler: (row: any) => {
          console.log('Delete user:', row)
          if (confirm(`Delete user ${row.name}?`)) {
            userData.value = userData.value.filter(u => u.id !== row.id)
          }
        }
      }
    ]
  }
]

const userData = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 28,
    active: true,
    createdAt: '2024-01-15T10:30:00'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 34,
    active: true,
    createdAt: '2024-02-20T14:45:00'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    age: 42,
    active: false,
    createdAt: '2024-03-10T09:15:00'
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    age: 31,
    active: true,
    createdAt: '2024-04-05T16:20:00'
  }
])

const deviceColumns = [
  {
    title: 'Device ID',
    data: 'deviceId',
    type: 'string' as const,
    editable: false
  },
  {
    title: 'Temperature (°C)',
    data: 'temperature',
    type: 'number' as const,
    editable: true,
    precision: 1
  },
  {
    title: 'Humidity (%)',
    data: 'humidity',
    type: 'number' as const,
    editable: true,
    precision: 2
  },
  {
    title: 'Online',
    data: 'online',
    type: 'boolean' as const,
    editable: true
  },
  {
    title: 'Last Update',
    data: 'lastUpdate',
    type: 'time' as const,
    editable: false,
    showElapsed: true
  },
  {
    title: 'Actions',
    data: 'actions',
    type: 'action' as const,
    actions: [
      {
        label: 'View',
        variant: 'primary',
        handler: (row: any) => {
          console.log('View device:', row)
          alert(`Device: ${row.deviceId}\nTemp: ${row.temperature}°C\nHumidity: ${row.humidity}%`)
        }
      },
      {
        label: 'Reset',
        variant: 'secondary',
        handler: (row: any) => {
          console.log('Reset device:', row)
          alert(`Resetting device: ${row.deviceId}`)
        }
      }
    ]
  }
]

const deviceData = ref([
  {
    deviceId: 'DEV-001',
    temperature: 22.5,
    humidity: 45.32,
    online: true,
    lastUpdate: '2026-02-02T08:30:00'
  },
  {
    deviceId: 'DEV-002',
    temperature: 19.8,
    humidity: 52.18,
    online: true,
    lastUpdate: '2026-02-02T08:28:00'
  },
  {
    deviceId: 'DEV-003',
    temperature: 25.1,
    humidity: 38.95,
    online: false,
    lastUpdate: '2026-02-01T23:45:00'
  }
])

// Large dataset for scrolling demo
const largeDataColumns = [
  {
    title: 'Order ID',
    data: 'orderId',
    type: 'string' as const,
    editable: false
  },
  {
    title: 'Customer',
    data: 'customer',
    type: 'string' as const,
    editable: true
  },
  {
    title: 'Product',
    data: 'product',
    type: 'string' as const,
    editable: true
  },
  {
    title: 'Quantity',
    data: 'quantity',
    type: 'number' as const,
    editable: true,
    precision: 0
  },
  {
    title: 'Price',
    data: 'price',
    type: 'number' as const,
    editable: true,
    precision: 2
  },
  {
    title: 'Paid',
    data: 'paid',
    type: 'boolean' as const,
    editable: true
  },
  {
    title: 'Order Date',
    data: 'orderDate',
    type: 'time' as const,
    editable: false
  }
]

const largeData = ref([
  { orderId: 'ORD-1001', customer: 'John Smith', product: 'Laptop', quantity: 1, price: 1299.99, paid: true, orderDate: '2026-01-15T09:30:00' },
  { orderId: 'ORD-1002', customer: 'Sarah Jones', product: 'Mouse', quantity: 2, price: 29.99, paid: true, orderDate: '2026-01-16T10:15:00' },
  { orderId: 'ORD-1003', customer: 'Mike Brown', product: 'Keyboard', quantity: 1, price: 89.99, paid: false, orderDate: '2026-01-16T14:22:00' },
  { orderId: 'ORD-1004', customer: 'Emily Davis', product: 'Monitor', quantity: 2, price: 349.99, paid: true, orderDate: '2026-01-17T11:45:00' },
  { orderId: 'ORD-1005', customer: 'David Wilson', product: 'Headset', quantity: 1, price: 79.99, paid: true, orderDate: '2026-01-18T08:30:00' },
  { orderId: 'ORD-1006', customer: 'Lisa Anderson', product: 'Webcam', quantity: 1, price: 99.99, paid: false, orderDate: '2026-01-18T13:20:00' },
  { orderId: 'ORD-1007', customer: 'Tom Martinez', product: 'SSD Drive', quantity: 2, price: 159.99, paid: true, orderDate: '2026-01-19T09:00:00' },
  { orderId: 'ORD-1008', customer: 'Amy Taylor', product: 'RAM Module', quantity: 4, price: 79.99, paid: true, orderDate: '2026-01-20T10:30:00' },
  { orderId: 'ORD-1009', customer: 'Chris Lee', product: 'USB Hub', quantity: 1, price: 34.99, paid: false, orderDate: '2026-01-21T15:45:00' },
  { orderId: 'ORD-1010', customer: 'Jessica White', product: 'Laptop Stand', quantity: 1, price: 49.99, paid: true, orderDate: '2026-01-22T11:00:00' },
  { orderId: 'ORD-1011', customer: 'Robert Harris', product: 'Cable Organizer', quantity: 3, price: 19.99, paid: true, orderDate: '2026-01-23T09:15:00' },
  { orderId: 'ORD-1012', customer: 'Maria Garcia', product: 'Desk Pad', quantity: 1, price: 24.99, paid: false, orderDate: '2026-01-24T14:30:00' },
  { orderId: 'ORD-1013', customer: 'James Clark', product: 'External HDD', quantity: 1, price: 129.99, paid: true, orderDate: '2026-01-25T10:00:00' },
  { orderId: 'ORD-1014', customer: 'Linda Rodriguez', product: 'Power Bank', quantity: 2, price: 39.99, paid: true, orderDate: '2026-01-26T16:20:00' },
  { orderId: 'ORD-1015', customer: 'Kevin Lewis', product: 'HDMI Cable', quantity: 3, price: 14.99, paid: false, orderDate: '2026-01-27T08:45:00' },
  { orderId: 'ORD-1016', customer: 'Nancy Walker', product: 'Phone Holder', quantity: 1, price: 19.99, paid: true, orderDate: '2026-01-28T12:30:00' },
  { orderId: 'ORD-1017', customer: 'Paul Hall', product: 'Screen Cleaner', quantity: 2, price: 9.99, paid: true, orderDate: '2026-01-29T09:30:00' },
  { orderId: 'ORD-1018', customer: 'Karen Allen', product: 'Laptop Bag', quantity: 1, price: 59.99, paid: false, orderDate: '2026-01-30T14:00:00' },
  { orderId: 'ORD-1019', customer: 'Steven Young', product: 'Docking Station', quantity: 1, price: 199.99, paid: true, orderDate: '2026-01-31T11:15:00' },
  { orderId: 'ORD-1020', customer: 'Betty King', product: 'Cooling Pad', quantity: 1, price: 34.99, paid: true, orderDate: '2026-02-01T10:45:00' }
])

// Compact table
const compactColumns = [
  {
    title: 'Status',
    data: 'status',
    type: 'boolean' as const,
    editable: true
  },
  {
    title: 'Service',
    data: 'service',
    type: 'string' as const,
    editable: false
  },
  {
    title: 'Port',
    data: 'port',
    type: 'number' as const,
    editable: false,
    precision: 0
  }
]

const compactData = ref([
  { status: true, service: 'HTTP', port: 80 },
  { status: true, service: 'HTTPS', port: 443 },
  { status: false, service: 'FTP', port: 21 },
  { status: true, service: 'SSH', port: 22 },
  { status: true, service: 'MySQL', port: 3306 }
])
</script>

<style scoped>
.table-view {
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
}

section {
  margin-bottom: 3rem;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}
</style>
