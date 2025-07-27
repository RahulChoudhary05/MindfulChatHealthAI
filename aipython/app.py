from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
import os
import datetime
import re
from dotenv import load_dotenv
import nltk
import ssl
import json
import random
import string
import logging

# Load environment variables
load_dotenv()

# Download NLTK resources
nltk_data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nltk_data')
os.makedirs(nltk_data_dir, exist_ok=True)
nltk.data.path.append(nltk_data_dir)

try:
    # Try to disable SSL verification for NLTK downloads
    try:
        _create_unverified_https_context = ssl._create_unverified_context
    except AttributeError:
        pass
    else:
        ssl._create_default_https_context = _create_unverified_https_context
    
    # Download required NLTK data
    for package in ['punkt', 'stopwords', 'vader_lexicon']:
        try:
            nltk.download(package, download_dir=nltk_data_dir, quiet=True)
        except Exception as e:
            # Continue even if download fails - we'll use fallback methods
            pass
except Exception as e:
    pass

app = Flask(__name__)
CORS(app)

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET')  # Use the JWT secret from .env
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
jwt = JWTManager(app)

# Connect to MongoDB
mongo_uri = os.environ.get('MONGODB_URI')  # Use the MongoDB URI from .env
client = MongoClient(mongo_uri)
db = client.get_database()


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("main")

# Initialize simple sentiment analyzer
def simple_sentiment_analysis(text):
    """
    A simple rule-based sentiment analyzer that doesn't rely on NLTK
    """
    # Convert to lowercase
    text = text.lower()
    
    # Define positive and negative word lists
    positive_words = [
        'happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'love', 'enjoy',
        'pleased', 'delighted', 'glad', 'thankful', 'grateful', 'excited', 'hopeful',
        'better', 'positive', 'calm', 'relaxed', 'peaceful', 'confident'
    ]
    
    negative_words = [
        'sad', 'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'angry',
        'upset', 'disappointed', 'frustrated', 'annoyed', 'worried', 'anxious', 'stressed',
        'depressed', 'unhappy', 'miserable', 'lonely', 'afraid', 'scared', 'hopeless',
        'worthless', 'tired', 'exhausted', 'pain', 'hurt', 'sick', 'worse', 'negative'
    ]
    
    # Count occurrences
    positive_count = sum(1 for word in positive_words if re.search(r'\b' + word + r'\b', text))
    negative_count = sum(1 for word in negative_words if re.search(r'\b' + word + r'\b', text))
    
    # Calculate sentiment score
    if positive_count > negative_count:
        sentiment = 'positive'
        compound_score = 0.5 + (0.5 * (positive_count - negative_count) / (positive_count + negative_count + 1))
    elif negative_count > positive_count:
        sentiment = 'negative'
        compound_score = -0.5 - (0.5 * (negative_count - positive_count) / (positive_count + negative_count + 1))
    else:
        sentiment = 'neutral'
        compound_score = 0.0
    
    return {
        'sentiment': sentiment,
        'compound_score': compound_score,
        'positive_score': positive_count / (positive_count + negative_count + 1),
        'negative_score': negative_count / (positive_count + negative_count + 1),
        'neutral_score': 1 - (positive_count + negative_count) / (len(text.split()) + 1)
    }

# Simple keyword extraction
def extract_keywords(text, max_keywords=10):
    """
    Extract keywords from text without using NLTK
    """
    # Convert to lowercase and split
    words = text.lower().split()
    
    # Remove common stop words
    stop_words = {
        'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 
        'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 
        'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 
        'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 
        'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
        'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 
        'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 
        'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
        'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
        'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 
        'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 
        'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 
        'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 
        't', 'can', 'will', 'just', 'don', 'should', 'now'
    }
    
    # Filter out stop words and non-alphanumeric words
    filtered_words = [word for word in words if word not in stop_words and word.isalnum()]
    
    # Count word frequencies
    word_freq = {}
    for word in filtered_words:
        if word in word_freq:
            word_freq[word] += 1
        else:
            word_freq[word] = 1
    
    # Sort by frequency
    sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    
    # Return top keywords
    return [word for word, freq in sorted_words[:max_keywords]]

