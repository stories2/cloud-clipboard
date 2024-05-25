<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'
import { encryptContent } from '../components/core/encryptAndDecrypt'
import { getApp } from 'firebase/app'
import { doc, setDoc, getFirestore } from 'firebase/firestore'

let userUid = ref('')
let qrImgUrl = ref('')
let qrError = ref('')
let content = ref('')
let password = ref('')
let sendResult = ref('')

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      userUid.value = user.uid
      QRCode.toDataURL(
        `https://gap-moe.web.app/#/code/${user.uid}`,
        { errorCorrectionLevel: 'L' },
        function (err: any, url: any) {
          if (err) {
            console.error(err)
            qrError.value = 'Failed to generate QR code. Try it later.'
          } else qrImgUrl.value = url
        }
      )
    }
  })
})

const onSubmitClicked = async function () {
  sendResult.value = 'Sending...'
  let contentToSend: string
  if (password.value.length > 0) {
    const encryptedBuffer = await encryptContent(
      password.value.toString(),
      content.value.toString()
    )
    const decoder = new TextDecoder('utf8')
    contentToSend = decoder.decode(encryptedBuffer)
  } else contentToSend = content.value.toString()

  const firestoreDB = getFirestore(getApp())
  try {
    await setDoc(doc(firestoreDB, 'user', userUid.value), {
      content: contentToSend
    })
    alert('Sent!')
    sendResult.value = ''
  } catch (err) {
    console.error(err)
    sendResult.value = 'Failed to send content. Try it later'
  }
}
</script>

<template>
  <div class="row justify-content-md-center" style="margin-top: 50px">
    <div class="col col-md-8 col-lg-5 text-center">
      <img
        :src="qrImgUrl"
        alt="QR"
        height="150px"
        data-bs-toggle="collapse"
        data-bs-target="#uid"
        style="cursor: pointer"
      />
      <div id="uid" class="collapse" style="margin-top: 5px">{{ userUid }}</div>
    </div>
  </div>
  <form @submit.prevent="onSubmitClicked">
    <div class="row justify-content-md-center" style="margin-top: 20px">
      <div class="col col-md-8 col-lg-5">
        <div class="form-floating">
          <textarea
            class="form-control"
            placeholder="Content to send"
            id="content"
            rows="4"
            style="height: 120px"
            maxlength="500"
            minlength="2"
            v-model="content"
          ></textarea>
          <label for="content">Content</label>
        </div>
      </div>
    </div>
    <div class="row justify-content-md-center" style="margin-top: 20px">
      <div class="col col-md-8 col-lg-5">
        <label
          for="inputPassword"
          class="form-label"
          data-bs-toggle="collapse"
          data-bs-target="#inputPassword"
          style="cursor: pointer"
        >
          ↓ Set password (optional)</label
        >
        <input
          type="password"
          class="form-control collapse"
          id="inputPassword"
          maxlength="16"
          minlength="4"
          v-model="password"
        />
      </div>
    </div>
    <div class="row justify-content-md-center" style="margin-top: 20px">
      <div class="col col-md-8 col-lg-5">
        <button type="submit" class="btn btn-outline-light" :disabled="sendResult === 'Sending...'">
          Send
        </button>
      </div>
    </div>
    <div class="row justify-content-md-center" style="margin-top: 20px">
      <div class="col col-md-8 col-lg-5">
        {{ sendResult }}
      </div>
    </div>
  </form>
  <div class="row justify-content-md-center" style="margin-top: 20px">
    <div class="col col-md-8 col-lg-5" v-if="userUid != ''">
      <RouterLink :to="'/code/' + userUid" class="nav-link">Go to receive page</RouterLink>
    </div>
    <div class="col col-md-8 col-lg-5" v-else>
      <RouterLink :to="'/code/undefined'" class="nav-link">Go to receive page</RouterLink>
    </div>
  </div>
</template>

<style></style>
