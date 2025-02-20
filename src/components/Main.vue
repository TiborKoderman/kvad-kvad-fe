<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <main class="content" :class="{ 'force-fit': props.forceFit }">
        <slot></slot>
    </main>
</template>

<script setup lang="ts">

const props = defineProps({
    forceFit: {
        type: Boolean,
        default: false,
    },
})

</script>

<style scoped>

.force-fit {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

</style>