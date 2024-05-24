import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from 'firebase/app'
import { VueFire, VueFireAuth } from 'vuefire'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

const firebaseConfig = {
  apiKey: 'AIzaSyDoNluY7beAgc03xPj8W_Tqu7mXSX1nEG0',
  authDomain: 'gap-moe.firebaseapp.com',
  projectId: 'gap-moe',
  storageBucket: 'gap-moe.appspot.com',
  messagingSenderId: '739502443950',
  appId: '1:739502443950:web:f609a1dc4007a880ea8c3f',
  measurementId: 'G-C9MHK5EBQY'
}
const firebaseApp = initializeApp(firebaseConfig)

const app = createApp(App)
app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth()
  ]
})
app.use(router)

app.mount('#app')
