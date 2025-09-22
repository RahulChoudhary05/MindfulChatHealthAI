python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
New-Item -ItemType Directory -Path nltk_data -ErrorAction SilentlyContinue
python -c "import nltk; nltk.download('punkt', download_dir='nltk_data'); nltk.download('stopwords', download_dir='nltk_data'); nltk.download('vader_lexicon', download_dir='nltk_data')"
Write-Output "Setup complete! Run '.\venv\Scripts\Activate' to activate the virtual environment, then 'python app.py' to start the server."
python app.py