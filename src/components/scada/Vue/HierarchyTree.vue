<template>
    <SvgNode
        v-for="node in svg.filteredNodes"
        :key="node.id"
        :node="node"
    />
</template>

<script setup lang="ts">
import { provide, PropType} from 'vue';
import Svg from '@/components/scada/Svg'
import SvgNode from './SvgNode.vue'

const props = defineProps({
    svg: {
        type: Object as PropType<Svg>,
        required: true,
    },
})
provide('svg', props.svg)

</script>
<style scoped>

</style>