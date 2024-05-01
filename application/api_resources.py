from flask import current_app as app
from flask import request, session
from flask_restful import Resource, Api,fields, marshal
from sqlalchemy import or_
from application.models import Song,db,Album,AlbumSong,User, Rating, Flag, Playlist,PlaylistSong
from werkzeug.utils import secure_filename 
import os



api = Api(prefix='/api')


#SONG MANAGEMENT CRUD

song_api_fields = {
    'id': fields.Integer,
    'song_name': fields.String,
    'artist': fields.String,
    'song_path': fields.String, 
    'play_count': fields.Integer,
    'flag_count' : fields.Integer,
    'average_rating': fields.Float,
}

#API End point for creating a song and viewing all songs
class SongApi(Resource):
    def get(self):
        all_songs = Song.query.all()
        print("databse queried successfully")
        if len(all_songs) > 0:
            #songs_data = [marshal(song, song_api_fields) for song in all_songs]
            #song_data['average_rating'] = song.average_rating()
            songs_data = []
            for song in all_songs:
                song_data = marshal(song, song_api_fields)
                #song_data['average_rating'] = song.average_rating  # Calculate and add average rating
                #songs_data.append(song_data)
                ratings = [rating.rating for rating in song.ratings]
                if ratings:
                    average_rating = sum(ratings) / len(ratings)
                    song_data['average_rating'] = average_rating
                else:
                    song_data['average_rating'] = None
                songs_data.append(song_data)
            print("Song data marshalled successfully")
            return songs_data
        else:
            return {"message":"No Songs Found"}, 404 
           
    
    def post(self):
        if 'file' not in request.files:
            print("file not found")
            return {"message" : "No file found"}, 400
        
        file = request.files['file']

        if file.filename == '':
            print("No selected file")
            return {"message" : "No selected file"},400
        
        if file:
            try:

                filename = secure_filename(file.filename)
                
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                song_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                
                print("File saved successfully:", song_path)
            except Exception as e:
                print("Error saving file:", e)

            song_name = request.form.get("song_name")
            if not song_name:
                print("Song name not found")
                return {"message": "Song name is required"}, 400
            
            # Fetch user data from session
            user_id = session.get('user_id')
            username = session.get('user_username')
        
            if not user_id or not username:
                print("Session not working")
                return {"message": "User data not found in session"}, 401

            
            song = Song(song_name=song_name, artist = username, song_path = song_path, creator_id = user_id)
            db.session.add(song)
            db.session.commit()
            return {"message":"Song created successfully!"}, 201
        else:
            print("Not uploaded")
            return {"message" : "File format not allowed"}, 400



api.add_resource(SongApi,'/song_api')


#API Endpoint for viewing songs of a particular creator, used in song update functionality
class UserSongsApi(Resource):
    def get(self):
        # Fetch user ID from session
        user_id = session.get('user_id')
        if not user_id:
            return {"message": "User not logged in"}, 401

        # Fetch songs created by the logged-in user
        user_songs = Song.query.filter_by(creator_id=user_id).all()
        songs_data = [marshal(song, song_api_fields) for song in user_songs]
        return songs_data


api.add_resource(UserSongsApi,'/user_songs_api')



#API Endpoint for updating the song name 
class SongEditApi(Resource):
    def post(self, song_id):
        # Fetch user ID from session
        user_id = session.get('user_id')
        if not user_id:
            print("User Not logged in")
            return {"message": "User not logged in"}, 401
        
        # Fetch song by ID
        song = Song.query.filter_by(id=song_id, creator_id=user_id).first()
        print("Song queried successfully")
        if not song:
            return {"message": "Song not found or unauthorized to edit"}, 404
        
        # Parse request data
        song_name = request.json.get('song_name')
        print("New song name recieved successfully")
        if not song_name:
            return {"message": "New song name is required"}, 400
        
        # Update song name
        song.song_name = song_name
        db.session.commit()
        print("New Song name committed successfully")
        
        return {"message": "Song name updated successfully"}, 200


