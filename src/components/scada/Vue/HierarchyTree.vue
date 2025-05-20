<template>
    <SvgNode
        v-for="node in filteredNodes"
        :key="node.id"
        :node="node"
    />
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue';
import SvgNode from './SvgNode.vue'
import type { HieNode } from '@/components/scada/Svg';

const selected = ref([])

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