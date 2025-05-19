<template>
    <div class="tile">

    </div>
</template>

<script setup lang="ts">
import '../ScadaTypes'

const props = defineProps({
    object: {
        type: ScadaObjectTemplate,
        required: true
    }
})

</script>

<style scoped>
.tile {
    aspect-ratio: 1;
}

</style>