api.add_resource(SongEditApi, '/song_edit_api/<int:song_id>')


#API Endpoint for deleting a song
class SongDeleteApi(Resource):
    def delete(self, song_id):
        try:
            song = Song.query.get(song_id)
            print("song queried for deletion")
            if not song:
                return {'message': 'Song not found'}, 404
            
            db.session.delete(song)
            print("song deleted")
            db.session.commit()
            print("session committed after deleting the song")
            return {'message': 'Song deleted successfully'}, 200
        except Exception as e:
            return {'error': str(e)}, 500
        
api.add_resource(SongDeleteApi, '/song_delete_api/<int:song_id>')


#------------------------------------------------------------------------------------------------------------------------------------------------------------

#ALBUM MANAGEMENT CRUD

#API Endpoint for viewing and creating Albums
class AlbumApi(Resource):
    def get(self):
      all_albums = Album.query.all()
      albums_data = []

      for album in all_albums:
        album_data = {
            'id':album.id,
            'album_name': album.album_name,
            'creator_name': album.creator.username,
            'song_count' : len(album.songs)
        }
        albums_data.append(album_data)

      return albums_data  

    def post(self):
        print("Request recieved")
        
        album_name = request.form.get('album_name')
        creator_id = session.get('user_id') 
        selected_song_ids_string = request.form.get('song_id')
        selected_song_ids = selected_song_ids_string.split(',') if selected_song_ids_string else []
        print(selected_song_ids)
        print("form data recieved successfully")
        try:
            # Create the album
            album = Album(album_name=album_name, creator_id= creator_id)
            db.session.add(album)
            print("album_name added")
            # Associate selected songs with the album
            for song_id in selected_song_ids:
                print(song_id)
                song = Song.query.get(song_id)
                if song:
                    album_song = AlbumSong(album_id=album.id, song_id=song.id)
                    db.session.add(album_song)
                    print("album_song filled")

            db.session.commit()
            print("database committed")
            print("song associated")
            return {'message': 'Album created successfully'}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

api.add_resource(AlbumApi, '/album_api')             


#API Endpoint for viewing the albums created by a particular creator
class UserAlbumApi(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'message': 'User not logged in'}, 401
        
        user_albums = Album.query.filter_by(creator_id=user_id).all()
        albums_data = [{'id': album.id, 'album_name': album.album_name} for album in user_albums]

        return albums_data, 200
    
api.add_resource(UserAlbumApi, '/user_album_api')

#API Endpoint for updating the name of an album
class AlbumEditApi(Resource):

    def post(self, album_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'message': 'User not logged in'}, 401
        
        album = Album.query.filter_by(id=album_id, creator_id=user_id).first()
        if not album:
            return {'message': 'Album not found or you are not authorized to update this album'}, 404
        
        album_name = request.json.get('album_name')
        print("Album name recieved successfully")
        if not album_name:
            return {'message': 'New album name is required'}, 400
        
        
        album.album_name = album_name
        db.session.commit()
        return {'message': 'Album name updated successfully'}, 200
    
api.add_resource(AlbumEditApi,'/album_edit_api/<int:album_id>')    


#API Endpoint for viewing the songs associated with an album
class AlbumSongsApi(Resource):
    def get(self, album_id):
        try: 
            album = Album.query.get(album_id)
            print("album queried successfully")
            if not album:
                print("Error while quering database")
                return {'error' : 'Album not found'}, 500
            
            associated_songs = album.songs
            associated_song_data = [{'id': song.id, 'song_name': song.song_name, 'song_path': song.song_path} for song in associated_songs]
            print("associated_song_data stored successfuly")
            return associated_song_data, 200
        except Exception as e:
            return {'error': str(e)}, 500
        
api.add_resource(AlbumSongsApi, '/album_songs/<int:album_id>')       

