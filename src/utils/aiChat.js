const API_KEY = import.meta.env.VITE_API_KEY

function buildSystemPrompt(moduleContext, lang) {
  const langInstruction =
    lang === 'hi'
      ? 'Respond only in Hindi using Devanagari script. Keep the answer simple and easy to understand.'
      : 'Respond only in English. Keep the answer simple and easy to understand.'

  return `You are a friendly financial literacy tutor for SakhiShiksha, a digital literacy app for Indian women entrepreneurs.

Current lesson context:
${moduleContext}

${langInstruction} Answer only questions related to this lesson. Keep responses to 2–3 sentences.`
}

async function callGemini(userQuestion, systemPrompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser question: ${userQuestion}` }],
          },
        ],
      }),
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Gemini API error ${res.status}`)
  }
  const data = await res.json()
  return data.candidates[0].content.parts[0].text.trim()
}

async function callOpenAI(userQuestion, systemPrompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuestion },
      ],
      max_tokens: 200,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `OpenAI API error ${res.status}`)
  }
  const data = await res.json()
  return data.choices[0].message.content.trim()
}

/**
 * Send a question to the AI and get an answer in the given language.
 * Automatically selects the provider based on the key prefix:
 *   - "sk-..."  → OpenAI (gpt-4o-mini)
 *   - anything else (e.g. "AIza...") → Gemini (gemini-2.5-flash-lite)
 *
 * @param {string} userQuestion  The user's question
 * @param {string} moduleContext The lesson notes to use as context
 * @param {'en'|'hi'} lang       Target response language
 * @returns {Promise<string>}    The AI's answer
 */
export async function askAI(userQuestion, moduleContext, lang) {
  if (!API_KEY) throw new Error('VITE_API_KEY is not configured.')
  const systemPrompt = buildSystemPrompt(moduleContext, lang)
  if (API_KEY.startsWith('sk-')) {
    return callOpenAI(userQuestion, systemPrompt)
  }
  return callGemini(userQuestion, systemPrompt)
}
