<template>
    <div :style="{ paddingLeft: `${depth * 1.2}em` }">
        <span v-if="hasChildren" @click.stop="toggle" style="cursor:pointer; user-select:none;">
            <i class="bi" :class="expanded ? 'bi-caret-down-fill' : 'bi-caret-right-fill'"></i>
        </span>
        <span v-else style="display:inline-block; width:1.2em"></span>
        <i class="bi" :class="iconMap[props.node.tagName]"></i>{{ props.node.name }}
        <div v-if="expanded">
            <SvgNode
                v-for="child in props.node.children"
                :key="child.id || child.name || child.tagName"
                :node="child"
                :depth="depth + 1"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue'
import type { HieNode } from '../Svg'
import SvgNode from './SvgNode.vue'

const iconMap = {
    "g": "bi-file-earmark",
    "text": "bi-fonts",
    "rect": "bi-square",
    "circle": "bi-circle",
    "path": "bi-vector-pen",
    "polygon": "bi-shield",
}

const props = defineProps({
    node: {
        type: Object as PropType<HieNode>,
        required: true,
    },
    depth: {
        type: Number,
        default: 0,
    }
})



const expanded = ref(true)
const hasChildren = computed(() => Array.isArray(props.node.children) && props.node.children.length > 0)
function toggle() {
    expanded.value = !expanded.value
}

</script>

<style scoped>
/* Optionally, you can add more styling here */
</style>