export default {
    template: 
    `
    <div class="container-fluid bg-secondary text-light">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-sm-2 bg-dark text-light sidebar-scroll">
                <div class="p-4">
                    <h4>Browse</h4>
                    <p>New Releases</p>
                    <p>Top Albums</p>
                    <p>Top Creators</p>
                    <p>All Songs</p>
                </div>
                <div class="p-4">
                    <h4>Browse</h4>
                    <p>New Releases</p>
                    <p>Top Albums</p>
                    <p>Top Creators</p>
                    <p>All Songs</p>
                </div>
                <div class="p-4">
                    <h4>Browse</h4>
                    <p>New Releases</p>
                    <p>Top Albums</p>
                    <p>Top Creators</p>
                    <p>All Songs</p>
                </div>
                <div class="p-4">
                    <h4>Browse</h4>
                    <p>New Releases</p>
                    <p>Top Albums</p>
                    <p>Top Creators</p>
                    <p>All Songs</p>
                </div>
            </div>
            <!-- Main Content -->
            <div class="col-md-9 bg-secondary text-light  main-content-scroll main-content-space">
                <h1>Welcome to creator Studio</h1>

                <!--CRUD SONGS-->
                <h4>Songs</h4>
                <div class="row mt-4">
                    <!-- Create Song -->
                    <div class="col-md-4">
                        <div class="accordion accordion-flush" id="accordionFlushExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                        Create
                                    </button>
                                </h2>
                                <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                    <div class="accordion-body">
                                        <div class="card">
                                            <div class="card-body">
                                                <h5 class="card-title">Create Song</h5>
                                                    <!-- Song Creation Form -->
                                                    <form id="songForm" enctype="multipart/form-data" @submit.prevent='createResource'>
                                                        <div class="mb-3">
                                                            <label for="song_name" class="form-label">Song Title</label>
                                                            <input type="text" class="form-control" id="song_name" name="song_name" v-model="resource.song_name">
                                                        </div>
                                                        <div class="mb-3">
                                                            <label for="song_file" class="form-label">Song File</label>
                                                            <input type="file" class="form-control" id="song_file" name="file" @change="onFileChange">
                                                        </div>
                                                        
                                                        <button type="submit" class="btn btn-primary">Create</button>
                                                    </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 

                    <!-- Update Song -->
                    <div class="col-md-4">
                        <div class="accordion accordion-flush" id="accordionFlushExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                        Update
                                    </button>
                                </h2>
                                <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                    <div class="accordion-body">
                                        <div class="card">
                                            <div class="card-body">
                                                    <h5 class="card-title">Update Song</h5>
                                                    <!-- Song Update Form -->
                                                    <form @submit.prevent = "updateSong">
                                                        <div class="mb-3">
                                                            <label for="song-select" class="form-label">Select Song</label>
                                                            <select v-model="selectedSong" class="form-select" id="song-select">
                                                                <option v-for="song in userSongs" :value="song.id">{{ song.song_name }}</option>
                                                            </select>
                                                        </div>
                                                        <div class="mb-3">
                                                            <label for="new-song-name" class="form-label">New Song Name</label>
                                                            <input type="text" class="form-control" v-model="newSongName" id="new-song-name">
                                                        </div>
                                                        <!-- Add fields for updating a song as needed -->
                                                        <button type="submit" class="btn btn-primary">Update Song</button>
                                                    </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Delete Song -->
                    <div class="col-md-4">
                        <div class="accordion accordion-flush" id="accordionFlushExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                        Delete
                                    </button>
                                </h2>
                                <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                    <div class="accordion-body">
                                        <div class="card">
                                            <div class="card-body">
                                                <h5 class="card-title">Delete Song</h5>
                                                    <!-- Song Deletion Form -->
                                                    <form @submit.prevent="deleteSong">
                                                        <div class="mb-3">
                                                            <label for="song-select" class="form-label">Select Song</label>
                                                            <select v-model="selectedSong" class="form-select" id="song-select">
                                                                <option v-for="song in userSongs" :value="song.id">{{ song.song_name }}</option>
                                                            </select>
                                                        </div>
                                                        <button type="submit" class="btn btn-danger">Delete</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                    <br></br>
                    <!-- CRUD ALBUM -->
                    <h4>Album</h4>
                    <div class="row mt-4">
                        <div class="col-md-4">
                            <div class="accordion accordion-flush" id="accordionFlushExample">
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                                            Create
                                        </button>
                                    </h2>
                                    <div id="flush-collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                        <div class="accordion-body">
                                            <div class="card">
                                                <div class="card-body">
                                                        <h5 class="card-title">Create Album</h5>
                                                        <!-- Album Creation Form -->
                                                        <form @submit.prevent="createAlbum" enctype="multipart/form-data">
                                                            <div class="mb-3">
                                                                <label for="album-name" class="form-label">Album Name</label>
                                                                <input type="text" class="form-control" id="album-name" v-model="albumName" required>
                                                            </div>
                                                            <div class="mb-3">
                                                                <label for="song-select" class="form-label">Select Songs</label>
                                                                <div v-for="song in userSongs" :key="song.id">
                                                                    <input type="checkbox" :id="'song-checkbox-' + song.id" :value="song.id" v-model="selectedSongs">
                                                                    <label :for="'song-checkbox-' + song.id">{{ song.song_name }}</label><br>
                                                                </div>
                                                            </div>
                                                            
                                                            <button type="submit" class="btn btn-primary">Create Album</button>
                                                        </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        <div class="col-md-4">
                            <div class="accordion accordion-flush" id="accordionFlushExample">
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive">
                                            Update
                                        </button>
                                    </h2>
                                    <div id="flush-collapseFive" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                        <div class="accordion-body">
                                            <div class="card">
                                                <div class="card-body">
                                                        <h5 class="card-title">Update Album</h5>
                                                        <!-- Album Update Form -->
                                                        <form @submit.prevent="updateAlbum">
                                                            <div class="mb-3">
                                                                <label for="album-select" class="form-label">Select Album to Update</label>
                                                                <select class="form-select" id="album-select" v-model="selectedAlbumId">
                                                                    <option v-for="album in userAlbums" :key="album.id" :value="album.id">{{ album.album_name }}</option>
                                                                </select>
                                                            </div>
                                                            <div class="mb-3">
                                                                <label for="new-album-name" class="form-label">New Album Name</label>
                                                                <input type="text" class="form-control" id="new-album-name" v-model="newAlbumName">
                                                            </div>
                                                            <button type="submit" class="btn btn-primary">Update Album</button>
                                                        </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        <div class="col-md-4">
                            <div class="accordion accordion-flush" id="accordionFlushExample">
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSix" aria-expanded="false" aria-controls="flush-collapseSix">
                                            Delete
                                        </button>
                                    </h2>
                                    <div id="flush-collapseSix" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                        <div class="accordion-body">
                                            <div class="card">
                                                <div class="card-body">
                                                        <h5 class="card-title">Delete Album</h5>
                                                        <!-- Album delete Form -->
                                                        <form @submit.prevent="deleteAlbum">
                                                            <div class="mb-3">
                                                                <label for="album-select" class="form-label">Select Album to Delete</label>
                                                                <select class="form-select" id="album-select" v-model="selectedAlbumId">
                                                                    <option v-for="album in userAlbums" :key="album.id" :value="album.id">{{ album.album_name }}</option>
                                                                </select>
                                                            </div>  
                                                            <button type="submit" class="btn btn-danger">Delete</button>
                                                        </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>                      
                </div>
            </div>
        </div>
    </div>
`
,

data() {
    return {
        resource: {
            song_name: null,
            file: null,
        },
        albumName: null,
        selectedSongs: [],
        userSongs: [],
        selectedSong: null,
        newSongName: '',
        userSongs: [],
        selectedAlbumId: null,
        newAlbumName: '',
        userAlbums: [],
    }
},

methods: {

    onFileChange(event) {
        this.resource.file = event.target.files[0];
    },

    //Song creation function
    async createResource() {
        const formData = new FormData();
        formData.append('song_name', this.resource.song_name);
        formData.append('file', this.resource.file);

        let song = this.resource.song_name;
        let file = this.resource.file;
        console.log(song,file)

        const required_body = {'song_name': song, 'file': file}

        const res = await fetch('/api/song_api',{
            method: 'POST',
            body: formData,
        })

        const data = await res.json();
        if (res.ok) {
            alert(data.message)
        } else {
            alert("Failed to create song")
        }
        this.$router.push({ path: '/'})
    },

    //Function for fetching songs created by a particular user to update the song name
    async fetchUserSongs() {
        try {
            const response = await fetch('/api/user_songs_api');
            const data = await response.json();
            console.log(data);
            this.userSongs = data
        } catch (error) {
            console.error('Error fetching songs', error);
        }    
    },

    //Function for creating an Album
    async createAlbum() {
        try {
            const formData = new FormData();
            formData.append('album_name', this.albumName);
            formData.append('song_id',this.selectedSongs);

            let album = this.albumName;
            let songarray = this.selectedSongs;
            console.log(album,songarray)

            const response = await fetch('/api/album_api', {
                method: "POST",
                body: formData 
            });
            const data = await response.json();
            alert(data.message);
            this.$router.push({ path: '/'})
        } catch (error) {
            console.error('Error creating album', error);
            alert('Failed to create album')
        }
    },

    //function for updating the song name
    async updateSong() {
        if (!this.selectedSong || !this.newSongName) {
            alert("Please select a song and enter a new name.");
            return;
        }

        try {
            const response = await fetch(`/api/song_edit_api/${this.selectedSong}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ song_name: this.newSongName })
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                this.updateUserSongs();
                this.fetchUserSongs();
                this.$router.push({ path: '/'})
            } else {
                alert("Failed to update song");
            }
        } catch (error) {
            console.error('Error updating song', error);
            alert("Failed to update song. Please try again later.");
        }
    },

    //function for updating the songs after the name of the song has been edited by the creator
    async updateUserSongs() {
        try {
            const response = await fetch('/api/user_songs_api');
            const data = await response.json();
            this.userSongs = data;
        } catch (error) {
            console.error('Error fetching user songs', error);
        }
    },

    //function for updating the album name
    async updateAlbum() {
        if (!this.selectedAlbumId || !this.newAlbumName) {
            alert("Please select an album and enter a new name.");
            return;
        }


        try {

            const response = await fetch(`/api/album_edit_api/${this.selectedAlbumId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ album_name: this.newAlbumName })
            });
            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                this.updateUserAlbums();
                this.fetchUserAlbums();
                this.$router.push({ path: '/'})
            } else {
                alert('Failed to update album');
            }
        } catch (error) {
            console.error('Error updating album:', error);
            alert('Failed to update album');
        }
    },

    //function for fetching the albums created by a particular user
    async fetchUserAlbums() {
        try {
            const response = await fetch('/api/user_album_api');
            const data = await response.json();
            console.log(data)
            this.userAlbums = data;
        } catch (error) {
            console.error('Error fetching user albums:', error);
        }
    },
    
    //function for updating the albums created by the user after updating the album name
    async updateUserAlbums() {
        try {
            const response = await fetch('/api/user_album_api');
            const data = await response.json();
            this.userAlbums = data;
        } catch (error) {
            console.error('Error fetching user Albums', error);
        }
    },

    //function for deleting song
    async deleteSong() {
        try {
            const response = await fetch(`/api/song_delete_api/${this.selectedSong}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                this.updateUserSongs();
                this.fetchUserSongs();
                this.$router.push({ path: '/'})
            } else {
                alert('Failed to delete song');
            }
        } catch (error) {
            console.error('Error deleting song:', error);
            alert('Failed to delete song');
        }
    },
    
    //function for deleting album
    async deleteAlbum() {
        try {
            const response = await fetch(`/api/album_delete_api/${this.selectedAlbumId}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                this.updateUserAlbums();
                this.fetchUserAlbums();
                this.$router.push({ path: '/'})
            } else {
                alert('Failed to delete album');
            }
        } catch (error) {
            console.error('Error deleting album:', error);
            alert('Failed to delete album');
        }
    },
},
mounted() {
    this.fetchUserSongs();
    this.fetchUserAlbums();
}
}