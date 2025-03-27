import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const useMenuStore = defineStore('menuStore', () => {
    const editMode = ref(false)
    const collapsed = ref(JSON.parse(localStorage.getItem('menuStore.collapsed') || 'false'))
    const sidebarWidth = ref(localStorage.getItem('menuStore.sidebarWidth') || '250px')

    const toggleCollapsed = async() => {
        collapsed.value = !collapsed.value
        localStorage.setItem('menuStore.collapsed', JSON.stringify(collapsed.value))
    }

    const toggleEditMode = () => {
        editMode.value = !editMode.value
    }

    const saveSidebarWidth = () => {
        localStorage.setItem('menuStore.sidebarWidth', sidebarWidth.value)
    }
    
    return {
        editMode,
        toggleEditMode,
        collapsed,
        toggleCollapsed,
        sidebarWidth,
        saveSidebarWidth,
    }
})

export default useMenuStore