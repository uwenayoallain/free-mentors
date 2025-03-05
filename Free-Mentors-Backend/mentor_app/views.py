# In your app's views.py (e.g., mentor_app/views.py)
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Free Mentors Backend!")
