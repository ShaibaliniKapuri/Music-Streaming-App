export default {
    template:`<div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header text-center bg-dark text-white">
            Sign Up
          </div>
          <div class="card-body">
            <form>
              <div class="form-group">
                <div class="text-danger">{{ error }}</div>
                <label for="user-username">Username</label>
                <input type="text" class="form-control" id="user-username" placeholder="Enter username"
                v-model="cred.username">
              </div>
              <div class="form-group">
                <label for="user-email">Email address</label>
                <input type="email" class="form-control" id="user-email" aria-describedby="emailHelp" placeholder="Enter email"
                v-model="cred.email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div class="form-group">
                <label for="user-password">Password</label>
                <input type="password" class="form-control" id="user-password" placeholder="Password"
                v-model="cred.password">
                <small id="emailHelp" class="form-text text-muted">password must contain uppercase,lowercase letters,numbers and special characters.</small>
              </div>
              <div class="form-group form-check">
                <input type="checkbox" class="form-check-input" id="register-as-creator" v-model="cred.registerAsCreator">
                <label class="form-check-label" for="register-as-creator">Register as creator</label>
              </div>
              <br>
              <button type="submit" class="btn btn-outline-secondary btn-block" @click='signup'>Sign Up</button>
            </form>
          </div>
        </div>
        <span style="padding-left: 350px;"></span><router-link to="/">Go back</router-link>
      </div>
    </div>
  </div>`
  ,

  data() {
    return {
      cred: {
        username: null,
        email: null,
        password: null,
        registerAsCreator: false,
      },
      error: null,
    }
  },

  methods: {
    async signup() {
      const res = await fetch('/user-register',{
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify(this.cred),
      })
      if(res.ok){
        const data = await res.json();
        localStorage.setItem('auth-token',data.token)
        localStorage.setItem('role',data.role)
        this.$router.push({ path: '/login'})
      }
      else {
        const errorData = await res.json(); 
        this.error = errorData.message;
      }
    }
  }
}