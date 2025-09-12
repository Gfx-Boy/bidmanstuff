const axios = require('axios');
require('dotenv').config();

async function testChatGPT() {
  try {
    const API_KEY = process.env.chatGptKey;
    
    console.log("🔑 Testing ChatGPT API...");
    console.log("🔑 API Key found:", API_KEY ? `${API_KEY.substring(0, 15)}...` : "undefined");
    
    if (!API_KEY) {
      console.error("❌ No API key found in environment variables");
      return;
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello, this is a test message. Please respond with 'API is working'." }],
        max_tokens: 50,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    console.log("✅ ChatGPT API is working!");
    console.log("📝 Response:", response.data.choices[0].message.content);
    
  } catch (error) {
    console.error("❌ ChatGPT API Test Failed:", error.message);
    
    if (error.response) {
      console.error("📊 Status:", error.response.status);
      console.error("📊 Response:", JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error("🔑 Authentication Error - Possible issues:");
        console.error("   - Invalid API key");
        console.error("   - Expired API key");
        console.error("   - Insufficient OpenAI credits/billing");
        console.error("   - API key doesn't have required permissions");
      } else if (error.response.status === 429) {
        console.error("⏱️ Rate limit exceeded - try again later");
      } else if (error.response.status === 503) {
        console.error("🔧 OpenAI service temporarily unavailable");
      }
    }
  }
}

testChatGPT();