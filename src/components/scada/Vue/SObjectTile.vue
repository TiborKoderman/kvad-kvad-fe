<template>
    <div class="tile">
        {{ props.object.name }}
    </div>
</template>

<script setup lang="ts">
import type { ScadaObjectTemplate } from '../ScadaTypes'

const props = defineProps<{
    object: object | ScadaObjectTemplate
}>()

</script>

<style scoped>
.tile {
    aspect-ratio: 1;
}

</style>