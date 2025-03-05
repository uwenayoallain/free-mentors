from mongoengine import Document, StringField, ReferenceField, DateTimeField, CASCADE
from users.models import User
import datetime

class MentorshipSession(Document):
    STATUS_CHOICES = ['pending', 'accepted', 'declined', 'completed']

    mentor = ReferenceField(User, reverse_delete_rule=CASCADE)
    mentee = ReferenceField(User, reverse_delete_rule=CASCADE)
    topic = StringField(max_length=255, required=True)
    questions = StringField()
    status = StringField(choices=STATUS_CHOICES, default='pending')
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {'collection': 'mentorship_sessions'}
