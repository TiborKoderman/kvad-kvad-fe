<template>
    <Modal 
        :title="`Add User`"
        :callback="addUser"
        ref="modal"
    >
        <form>
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" class="form-control" id="username" />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" />
            </div>
            <div class="form-group">
            <label for="roles">Roles</label>
            <select class="form-select" id="roles" v-model="selectedRoles" multiple>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
        </div>

        </form>
    </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import { ref, Ref } from 'vue';
import api from '@/api'

interface Role {
    id: number
    name: string
}

const modal: Ref<InstanceType<typeof Modal> | null> = ref(null)

const user = ref({
    username: '',
    password: '',
    roles: []
})

const roles = ref<Role[]>([])

const selectedRoles = ref([])

fetchRoles()

function fetchRoles() {
    api.get('/roles').then((response) => {
        user.value.roles = response.data
    })
}



function addUser() {
    console.log('User added')
}



function open() {
    if (modal.value !== null) {
        modal.value.open()
    }
}

defineExpose({ open, close })

</script>

<style scoped>

</style>