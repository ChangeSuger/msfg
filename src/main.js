import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/main.css'
import MSFG from '../lib/main.js'

Vue.use(ElementUI);
Vue.use(MSFG)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
