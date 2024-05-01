import adminhome from './adminhome.js'
import basehome from './basehome.js'


export default {
    template: `
    <div>
        <adminhome v-if="userRole ==='admin' && isAdminLoggedIn"/>
        <basehome v-else/>
    </div>
    
    `
    ,
    data() {
        return {
            userRole: null,
        }
    },

    computed: {
        isAdminLoggedIn() {
            return this.userRole === 'admin';
        }
    },

    components: {
        adminhome,
        basehome,
    },
   

    created() {
        this.userRole = localStorage.getItem('role');
      }
   
}