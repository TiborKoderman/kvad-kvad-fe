<template>
    <div :style="{ paddingLeft: `${depth * 1.2}em` }" :class="{ selected: selected }" class="nodeLine">
        <span v-if="hasChildren" @click.stop="toggle" style="cursor:pointer; user-select:none;">
            <i class="bi" :class="expanded ? 'bi-caret-down-fill' : 'bi-caret-right-fill'"></i>
        </span>
        <span v-else style="display:inline-block; width:1.2em"></span>
        <span
            class="nameLine"
            @click.stop="selected = !selected"
            @dblclick.stop="editing = true"
        >
            <i class="bi" :class="folderIconClass"></i>
            <template v-if="editing">
                <input
                    v-model="editValue"
                    @blur="saveEdit"
                    @keyup.enter="saveEdit"
                    @keyup.esc="cancelEdit"
                    ref="editInput"
                    class="edit-input"
                    :style="{ width: `${Math.max(editValue.length, 4)}ch` }"
                />
            </template>
            <template v-else>
                {{ props.node.name }}
            </template>
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
import { ref, computed, PropType, nextTick, watch } from 'vue'
import type { HieNode } from '../Svg'
import SvgNode from './SvgNode.vue'

const selected = ref(false)
const editing = ref(false)
const editValue = ref('')
const editInput = ref<HTMLInputElement>()

function saveEdit() {
    editing.value = false
    if (editValue.value.trim() !== '') {
        props.node.name = editValue.value
    }
}
function cancelEdit() {
    editing.value = false
    editValue.value = props.node.name
}

watch(editing, (val) => {
    if (val) {
        editValue.value = props.node.name
        nextTick(() => {
            editInput.value?.focus()
            editInput.value?.select()
        })
    }
})

const iconMap = {
    "g": "bi-folder",
    "text": "bi-fonts",
    "rect": "bi-square",
    "circle": "bi-circle",
    "path": "bi-vector-pen",
    "polygon": "bi-star",
    "tspan": "bi-file-font",
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
.nodeLine {
    align-items: center;
        margin: 0.1em 0;
    font-size: 1rem;
    color: #333;
    font-family: sans-serif;
    border: 1px solid transparent;
    border-radius: 3px;
}
.selected {
    background-color: color-mix(in srgb, var(--bs-secondary) 40%, white 30%);
    border: 1px solid gray;
    border-radius: 3px;
}
.edit-input {
    font: inherit;
    padding: 0 0.2em;
    border: 1px solid #aaa;
    border-radius: 3px;
    background: #fff;
    color: #222;
    margin-left: 0.2em;
    min-width: 4ch;
    max-width: 20ch;
}
</style>