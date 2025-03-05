# reviews/schema.py
import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.contrib.auth import get_user_model
from .models import Review
from mentorship.models import MentorshipSession

User = get_user_model()

class ReviewType(DjangoObjectType):
    class Meta:
        model = Review

class Query(graphene.ObjectType):
    all_reviews = graphene.List(ReviewType)
    mentor_reviews = graphene.List(ReviewType, mentor_id=graphene.ID(required=True))
    
    def resolve_all_reviews(self, info):
        if not info.context.user.is_authenticated:
            raise GraphQLError('You must be logged in')
        if not info.context.user.is_admin():
            return Review.objects.filter(is_visible=True)
        return Review.objects.all()
    
    def resolve_mentor_reviews(self, info, mentor_id):
        try:
            mentor = User.objects.get(id=mentor_id, user_type='mentor')
            # Get all visible reviews for sessions where user is the mentor
            return Review.objects.filter(
                session__mentor=mentor,
                is_visible=True
            )
        except User.DoesNotExist:
            raise GraphQLError('Mentor not found')

class CreateReview(graphene.Mutation):
    review = graphene.Field(ReviewType)
    
    class Arguments:
        session_id = graphene.ID(required=True)
        rating = graphene.Int(required=True)
        content = graphene.String(required=True)
    
    def mutate(self, info, session_id, rating, content):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError('You must be logged in')
        
        if rating < 1 or rating > 5:
            raise GraphQLError('Rating must be between 1 and 5')
        
        try:
            session = MentorshipSession.objects.get(id=session_id)
        except MentorshipSession.DoesNotExist:
            raise GraphQLError('Session not found')
        
        # Only mentee can review the session
        if session.mentee != user:
            raise GraphQLError('Not authorized')
        
        # Session must be completed
        if session.status != 'completed':
            raise GraphQLError('Cannot review an incomplete session')
        
        # Check if review already exists
        if Review.objects.filter(session=session).exists():
            raise GraphQLError('Review already exists for this session')
        
        review = Review(
            session=session,
            rating=rating,
            content=content
        )
        review.save()
        return CreateReview(review=review)

class UpdateReviewVisibility(graphene.Mutation):
    review = graphene.Field(ReviewType)
    
    class Arguments:
        review_id = graphene.ID(required=True)
        is_visible = graphene.Boolean(required=True)
    
    def mutate(self, info, review_id, is_visible):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError('You must be logged in')
        if not user.is_admin():
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