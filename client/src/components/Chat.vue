<script setup>
import { ref } from 'vue'
import { fetchChat } from '@/api'

const newMessage = ref('')

const chatMessages = ref([])

const messageHistory = []

async function sendMessageHandler() {
  const message = {
    type: 'human',
    text: newMessage.value.trim(),
  }

  chatMessages.value.push(message)

  newMessage.value = ''

  try {
    const res = await fetchChat(message.text, messageHistory.join('\n'))
    const data = await res.json()
    console.log('response data: ', data)

    chatMessages.value.push({
      type: 'ai',
      text: data.data?.text.trim() || '',
    })

    messageHistory.push(message.text, data.data?.text.trim() || '')
    console.log('messageHistory: ', messageHistory)
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <main class="mt-16 p-4">
    <div
      class="h-[calc(100vh-250px)] overflow-y-scroll rounded-lg bg-white p-4 shadow-lg"
    >
      <template v-for="chat in chatMessages">
        <!-- 用戶訊息 -->
        <div
          v-if="chat.type === 'human'"
          class="mb-2 flex items-end justify-end"
        >
          <p
            class="inline-block w-max rounded-bl-lg rounded-br-lg rounded-tl-lg bg-purple-500 p-2 text-white"
            v-html="chat.text"
          ></p>
          <img
            class="ml-2 h-8 w-8 rounded-full"
            src="@/assets/avatar-user.png"
            alt="user avatar"
          />
        </div>

        <!-- AI 訊息 -->
        <div
          v-else
          class="mb-2 flex items-end"
        >
          <img
            class="mr-2 h-8 w-8 rounded-full"
            src="@/assets/avatar-ai.png"
            alt="AI avatar"
          />
          <div
            class="inline-block w-max rounded-bl-lg rounded-br-lg rounded-tr-lg bg-blue-500 p-2 text-white"
          >
            <p v-html="chat.text"></p>
          </div>
        </div>
      </template>
    </div>
  </main>

  <!-- 輸入訊息 -->
  <footer class="fixed bottom-0 w-full p-4">
    <div class="item-center flex">
      <input
        type="text"
        class="flex-grow rounded-l-lg border border-gray-300 p-2 focus:outline-none"
        placeholder="請輸入訊息..."
        v-model="newMessage"
        @keyup.enter="sendMessageHandler"
        autofocus
      />
      <button
        type="button"
        class="rounded-r-lg bg-purple-500 px-4 py-2 font-bold text-white"
        @click="sendMessageHandler"
        :disabled="!newMessage"
      >
        送出
      </button>
    </div>
  </footer>
</template>