# Simple emotion detection
def detect_emotions(text):
    """
    A simple rule-based emotion detector
    """
    text = text.lower()
    
    emotion_keywords = {
        'anxiety': ['anxious', 'worried', 'nervous', 'panic', 'fear', 'stress', 'tense', 'uneasy'],
        'sadness': ['sad', 'depressed', 'unhappy', 'miserable', 'down', 'blue', 'grief', 'sorrow'],
        'anger': ['angry', 'mad', 'frustrated', 'irritated', 'annoyed', 'furious', 'rage', 'hate'],
        'fear': ['afraid', 'scared', 'terrified', 'frightened', 'fearful', 'phobia', 'terror'],
        'joy': ['happy', 'joyful', 'excited', 'delighted', 'pleased', 'glad', 'content', 'cheerful'],
        'surprise': ['surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'unexpected'],
        'disgust': ['disgusted', 'repulsed', 'revolted', 'gross', 'nauseous', 'sickened'],
        'shame': ['ashamed', 'embarrassed', 'guilty', 'remorseful', 'regretful', 'humiliated'],
        'confusion': ['confused', 'puzzled', 'perplexed', 'unsure', 'uncertain', 'lost', 'disoriented'],
        'loneliness': ['lonely ', 'alone', 'isolated', 'abandoned', 'rejected', 'unwanted', 'solitary'],
        'frustration': ['frustrated', 'fed up', 'exasperated', 'irritated', 'annoyed'],
        'overwhelm': ['overwhelmed', 'stressed', 'burned out', 'exhausted'],
        'pain': ['pain', 'hurt', 'ache', 'sore', 'suffering', 'discomfort', 'agony']
    }
    
    detected_emotions = {}
    
    for emotion, keywords in emotion_keywords.items():
        count = sum(1 for keyword in keywords if re.search(r'\b' + keyword + r'\b', text))
        if count > 0:
            detected_emotions[emotion] = count
    
    # Return detected emotions as a dictionary
    return detected_emotions

# Load mental health resources
resources_file = 'resources.json'
if os.path.exists(resources_file):
    try:
        with open(resources_file, 'r') as f:
            resources_data = json.load(f)
    except Exception as e:
        resources_data = []
else:
    # Create default resources if file doesn't exist
    resources_data = [
        {
            "title": "Mindfulness Meditation Guide",
            "description": "A beginner's guide to mindfulness meditation practices",
            "url": "https://www.mindful.org/meditation/mindfulness-getting-started/",
            "type": "Article",
            "category": "Mindfulness",
            "tags": ["meditation", "mindfulness", "anxiety", "stress"]
        },
        {
            "title": "Depression Coping Strategies",
            "description": "Evidence-based strategies for managing depression symptoms",
            "url": "https://www.helpguide.org/articles/depression/coping-with-depression.htm",
            "type": "Guide",
            "category": "Depression",
            "tags": ["depression", "sadness", "coping", "self-care"]
        },
        {
            "title": "Anxiety Relief Techniques",
            "description": "Quick techniques to manage anxiety in the moment",
            "url": "https://www.anxietycanada.com/articles/new-thinking-patterns/",
            "type": "Exercise",
            "category": "Anxiety",
            "tags": ["anxiety", "stress", "panic", "breathing"]
        },
        {
            "title": "National Suicide Prevention Lifeline",
            "description": "24/7 support for people in distress",
            "url": "https://988lifeline.org/",
            "type": "Crisis Support",
            "category": "Crisis",
            "tags": ["crisis", "suicide", "emergency", "hotline"]
        },
        {
            "title": "Crisis Text Line",
            "description": "Text HOME to 741741 for crisis support",
            "url": "https://www.crisistextline.org/",
            "type": "Crisis Support",
            "category": "Crisis",
            "tags": ["crisis", "texting", "emergency", "support"]
        },
        {
            "title": "Pain Management Techniques",
            "description": "Non-medication approaches to managing physical pain",
            "url": "https://www.healthline.com/health/pain-management-techniques",
            "type": "Guide",
            "category": "Pain",
            "tags": ["pain", "physical", "management", "relief"]
        }
    ]
    try:
        with open(resources_file, 'w') as f:
            json.dump(resources_data, f, indent=2)
    except Exception as e:
        pass

# Crisis detection keywords
crisis_keywords = [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'harm myself', 'self harm', 'hurt myself', 'no reason to live',
    'better off dead', 'can\'t go on', 'give up', 'end it all'
]

# Response templates
response_templates = {
    'greeting': [
        "Hello! I'm here to support you. How are you feeling today?",
        "Hi there! I'm your mental health assistant. How can I help you today?",
        "Welcome! I'm here to listen and provide support. What's on your mind?"
    ],
    'positive': [
        "That's wonderful to hear! What's been contributing to your positive feelings?",
        "I'm glad you're feeling good! Would you like to talk about what's going well?",
        "It's great that you're in a positive state. How can I help maintain this momentum?"
    ],
    'negative': [
        "I'm sorry to hear you're feeling this way. Would you like to talk more about what's troubling you?",
        "That sounds difficult. Remember that it's okay to feel this way, and I'm here to listen.",
        "I understand this is hard. Would it help to explore some coping strategies together?"
    ],
    'neutral': [
        "How else can I support you today?",
        "Is there anything specific you'd like to discuss or learn about?",
        "I'm here to help. What would be most useful for you right now?"
    ],
    'crisis': [
        "I'm concerned about what you've shared. If you're in immediate danger, please call 988 (National Suicide Prevention Lifeline) or text HOME to 741741 (Crisis Text Line). These services have trained counselors available 24/7.",
        "Your safety is important. Please reach out to emergency services or a crisis helpline like 988 right away. Would you like me to provide more crisis resources?",
        "This sounds serious, and I want to make sure you get the help you need. Please contact a crisis service like 988 or go to your nearest emergency room. Is there someone nearby who can support you right now?"
    ],
    'pain': [
        "I'm sorry to hear you're experiencing pain. Physical discomfort can be challenging to deal with. Have you spoken with a healthcare provider about this?",
        "Physical pain can be difficult to manage. While I can't provide medical advice, I can suggest some relaxation techniques that might help alongside professional care.",
        "I understand that pain can be overwhelming. It's important to consult with a healthcare professional for proper diagnosis and treatment. Would you like some general information about pain management strategies?"
    ]
}

# Coping strategies by emotion
coping_strategies = {
    'anxiety': [
        "Try deep breathing: Inhale for 4 counts, hold for 2, exhale for 6.",
        "Practice the 5-4-3-2-1 grounding technique: Acknowledge 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste.",
        "Progressive muscle relaxation can help reduce physical tension."
    ],
    'sadness': [
        "Consider journaling about your feelings to process them.",
        "Reach out to a trusted friend or family member for support.",
        "Engage in a small activity that usually brings you joy, even if you don't feel like it at first."
    ],
    'anger': [
        "Take a short timeout to cool down before responding.",
        "Physical activity like a brisk walk can help release tension.",
        "Try to identify the underlying cause of your anger - sometimes it masks other emotions."
    ],
    'stress': [
        "Break large tasks into smaller, manageable steps.",
        "Practice mindfulness meditation for 5-10 minutes.",
        "Ensure you're meeting basic needs: adequate sleep, nutrition, and hydration."
    ],
    'fear': [
        "Write down your fears and evaluate how realistic they are.",
        "Focus on what you can control in the situation.",
        "Visualization techniques can help - imagine yourself successfully handling the feared situation."
    ],
    'loneliness': [
        "Consider joining a community group or online forum related to your interests.",
        "Schedule regular check-ins with friends or family, even if they're brief.",
        "Volunteer for a cause you care about - helping others can create meaningful connections."
    ],
    'confusion': [
        "Take a step back and write down what you know and what you're unsure about.",
        "Break complex problems into smaller, more manageable parts.",
        "Consider talking through your thoughts with someone you trust to gain perspective."
    ],
    'pain': [
        "Gentle stretching or movement may help with some types of pain, but always check with your doctor first.",
        "Mindfulness meditation can help change your relationship with pain, even if it doesn't eliminate it.",
        "Distraction techniques like engaging in an absorbing activity can temporarily shift focus away from pain."
    ]
}

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"message": "Missing required fields"}), 400
    
    # Check if email already exists
    if db.users.find_one({"email": data['email']}):
        return jsonify({"message": "Email already registered"}), 400
    
    # Validate email format
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, data['email']):
        return jsonify({"message": "Invalid email format"}), 400
    
    # Validate password strength
    if len(data['password']) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400
    
    # Create user
    new_user = {
        "name": data['name'],
        "email": data['email'],
        "password": generate_password_hash(data['password']),
        "createdAt": datetime.datetime.utcnow(),
        "preferences": {
            "notifications": True,
            "language": "English",
            "theme": "light"
        }
    }
    
    result = db.users.insert_one(new_user)
    
    # Create access token
    access_token = create_access_token(identity=str(result.inserted_id))
    
    return jsonify({
        "message": "User registered successfully",
        "token": access_token,
        "user": format_user(new_user)
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Missing email or password"}), 400
    
    # Find user
    user = db.users.find_one({"email": data['email']})
    
    # Check if user exists and password is correct
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({"message": "Invalid email or password"}), 401
    
    # Create access token
    access_token = create_access_token(identity=str(user['_id']))
    
    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": format_user(user)
    }), 200

