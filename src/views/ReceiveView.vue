<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QrScanner from 'qr-scanner'

let code = ref('')
let qrCodeReadResultMsg = ref('')
const route = useRoute()
const router = useRouter()

onMounted(() => {
  // console.log('r', route.params.code)
  code.value = route.params.code as string
})
watch(
  () => route.params.code,
  (newId, oldId) => {
    // react to route changes...
    code.value = newId as string
  }
)

const onSearchBtnClicked = function () {
  router.push(`/code/${code.value}`)
}

const onQRCodeImageChanged = function (e: Event) {
  const target = e.target as HTMLInputElement
  if (target && target.files) {
    qrCodeReadResultMsg.value = 'Scanning the image.'
    console.log()
    QrScanner.scanImage(target.files[0])
      .then((result) => {
        try {
          const url = new URL(result)
          const [, codeFromQR] = /^#\/code\/([A-Za-z0-9]*)$/.exec(url.hash) || []
          if (codeFromQR && url.hostname === 'gap-moe.web.app') {
            qrCodeReadResultMsg.value = ''
            alert('Redirecting...')
            router.push(`/code/${codeFromQR}`)
          } else qrCodeReadResultMsg.value = 'Wrong QR code detected.'
        } catch (err) {
          console.error(err)
          qrCodeReadResultMsg.value = 'Please, upload valid QR code.'
        }
      })
      .catch((error) => {
        console.error(error || 'No QR code found.')
        qrCodeReadResultMsg.value = 'Failed to scan the QR code.'
      })
  } else qrCodeReadResultMsg.value = 'Please select the image.'
}
</script>

<template>
  <div class="row justify-content-md-center" style="margin-top: 50px">
    <div class="col col-md-8 col-lg-5">
      <label
        class="form-label text-center"
        data-bs-toggle="collapse"
        data-bs-target="#typeSenderIDManually"
        style="cursor: pointer"
        >↓ Type sender ID manually</label
      >
      <div class="input-group mb-3 collapse" id="typeSenderIDManually">
        <button class="btn btn-outline-secondary" type="button" v-on:click="onSearchBtnClicked">
          Search
        </button>
        <input type="text" class="form-control" placeholder="code" v-model="code" />
      </div>
    </div>
  </div>
  <div class="row justify-content-md-center" style="margin-top: 10px">
    <div class="col col-md-8 col-lg-5">
      <!-- <img
        :src="qrImgUrl"
        alt="QR"
        height="150px"
        data-bs-toggle="collapse"
        data-bs-target="#uid"
        style="cursor: pointer"
      /> -->
      <div>
        <label for="formFile" class="form-label text-center">Read QR code</label>
        <input
          class="form-control"
          type="file"
          id="formFile"
          accept="image/jpeg, image/png"
          v-on:change="onQRCodeImageChanged"
        />
      </div>
      <div>
        <span>{{ qrCodeReadResultMsg }}</span>
      </div>
    </div>
  </div>
  <hr />
  <form>
    <div class="row justify-content-md-center" style="margin-top: 40px">
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
          ↓ Type password to decrypt (optional)</label
        >
        <input
          type="password"
          class="form-control collapse"
          id="inputPassword"
          maxlength="16"
          minlength="4"
        />
      </div>
    </div>
    <div class="row justify-content-md-center" style="margin-top: 20px">
      <div class="col col-md-8 col-lg-5">
        <button type="submit" class="btn btn-outline-light">Read</button>
      </div>
    </div>
  </form>
  <div class="row justify-content-md-center" style="margin-top: 20px">
    <div class="col col-md-8 col-lg-5">
      <RouterLink to="/send" class="nav-link">Go to send page</RouterLink>
    </div>
  </div>
</template>

<style></style>
