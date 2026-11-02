import type { Language } from '../data/ngoKnowledgeBase';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
// Configurable active Groq model (e.g. qwen/qwen3.8-27b)
const getModelName = () => (import.meta.env.VITE_LLM_MODEL || 'qwen/qwen3.8-27b').trim();

export interface LlamaResponse {
  text: string;
  isAiGenerated: boolean;
}

/**
 * Checks if a Groq API key is configured in the environment.
 */
export function isLlamaAvailable(): boolean {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 10);
}

/**
 * Asks Llama / Groq open-weight LLM to generate a polite, conversational answer
 * strictly grounded in the provided NGO Knowledge Base context.
 *
 * If the API key is not present or an error/timeout occurs, returns null
 * so the engine seamlessly falls back to local direct FAQ matching.
 */
export async function queryLlamaWithContext(
  userQuery: string,
  groundedContext: string,
  lang: Language = 'en'
): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey.trim().length < 10) {
    return null; // Silent fallback to local matcher
  }

  const langNames: Record<Language, string> = {
    en: 'English',
    hi: 'Hindi (हिंदी)',
    mr: 'Marathi (मराठी)'
  };

  const systemPrompt = `You are Vasundhara Bot, the friendly, intelligent green ambassador for Vasundhara Abhiyan, a non-profit citizen conservation trust that has transformed Tukai Hill (Baner-Pashan Hills) in Pune, Maharashtra since 2006.

Core NGO Facts:
- Mission: Afforestation of native Deccan trees (Neem, Banyan, Peepal, Karanj, Tamarind, Amla, Mahua) and rainwater harvesting (over 5,000m of contour trenches & check dams).
- Daily Volunteer Shramadaan: Every morning 7:00 AM to 9:00 AM, 365 days a year on Baner-Pashan Hills. Free to join for everyone.
- Student & College Programs: 15-20 hours of seva earns official environmental action certificates for college/NSS requirements.
- Corporate CSR: Groups can organize customized weekend plantation drives with 2 weeks advance notice.
- Donations: Registered charitable trust; donations get 50% income tax exemption under Section 80G. UPI: eazypay.OPCH8Q0NYA45HZT@icici. Bank: ICICI Bank LTD, A/C: 624001082227, IFSC: ICIC0006240.
- Contact: +91 9882 501 501 | vasundharaabhiyan2006@gmail.com | Office next to Reelicon Alpine Ridge, Pan Card Clubs Rd, Baner, Pune - 411045.

Your Conversational Guidelines:
1. Speak fluently, warmly, and helpfully like a passionate, polite NGO representative.
2. Reply in ${langNames[lang]}. If the user speaks Marathi or Hindi, reply natively in that language.
3. If specific question context is provided below, use it accurately:
${groundedContext}
4. If the user greets you or says thanks, respond naturally and encourage them to visit the hill or volunteer.
5. If you do not know the answer to a question outside our conservation work, politely state that and suggest contacting our coordinators at +91 9882 501 501.
6. Keep answers concise, informative, and formatted with clean paragraphs or bullet points where appropriate (2 to 5 sentences).`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500); // 6.5s safety timeout

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: getModelName(),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.3, // Low temperature for high factual accuracy
        max_tokens: 300
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Llama Service] Groq returned status ${response.status}. Falling back to local FAQ.`);
      return null;
    }

    const data = await response.json();
    const generatedText = data?.choices?.[0]?.message?.content?.trim();

    return generatedText || null;
  } catch (error) {
    console.warn('[Llama Service] Network/timeout error. Using local FAQ fallback.', error);
    return null;
  }
}

