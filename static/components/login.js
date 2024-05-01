export default {
    template: `<div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header text-center bg-dark text-white">
            Login
          </div>
          <div class="card-body">
            <form>
              <div class="form-group">
                <div class="text-danger">{{ error }}</div>
                <label for="user-email">Email address</label>
                <input type="email" class="form-control" id="user-email" aria-describedby="emailHelp" placeholder="Enter email"
                v-model = "cred.email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div class="form-group">
                <label for="user-password">Password</label>
                <input type="password" class="form-control" id="user-password" placeholder="Password"
                v-model="cred.password">
              </div>
              <br>
              <button type="submit" class="btn btn-outline-secondary btn-block" @click='login'>Login</button>
            </form>
          </div>
        </div>
        <router-link to='/sign_up'>Create new account</router-link><span style="padding-left: 210px;"></span><router-link to='/'> Go back</router-link>
      </div>
    </div>
  </div>`
  ,

  data() {
    return {
      cred: {
        email: null,
        password: null,
      },
      error: null,
    }
  },

  methods: {
    async login() {
      const res = await fetch('/user-login',{
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify(this.cred),
      })
      if(res.ok){
        const data = await res.json();
        console.log("reponse recieved")  
        localStorage.setItem('auth-token',data.token)
        localStorage.setItem('role',data.role)
        localStorage.setItem('username', data.username)
        this.$router.push({ path: '/'})
        
      }
      else {
        const errorData = await res.json(); 
        this.error = errorData.message;
      }
    }
  }


}