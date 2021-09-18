import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import vuetify from '@/plugins/vuetify'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueRouter)
import App from './App'
import router from './router'
Vue.use(Vuetify)
Vue.use(VueAxios, axios)

new Vue({
  el: '#app',
  vuetify,
  router,
  render: h => h(App)
})
