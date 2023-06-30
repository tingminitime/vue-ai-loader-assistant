<script setup>
import { ref } from 'vue'
import Chat from './components/Chat.vue'
import { uploadPDF } from '@/api'

const file = ref(null)

function triggerUploadPDF() {
  file.value.click()
}

async function uploadPDFHandler() {
  console.log('file: ', file.value.files[0])

  const formData = new FormData()
  formData.append('pdf-file', file.value.files[0])
  formData.append('filename', file.value.files[0].name)
  console.log(formData)

  try {
    const res = await uploadPDF(formData)
    const data = await res.json()
    console.log('data: ', data)
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <div>
    <header
      class="fixed left-0 right-0 top-0 z-10 flex items-center justify-between bg-blue-500 px-4 py-2 text-xl font-bold text-white"
    >
      <p>AI Assistant</p>
      <button
        type="button"
        class="rounded bg-white p-2 text-sm font-bold text-blue-600"
        @click="triggerUploadPDF"
      >
        Upload PDF
      </button>
      <input
        type="file"
        ref="file"
        class="hidden"
        accept=".pdf"
        @change="uploadPDFHandler"
      />
    </header>
    <Chat />
  </div>
</template>

<style scoped></style>