@app.route('/api/users/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    
    # Find user
    user = db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    return jsonify(format_user(user)), 200

@app.route('/api/users/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Find user
    user = db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Update fields
    updates = {}
    
    if 'name' in data:
        updates['name'] = data['name']
    
    if 'email' in data:
        # Check if email is already taken by another user
        existing_user = db.users.find_one({"email": data['email']})
        if existing_user and str(existing_user['_id']) != user_id:
            return jsonify({"message": "Email already in use"}), 400
        
        # Validate email format
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, data['email']):
            return jsonify({"message": "Invalid email format"}), 400
        
        updates['email'] = data['email']
    
    if 'bio' in data:
        updates['bio'] = data['bio']
    
    if 'preferences' in data:
        updates['preferences'] = data['preferences']
    
    # Update user
    if updates:
        db.users.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
        
        # Get updated user
        updated_user = db.users.find_one({"_id": ObjectId(user_id)})
        return jsonify(format_user(updated_user)), 200
    
    return jsonify(format_user(user)), 200

@app.route('/api/users/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('currentPassword') or not data.get('newPassword'):
        return jsonify({"message": "Missing required fields"}), 400
    
    # Find user
    user = db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Check current password
    if not check_password_hash(user['password'], data['currentPassword']):
        return jsonify({"message": "Current password is incorrect"}), 401
    
    # Validate new password
    if len(data['newPassword']) < 6:
        return jsonify({"message": "New password must be at least 6 characters"}), 400
    
    # Update password
    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password": generate_password_hash(data['newPassword'])}}
    )
    
    return jsonify({"message": "Password updated successfully"}), 200

@app.route('/api/users/profile', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    
    # Find user
    user = db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Delete user's data
    db.chats.delete_many({"userId": ObjectId(user_id)})
    db.journal_entries.delete_many({"userId": ObjectId(user_id)})
    db.mood_entries.delete_many({"userId": ObjectId(user_id)})
    db.interaction_logs.delete_many({"userId": ObjectId(user_id)})
    db.sessions.delete_many({"userId": ObjectId(user_id)})
    
    # Delete user
    db.users.delete_one({"_id": ObjectId(user_id)})
    
    return jsonify({"message": "Account deleted successfully"}), 200

@app.route('/api/users/upload-avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    user_id = get_jwt_identity()
    
    # Check if file is in request
    if 'avatar' not in request.files:
        return jsonify({"message": "No file provided"}), 400
    
    file = request.files['avatar']
    
    # Check if file is empty
    if file.filename == '':
        return jsonify({"message": "No file selected"}), 400
    
    # In a real app, you would upload to cloud storage and get a URL
    # For this example, we'll simulate by storing a placeholder URL
    avatar_url = f"/uploads/avatars/{user_id}_{file.filename}"
    
    # Update user's avatar
    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"avatar": avatar_url}}
    )
    
    return jsonify({
        "message": "Avatar uploaded successfully",
        "avatarUrl": avatar_url
    }), 200

