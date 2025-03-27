import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const useMenuStore = defineStore('menuStore', () => {
    const editMode = ref(false)
    const collapsed = ref(JSON.parse(localStorage.getItem('menuStore.collapsed') || 'false'))

    const sidebarWidth = ref('250px')

    const toggleCollapsed = async() => {
        collapsed.value = !collapsed.value
        localStorage.setItem('menuStore.collapsed', JSON.stringify(collapsed.value))
    }

    const toggleEditMode = () => {
        editMode.value = !editMode.value
    }

    const setSidebarWidth = (width: string) => {
        sidebarWidth.value = width
    }
    
    return {
        editMode,
        toggleEditMode,
        collapsed,
        toggleCollapsed,
        sidebarWidth,
        setSidebarWidth,
    }
})

export default useMenuStore