#API Endpoint for deleting album
class AlbumDeleteApi(Resource):
    def delete(self, album_id):
        try:
            album = Album.query.get(album_id)
            print("album queried for deletion")
            if not album:
                return {'message': 'Album not found'}, 404
            
            db.session.delete(album)
            print("Album deleted")
            db.session.commit()
            print("Database committed after deleting album")
            return {'message': 'Album deleted successfully'}, 200
        except Exception as e:
            return {'error': str(e)}, 500
        
api.add_resource(AlbumDeleteApi, '/album_delete_api/<int:album_id>')  


#---------------------------------------------------------------------------------------------------------------------------------------------------------------

#ADMIN FUNCTIONALITIES

#Monitoring app statistics

class AppStatistics(Resource):
    def get(self):
        total_users = User.query.count()
        print(total_users)
        total_creators = User.query.filter(User.song.any()).count()
        print(total_creators)
        total_songs = Song.query.count()
        print(total_songs)
        total_albums = Album.query.count()
        print(total_albums)

        statistics = {
            "total_users": total_users,
            "total_creators": total_creators,
            "total_songs": total_songs,
            "total_albums": total_albums
        }
        print(statistics)

        return statistics
    
api.add_resource(AppStatistics,'/app_statistics')


#Monitoring song statistics

#API for play count of the song
class PlayCountApi(Resource):
    def post(self, song_id):
        song = Song.query.get_or_404(song_id)
        song.play_count += 1
        print("play_count updated successfully")
        db.session.commit()
        print("updated play_count is committed in the database")
        return {'message':'Play count updated successfully'}, 200
    
api.add_resource(PlayCountApi,'/play_count_api/<int:song_id>')    

#API for rating a song
class SongRatingApi(Resource):
    def post(self, song_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'message': 'User not logged in'}, 401
        
        rating_value = request.json.get('rating')
        print("Rating value recieved successfully")

        
        if rating_value is None or not isinstance(rating_value, int) or rating_value < 1 or rating_value > 5:
            return 'Invalid rating value', 400

    
        song = Song.query.get_or_404(song_id)
        
        rating = Rating.query.filter_by(song_id=song_id, user_id=user_id).first()
        if rating:
            rating.rating = rating_value
            print("rating updated")
        else:
            rating = Rating(song_id=song_id, user_id=user_id, rating=rating_value)
            db.session.add(rating)
            print("rating created")
        db.session.commit()
        print("rating committed successfully")

        return {'message':'Song rated successfully'}, 200
    
api.add_resource(SongRatingApi,'/song_rating_api/<int:song_id>')

#API Endpoint for flagging a song
class FlagSongApi(Resource):
    def post(self, song_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'message': 'User not logged in'}, 401
        
        
        song = Song.query.get_or_404(song_id)
        song.flag_count += 1
        print("flag count incremented successfully")
      
        db.session.commit()
        print("database committed after flagging song")

        flag = Flag(song_id=song_id, user_id=user_id)
        db.session.add(flag)
        print("Flagging user is recorded")
        db.session.commit()
        print("Flagging user is committed in the database")

        return {'message':'Song flagged successfully'}, 200
    
api.add_resource(FlagSongApi, '/flag_song_api/<int:song_id>')   


#API Endpoint for admins removing a song or an album
class AdminRemoveSongApi(Resource):
    def delete(self, song_id):
        song = Song.query.get(song_id)
        if not song:
            return  {'message':"Song not found"}, 404
        
        # Remove the song from the database
        db.session.delete(song)
        db.session.commit()
        
        return {"message": "Song removed successfully"}, 200
    
api.add_resource(AdminRemoveSongApi, '/admin_remove_song/<int:song_id>')


class AdminRemoveAlbumApi(Resource):
    def delete(self, album_id):
        album = Album.query.get(album_id)
        if not album:
            return  {'message':"Album not found"}, 404
        
        # Remove the song from the database
        db.session.delete(album)
        db.session.commit()
        
        return {"message": "Album removed successfully"}, 200
    
