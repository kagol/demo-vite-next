<script setup lang="ts">
import axios from 'axios'
import HelloWorld from './components/HelloWorld.vue'
import { useNext } from './composables/use-next'
import { TinyRemoter } from '@opentiny/next-remoter'
import '@opentiny/next-remoter/dist/style.css'

const sessionId = 'd299a869-c674-4125-a84b-bb4e24079b99'
const { loadingSessionId } = useNext({ sessionId })

axios.get('/api')
.then(response => {
  console.log('response:', response)
  console.log('response.status:', response.status)
  console.log('response.data:', response.data)
})
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <tiny-remoter
    agent-root="https://ai.opentiny.design/api/v1/webmcp/"
    :session-id="sessionId"
    v-if="loadingSessionId"
  />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
