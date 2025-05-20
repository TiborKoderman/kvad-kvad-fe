<template>
    <SvgNode
        v-for="node in filteredNodes"
        :key="node.id"
        :node="node"
    />
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import SvgNode from './SvgNode.vue'
import type { HieNode } from '@/components/scada/Svg';

const props = defineProps({
    nodes: {
        type: Array as PropType<HieNode[]>,
        required: true,
    },
})

const filteredNodes = computed(() => props.nodes.filter(node => node.tagName === 'g'));

</script>
<style scoped>

</style>