<script setup lang="ts">
import { RouterView } from 'vue-router'
import { getAuth, signInAnonymously, getAdditionalUserInfo, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { ref, onMounted } from 'vue'

let userUid = ref('')
let initError = ref('')
let googleLoginBtnText = ref('Google login')

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

    onAuthStateChanged(auth, (user) => {
      googleLoginBtnText.value = 'Google login'
      for(let providerData of user?.providerData || []) {
        if (providerData.providerId === 'google.com') {
          googleLoginBtnText.value = 'logout'
        }
      }
    })
})

function loginAnonymously() {
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
}

function loginWithGoogle () {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    userUid.value = result.user.uid
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    alert(errorMessage)
  });
}

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
      <span class="navbar-brand">{{ userUid }}</span>
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
    <div class="row" style="margin-top: 50px">
      <div class="col">
        <span v-if="googleLoginBtnText == 'Google login'">
          <button class="btn btn-outline-success" @click="loginWithGoogle">{{ googleLoginBtnText }}</button>
        </span>
        <span v-else>
          <button class="btn btn-outline-danger" @click="loginAnonymously">{{ googleLoginBtnText }}</button>
        </span>
      </div>
      </div>
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
