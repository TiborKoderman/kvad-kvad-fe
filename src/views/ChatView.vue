<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <aside class="col-md-3 bg-light p-3">
          <h2>Available Chatrooms</h2>
          <ul class="list-group">
            <li
              v-for="chatroom in chatrooms"
              :key="chatroom.id"
              class="list-group-item"
              @click="selectedChatRoom = chatroom"
              :class="{ active: chatroom === selectedChatRoom }"
              @mouseover="hoveredChatRoom = chatroom"
              @mouseleave="hoveredChatRoom = null"
            >

              {{ chatroom.name }}
              <span class="float-end" v-if="chatroom === hoveredChatRoom">
                <i class="bi bi-trash deleteIcon"></i>
              </span>
            </li>
            <li class="list-group-item" v-if="addingChatRoom">
              <div class="input-group">
                <input
                  type="text"
                  v-model="newChatRoomName"
                  class="form-control"
                  placeholder="Enter chatroom name"
                />
                <button class="btn btn-success" @click="createChatRoom">
                  <i class="bi bi-check"></i>
                </button>
                <button class="btn btn-danger" @click="addingChatRoom = false">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </li>
            <li
              class="list-group-item cursor-pointer text-center"
              @click="addingChatRoom = true"
            >
              New Chatroom
            </li>
          </ul>
        </aside>
        <main class="col-md-9 d-flex flex-column">
          <div class="chat-history flex-grow-1 overflow-auto mb-3">
            <div v-if="messages.length == 0">Start of new chat</div>
            <div 
              v-else 
              v-for="message in messages" 
              :key="message.id" 
              class="message"
              @mouseover="hoveredMessage = message"
              @mouseleave="hoveredMessage = null"
            >
              <strong>{{ message.username }}:</strong> {{ message.content }}
              <span v-if="hoveredMessage === message" class="text-muted float-end">{{ message.timestamp }}</span>
            </div>
          </div>
          <div class="chat-input input-group">
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              class="form-control"
              placeholder="Type a message..."
            />
            <button @click="sendMessage" class="btn btn-primary">Send</button>
          </div>
        </main>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const chatrooms = ref([])

const newChatRoomName = ref('')

const addingChatRoom = ref(false)

const selectedChatRoom = ref(null)

const hoveredChatRoom = ref(null)

const hoveredMessage = ref(null)

const messages = ref([
//   { id: 1, user: 'Alice', text: 'Hello!' },
//   { id: 2, user: 'Bob', text: 'Hi there!' },
])

onMounted(() => {
  fetchChatRooms()
})

function fetchChatRooms() {
  api.get('/Chat/chatRooms').then(response => {
    chatrooms.value = response.data
    selectedChatRoom.value = chatrooms.value[0]
  }).
  then(() => {
    if (selectedChatRoom.value){
        fetchMessages()
    }
        // fetchMessages()
  })
}

function createChatRoom() {
  if (newChatRoomName.value.trim()) {
    api
      .post('/Chat/newChatRoom', { name: newChatRoomName.value })
      .then(response => {
        chatrooms.value.push(response.data)
        newChatRoomName.value = ''
        addingChatRoom.value = false
        fetchChatRooms()
      })
  }
}

function fetchMessages() {
  api.get(`/Chat/chatMessages/${selectedChatRoom.value.id}`).then(response => {
    messages.value = response.data
  })
}

const newMessage = ref('')

function sendMessage() {
  if (newMessage.value.trim()) {
    api
      .post('/Chat/sendMessage', {
        chatRoomId: selectedChatRoom.value.id,
        content: newMessage.value,
      })
      .then(() => {
        fetchMessages()
        newMessage.value = ''
      })
  }
}
</script>

<style scoped>
.chat-history {
  padding: 10px;
}

.message {
  margin-bottom: 10px;
}

.deleteIcon {
  cursor: pointer;
}

.deleteIcon:hover {
  color: var(--bs-danger); /* Danger color */
}

.list-group-item.active {
  background-color: var(--bs-primary); /* Primary color */
  color: white;
}

.list-group-item:hover  {
  cursor: pointer;
  background-color: var(--bs-light); /* Light color */
}

</style>
