from mongoengine import Document, StringField, EmailField, BooleanField
import bcrypt

class User(Document):
    meta = {
        'collection': 'user'  # Explicitly set the collection name
    }   
    first_name = StringField(required=True)
    last_name = StringField(required=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    address = StringField(required=True)
    bio = StringField()
    occupation = StringField()
    expertise = StringField()
    USERNAME_FIELD = 'email'
    user_type = StringField(choices=[('mentor', 'Mentor'), ('mentee', 'Mentee'), ('admin', 'Admin')], default='mentee')
    is_staff = BooleanField(default=False)  

    def set_password(self, raw_password):
        # Hash the password using bcrypt
        hashed = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt())
        self.password = hashed.decode('utf-8')

    def check_password(self, raw_password):
        # Verify the password
        return bcrypt.checkpw(
            raw_password.encode('utf-8'),
            self.password.encode('utf-8')
        )

    def get_username(self):
        return self.email
    
class AdminCreationFlag(Document):
    admin_created = BooleanField(default=False)