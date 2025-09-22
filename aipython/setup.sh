#!/bin/bash

# Install dependencies into Render's managed environment
pip install -r requirements.txt

# Ensure nltk_data directory exists
mkdir -p nltk_data

# Download NLTK data
python -c "import nltk; nltk.download('punkt', download_dir='nltk_data'); nltk.download('stopwords', download_dir='nltk_data'); nltk.download('vader_lexicon', download_dir='nltk_data')"

echo "Setup complete! Starting Flask app..."

# Start the Flask app
python app.py
