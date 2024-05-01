export default {
    template: 
    `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <!--<button class="btn btn-outline-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
    </svg></button>
    <div class="spacer"></div>-->
      <a class="navbar-brand" href="#">Musify</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!--<li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to='/'>Home</router-link>
          </li>-->
        </ul>
        <ul class="navbar-nav ms-2">
          <li class="nav-item">
            <router-link class="nav-link" to='/'><i class="fas fa-user"></i>Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to='/search'><i class="fas fa-user"></i>Search</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/login"><i class="fas fa-user"></i>Log In</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/sign_up"><i class="fas fa-user"></i>Sign Up</router-link>
          </li>
          <li class="nav-item" v-if="is_login">
            <button class="nav-link"  @click='logout'>Log out</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
 `,
  
 data() {
  return {
    role: localStorage.getItem('role'),
    is_login: localStorage.getItem('auth-token'),
    username: localStorage.getItem('username'),
  }
},
methods: {
  async logout() {
    const res = await fetch('/user-logout',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if(res.ok){
      console.log("response recieved");  
      localStorage.removeItem('auth-token')
      localStorage.removeItem('role')
      localStorage.removeItem('username')
      this.$router.push({ path: '/login' })
      console.log("logged out successfully")
    }
    else{
      console.log("Error logging out")
    }  
  },

  async searchAlbums() {
    try {
        alert("search request recieved")
        console.log(this.searchQuery)
        const response = await fetch(`/api/search_albums_api?artist_name=${this.searchQuery}`);
        console.log(response)
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            this.$router.push({ name:'search_album', params: { albums: data.albums } });
        } else {
            console.error('Failed to search albums:', response.statusText);
        }
    } catch (error) {
        console.error('Error searching albums:', error);
    }
  },
},
 
}

