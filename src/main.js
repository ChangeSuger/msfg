import Vue from 'vue'
import App from './App.vue'

import './assets/main.css'
import MSFG from '../lib/main.js'

Vue.use(MSFG)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
