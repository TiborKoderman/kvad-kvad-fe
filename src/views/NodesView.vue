<template>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Nodes</h3>
      </div>
      <div class="card-body">
        <button class="btn btn-primary" @click="OpenModal">
          OpenModal
        </button>
        <NodesTable />
      </div>
    </div>
</template>

<script setup lang="ts">
import NodesTable from '@/components/Views/NodesView/NodesTable.vue'

import { ref } from 'vue'

const addItemModal = ref(null)

function OpenModal() {
  addItemModal.value.open()
}

</script>

<style lang="scss" scoped>
</style>