@app.route('/api/users/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    user_id = get_jwt_identity()
    
    # Find user
    user = db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Get stats
    journal_count = db.journal_entries.count_documents({"userId": ObjectId(user_id)})
    
    # Get meditation minutes
    meditation_sessions = list(db.sessions.find({"userId": ObjectId(user_id), "type": "meditation"}))
    meditation_minutes = sum(session.get('duration', 0) for session in meditation_sessions)
    
    # Get breathing exercises
    breathing_exercises = db.sessions.count_documents({"userId": ObjectId(user_id), "type": "breathing"})
    
    # Get chat interactions
    chat_interactions = db.interaction_logs.count_documents({"userId": ObjectId(user_id), "type": "chat"})
    
    # Get recent activities
    recent_activities = list(db.interaction_logs.find(
        {"userId": ObjectId(user_id)},
        {"_id": 0, "type": 1, "description": 1, "timestamp": 1}
    ).sort("timestamp", -1).limit(10))
    
    # Format timestamps
    for activity in recent_activities:
        activity["timestamp"] = activity["timestamp"].isoformat()
    
    stats = {
        "journalEntries": journal_count,
        "meditationMinutes": meditation_minutes,
        "breathingExercises": breathing_exercises,
        "chatInteractions": chat_interactions,
        "recentActivities": recent_activities
    }
    
    return jsonify(stats), 200

@app.route('/api/chats', methods=['GET'])
@jwt_required()
def get_chat_history():
    user_id = get_jwt_identity()
    
    # Pagination
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    skip = (page - 1) * limit
    
    # Search filter
    search = request.args.get('search', '')
    date_filter = request.args.get('date')
    
    # Build query
    query = {"userId": ObjectId(user_id)}
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"messages.content": {"$regex": search, "$options": "i"}}
        ]
    
    if date_filter:
        date_obj = datetime.datetime.fromisoformat(date_filter.replace('Z', '+00:00'))
        start_of_day = datetime.datetime.combine(date_obj.date(), datetime.time.min)
        end_of_day = datetime.datetime.combine(date_obj.date(), datetime.time.max)
        query["createdAt"] = {"$gte": start_of_day, "$lte": end_of_day}
    
    # Get chats
    total = db.chats.count_documents(query)
    chats = list(db.chats.find(query).sort("updatedAt", -1).skip(skip).limit(limit))
    
    # Format chats
    formatted_chats = [format_chat(chat) for chat in chats]
    
    return jsonify({
        "chats": formatted_chats,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": (total + limit - 1) // limit
    }), 200

