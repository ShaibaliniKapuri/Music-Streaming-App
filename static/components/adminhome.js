export default {
    template:
    `
    <h1>Welcome to Admin Dashboard</h1>
        
    
    <h2>App Statistics</h2>
    <table class="table table-dark">
        <thead>
            <tr>
                <th scope="col">Metric</th>
                <th scope="col">Count</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Total Users</td>
                <td>{{ statistics.total_users }}</td>
            </tr>
            <tr>
                <td>Total Creators</td>
                <td>{{ statistics.total_creators }}</td>
            </tr>
            <tr>
                <td>Total Songs</td>
                <td>{{ statistics.total_songs }}</td>
            </tr>
            <tr>
                <td>Total Albums</td>
                <td>{{ statistics.total_albums }}</td>
            </tr>
        </tbody>
    </table>
</div>

<div>
    <h2>Song Performance</h2>
    <table class="table table-dark">
        <thead>
            <tr>
                <th scope="col">Song Name</th>
                <th scope="col">Artist</th>
                <th scope="col">Play Count</th>
                <th scope="col">Average Rating</th>
                <th scope="col">Flag Count</th>
                <th scope="col">Action</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="song in songs" :key="song.id">
                <td>{{ song.song_name }}</td>
                <td>{{ song.artist }}</td>
                <td>{{ song.play_count }}</td>
                <td>{{ song.average_rating }}</td>
                <td>{{ song.flag_count }}</td>
                <td>
                    <button class="btn btn-danger" @click="removeSong(song.id)">Remove Song</button>
                </td>
                <td>
                    <button class="btn btn-danger" @click="flagSong(song)">Flag Song</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<div>
    <h2>Albums</h2>
    <table class="table table-dark">
        <thead>
            <tr>
                <th scope="col">Album Name</th>
                <th scope="col">Artist</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="album in albums" :key="album.id">
                <td>{{ album.album_name }}</td>
                <td>{{ album.creator_name }}</td>
                <td>
                    <button class="btn btn-danger" @click="removeAlbum(album.id)">Remove Album</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>

    `
    ,
    data(){
        return {
            statistics:{
                total_users: null,
                total_creators: null,
                total_songs: null,
                total_albums: null,
            },
            songs:[],
            albums:[],
        }
    },

    mounted() {
        this.fetchStatistics()
        this.fetchSongs()
        this.fetchAlbums()
    },

    methods: {

        //function for showing app statistics
        async fetchStatistics() {
            try {
                const response = await fetch('/api/app_statistics');
                this.statistics = await response.json();
                console.log(this.statistics);
            } catch (error) {
                console.log("Error fetching statistics", error);
            }
        },

        //function for showing song statistics
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

        //function for removing song
        async removeSong(songId) {
            try {
              const response = await fetch(`/api/admin_remove_song/${songId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              if (response.ok) {
                alert('Song removed successfully');
                this.songs = this.songs.filter(song => song.id !== songId);
              } else {
                console.error('Failed to remove song');
              }
            } catch (error) {
              console.error('Error removing song:', error);
            }
          
        },

        //function for flagging a song
        async flagSong(song) {
            try {
                const response = await fetch(`/api/flag_song_api/${song.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    song.flag_count++;
                    alert('Song flagged successfully');
                } else {
                    alert('Failed to flag the song');
                }
            } catch (error) {
                console.error('Error flagging the song:', error);
            }
        },

        //function for showing all albums
        async fetchAlbums() {
            try {
              const response = await fetch('/api/album_api');
              this.albums = await response.json();
              console.log(this.albums)
            } catch (error) {
              console.error('Error fetching albums:', error);
            }
        },

        //function for removing an album
        async removeAlbum(albumId) {
            try {
              const response = await fetch(`/api/admin_remove_album/${albumId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              if (response.ok) {
                alert('Album removed successfully');
                this.albums = this.albums.filter(album => album.id !== albumId);
              } else {
                console.error('Failed to remove album');
              }
            } catch (error) {
              console.error('Error removing album:', error);
            }
          
        },

    }    
    
}