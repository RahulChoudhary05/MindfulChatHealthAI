#!/bin/bash

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate

# Install dependencies
pip install -r requirements.txt

# Create nltk_data directory
mkdir -p nltk_data

# Download NLTK data
python -c "import nltk; nltk.download('punkt', download_dir='nltk_data'); nltk.download('stopwords', download_dir='nltk_data'); nltk.download('vader_lexicon', download_dir='nltk_data')"

echo "Setup complete! Run '.\venv\Scripts\Activate' to activate the virtual environment, then 'python app.py' to start the server."
