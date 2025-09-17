// Simple DataTables setup without problematic extensions
import DataTablesCore from 'datatables.net-bs5'
import DataTable from 'datatables.net-vue3'

// Only import the essential extensions that work
import DateTime from 'datatables.net-datetime'

// Initialize DataTables
DataTable.use(DataTablesCore)

export { DataTable, DateTime, DataTablesCore }
