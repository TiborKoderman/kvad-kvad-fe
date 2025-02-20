<template>
  <div class="row d-flex h-100">
      <div class=" col-md-3 bg-light d-flex flex-column border-end">
        <h2>Available Chatrooms</h2>
        <ul class="list-group flex-grow-1">
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
              <i class="bi bi-trash bs-white deleteIcon"></i>
            </span>
          </li>
            <li class="list-group-item" v-if="addingChatRoom">
            <div class="input-group">
              <input
              type="text"
              v-model="newChatRoomName"
              class="form-control"
              placeholder="Enter chatroom name"
              ref="newChatRoomInput"
              @keyup.enter="createChatRoom"
              />
              <button class="btn btn-success" @click.prevent="createChatRoom">
              <i class="bi bi-check"></i>
              </button>
              <button class="btn btn-danger" @click="addingChatRoom = false">
              <i class="bi bi-x"></i>
              </button>
            </div>
            </li>
        </ul>

        <div
          class="btn btn-light border-primary-subtle text-center"
          @click="addingChatRoom = true;"
          style="margin-top: auto"
          mt-auto
        >
          New Chatroom
        </div>
    </div>
    <div class="col-md-9 d-flex flex-column" v-if="selectedChatRoom">
      <div class="p-3 border-bottom bg-dark text-white">
        <h2>{{ selectedChatRoom.name }}</h2>
      </div>
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
          <span
            v-if="hoveredMessage === message"
            class="text-muted float-end"
            >{{ message.timestamp }}</span
          >
        </div>
      </div>
      <div class="chat-input input-group mt-auto">
        <input
          v-model="newMessage"
          @keyup.enter.exact="sendMessage"
          class="form-control"
          placeholder="Type a message..."
          ref="messageInput"
        />
        <button @click="sendMessage" class="btn btn-primary">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import { WebSocketClient } from '@/ws'

const chatrooms = ref([])

const newChatRoomName = ref('')

const addingChatRoom = ref(false)

const selectedChatRoom = ref(null)

const hoveredChatRoom = ref(null)

const hoveredMessage = ref(null)

const messageInput = ref(null)


const route = useRoute()
const router = useRouter()

// const ws = new WebSocketClient('messages')

// ws.on('message', message => {
//     if (message.chatRoomId === selectedChatRoom.value.id) {
//         messages.value.push(message)
//     }

// })

const messages = ref([
  //   { id: 1, user: 'Alice', text: 'Hello!' },
  //   { id: 2, user: 'Bob', text: 'Hi there!' },
])

onMounted(() => {
  checkSelectedChatRoom()
})

function checkSelectedChatRoom(){
  if(route.name=="chat"){
    fetchChatRooms().then(() => {
      if (chatrooms.value.length > 0) {
        selectedChatRoom.value = chatrooms.value[0]
      }
    })
  }
  else if(route.name=="chat_room"){
    fetchChatRooms().then(() => {
      if (chatrooms.value.length > 0) {
        selectedChatRoom.value = chatrooms.value.find(room => room.id == route.params.room)
        if(!selectedChatRoom.value){
          selectedChatRoom.value = chatrooms.value[0]
        }
      }
      else{
        router.push({ name: 'chat'})
      }
    })
  }
}

function fetchChatRooms() {
  return api
    .get('/Chat/chatRooms')
    .then(response => {
      chatrooms.value = response.data
    })
    .then(() => {
      if (selectedChatRoom.value) {
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
        selectedChatRoom.value = response.data       
        // router.push({ name: 'chat_room', params: { room: response.data } }) 
      })
  }
}

watch(selectedChatRoom, (newChatRoom) => {
  if (newChatRoom) {

    router.push({ name: 'chat_room', params: { room: selectedChatRoom.value.id } })

    fetchMessages()
  }
})

function fetchMessages() {
  api.get(`/Chat/chatMessages/${selectedChatRoom.value.id}`).then(response => {
    messages.value = response.data
    messageInput.value.focus()
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
  color: var(--bs-white); /* Danger color */
}

.deleteIcon:hover {
  color: var(--bs-danger); /* Danger color */
}

.list-group {
  overflow: scroll;
}
.list-group-item.active {
  background-color: var(--bs-primary); /* Primary color */
  color: white;
}

.list-group-item.active:hover {
  background-color: darken(var(--bs-primary), 10%); /* Primary color but darker */
}

.list-group-item:hover {
  cursor: pointer;
  background-color: var(--bs-light); /* Light color */
}
</style>
