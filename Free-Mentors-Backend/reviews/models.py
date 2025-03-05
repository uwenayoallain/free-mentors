# reviews/models.py
from mongoengine import Document, ReferenceField, IntField, StringField, BooleanField, DateTimeField
from mentorship.models import MentorshipSession
import datetime

class Review(Document):
    session = ReferenceField(MentorshipSession, required=True, unique=True, reverse_delete_rule=2)  # 2 = CASCADE
    rating = IntField(choices=[(i, str(i)) for i in range(1, 6)], required=True)
    content = StringField(required=True)
    is_visible = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {'collection': 'reviews'}  # Explicitly define the collection name
