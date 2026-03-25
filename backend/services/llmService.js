// backend/services/llmService.js
const axios = require('axios');

// Timeout in milliseconds for all external LLM API calls
const API_TIMEOUT_MS = 30000; // 30 seconds

const fetchGeminiResponse = async (query, previousTurns = []) => {
  try {
    const contents = [];
    previousTurns.forEach(turn => {
      contents.push({ role: 'user', parts: [{ text: turn.query }] });
      const geminiResponse = turn.responses.find(r => r.modelName.includes('Gemini'));
      if (geminiResponse) {
        contents.push({ role: 'model', parts: [{ text: geminiResponse.answer }] });
      }
    });
    contents.push({ role: 'user', parts: [{ text: query }] });

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: API_TIMEOUT_MS,
      }
    );
    return {
      modelName: 'Google (Gemini 2.5 Flash)',
      answer: response.data.candidates[0].content.parts[0].text,
    };
  } catch (error) {
    const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
    if (isTimeout) {
      console.warn('Gemini API timed out after', API_TIMEOUT_MS / 1000, 'seconds');
      return {
        modelName: 'Google (Gemini 2.5 Flash)',
        answer: '⏱️ Model timed out. Gemini took too long to respond. Please try again.',
      };
    }
    console.error('Error fetching Gemini response:', error.response?.data || error.message);
    return {
      modelName: 'Google (Gemini 2.5 Flash)',
      answer: `Error: ${error.response?.data?.error?.message || error.message}`,
    };
  }
};

const fetchGroqResponse = async (query, previousTurns = []) => {
  try {
    const messages = [];
    previousTurns.forEach(turn => {
      messages.push({ role: 'user', content: turn.query });
      const groqResponse = turn.responses.find(r => r.modelName.includes('Groq'));
      if (groqResponse) {
        messages.push({ role: 'assistant', content: groqResponse.answer });
      }
    });
    messages.push({ role: 'user', content: query });

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: API_TIMEOUT_MS,
      }
    );
    return {
      modelName: 'Groq (Llama 3.1 8B Instant)',
      answer: response.data.choices[0].message.content,
    };
  } catch (error) {
    const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
    if (isTimeout) {
      console.warn('Groq API timed out after', API_TIMEOUT_MS / 1000, 'seconds');
      return {
        modelName: 'Groq (Llama 3.1 8B Instant)',
        answer: '⏱️ Model timed out. Groq took too long to respond. Please try again.',
      };
    }
    console.error('Error fetching Groq response:', error.response?.data || error.message);
    return {
      modelName: 'Groq (Llama 3.1 8B Instant)',
      answer: `Error: ${error.response?.data?.error?.message || error.message}`,
    };
  }
};

const getLlmResponses = async (query, previousTurns = []) => {
  // Call all models concurrently
  const results = await Promise.allSettled([
    fetchGeminiResponse(query, previousTurns),
    fetchGroqResponse(query, previousTurns)
  ]);

  // Map results back to the expected array format
  return results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      // Should rarely happen since we catch errors inside the fetch functions themselves,
      // but safe to have a fallback.
      return {
        modelName: 'Unknown Model',
        answer: `Unhandled error during fetch: ${result.reason}`
      };
    }
  });
};

const generateSessionTitle = async (query) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates very short, concise chat session titles. Given a user prompt, respond with ONLY a short title of 4-6 words maximum. No quotes, no punctuation at the end, no explanation.',
          },
          {
            role: 'user',
            content: `Generate a short title for a chat that starts with this prompt: "${query}"`,
          },
        ],
        max_tokens: 20,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const title = response.data.choices[0].message.content.trim();
    return title;
  } catch (error) {
    console.error('Error generating session title:', error.message);
    // Fallback: truncate the raw query
    return query.length > 40 ? query.substring(0, 40) + '...' : query;
  }
};

module.exports = {
  getLlmResponses,
  generateSessionTitle,
};

