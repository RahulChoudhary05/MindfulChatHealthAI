# MindfulChat - AI-Powered Mental Health Chatbot 🌟  

MindfulChat is your 24/7 **AI-powered mental health chatbot** designed to provide emotional support, coping strategies, and resources. Whether you’re looking to process emotions, manage stress, or find a supportive companion, MindfulChat offers a safe and empathetic space to guide you through your mental health journey.

---

## 🚀 Features  

### 🌟 **Core Functionalities**  
- **User Chat Interface**: A simple and interactive chat module for simulated conversation.  
- **Sentiment Analysis**: AI-powered emotional analysis to generate appropriate and empathetic responses.  
- **Resource Recommendations**: Articles, exercises, and self-help tools tailored to user input.  
- **Crisis Detection & Management**: Directs users in distress to local mental health services and hotlines.  
- **Anonymous User Data**: Optionally gathers anonymized data to improve response quality.  

---

## 🛠️ Technology Stack  

| **Category**               | **Technology**                               |
|-----------------------------|-----------------------------------------------|
| **Frontend**               | React.js, Tailwind CSS                       |
| **Backend**                | Node.js with Express.js                      |
| **Database**               | MongoDB (NoSQL database)                     |
| **AI Components (aipython)** | TensorFlow.py, NLTK, Dialogflow, Rasa        |
| **Styling**                | Tailwind CSS for modern and responsive UI    |

---

## 🌈 Branding & Design Preferences  

- **Color Palette**: Soft blues (#E0F2F7), gentle greens (#E8F5E9), warm yellows (#FFFDE7), and light purples (#F3E5F5).  
- **Typography**: Modern, easy-to-read fonts like Roboto or Open Sans.  
- **Interface**: Clean, minimalistic, mobile-friendly design with appropriately styled chat bubbles.  

---

## 📋 Pages Overview  

1. `LandingPage.jsx`: Main page introducing MindfulChat.  
2. `ChatHistoryPage.jsx`: Allows users to view previous interactions.  
3. `JournalPage.jsx`: A private space for tracking emotions and thoughts.  
4. `MoodChartPage.jsx`: Visualized insights into a user’s mood over time.  
5. `BreathingPage.jsx`: Guided breathing techniques for stress management.  
6. `MeditationPage.jsx`: Offers mindfulness exercises and meditations.  
7. `ResourcesPage.jsx`: Articles, worksheets, and curated mental health tools.  
8. `ProfilePage.jsx`: (Optional) User profiles for personal customization.  
9. `PrivacyPage.jsx`: Details MindfulChat’s secure data-handling practices.  
10. `AboutPage.jsx`: Highlights the mission and purpose behind MindfulChat.

---

## 🔧 Getting Started  

Follow these instructions to set up and run MindfulChat on your local machine.  

### Prerequisites  
Make sure you have the latest versions of **Node.js**, **Python 3.x**, and **MongoDB** installed.  

---

### 🌟 1. Clone the Repository  
```bash
git clone https://github.com/your-username/MindfulChat.git
cd MindfulChat
```

---

### 🌟 2. Setup the Frontend  

Navigate to the `frontend` folder and install the required packages:  
```bash
cd frontend
npm install
```

Start the React development server (default port: **4001**):  
```bash
npm start
```

---

### 🌟 3. Setup the Backend  

Navigate to the `backend` folder and install the required packages:  
```bash
cd backend
npm install
```

Start the Node.js backend server (default port: **4000**):  
```bash
npm start
```

---

### 🌟 4. Setup the Python Sentiment Service  

Navigate to the `aipython` folder to initialize the chatbot’s AI processes:  
```bash
cd aipython
pip install -r requirements.txt
```

Run the Python AI service on port **5000**:  
```bash
python app.py
```

---

## 🌐 How MindfulChat Services Work Together  

| Service            | Port  | Description                                   |
|---------------------|-------|-----------------------------------------------|
| **Frontend**       | 4001  | React.js-based chat interface for users       |
| **Backend**        | 4000  | Node.js APIs to manage user inputs and processing |
| **aipython**     | 5000  | Python-powered NLP service for chatbot responses |

### Communication Flow:  
1. The **frontend** sends user queries to the **backend** (Node.js).  
2. The **backend** sends requests to the **Python AI service** (sentiment analysis/chat processing).  
3. The AI service generates appropriate responses and sends them back via the backend to the frontend.  

---

## 🧠 Architecture Overview  

```plaintext
MindfulChat
├── Frontend
│   ├── React Components (e.g., Chat Interface, Resource Pages)
│   ├── Tailwind CSS for Styling
│   └── Responsive Design
├── Backend
│   ├── Node.js with Express.js (API Handling)
│   └── MongoDB (Data Storage)
├── aipython
│   ├── TensorFlow.py and NLTK (Sentiment Analysis)
│   ├── Dialogflow or Rasa (Chatbot Logic)
│   └── Crisis Response Logic
```

---

## 🚨 Crisis Support Disclaimer  

MindfulChat is **not a substitute** for professional therapy. If you are in immediate distress or experiencing a crisis, please contact your **local mental health hotline** or seek professional help immediately. The chatbot is designed to offer **emotional support** and **recommend resources**, but it cannot replace medical or therapeutic services.

---

## 🙌 Contributing  

We welcome contributions to enhance MindfulChat!  

### How to Contribute:  
1. **Fork** the repository.  
2. Create a **new branch** for your feature (`git checkout -b feature-branch`).  
3. Make your changes and **commit** them (`git commit -m 'Add feature X'`).  
4. Push to your branch (`git push origin feature-branch`).  
5. Open a **Pull Request**.  

### Areas for Contribution:  
- Improving sentiment analysis accuracy.  
- Adding more languages for multilingual support.  
- Extending chatbot features (e.g., voice integration, advanced crisis management tools).  

---

## 🧩 Future Enhancements  

- **Voice Interaction**: Add voice-based communication for accessibility.  
- **Wearable Integration**: Connect with wellness devices for personalized insights.  
- **Cultural Context Support**: Improving responses to cater to diverse cultural backgrounds.  
- **Professional Portal**: Allow therapists to integrate MindfulChat insights into care plans.  

---

### ⭐️ Show Your Support  

If you find MindfulChat useful, please give this repository a ⭐️ on GitHub! Your support helps us grow and continue to make a difference in mental health care. ❤️  

---  

**Created with ❤️ by the MindfulChat Team - Rahul Choudhary** 🎉
