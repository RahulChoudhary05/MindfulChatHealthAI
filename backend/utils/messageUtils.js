// Detect crisis keywords in a message
export const detectCrisisKeywords = (message) => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'harm myself', 'self harm', 'hurt myself', 'no reason to live',
    'better off dead', 'can\'t go on', 'give up', 'end it all'
  ];
  
  const messageLower = message.toLowerCase();
  const detectedKeywords = crisisKeywords.filter(keyword => 
    messageLower.includes(keyword)
  );
  
  return {
    isCrisis: detectedKeywords.length > 0,
    detectedKeywords
  };
};

// Extract potential emotions from message
export const extractEmotions = (message) => {
  const emotionKeywords = {
    anxiety: ['anxious', 'nervous', 'worried', 'panic', 'fear', 'stress', 'tense'],
    depression: ['depressed', 'sad', 'hopeless', 'empty', 'worthless', 'miserable'],
    anger: ['angry', 'mad', 'frustrated', 'irritated', 'annoyed', 'rage'],
    happiness: ['happy', 'joy', 'excited', 'pleased', 'content', 'grateful'],
    grief: ['grief', 'loss', 'mourning', 'missing', 'heartbroken']
  };
  
  const messageLower = message.toLowerCase();
  const detectedEmotions = {};
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    const matches = keywords.filter(keyword => messageLower.includes(keyword));
    if (matches.length > 0) {
      detectedEmotions[emotion] = matches;
    }
  });
  
  return detectedEmotions;
};