import home from "./components/home.js"
import login from "./components/login.js" 
import sign_up from "./components/sign_up.js"
import creator_studio from "./components/creator_studio.js"
import search from "./components/search.js"


const routes = [
    {path:'/', component: home},
    {path: '/login', component: login},
    {path: '/sign_up', component: sign_up},
    {path: '/creator_studio', component: creator_studio},
    {path: '/search', component: search},
]

export default VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})