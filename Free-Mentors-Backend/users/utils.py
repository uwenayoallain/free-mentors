import jwt
from graphql import GraphQLError
from django.conf import settings
from .models import User

def get_authenticated_user(context):
    auth_header = context.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise GraphQLError("Authentication required")

    token = auth_header.split("Bearer ")[1]

    try:
        # Decode the token using the SECRET_KEY from settings
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        
        # Fetch the user from the database using the ID in the token payload
        user = User.objects(id=payload["id"]).first()
        if not user:
            raise GraphQLError("Invalid token")
        
        return user
    except jwt.ExpiredSignatureError:
        raise GraphQLError("Token has expired")
    except jwt.DecodeError:
        raise GraphQLError("Invalid token")