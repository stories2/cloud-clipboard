<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

let userUid = ref('')
let qrImgUrl = ref('')
let qrError = ref('')
let content = ref('')
let password = ref('')

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

async function decryptMessage(key: string, ciphertext: ArrayBuffer) {
  const keyEncoded = new TextEncoder().encode(key)
  const iv = new Uint8Array(16)
  console.log('iv c', iv)
  iv.set(keyEncoded)
  console.log('iv', iv, iv.length)
  const key_encoded = await window.crypto.subtle.importKey('raw', iv.buffer, 'AES-CTR', false, [
    'encrypt',
    'decrypt'
  ])
  // The iv value is the same as that used for encryption
  return window.crypto.subtle.decrypt(
    { name: 'AES-CTR', counter: iv, length: 128 },
    key_encoded,
    ciphertext
  )
}

async function encryptMessage(key: string, plainText: string) {
  const keyEncoded = new TextEncoder().encode(key)
  const iv = new Uint8Array(16)
  console.log('iv c', iv)
  iv.set(keyEncoded)
  console.log('iv', iv, iv.length)
  const key_encoded = await window.crypto.subtle.importKey('raw', iv.buffer, 'AES-CTR', false, [
    'encrypt',
    'decrypt'
  ])
  const enc = new TextEncoder()
  return window.crypto.subtle.encrypt(
    {
      name: 'AES-CTR',
      counter: iv,
      length: 128
    },
    key_encoded,
    enc.encode(plainText)
  )
}

const onSubmitClicked = async function () {
  console.log(content.value.toString(), password.value.toString())
  if (password.value.length > 0) {
    const encryptedBuffer = await encryptMessage(
      password.value.toString(),
      content.value.toString()
    )
    console.log('e', encryptedBuffer)

    const decrypted = await decryptMessage(password.value.toString(), encryptedBuffer)
    console.log('d', decrypted)
    const enc = new TextDecoder('utf-8')
    console.log('t', enc.decode(decrypted))
  } else {
    console.log('plain')
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
        <button type="submit" class="btn btn-outline-light">Send</button>
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
