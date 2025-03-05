import os
import socket
import mongoengine

def debug_mongodb_connection():
    # Detailed connection debugging
    print("MongoDB Connection Details:")
    print(f"MONGO_URI: {os.environ.get('MONGO_URI', 'mongodb://localhost:27017')}")
    print(f"MONGO_DB_NAME: {os.environ.get('MONGO_DB_NAME', 'free_mentors_db')}")
    
    # Check hostname resolution
    try:
        host = os.environ.get('MONGO_URI', 'localhost').replace('mongodb://', '')
        socket.gethostbyname(host)
        print(f"✓ Hostname {host} resolves successfully")
    except socket.gaierror:
        print(f"✗ Cannot resolve hostname: {host}")
    
    # Alternative connection method
    try:
        connection = mongoengine.connect(
            db=os.environ.get('MONGO_DB_NAME', 'free_mentors_db'),
            host=os.environ.get('MONGO_URI', 'mongodb://localhost:27017'),
            username=os.environ.get('MONGO_USERNAME', ''),
            password=os.environ.get('MONGO_PASSWORD', ''),
            port=27017,
            alias='default'
        )
        print("✓ MongoEngine connection successful")
        print(f"Connected to: {connection.address}")
    except Exception as e:
        print(f"✗ Connection Error: {e}")

# Recommended MongoDB URI formats
print("Recommended MongoDB URI Formats:")
print("1. Standard: mongodb://localhost:27017/free_mentors_db")
print("2. With Authentication: mongodb://username:password@localhost:27017/free_mentors_db")
print("3. Full Format: mongodb://username:password@host:port/database?authSource=admin")