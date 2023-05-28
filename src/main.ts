import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// index.js or main.js
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

const vuetify = createVuetify({
  components,
  directives,
})
let app = createApp(App);
app.use(vuetify).use(router).mount('#app');
