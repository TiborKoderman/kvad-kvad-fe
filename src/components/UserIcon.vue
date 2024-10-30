<template>
    <div class="user-icon">
        <img :src="userIcon" alt="User Icon" />
    </div>
</template>

<script setup lang="ts">
    import api from '@/api'
    import default_user_icon from '@/assets/img/default_user_icon.png'
    import { ref, onMounted } from 'vue'

    const userIcon = ref(default_user_icon)

    onMounted(() => {
        api.get('/user/icon/admin', { responseType: 'blob' })
            .then((response) => {
                userIcon.value = URL.createObjectURL(response.data)
            })
            .catch(() => {
                userIcon.value = default_user_icon
            })
    })

</script>

<style scoped>
    .user-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
    }

    .user-icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>