@app.route('/api/chats/<chat_id>', methods=['GET'])
@jwt_required()
def get_chat(chat_id):
    user_id = get_jwt_identity()
    
    try:
        # Find chat
        chat = db.chats.find_one({
            "_id": ObjectId(chat_id),
            "userId": ObjectId(user_id)
        })
        
        if not chat:
            return jsonify({"message": "Chat not found"}), 404
        
        return jsonify(format_chat(chat)), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@app.route('/api/chats/message', methods=['POST'])
@jwt_required()
def send_message():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('message'):
        return jsonify({"message": "Message is required"}), 400
    
    user_message = data['message']
    
    # Check if continuing existing chat
    chat_id = data.get('chatId')
    
    if chat_id:
        try:
            # Find existing chat
            chat = db.chats.find_one({
                "_id": ObjectId(chat_id),
                "userId": ObjectId(user_id)
            })
            
            if not chat:
                return jsonify({"message": "Chat not found"}), 404
        except:
            return jsonify({"message": "Invalid chat ID"}), 400
    
    # Process message with AI
    # In a real app, you would call your AI service here
    # For this example, we'll use a simple response
    
    # Analyze sentiment
    sentiment = simple_sentiment_analysis(user_message)
    
    # Generate response based on sentiment
    if sentiment["sentiment"] == 'positive':
        ai_response = "I'm glad you're feeling positive! How can I help you further?"
    elif sentiment["sentiment"] == 'negative':
        ai_response = "I'm sorry to hear you're feeling this way. Would you like to talk about it more or explore some coping strategies?"
    else:
        ai_response = "Thank you for sharing. Is there anything specific you'd like to discuss or learn about?"
    
    # Create message objects
    timestamp = datetime.datetime.utcnow()
    user_message_obj = {
        "role": "user",
        "content": user_message,
        "timestamp": timestamp
    }
    
    ai_message_obj = {
        "role": "assistant",
        "content": ai_response,
        "timestamp": timestamp + datetime.timedelta(seconds=1)
    }
    
    # Update or create chat
    if chat_id:
        # Update existing chat
        db.chats.update_one(
            {"_id": ObjectId(chat_id)},
            {
                "$push": {"messages": {"$each": [user_message_obj, ai_message_obj]}},
                "$set": {"updatedAt": timestamp}
            }
        )
        
        # Get updated chat
        updated_chat = db.chats.find_one({"_id": ObjectId(chat_id)})
        
        # Update summary if needed
        if len(updated_chat["messages"]) % 5 == 0:  # Update summary every 5 messages
            summary = generate_chat_summary(updated_chat["messages"])
            db.chats.update_one(
                {"_id": ObjectId(chat_id)},
                {"$set": {"summary": summary}}
            )
            updated_chat["summary"] = summary
        
        chat_response = format_chat(updated_chat)
    else:
        # Create new chat
        # Generate title from first message
        title = user_message[:30] + "..." if len(user_message) > 30 else user_message
        
        new_chat = {
            "userId": ObjectId(user_id),
            "title": title,
            "messages": [user_message_obj, ai_message_obj],
            "createdAt": timestamp,
            "updatedAt": timestamp
        }
        
        # Generate summary
        summary = generate_chat_summary([user_message_obj, ai_message_obj])
        new_chat["summary"] = summary
        
        # Insert new chat
        result = db.chats.insert_one(new_chat)
        
        # Get created chat
        created_chat = db.chats.find_one({"_id": result.inserted_id})
        chat_response = format_chat(created_chat)
    
    # Log interaction
    interaction_log = {
        "userId": ObjectId(user_id),
        "type": "chat",
        "description": "Had a conversation with MindfulChat ",
        "timestamp": timestamp
    }
    db.interaction_logs.insert_one(interaction_log)
    
    return jsonify({
        "message": "Message sent successfully",
        "chat": chat_response
    }), 200

