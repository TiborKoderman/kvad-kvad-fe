<template>
  <div class="table-view">
    <h1>Table Component Demo</h1>

    <!-- 1. Object-array data (standard usage) -->
    <section>
      <h2>1. Standard (object rows, striped, bordered, hoverable)</h2>
      <KTable
        :columns="userColumns"
        :data="userData"
        :striped="true"
        :hoverable="true"
        :bordered="true"
        @update:data="userData = $event"
      />
    </section>

    <!-- 2. Array-of-arrays input -->
    <section>
      <h2>2. Array-of-arrays input</h2>
      <p class="demo-note">Data is passed as <code>[[id, name, value, active], ...]</code> — columns map by index.</p>
      <KTable
        :columns="arrColumns"
        :data="arrData"
        :striped="true"
        :hoverable="true"
        :bordered="true"
        @update:data="arrData = $event"
      />
    </section>

    <!-- 3. Client-side pagination -->
    <section>
      <h2>3. Client-side pagination (20 rows, pageSize=5)</h2>
      <KTable
        :columns="largeDataColumns"
        :data="largeData"
        :striped="true"
        :hoverable="true"
        :bordered="true"
        :paginated="true"
        :pageSize="5"
        @update:data="largeData = $event"
      />
    </section>

    <!-- 4. Sticky header (max-height scroll) -->
    <section>
      <h2>4. Sticky header with scrollable body (maxHeight=300px)</h2>
      <KTable
        :columns="largeDataColumns"
        :data="largeData"
        :striped="true"
        :hoverable="true"
        :bordered="true"
        maxHeight="300px"
        @update:data="largeData = $event"
      />
    </section>

    <!-- 5. Server-side pagination -->
    <section>
      <h2>5. Server-side pagination (fetchUrl)</h2>
      <p class="demo-note">
        Fetches from <code>fetchUrl</code> with <code>?page=N&amp;limit=N&amp;sort=col&amp;order=asc&amp;search=q</code>.
        Expected response: <code>{ data: T[], total: number }</code> or a plain array.
        Currently pointing to <code>/api/table-demo</code> (not implemented — shows empty state).
      </p>
      <KTable
        :columns="serverColumns"
        fetchUrl="/api/table-demo"
        :pageSize="5"
        :searchable="true"
      />
    </section>

    <!-- 6. Minimal (no search, no sort) -->
    <section>
      <h2>6. Minimal (no search, no sort)</h2>
      <KTable
        :columns="compactColumns"
        :data="compactData"
        :hoverable="true"
        :sortable="false"
        :searchable="false"
        @update:data="compactData = $event"
      />
    </section>

    <!-- 7. Device table (no border, with actions) -->
    <section>
      <h2>7. No border, with actions</h2>
      <KTable
        :columns="deviceColumns"
        :data="deviceData"
        :striped="true"
        :hoverable="true"
        @update:data="deviceData = $event"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KTable from '@/components/Table/KTable.vue'

// --- 1. Standard object-array table ---
const userColumns = [
  { title: 'ID', data: 'id', type: 'number' as const },
  { title: 'Name', data: 'name', type: 'string' as const, editable: true },
  { title: 'Email', data: 'email', type: 'string' as const, editable: true },
  { title: 'Age', data: 'age', type: 'number' as const, editable: true, precision: 0 },
  { title: 'Active', data: 'active', type: 'boolean' as const, editable: true },
  { title: 'Created', data: 'createdAt', type: 'time' as const },
  {
    title: 'Actions', data: 'actions', type: 'action' as const, actions: [
      { label: 'Edit', variant: 'primary', handler: (row: Record<string, unknown>) => alert(`Editing: ${row['name']}`) },
      { label: 'Delete', variant: 'danger', handler: (row: Record<string, unknown>) => { if (confirm(`Delete ${row['name']}?`)) userData.value = userData.value.filter(u => u['id'] !== row['id']) } },
    ],
  },
]

const userData = ref<Record<string, unknown>[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, active: true, createdAt: '2024-01-15T10:30:00' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 34, active: true, createdAt: '2024-02-20T14:45:00' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 42, active: false, createdAt: '2024-03-10T09:15:00' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', age: 31, active: true, createdAt: '2024-04-05T16:20:00' },
])

