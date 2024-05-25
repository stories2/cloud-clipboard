<script setup lang="ts">
import { RouterView } from 'vue-router'
import { getAuth, signInAnonymously, getAdditionalUserInfo } from 'firebase/auth'
import { ref, onMounted } from 'vue'

let userUid = ref('')
let initError = ref('')

onMounted(() => {
  const auth = getAuth()
  signInAnonymously(auth)
    .then((user) => {
      // console.log('user', user.user.uid, getAdditionalUserInfo(user))
      userUid.value = user.user.uid
    })
    .catch((error) => {
      console.error(error)
      initError.value = 'Failed to connect to the auth server.\nTry it later.'
    })
})
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <img
        src="./assets/icon.png"
        alt="icon"
        height="32px"
        style="margin-right: 5px; border-radius: 16px"
      />
      <span class="navbar-brand">Clipboard via cloud</span>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <RouterLink to="/send" class="nav-link">Send</RouterLink>
          <span v-if="userUid == ''">
            <RouterLink to="/code/undefined" class="nav-link">Receive</RouterLink>
          </span>
          <span v-else>
            <RouterLink :to="'/code/' + userUid" class="nav-link">Receive</RouterLink>
          </span>
          <RouterLink to="/about" class="nav-link">About</RouterLink>
        </div>
      </div>
    </div>
  </nav>
  <div class="container">
    <div v-if="userUid != ''">
      <!-- {{ userUid }} -->
      <RouterView />
    </div>
    <div v-else>
      <span>{{ initError }}</span>
    </div>
  </div>
</template>

<style scoped></style>
