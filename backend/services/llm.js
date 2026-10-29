require('dotenv').config();
const OpenAI = require('openai');

const { LLM_API_KEY, LLM_BASE_URL, LLM_MODEL, LLM_FALLBACK_MODEL } = process.env;

for (const [name, value] of Object.entries({ LLM_API_KEY, LLM_BASE_URL, LLM_MODEL })) {
  if (!value) throw new Error(`${name} is not set in .env`);
}

const client = new OpenAI({
  apiKey: LLM_API_KEY,
  baseURL: LLM_BASE_URL,
  timeout: 30 * 1000,
  maxRetries: 0,
});

const SYSTEM_PROMPT = 'You are a helpful assistant.';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callModel(model, history) {
  const response = await client.chat.completions.create({
    model,
    max_tokens: 1024,
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
  });
  return response.choices[0]?.message?.content ?? null;
}

async function chat(history) {
  const models = [LLM_MODEL, LLM_FALLBACK_MODEL].filter(Boolean);
  let lastError;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await callModel(model, history);
      } catch (err) {
        lastError = err;
        // 429 = rate or daily limit reached: retrying only wastes quota
        if (![502, 503, 504].includes(err.status)) break;
        await sleep(1500);
      }
    }
  }
  throw lastError;
}

module.exports = { chat };