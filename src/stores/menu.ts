import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menuStore', () => {
    const editMode = ref(false)


    const toggleEditMode = () => {
        editMode.value = !editMode.value
    }
    
    return {
        editMode,
        toggleEditMode
    }
})