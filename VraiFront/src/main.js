import Vue from 'vue'
import App from './App.vue'
import router from './router'

import vuetify from './plugins/vuetify';

import VueGeolocation from 'vue-browser-geolocation';


// leaflet bibliotheque
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';



Vue.config.productionTip = false;
Vue.use(vuetify);
Vue.use(VueGeolocation);


new Vue({
  router,
  VueGeolocation,
  vuetify,
  render: h => h(App)
}).$mount('#app')

