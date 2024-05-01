export default {
    template: `
    <div class="container-fluid bg-dark text-light">
            <div class="row">
                <!-- Side Column with Separate Scrolling -->
                <div class="col-sm-2 bg-secondary text-light sidebar-scroll">
                    <!-- User Information -->
                    <div class="p-4">
                        <h4>Hi {{ userName }} !</h4>
                        <router-link v-if="userRole === 'creator'" to='/creator_studio'>
                            <button type="button" class="btn btn-outline-success">Creator Studio</button>
                        </router-link>
                    </div>  
                    <div class="p-4">
                        <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#createPlaylistModal">
                            New Playlist
                        </button>
                    </div>
                    <!-- Modal -->
                    <div class="modal fade" id="createPlaylistModal" tabindex="-1" role="dialog" aria-labelledby="createPlaylistModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content bg-secondary text-light">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="createPlaylistModalLabel">Create Playlist</h5>
                                    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <!-- Form for creating a playlist -->
                                    <form @submit.prevent="createPlaylist" enctype="multipart/form-data">
                                        <div class="mb-3">
                                            <label for="playlist-name" class="form-label">Playlist Name</label>
                                            <input type="text" class="form-control" id="playlist-name" v-model="playlistName" required>
                                        </div>
                                        <div class="mb-3 bg-secondary text-light">
                                            <label for="song-select" class="form-label">Select Songs</label>
                                            <div v-for="song in songs" :key="song.id">
                                                <input type="checkbox" :id="'song-checkbox-' + song.id" :value="song.id" v-model="selectedSongs">
                                                <label :for="'song-checkbox-' + song.id">{{ song.song_name }}</label><br>
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-primary">Create Playlist</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Add more sections in the side column as needed -->
                    <div class="p-4">
                        <h4>Browse</h4>
                        <p>New Releases</p>
                        <p>Top Albums</p>
                        <p>Top Creators</p>
                        <p>All Songs</p>
                    </div>
                    <div class="p-4">
                        <h4>Library</h4>
                        <p>History</p>
                        <p>Liked Songs</p>
                        <p>Liked Albums</p>
                        <p>My Playlists</p>
                    </div>
                    
                </div>
                <!-- Main Content Column with Separate Scrolling -->
                <div class="col-md-9 bg-dark text-light main-content-scroll main-content-space ">
                    <h1>Welcome to Musify</h1>
                    <p>Discover and enjoy your favorite music.</p>
                    
                    <!-- Songs -->
                    <h4>Trending Songs</h4>
                    <div class="row mt-4">
                        <div v-for="song in songs" :key="song.id" class="col-md-3">
                            <div class="card bg-secondary text-light">
                                <img src="https://thumbs.dreamstime.com/b/simple-cartoon-audio-music-player-icon-headphones-flat-insulated-style-simple-cartoon-audio-music-player-icon-headphones-167547675.jpg" class="card-img-top" alt="test">
                                <div class="card-body">
                                    <h5 class="card-title">{{ song.song_name }}</h5>
                                    <p class="card-text">{{ song.artist }}</p>
                                </div>    
                                <div class="card-footer border-light d-flex justify-content-evenly">
                                    <button class="btn btn-outline-secondary btn-sm" @click="playSong(song); incrementPlayCount(song.id)">Play Song</button>
                                    <div class="dropdown">
                                        <button class="btn btn-outline-secondary btn-sm dropdown-toggle" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                            Rate Song
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <a class="dropdown-item" @click="rateSong(song.id, 1)">1 Star</a>
                                            <a class="dropdown-item" @click="rateSong(song.id, 2)">2 Stars</a>
                                            <a class="dropdown-item" @click="rateSong(song.id, 3)">3 Stars</a>
                                            <a class="dropdown-item" @click="rateSong(song.id, 4)">4 Stars</a>
                                            <a class="dropdown-item" @click="rateSong(song.id, 5)">5 Stars</a>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <br></br>
                    <!-- Top Albums -->
                    <h4>Top Albums</h4>
                    <div class="row mt-4">
                        <div class="col-md-3" v-for="album in albums" :key="album.id">
                            <div class="card bg-secondary text-light">
                                <img src="https://png.pngtree.com/background/20210715/original/pngtree-electronic-music-album-picture-image_1301130.jpg" class="card-img-top" alt="test">
                                <div class="card-body">
                                    <h5 class="card-title">{{ album.album_name }}</h5>
                                    <p class="card-text">Creator: {{ album.creator_name }}</p>
                                    <p class="card-text">Song Count: {{ album.song_count }}</p>
                                    <button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#albumSongsModal" @click="viewAlbumSongs(album)">View Album</button>
                                </div>
                            </div>   
                        </div> 
                    </div>
                    <div class="modal fade" id="albumSongsModal" tabindex="-1" aria-labelledby="albumSongsModalLabel" aria-hidden="true" v-if="showAlbumSongsModal">
                        <div class="modal-dialog modal-lg">
                        <div class="modal-content bg-secondary text-light">
                            <div class="modal-header">
                                <h5 class="modal-title" id="albumSongsModalLabel">Songs in the Album</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            <!-- Display album songs here -->
                            <ul class="list-group">
                                <li class="list-group-item bg-secondary text-light" v-for="song in selectedAlbum.songs" :key="song.id" @click="playSong(song)">{{ song.song_name }}</li>
                            </ul>
                            </div>
                        </div>
                        </div>
                    </div>

                    <br></br>
                    <!-- My Playlists -->
                    <h4>Top Playlists</h4>
                    <div class="row mt-4">
                        <div class="col-md-3" v-for="playlist in playlists" :key="playlist.id">
                            <div class="card bg-secondary text-light">
                                <img src="https://images.template.net/wp-content/uploads/2022/10/Disney-Playlist-Covers.png" class="card-img-top" alt="test">
                                <div class="card-body">
                                    <h5 class="card-title">{{ playlist.playlist_name }}</h5>
                                    <p class="card-text">Creator: {{ playlist.user_name }}</p>
                                    <p class="card-text">Song Count: {{ playlist.song_count }}</p>
                                    <button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#playlistSongsModal" @click="viewPlaylistSongs(playlist)">View Playlist</button>
                                </div>
                            </div>   
                        </div> 
                    </div>
                    <div class="modal fade" id="playlistSongsModal" tabindex="-1" aria-labelledby="playlistSongsModalLabel" aria-hidden="true" v-if="showPlaylistSongsModal">
                        <div class="modal-dialog modal-lg">
                        <div class="modal-content bg-secondary text-light">
                            <div class="modal-header">
                            <h5 class="modal-title" id="playlistSongsModalLabel">Songs in the Playlist</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            <!-- Display playlist songs here -->
                            <ul class="list-group">
                                <li class="list-group-item bg-secondary text-light" v-for="song in selectedPlaylist.songs" :key="song.id" @click="playSong(song)">{{ song.song_name }}</li>
                            </ul>
                            </div>
                        </div>
                        </div>
                    </div>

                    <br></br>
                    <h4>Top Creators</h4>
                    <div class="row mt-4">
                        <div class="col-md-3">
                            <div class="card bg-secondary text-light">
                                <img src="https://i.scdn.co/image/ab67706c0000da84713acc3db68c7a5a605245b8" class="card-img-top" alt="test">
                                <div class="card-body">
                                    <h5 class="card-title">Taylor Swift</h5>
                                </div>
                            </div>   
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-secondary text-light">
                                <img src="https://i.scdn.co/image/ab67616d0000b27331ce38228313cd7e713b9f65" class="card-img-top" alt="test">
                                <div class="card-body">
                                    <h5 class="card-title">Alex Turner</h5>
                                </div>
                            </div>   
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-secondary text-light">
                                <img src="https://i.scdn.co/image/ab6775700000ee85b04b359362e0b98cad0589b4" class="card-img-top" alt="test">
                                <div class="card-body">
                                    <h5 class="card-title">Christina Perry</h5>
                                </div>
                            </div>   
                        </div>
                    </div>
                </div>
                    <!-- Music bar -->
                    <div v-if="currentSong" class="music-bar">
                        <audio ref="audioPlayer" :src="currentSong.song_path" @ended="stopSong"></audio>
                        <div class="music-controls">
                            <button type="button" class="btn btn-outline-success" @click="togglePlayPause">{{ isPlaying ? 'Pause' : 'Play' }}</button>
                            <input type="range" class="seek-bar" :value="progress" @input="seekMusic" step="0.01">
                            <span>{{ currentSong.song_name }} - {{ currentSong.artist }}</span>
                            <div data-bs-theme="dark">
                                <button type="button" class="btn-close" aria-label="Close" @click="closeMusicBar"></button>
                            </div>    
                        </div>
                    </div>
            </div>
        </div>   
    `
    ,
    data() {
        return {
            userName: null,
            userRole: null,
            songs: [],//list for showing all songs
            currentSong: null,
            isPlaying: false,
            progress: 0,
            albums: [],
            selectedAlbum: {
                songs: null,
            },//object for album modal
            showAlbumSongsModal: false,
            playlistName: null,
            selectedSongs: [],
            playlists:[],
            selectedPlaylist: {
                songs: null,
            },//object for playlist modal
            showPlaylistSongsModal: false,
        }
    },
    mounted() {
        this.fetchSongs();
        this.fetchAlbums();
        this.fetchPlaylists();
    },
    created() {
        this.userName = localStorage.getItem('username')
        this.userRole = localStorage.getItem('role')
    },

    methods: {
        async fetchSongs() {
            const res = await fetch('/api/song_api',{
                method: 'GET',
            })
            const data = await res.json();
            if (res.ok) {
                console.log("response recieved successfully");
                console.log(data);
                this.songs = data;
            }else{
                console.log("Failed to load songs")
            }
        },

        //Playing a song
        playSong(song) {
            this.currentSong = song;
            this.isPlaying = true;
            this.$refs.audioPlayer.play();
            this.$refs.audioPlayer.addEventListener('timeupdate', this.updateProgress);
          },
        stopSong() {
            this.currentSong = null;
            this.isPlaying = false;
        },
        togglePlayPause() {
            if (this.isPlaying) {
              this.$refs.audioPlayer.pause();
              this.isPlaying = false;
            } else {
              this.$refs.audioPlayer.play();
              this.isPlaying = true;
            }
        },
        updateProgress() {
            const audio = this.$refs.audioPlayer;
            const progress = (audio.currentTime / audio.duration) * 100;
            this.progress = progress.toFixed(2);
        },
        seekMusic(event) {
            const audio = this.$refs.audioPlayer;
            const seekTime = (event.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        },
        closeMusicBar() {
            this.currentSong = null; // Close the music bar by setting currentSong to null
            this.isPlaying = false; // Stop playing if it's playing
        },

        //------------------------------------------------------------------------------------------------------------

        //albums
        async fetchAlbums() {
            try {
              const response = await fetch('/api/album_api');
              this.albums = await response.json();
              console.log(this.albums)
            } catch (error) {
              console.error('Error fetching albums:', error);
            }
        },

        async viewAlbumSongs(album) {
            this.selectedAlbum = album;
            console.log(this.selectedAlbum);
            try {
              const response = await fetch(`/api/album_songs/${album.id}`); 
              console.log("response sent to backend")
              const songs = await response.json();
              console.log(songs)
              this.selectedAlbum.songs = songs;
              this.showAlbumSongsModal = true;
              console.log("showing modal")
            } catch (error) {
              console.error('Error fetching album songs:', error);
            }
        },


        //------------------------------------------------------------------------------------------------------------------------------------------

        //function for keeping track of play count of a song
        async incrementPlayCount(songId) {
            try {
                const response = await fetch(`/api/play_count_api/${songId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    console.log('Play count updated successfully');
                } else {
                    console.error('Failed to update play count');
                }
            } catch (error) {
                console.error('Error updating play count:', error);
            }
        },

        //function for song rating
        async rateSong(songId, rating) {
            try {
                const response = await fetch(`/api/song_rating_api/${songId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ rating })
                });
                if (response.ok) {
                    alert('Song rated successfully');
                } else {
                    console.error('Failed to rate song');
                }
            } catch (error) {
                console.error('Error rating song:', error);
            }
        },


        //-----------------------------------------------------------------------------------------------------------------------------------

        //Playlist
        async createPlaylist() {
            try {
                const formData = new FormData();
                formData.append('playlist_name', this.playlistName);
                formData.append('song_id',this.selectedSongs);
    
                let playlist = this.playlistName;
                let songarray = this.selectedSongs;
                console.log(playlist,songarray)
    
                const response = await fetch('/api/playlist_api', {
                    method: "POST",
                    body: formData 
                });
                const data = await response.json();
                alert(data.message);
                this.fetchPlaylists();
                this.$router.push({ path: '/'})
            } catch (error) {
                console.error('Error creating playlist', error);
                alert('Failed to create playlist')
            }
        },

        async fetchPlaylists() {
            try {
              const response = await fetch('/api/playlist_api');
              this.playlists = await response.json();
              console.log(this.playlists)
            } catch (error) {
              console.error('Error fetching playlists:', error);
            }
        },

        async viewPlaylistSongs(playlist) {
            this.selectedPlaylist = playlist;
            console.log(this.selectedPlaylist);
            try {
              const response = await fetch(`/api/playlist_songs/${playlist.id}`); 
              console.log("response sent to backend")
              const songs = await response.json();
              console.log(songs)
              this.selectedPlaylist.songs = songs;
              this.showPlaylistSongsModal = true;
              console.log("showing modal")
            } catch (error) {
              console.error('Error fetching playlist songs:', error);
            }
        },


    }
        
}    