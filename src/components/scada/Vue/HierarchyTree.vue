<template>
    <SvgNode
        v-for="node in filteredNodes"
        :key="node.id"
        :node="node"
    />
</template>

<script setup lang="ts">
import { computed, ref, provide, PropType, watch } from 'vue';
import Svg from '@/components/scada/Svg'
import SvgNode from './SvgNode.vue'

const selected = ref<Element[]>([])
const filteredNodes = computed(() => Array.from(props.svg.svg.children).filter(node => node.tagName === 'g').reverse());
const flatNodes = computed(() => {
    const nodes: Element[] = []
    function traverse(node: Element) {
        nodes.push(node)
        if (node.children) {
            Array.from(node.children).reverse().forEach(traverse)
        }
    }
    filteredNodes.value.forEach(traverse)
    return nodes
})
const lastSelectedIndex = ref(-1)
provide('selectedNodes', selected)
provide('filteredNodes', filteredNodes)
provide('flatNodes', flatNodes)
provide('lastSelectedIndex', lastSelectedIndex)

const props = defineProps({
    svg: {
        type: Object as PropType<Svg>,
        required: true,
    },
})

</script>
<style scoped>

</style>