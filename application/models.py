from flask_sqlalchemy import SQLAlchemy 
from flask_security import UserMixin,RoleMixin



db = SQLAlchemy()


class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String, unique = True)
    email = db.Column(db.String, unique = True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255),unique = True,nullable = False)
    roles = db.relationship('Role', secondary='roles_users',backref = db.backref('users', lazy='dynamic'))
    song = db.relationship('Song', backref = 'creator')
    last_login = db.Column(db.DateTime)


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer,primary_key = True)
    name = db.Column(db.String(80),unique = True)
    description = db.Column(db.String(255))


class Song(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    song_name = db.Column(db.String(100),nullable = False, unique = True)
    artist = db.Column(db.String(255),nullable = False)
    song_path = db.Column(db.String(255),nullable = False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    play_count = db.Column(db.Integer, default = 0)
    ratings = db.relationship('Rating', backref='song', lazy = True, cascade='all, delete-orphan')
    flag_count = db.Column(db.Integer, default = 0)
    is_flagged = db.Column(db.Boolean, default = False)
    flags = db.relationship('Flag', backref='song', lazy= True, cascade='all, delete-orphan')

class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    album_name = db.Column(db.String(100), nullable=False, unique = True)
    songs = db.relationship('Song',secondary = 'album_song', backref='albums')
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    creator = db.relationship('User', backref='albums')

class AlbumSong(db.Model):
    __tablename__ = 'album_song'
    id = db.Column(db.Integer, primary_key = True)
    album_id = db.Column('album_id', db.Integer, db.ForeignKey('album.id'))
    song_id = db.Column('song_id', db.Integer, db.ForeignKey('song.id')) 

class Flag(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'), nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)          

class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    playlist_name = db.Column(db.String(100), nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='playlists')
    songs = db.relationship('Song', secondary='playlist_songs', backref='playlists')

class PlaylistSong(db.Model):
    __tablename__ = 'playlist_songs'
    id = db.Column(db.Integer, primary_key = True)
    playlist_id = db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id'))
    song_id = db.Column('song_id', db.Integer, db.ForeignKey('song.id'))

        
