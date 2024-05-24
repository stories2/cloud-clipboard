<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

let code = ref('')
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
    console.log('c', newId, oldId)
    code.value = newId as string
  }
)

const onSearchBtnClicked = function () {
  router.push(`/code/${code.value}`)
}
</script>

<template>
  <div class="row justify-content-md-center" style="margin-top: 50px">
    <div class="col col-md-8 col-lg-5">
      <label for="formFile" class="form-label text-center">Type sender ID manually</label>
      <div class="input-group mb-3">
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
        <input class="form-control" type="file" id="formFile" accept="image/jpeg, image/png" />
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
        <label for="inputPassword" class="form-label" style="cursor: pointer">
          ↓ Type password to decrypt (optional)</label
        >
        <input
          type="password"
          class="form-control"
          id="inputPassword"
          maxlength="15"
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