api.add_resource(AdminRemoveAlbumApi, '/admin_remove_album/<int:album_id>')

#---------------------------------------------------------------------------------------------------------------------------------------------------

#USER FUNCTIONALITY

#API for creating and viewing playlist
class PlaylistApi(Resource):
    def get(self):
      all_playlists = Playlist.query.all()
      playlists_data = []

      for playlist in all_playlists:
        playlist_data = {
            'id':playlist.id,
            'playlist_name': playlist.playlist_name,
            'user_name': playlist.user.username,
            'song_count' : len(playlist.songs)
        }
        playlists_data.append(playlist_data)

      return playlists_data  

    def post(self):
        print("Request recieved for playlist")
        
        playlist_name = request.form.get('playlist_name')
        user_id = session.get('user_id') 
        selected_song_ids_string = request.form.get('song_id')
        selected_song_ids = selected_song_ids_string.split(',') if selected_song_ids_string else []
        print(selected_song_ids)
        print("form data for playlist recieved successfully")
        try:
            # Create the album
            playlist = Playlist(playlist_name=playlist_name, user_id= user_id)
            db.session.add(playlist)
            print("playlist_name added")
            
            for song_id in selected_song_ids:
                print(song_id)
                song = Song.query.get(song_id)
                if song:
                    playlist_song = PlaylistSong(playlist_id=playlist.id, song_id=song.id)
                    db.session.add(playlist_song)
                    print("playlist_song filled")

            db.session.commit()
            print("database committed for playlist")
            print("song associated")
            return {'message': 'Playlist created successfully'}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

api.add_resource(PlaylistApi, '/playlist_api')    


class PlaylistSongsApi(Resource):
    def get(self, playlist_id):
        try: 
            playlist = Playlist.query.get(playlist_id)
            print("playlist queried successfully")
            if not playlist:
                print("Error while quering database for palylist")
                return {'error' : 'Playlist not found'}, 500
            
            associated_songs = playlist.songs
            associated_song_data = [{'id': song.id, 'song_name': song.song_name, 'song_path': song.song_path} for song in associated_songs]
            print("associated_song_data with playlist stored successfuly")
            return associated_song_data, 200
        except Exception as e:
            return {'error': str(e)}, 500
        
api.add_resource(PlaylistSongsApi, '/playlist_songs/<int:playlist_id>')

#API for searching a song or an album
class Search(Resource):
    def get(self):
        query = request.args.get('query')
        print("search query:", query)
        search_type = request.args.get('type')
        print("search type:", search_type)
        rating = request.args.get('rating', None)
        print("rating:", rating)

        if search_type == 'songs':
            # Query songs based on song name and artist
            query_result = Song.query.filter(
                or_(Song.song_name.ilike(f'%{query}%'), Song.artist.ilike(f'%{query}%'))
            )
            #print("when searched for song:",query_result)
            # Filter songs based on rating if provided
            if rating != 'null':
                print("rating is not null")
                query_result = query_result.filter(Song.ratings.any(Rating.rating >= rating))
            results = query_result.all()
            #print("song query result:",query_result)
            serialized_results = [{'id': song.id, 'song_name': song.song_name, 'artist': song.artist, 'song_path':song.song_path, 'flag_count': song.flag_count} for song in results]
            print("serialized song query:", serialized_results)
        elif search_type == 'albums':
            # Query albums based on album name and artist
            results = Album.query.filter(
                or_(Album.album_name.ilike(f'%{query}%'), Album.creator.has(User.username.ilike(f'%{query}%')))
            ).all()
            print("when searched for album:", results)
            serialized_results = [{'id': album.id, 'album_name': album.album_name, 'artist': album.creator.username,'song_count':len(album.songs)} for album in results]
            print("serialized album query", serialized_results)
        else:
            return {'error': 'Invalid search type'}, 400

        return {'results': serialized_results}

api.add_resource(Search, '/search')

        

        

