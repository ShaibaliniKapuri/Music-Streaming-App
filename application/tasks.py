from celery import shared_task
from application.mail_service import send_message
from application.models import User, Song
from datetime import datetime
from datetime import date

'''
@shared_task()
def say_hello(message):
    print("Task completed")
    return message

'''

@shared_task(ignore_result=True)
def send_mail(subject):
    all_songs = Song.query.all()  
    creator_report = {}

    for song in all_songs:
        ratings = [rating.rating for rating in song.ratings]
        if ratings:
            average_rating = sum(ratings) / len(ratings)
        else:
            average_rating = 0    
        song_data = {
            'song_name': song.song_name,
            'flag_count': song.flag_count,
            'play_count': song.play_count,
            'average_rating' : average_rating,
        }

        creator_username = song.creator.username
        if creator_username not in creator_report:
            creator_report[creator_username] = {'songs': [], 'email': song.creator.email}
        creator_report[song.creator.username]['songs'].append(song_data)
 
    
    now = datetime.now()
    dt_string = now.strftime("%d/%m/%Y %H:%M")

    



    html_template = """

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Creator Report</title>
    </head>
    <body>
        <b>Dear {creator},</b>
        <p>Thank you for your contributions in our platform</p>
        <h4>Your Song performance summary:</h4>
        <h6>This report was generated at: {dt_string}</h6>
        <br></br>
        <table border="1">
            <tr>
                <th>Song Name</th>
                <th>Rating Received</th>
                <th>Flags</th>
                <th>Play Count</th>
            </tr>
            {table_rows}
        </table>
        

        <p>With Regards,</p>
        <p>Team Musify</p>
    </body>
    </html>

    """
    for creator, info in creator_report.items():
        table_rows = ""
        for song_data in info['songs']:
            table_rows += f"""
            <tr>
                <td>{song_data['song_name']}</td>
                <td>{song_data['average_rating']}</td>
                <td>{song_data['flag_count']}</td>
                <td>{song_data['play_count']}</td>
            </tr>
            """
    

        mail_body = html_template.format(table_rows=table_rows, dt_string=dt_string, creator=creator)
        creator_mail = info['email']      
        send_message(creator_mail,
                        subject,
                        mail_body)

    return f"Emails have been sent to creators."

@shared_task()
def send_login_reminder(subject):
    
    html_template = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reminder Email</title>
    </head>
    <body>
        <p>Dear {user_name},</p>
        <p>We noticed that you haven't visited our app today (Your last logged in date: {last_log}).</p>
        <p>Come back soon to enjoy all the latest musics and podcasts.</p>
        <p>Best regards,<br> Team Musify</p>
    </body>
    </html>
    """
    
    all_users = User.query.all()

    today = date.today()
    today_str = today.strftime("%d/%m/%Y")

    for user in all_users:
        user_name = user.username  
        
        # Checking if last logged in date is not today
        if user.last_login != today_str:
            mail_body = html_template.format(user_name=user_name, last_log=user.last_login)
            user_email = user.email
            send_message(user_email,
                         subject,
                         mail_body)


    return "Login reminders have been sent."
    
