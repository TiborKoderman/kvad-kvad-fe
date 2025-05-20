<template>
    <!-- <SvgNode
        v-for="node in filteredNodes"
        :key="node.id"
        :node="node"
    /> -->
    <div>
        hie
    </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref, provide } from 'vue';
import SvgNode from './SvgNode.vue'

const selected = ref<SVGElement[]>([])
const filteredNodes = computed(() => Array.from(props.nodes).filter(node => node.tagName === 'g'));
const flatNodes = computed(() => {
    const nodes: SVGElement[] = []
    function traverse(node: SVGElement) {
        nodes.push(node)
        if (node.children) {
            Array.from(node.children).forEach(traverse)
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
    nodes: {
        type: HTMLCollection,
        required: true,
    },
})


</script>
<style scoped>

</style>