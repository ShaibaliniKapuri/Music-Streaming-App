export default {
    template:
    `
    <div>
      <input class="form-control me-2" v-model="searchQuery" type="search" placeholder="Search..." aria-label="Search">
      <select class="form-select-sm mb-3" style="width: 150px;" v-model="filterOption">
        <option value="songs">Songs</option>
        <option value="albums">Albums</option>
      </select>
      <select class="select" style="width: 100px;" v-if="filterOption === 'songs'" v-model="ratingFilter">
        <option value="">All Ratings</option>
        <option value="5">5 Stars</option>
        <option value="4">4 Stars</option>
        <option value="3">3 Stars</option>
        <option value="2">2 Stars</option>
        <option value="1">1 Star</option>
      </select>
      <button class="btn btn-outline-success" @click="searchItems">Search</button>
    </div>  
    <div>
      <h3>Searched Items</h3>
        <div v-for="item in searchResults" :key="item.index">
          <!-- Rendering song or album information here -->
          <div v-if="item.song_name" class="col-sm-2">
            <div class="card text-dark">
              <img src="https://thumbs.dreamstime.com/b/simple-cartoon-audio-music-player-icon-headphones-flat-insulated-style-simple-cartoon-audio-music-player-icon-headphones-167547675.jpg" class="card-img-top" alt="test">
              <div class="card-body">
                <h5 class="card-title">{{ item.song_name }}</h5>
                <p class="card-text">{{ item.artist }}</p>
                <!--<button class="btn btn-outline-secondary" @click="playSong(song); incrementPlayCount(song.id)">Play Song</button>-->
              </div>
            </div>  
          </div>
          <div v-else-if="item.album_name" class="col-sm-2">
            <div class="card text-dark">
                <img src="https://png.pngtree.com/background/20210715/original/pngtree-electronic-music-album-picture-image_1301130.jpg" class="card-img-top" alt="test">
                <div class="card-body">
                  <h5 class="card-title">{{ item.album_name }}</h5>
                  <p class="card-text">Creator: {{ item.creator_name }}</p>
                  <p class="card-text">Song Count: {{ item.song_count }}</p>
                  <!--<button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#albumSongsModal" @click="viewAlbumSongs(album)">View Album</button>-->
                </div> 
            </div> 
          </div>      
        </div>
        <!--<div v-else>
          <h4> No matching results found...</h4>
        </div>--> 
    </div>

    `
    ,
    
    data() {
      return {
        searchQuery:'',
        filterOption: 'songs', // Default to searching for songs
        ratingFilter: null,
        searchResults: [],
      }
    },

    methods : {
      async searchItems() {
        try {
          const response = await fetch(`/api/search?query=${this.searchQuery}&type=${this.filterOption}&rating=${this.ratingFilter}`);
          if (response.ok) {
            const data = await response.json();
            console.log(data)
            this.searchResults = data.results;
          } else {
            console.error('Failed to search items:', response.statusText);
          }
        } catch (error) {
          console.error('Error searching items:', error);
        }
      },

      filterByRating(rating) {
        this.ratingFilter = rating;
      },

    }

  }