@app.route('/api/chats/<chat_id>', methods=['DELETE'])
@jwt_required()
def delete_chat(chat_id):
    user_id = get_jwt_identity()
    
    try:
        # Find and delete chat
        result = db.chats.delete_one({
            "_id": ObjectId(chat_id),
            "userId": ObjectId(user_id)
        })
        
        if result.deleted_count == 0:
            return jsonify({"message": "Chat not found"}), 404
        
        return jsonify({"message": "Chat deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@app.route('/api/analyze', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.json
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Simple sentiment analysis
        sentiment_scores = simple_sentiment_analysis(message)
        
        # Extract keywords
        keywords = extract_keywords(message)
        
        # Detect emotions
        emotions = detect_emotions(message)
        
        # Check for crisis keywords
        is_crisis = any(keyword in message.lower() for keyword in crisis_keywords)
        
        result = {
            'sentiment': sentiment_scores['sentiment'],
            'compound_score': sentiment_scores['compound_score'],
            'positive_score': sentiment_scores['positive_score'],
            'negative_score': sentiment_scores['negative_score'],
            'neutral_score': sentiment_scores['neutral_score'],
            'keywords': keywords,
            'emotions': emotions,
            'is_crisis': is_crisis
        }
        
        logger.info(f"Analyzed sentiment: {sentiment_scores['sentiment']} (score: {sentiment_scores['compound_score']})")
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in sentiment analysis: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/process', methods=['POST'])
def process_message():
    try:
        data = request.json
        message = data.get('message', '')
        user_id = data.get('userId', 'anonymous')
        is_crisis = data.get('isCrisis', False)
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Simple sentiment analysis
        sentiment_scores = simple_sentiment_analysis(message)
        sentiment = sentiment_scores['sentiment']
        
        # Extract keywords
        keywords = extract_keywords(message)
        
        # Detect emotions
        emotions = detect_emotions(message)
        
        # Check for crisis keywords if not already provided
        if not is_crisis:
            is_crisis = any(keyword in message.lower() for keyword in crisis_keywords)
        
        # Determine primary emotion
        primary_emotion = None
        if emotions:
            # Use the first emotion from detected emotions
            primary_emotion = max(emotions, key=emotions.get)  # Get the emotion with the highest count
        else:
            primary_emotion = None
        
        # Generate response based on sentiment and context
        response = generate_response(message, sentiment, primary_emotion, is_crisis)
        
        # Get relevant resources
        relevant_resources = get_relevant_resources(message, sentiment, primary_emotion, is_crisis, keywords)
        
        result = {
            'response': response,
            'resources': relevant_resources,
            'sentiment': sentiment,
            'is_crisis': is_crisis,
            'keywords': keywords,
            'emotions': emotions
        }
        
        # Log the interaction
        logger.info(f"Processed message from {user_id}: sentiment={sentiment}, is_crisis={is_crisis}")
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        return jsonify({
            'error': str(e), 
            'response': "I'm sorry, I encountered an error processing your message. How else can I help you?",
            'resources': get_relevant_resources("", "neutral", None, False, [])
        }), 500

def generate_response(message, sentiment, primary_emotion=None, is_crisis=False):
    # Check for greeting patterns
    greeting_words = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening']
    if any(greeting in message.lower() for greeting in greeting_words) and len(message.split()) < 5:
        return random.choice(response_templates['greeting'])
    
    # Check for crisis indicators
    if is_crisis:
        return random.choice(response_templates['crisis'])
    
    # Check for pain-related messages
    if any(word in message.lower() for word in ['pain', 'hurt', 'ache', 'sore', 'suffering']):
        return random.choice(response_templates['pain'])
    
    # Generate response based on sentiment
    base_response = random.choice(response_templates[sentiment])
    
    # Add coping strategy if negative emotion is detected
    coping_strategy = ""
    if sentiment == 'negative' and primary_emotion:
        emotion_key = primary_emotion
        # Map emotion to our coping strategy keys
        emotion_mapping = {
            'anxiety': 'anxiety',
            'sadness': 'sadness',
            'anger': 'anger',
            'fear': 'fear',
            'stress': 'stress',
            'loneliness': 'loneliness',
            'confusion': 'confusion',
            'depression': 'sadness',
            'overwhelm': 'stress',
            'pain': 'pain'
        }
        
        if primary_emotion in emotion_mapping:
            emotion_key = emotion_mapping[primary_emotion]
        
        if emotion_key in coping_strategies:
            coping_strategy = f"\n\nHere's a strategy that might help: {random.choice(coping_strategies[emotion_key])}"
        else:
            coping_strategy = f"\n\nHere's a strategy that might help: {random.choice(coping_strategies['stress'])}"
    
    # Specific response for requests to sing
    if "sing" in message.lower():
        return "I can't sing, but I can share some uplifting music recommendations or guided meditations to help you relax!"

    return base_response + coping_strategy

def get_relevant_resources(message, sentiment, primary_emotion=None, is_crisis=False, keywords=None):
    if keywords is None:
        keywords = []
    
    # Filter resources based on keywords and emotion
    relevant_resources = []
    
    for resource in resources_data:
        # Check if resource tags match keywords or emotion
        resource_tags = [tag.lower() for tag in resource.get('tags', [])]
        
        if any(keyword in resource_tags for keyword in keywords) or (primary_emotion and primary_emotion.lower() in resource_tags):
            relevant_resources.append(resource)
    
    # If crisis is detected, add crisis resources
    if is_crisis:
        crisis_resources = [r for r in resources_data if 'crisis' in [tag.lower() for tag in r.get('tags', [])]]
        # Ensure no duplicates
        for resource in crisis_resources:
            if resource not in relevant_resources:
                relevant_resources.append(resource)
    
    # If pain is mentioned, add pain resources
    if any(word in message.lower() for word in ['pain', 'hurt', 'ache', 'sore', 'suffering']):
        pain_resources = [r for r in resources_data if 'pain' in [tag.lower() for tag in r.get('tags', [])]]
        for resource in pain_resources:
            if resource not in relevant_resources:
                relevant_resources.append(resource)
    
    # If no relevant resources found, add general resources based on sentiment
    if not relevant_resources:
        if sentiment == 'negative':
            # Add resources for common negative emotions
            negative_tags = ['anxiety', 'depression', 'stress', 'sadness']
            for resource in resources_data:
                resource_tags = [tag.lower() for tag in resource.get('tags', [])]
                if any(tag in resource_tags for tag in negative_tags):
                    relevant_resources.append(resource)
        else:
            # Add general wellbeing resources
            wellbeing_tags = ['mindfulness', 'self-care', 'meditation']
            for resource in resources_data:
                resource_tags = [tag.lower() for tag in resource.get('tags', [])]
                if any(tag in resource_tags for tag in wellbeing_tags):
                    relevant_resources.append(resource)
    
    # Limit to top 3 resources
    return relevant_resources[:3]

def format_user(user):
    """Format user document for response"""
    if user:
        return {
            "_id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "createdAt": user["createdAt"],
            "avatar": user.get("avatar"),
            "bio": user.get("bio"),
            "preferences": user.get("preferences", {})
        }
    return None

def format_chat(chat):
    """Format chat document for response"""
    if chat:
        return {
            "_id": str(chat["_id"]),
            "userId": str(chat["userId"]),
            "title": chat["title"],
            "messages": chat["messages"],
            "createdAt": chat["createdAt"],
            "updatedAt": chat["updatedAt"],
            "summary": chat.get("summary")
        }
    return None

def generate_chat_summary(messages):
    """Generate a summary for a chat conversation"""
    if not messages or len(messages) < 2:
        return "Brief conversation"
    
    # Combine user messages
    user_text = " ".join([msg["content"] for msg in messages if msg["role"] == "user"])
    
    # Extract keywords
    keywords = extract_keywords(user_text)
    
    # Analyze sentiment
    sentiment = simple_sentiment_analysis(user_text)
    
    # Determine overall sentiment
    if sentiment["compound_score"] >= 0.05:
        sentiment_label = "positive"
    elif sentiment["compound_score"] <= -0.05:
        sentiment_label = "negative"
    else:
        sentiment_label = "neutral"
    
    # Create summary
    if keywords:
        topic = ", ".join(keywords[:3])
        return f"Discussion about {topic} with {sentiment_label} sentiment"
    else:
        return f"Conversation with {sentiment_label} sentiment"

# Main entry point
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
