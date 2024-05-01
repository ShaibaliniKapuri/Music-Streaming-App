import router from "./router.js"
import navbar from "./components/navbar.js"


//router.beforeEach((to, from, next) => {
  //if (to.name !== 'Login' && !localStorage.getItem('auth-token') ? true : false)
    //next({ name: 'Login' })
  //else next()
//})


const app = Vue.createApp({
    template: `<div>
    <navbar :key="navKey"/>
    <router-view /></div>`,
    data() {
      return {
        navKey: 0 // Initially set to 0 to force re-render
      };
    },
    watch: {
      '$route'() {
        // Incrementing the key forces the <navbar> component to re-render
        this.navKey++;
      }
    }
  });

  app.component('navbar',navbar)
  app.use(router);
  app.mount('#app');
  
