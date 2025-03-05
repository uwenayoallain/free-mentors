import graphene
from graphene_mongo import MongoengineObjectType
from graphql import GraphQLError
from graphql_jwt import Refresh, Verify
from .models import User
from graphql_jwt.shortcuts import get_token
from graphql_jwt.mutations import ObtainJSONWebToken
from graphql_jwt import JSONWebTokenMutation
from graphql_jwt.decorators import login_required
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import authenticate
from graphql_jwt.shortcuts import get_token, get_payload, get_user_by_payload, get_refresh_token
from datetime import timedelta , datetime , timezone
from django.conf import settings
from users.utils import get_authenticated_user


import jwt


class ObtainJSONWebTokenWithEmail(graphene.Mutation):
    token = graphene.Field(graphene.String)

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, email, password, **kwargs):
        user = User.objects.get(email=email)
        if user is None:
            raise GraphQLError('Invalid credentials')
        
        if user.check_password(password):
            # Generate a JWT token with the user's ID in the payload
            payload = {
                "id": str(user.id),
                "exp": datetime.now(timezone.utc) + timedelta(days=1)  # Token expires in 1 day
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
            return ObtainJSONWebTokenWithEmail(token=token)
        else:
            raise GraphQLError("Invalid email or Password")

        
    # Custom Authentication Backend for MongoEngine User Model
class MongoEngineBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=email)
            print("User Found:", user.email)  # Debugging statement
            if user.check_password(password):
                print("Password Verified")  # Debugging statement
                return user
            else:
                print("Invalid Password")  # Debugging statement
        except User.DoesNotExist:
            print("User Not Found")  # Debugging statement
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
# GraphQL Types
class UserType(MongoengineObjectType):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "address", "bio", "occupation", "expertise", "user_type")

# Queries
class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    mentors = graphene.List(UserType)
    mentor = graphene.Field(UserType, id=graphene.ID(required=True))
    me = graphene.Field(UserType)

    def resolve_me(self, info):
        # Authenticate the user using the custom function
        user = get_authenticated_user(info.context)
        return user

    def resolve_users(self, info):
    # Authenticate the user
        authenticated_user = get_authenticated_user(info.context)
    
    # Ensure the authenticated user is staff
        if not authenticated_user.is_staff:
            raise GraphQLError('Not authorized')
    
    # Return all users
        return User.objects.all()


    def resolve_mentors(self, info):
    # Authenticate the user
        authenticated_user = get_authenticated_user(info.context)
    
    # Return all mentors
        return User.objects.filter(user_type='mentor')
    
    def resolve_mentor(self, info, id):
    # Authenticate the user
        authenticated_user = get_authenticated_user(info.context)
    
        try:
        # Fetch the mentor by ID
            return User.objects.get(id=id, user_type='mentor')
        except User.DoesNotExist:
            raise GraphQLError('Mentor not found')

# Mutations
class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        address = graphene.String(required=True)
        bio = graphene.String()
        occupation = graphene.String()
        expertise = graphene.String()

    def mutate(self, info, first_name, last_name, email, password, address, bio='', occupation='', expertise=''):
        existing_user = User.objects(email=email).first()
        if existing_user:
            raise Exception('User with this email already exists')

        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            address=address,
            bio=bio,
            occupation=occupation,
            expertise=expertise
        )
        user.set_password(password)
        user.save()
        return CreateUser(user=user)

class ChangeToMentor(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        user_id = graphene.ID(required=True)  # Only userId is required

    def mutate(self, info, user_id):
        # Authenticate the user
        authenticated_user = get_authenticated_user(info.context)
        
        # Ensure the authenticated user is staff
        if not authenticated_user.is_staff:
            raise GraphQLError('Not authorized')

        try:
            # Fetch the user to be updated
            user = User.objects.get(id=user_id)
            
            # Ensure the user is currently a mentee
            if user.user_type != 'mentee':
                raise GraphQLError('User is not a mentee')
            
            # Update the user_type to mentor
            user.user_type = 'mentor'
            user.save()
            
            return ChangeToMentor(user=user)
        except User.DoesNotExist:
            raise GraphQLError('User not found')
        
class UpdateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        first_name = graphene.String()
        last_name = graphene.String()
        address = graphene.String()
        bio = graphene.String()
        occupation = graphene.String()
        expertise = graphene.String()

    def mutate(self, info, **kwargs):
        # Authenticate the user using the custom function
        user = get_authenticated_user(info.context)

        # Update user fields
        for key, value in kwargs.items():
            if value is not None:
                setattr(user, key, value)
        
        user.save()
        return UpdateUser(user=user)

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    update_user = UpdateUser.Field()    
    change_to_mentor = ChangeToMentor.Field()
    token_auth = ObtainJSONWebTokenWithEmail.Field()  # Use the custom mutatio
    verify_token = Verify.Field()  # Add this to verify tokens
    refresh_token = Refresh.Field()  # Add this to refresh tokens

schema = graphene.Schema(query=Query, mutation=Mutation)