// --- 2. Array-of-arrays table ---
const arrColumns = [
  { title: 'ID', data: 'id', type: 'number' as const },
  { title: 'Product', data: 'name', type: 'string' as const, editable: true },
  { title: 'Price ($)', data: 'price', type: 'number' as const, editable: true, precision: 2 },
  { title: 'In Stock', data: 'stock', type: 'boolean' as const, editable: true },
]

// Data as plain arrays — column order matches arrColumns
const arrData = ref<unknown[]>([
  [1, 'Laptop', 1299.99, true],
  [2, 'Mouse', 29.99, true],
  [3, 'Keyboard', 89.99, false],
  [4, 'Monitor', 349.99, true],
  [5, 'Headset', 79.99, true],
])

// --- 3 & 4. Large dataset (for pagination and scroll demos) ---
const largeDataColumns = [
  { title: 'Order ID', data: 'orderId', type: 'string' as const },
  { title: 'Customer', data: 'customer', type: 'string' as const, editable: true },
  { title: 'Product', data: 'product', type: 'string' as const },
  { title: 'Qty', data: 'quantity', type: 'number' as const, precision: 0 },
  { title: 'Price ($)', data: 'price', type: 'number' as const, precision: 2 },
  { title: 'Paid', data: 'paid', type: 'boolean' as const, editable: true },
  { title: 'Order Date', data: 'orderDate', type: 'time' as const },
]

const largeData = ref<Record<string, unknown>[]>([
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
  { orderId: 'ORD-1020', customer: 'Betty King', product: 'Cooling Pad', quantity: 1, price: 34.99, paid: true, orderDate: '2026-02-01T10:45:00' },
])

// --- 5. Server-side table columns ---
const serverColumns = [
  { title: 'ID', data: 'id', type: 'number' as const },
  { title: 'Name', data: 'name', type: 'string' as const },
  { title: 'Email', data: 'email', type: 'string' as const },
  { title: 'Role', data: 'role', type: 'string' as const },
  { title: 'Active', data: 'active', type: 'boolean' as const },
]

// --- 6. Compact ---
const compactColumns = [
  { title: 'Status', data: 'status', type: 'boolean' as const, editable: true },
  { title: 'Service', data: 'service', type: 'string' as const },
  { title: 'Port', data: 'port', type: 'number' as const, precision: 0 },
]

const compactData = ref<Record<string, unknown>[]>([
  { status: true, service: 'HTTP', port: 80 },
  { status: true, service: 'HTTPS', port: 443 },
  { status: false, service: 'FTP', port: 21 },
  { status: true, service: 'SSH', port: 22 },
  { status: true, service: 'MySQL', port: 3306 },
])

// --- 7. Device table ---
const deviceColumns = [
  { title: 'Device ID', data: 'deviceId', type: 'string' as const },
  { title: 'Temp (°C)', data: 'temperature', type: 'number' as const, editable: true, precision: 1 },
  { title: 'Humidity (%)', data: 'humidity', type: 'number' as const, precision: 2 },
  { title: 'Online', data: 'online', type: 'boolean' as const, editable: true },
  { title: 'Last Update', data: 'lastUpdate', type: 'time' as const, showElapsed: true },
  {
    title: 'Actions', data: 'actions', type: 'action' as const, actions: [
      { label: 'View', variant: 'primary', handler: (row: Record<string, unknown>) => alert(`Device: ${row['deviceId']}`) },
      { label: 'Reset', variant: 'secondary', handler: (row: Record<string, unknown>) => alert(`Resetting: ${row['deviceId']}`) },
    ],
  },
]

const deviceData = ref<Record<string, unknown>[]>([
  { deviceId: 'DEV-001', temperature: 22.5, humidity: 45.32, online: true, lastUpdate: '2026-02-02T08:30:00' },
  { deviceId: 'DEV-002', temperature: 19.8, humidity: 52.18, online: true, lastUpdate: '2026-02-02T08:28:00' },
  { deviceId: 'DEV-003', temperature: 25.1, humidity: 38.95, online: false, lastUpdate: '2026-02-01T23:45:00' },
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
  font-size: 1.25rem;
}

.demo-note {
  font-size: 0.875rem;
  opacity: 0.7;
  margin-bottom: 0.75rem;
}
</style>
