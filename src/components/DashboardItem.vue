<template>
    <div class="card flex-fill">
        <div class="card-header">
            {{props.card.title}}
        </div>
        <div class="card-body">
            {{props.card.description}}
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    card: {
        type: Object,
        required: true
    }
})

</script>

<style scoped>

</style>