<template>
    <div :style="{ paddingLeft: `${depth * 1.2}em` }" >
        <span v-if="hasChildren" @click.stop="toggle" style="cursor:pointer; user-select:none;">
            <i class="bi" :class="expanded ? 'bi-caret-down-fill' : 'bi-caret-right-fill'"></i>
        </span>
        <span v-else style="display:inline-block; width:1.2em"></span>
        <span class="nameLine" @click.stop="selected = !selected" :class="{ selected: selected }">
            <i
                class="bi"
                :class="folderIconClass"
            ></i>
            {{ props.node.name }}
        </span>
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

const selected = ref(false)

const iconMap = {
    "g": "bi-folder",
    "text": "bi-fonts",
    "rect": "bi-square",
    "circle": "bi-circle",
    "path": "bi-vector-pen",
    "polygon": "bi-star",
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

const folderIconClass = computed(() => {
    if (props.node.tagName === 'g') {
        return expanded.value ? 'bi-folder2-open' : 'bi-folder';
    }
    return iconMap[props.node.tagName] || 'bi-file-earmark';
});

</script>

<style scoped>
/* Optionally, you can add more styling here */

.bi {
    margin-right: 0.5em;
}
.bi-folder,
.bi-folder2-open {
    color: #007bff;
}
.nameLine {
    cursor: pointer;
    user-select: none;
}
.selected {
    background-color: var(--bs-primary);
}
</style>