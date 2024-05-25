<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'
import { encryptContent } from '../components/core/encryptAndDecrypt'

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

const onSubmitClicked = async function () {
  if (password.value.length > 0) {
    const encryptedBuffer = await encryptContent(
      password.value.toString(),
      content.value.toString()
    )
    console.log('e', encryptedBuffer as Uint8Array)
  } else {
    const enc = new TextEncoder()
    console.log('plain', enc.encode(content.value.toString()))
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
