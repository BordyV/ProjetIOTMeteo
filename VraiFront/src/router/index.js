import Vue from 'vue'
import VueRouter from 'vue-router';
import LoginComponent from '../components/LoginRegister.vue'
import UserComponent from '../components/User.vue'
import MapComponent from '../components/Pmap.vue'
import GuideComponent from '../components/Pguide.vue'
// Packages import
import VueSession from 'vue-session'

Vue.use(VueSession)

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
          path: '/',
          redirect: {
              name: "login"
          }
      },
      {
          path: "/login",
          name: "login",
          component: LoginComponent
      },
      {
        path: "/map",
        name: "map",
        component: MapComponent
    },
    {
        path: "/guide",
        name: "guide",
        component: GuideComponent
    },
         {
        path: "/user/:idUser",
        name: "user",
        component: UserComponent
      }
    ]
});