import os
from pathlib import Path
from dotenv import load_dotenv
from mongoengine import connect
from urllib.parse import quote_plus
from datetime import timedelta

# Load environment variables
load_dotenv()

# Escape username and password
username = quote_plus(os.environ.get('MONGO_USERNAME', ''))
password = quote_plus(os.environ.get('MONGO_PASSWORD', ''))

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# MongoDB connection settings
MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME', 'free_mentors_db')
MONGO_HOST = os.environ.get('MONGO_HOST', 'mongodb')  # Use 'mongodb' as the host in Docker
MONGO_PORT = int(os.environ.get('MONGO_PORT', 27017))  # Default MongoDB port

# Construct the MongoDB URI
MONGO_URI = f"mongodb://{username}:{password}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB_NAME}?authSource=admin"

# MongoEngine Connection
connect(
    db=MONGO_DB_NAME,
    host=MONGO_URI,
    port=MONGO_PORT,
)

# Django settings
SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'  # Ensure DEBUG is a boolean

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'web']  # Add 'web' for Docker

# GraphQL JWT settings
GRAPHQL_JWT = {
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_EXPIRATION_DELTA': timedelta(days=1),
    'JWT_ALLOW_REFRESH': True,
}

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            # If you have custom template directories, add them here
            # Example: BASE_DIR / 'templates'
        ],
        'APP_DIRS': True,  # This tells Django to search for templates inside each app
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database settings (for Django's dummy backend)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.dummy',  # Use the dummy backend
        'NAME': 'free_mentors_db',             # Name of your MongoDB database
    }
}


GRAPHENE = {
    "SCHEMA": "users.schema.schema",
    "MIDDLEWARE": [
        "graphql_jwt.middleware.JSONWebTokenMiddleware",
    ],
}

GRAPHQL_JWT = {
    "JWT_SECRET_KEY":"123abc",
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_EXPIRATION_DELTA': timedelta(days=1),
    'JWT_ALLOW_REFRESH': True,
}

# Add mongoengine settings



INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'graphql_jwt',
    'graphene_django',
    'corsheaders',
    'users',
    'mentorship',
    'reviews',
]
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',  # Correct placement here
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]



AUTHENTICATION_BACKENDS = [
    'users.schema.MongoEngineBackend',  # Path to the custom backend
    'graphql_jwt.backends.JSONWebTokenBackend',
    'django.contrib.auth.backends.ModelBackend',
]
STATIC_URL = '/static/'

ROOT_URLCONF = 'mentor_app.urls'

# SESSION_ENGINE = 'mongoengine.django.sessions'  
# Store sessions in MongoDB
