# reviews/schema.py
import graphene
from graphene_mongo import MongoengineObjectType
from graphql import GraphQLError
from django.contrib.auth import get_user_model
from .models import Review
from users.utils import get_authenticated_user
from mentorship.models import MentorshipSession
from bson import ObjectId
User = get_user_model()

class ReviewType(MongoengineObjectType):
    class Meta:
        model = Review
        fields = ("id", "rating", "content", "is_visible", "session")

        id = graphene.String()
        

class Query(graphene.ObjectType):
    all_reviews = graphene.List(ReviewType)
    mentor_reviews = graphene.List(ReviewType, mentor_id=graphene.String(required=True))
    
    def resolve_all_reviews(self, info):
        user = get_authenticated_user(info.context)  # Ensure authentication

        if not user.is_staff:  # Assuming `is_staff` is used for admin users
            return Review.objects.filter(is_visible=True)  # Only return visible reviews
        
        return Review.objects.all()  # Admin can see all reviews
    
    def resolve_mentor_reviews(self, info, mentor_id):
        user = get_authenticated_user(info.context)  # Ensure authentication

        try:
        # Convert to string if needed
            mentor_id_str = str(mentor_id)
        
        # Assuming your User model has a field like 'mongo_id' that stores the MongoDB ObjectId as string
        # If not, you need to add such a field to link Django users with MongoDB documents
            mentor = User.objects.get(mongo_id=mentor_id_str, user_type='mentor')
        
        # Find sessions for this mentor
            sessions = MentorshipSession.objects.filter(mentor=mentor)
        
        # Get reviews for these sessions
            return Review.objects.filter(session__in=sessions, is_visible=True)
            
        except User.DoesNotExist:
            raise GraphQLError('Mentor not found')
        except Exception as e:
            raise GraphQLError(f'Error retrieving reviews: {str(e)}')
class CreateReview(graphene.Mutation):
    review = graphene.Field(ReviewType)
    
    class Arguments:
        session_id = graphene.String(required=True)
        rating = graphene.Int(required=True)
        content = graphene.String(required=True)
    
    def mutate(self, info, session_id, rating, content):
        # Authenticate the user
        user = get_authenticated_user(info.context)
        if not user:
            raise GraphQLError('You must be logged in to create a review')
        
        try:
            # Fetch the session
            session = MentorshipSession.objects.get(id=ObjectId(session_id))
        except (MentorshipSession.DoesNotExist, ValueError):
            raise GraphQLError('Invalid or non-existent session ID')
        
        # Validate the rating
        if rating < 1 or rating > 5:
            raise GraphQLError('Rating must be between 1 and 5')
        
        # Only mentee can review the session
        if session.mentee != user:
            raise GraphQLError('Not authorized')
        
        # Session must be completed
        if session.status != 'completed':
            raise GraphQLError('Cannot review an incomplete session')
        
        # Check if review already exists
        if Review.objects.filter(session=session).count() > 0:
            raise GraphQLError('Review already exists for this session')
        
        # Create the review
        review = Review(session=session, rating=rating, content=content)
        review.save()
        
        return CreateReview(review=review)

class UpdateReviewVisibility(graphene.Mutation):
    review = graphene.Field(ReviewType)
    
    class Arguments:
        review_id = graphene.String(required=True)
        is_visible = graphene.Boolean(required=True)
    
    def mutate(self, info, review_id, is_visible):
        user = get_authenticated_user(info.context)  # Use the helper function

        if not user.is_staff:
            raise GraphQLError('Not authorized')

        try:
            review = Review.objects.get(id=review_id)
            review.is_visible = is_visible
            review.save()
            return UpdateReviewVisibility(review=review)
        except Review.DoesNotExist:
            raise GraphQLError('Review not found')

class Mutation(graphene.ObjectType):
    create_review = CreateReview.Field()
    update_review_visibility = UpdateReviewVisibility.Field()