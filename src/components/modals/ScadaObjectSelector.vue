<template>
    <div class="body d-flex flex-column justify-content-center align-content-center">
        <div class="d-flex align-content-around flex-wrap">
          <SObjectTile
            v-for="object in objects"
            :key="object.id"
            :object="object"
            class="m-2"
            :selected="selectedObject?.id === object.id"
            @click="selectedObject = object"
            @dblclick="submit"
          />
        <SObjectNewTile
            class="m-2"
          />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SObjectTile from '../scada/Vue/SObjectTile.vue'
import SObjectNewTile from '../scada/Vue/SObjectNewTile.vue'

const selectedObject = ref(null)


const objects = [
    {
        id: '1',
        name: 'Object 1',
        description: 'Description 1',
    },
    {
        id: '2',
        name: 'Object 2',
        description: 'Description 2',
    },
    {
        id: '3',
        name: 'Object 3',
        description: 'Description 3',
    },
    {
        id: '4',
        name: 'Object 4',
        description: 'Description 4',
    },
    {
        id: '5',
        name: 'Object 5',
        description: 'Description 5',
    },
    {
        id: '6',
        name: 'Object 6',
        description: 'Description 6',
    },
    {
        id: '7',
        name: 'Object 7',
        description: 'Description 7',
    },
    {
        id: '8',
        name: 'Object 8',
        description: 'Description 8',
    },
    {
        id: '9',
        name: 'Object 9',
        description: 'Description 9',
    },
    {
        id: '10',
        name: 'Object 10',
        description: 'Description 10',
    },
    {
        id: '11',
        name: 'Object 11',
        description: 'Description 11',
    },
    {
        id: '12',
        name: 'Object 12',
        description: 'Description 12',
    },
    {
        id: '13',
        name: 'Object 13',
        description: 'Description 13',
    },
    {
        id: '14',
        name: 'Object 14',
        description: 'Description 14',
    },
    {
        id: '15',
        name: 'Object 15',
        description: 'Description 15',
    },
]

//submit, define expose and export default baseProps are required for the modal system to work
async function submit() {
    console.log('submit', selectedObject.value);
  return selectedObject.value
}

defineOptions({
  name: 'ScadaObjectSelector',
  baseProps: () => ({
    title: 'Select SCADA Object',
  }),
})

defineExpose({ submit })
</script>
<style scoped>
.body {
  width: 80vw;
  height: 80vh;
  overflow: auto;
}
</style>
