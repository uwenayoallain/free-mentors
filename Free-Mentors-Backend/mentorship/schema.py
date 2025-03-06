# mentorship/schema.py
import graphene
from graphene_mongo import MongoengineObjectType
from graphql import GraphQLError
from .models import MentorshipSession
from users.models import User
from users.utils import get_authenticated_user

class MentorshipSessionType(MongoengineObjectType):
    class Meta:
        model = MentorshipSession

class Query(graphene.ObjectType):
    all_sessions = graphene.List(MentorshipSessionType)
    user_sessions = graphene.List(MentorshipSessionType)
    
    def resolve_all_sessions(self, info):
        # Authenticate the user
        user = get_authenticated_user(info.context)
        
        # Ensure the authenticated user is staff (admin)
        if not user.is_staff:
            raise GraphQLError('Not authorized')
        
        return MentorshipSession.objects.all()
    
    def resolve_user_sessions(self, info):
        # Authenticate the user
        user = get_authenticated_user(info.context)
        
        # Get sessions where user is either mentee or mentor
        return MentorshipSession.objects.filter(__raw__={"$or": [{"mentee": user}, {"mentor": user}]})

class CreateSession(graphene.Mutation):
    session = graphene.Field(MentorshipSessionType)
    
    class Arguments:
        mentor_id = graphene.ID(required=True)
        topic = graphene.String(required=True)
        questions = graphene.String(required=True)
    
    def mutate(self, info, mentor_id, topic, questions):
        # Authenticate the user
        user = get_authenticated_user(info.context)
        
        try:
            mentor = User.objects.get(id=mentor_id, user_type='mentor')
        except User.DoesNotExist:
            raise GraphQLError('Mentor not found')
        
        session = MentorshipSession(
            mentor=mentor,
            mentee=user,
            topic=topic,
            questions=questions
        )
        session.save()
        return CreateSession(session=session)

class UpdateSessionStatus(graphene.Mutation):
    session = graphene.Field(MentorshipSessionType)
    
    class Arguments:
        session_id = graphene.ID(required=True)
        status = graphene.String(required=True)
    
    def mutate(self, info, session_id, status):
        # Authenticate the user
        user = get_authenticated_user(info.context)
        
        valid_statuses = [s[0] for s in MentorshipSession.STATUS_CHOICES]
        if status not in valid_statuses:
            raise GraphQLError(f'Invalid status. Choose from {", ".join(valid_statuses)}')
        
        try:
            session = MentorshipSession.objects.get(id=session_id)
        except MentorshipSession.DoesNotExist:
            raise GraphQLError('Session not found')
        
        # Only mentor can update status
        if session.mentor != user:
            raise GraphQLError('Not authorized')
        
        session.status = status
        session.save()
        return UpdateSessionStatus(session=session)

class Mutation(graphene.ObjectType):
    create_session = CreateSession.Field()
    update_session_status = UpdateSessionStatus.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)