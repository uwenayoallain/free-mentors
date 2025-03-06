# mentor_app/schema.py
import graphene
import users.schema
import mentorship.schema
# import reviews.schema
from graphql_auth import mutations
from graphql_auth.schema import MeQuery

class Query(
    users.schema.Query, 
    mentorship.schema.Query,
    graphene.ObjectType
):
    pass

class Mutation(
    users.schema.Mutation,
    mentorship.schema.Mutation,
    
    graphene.ObjectType
):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)