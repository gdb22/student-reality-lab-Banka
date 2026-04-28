/**
 * API Handler for Student Loan Advisor Chat
 *
 * This handler processes chat messages and sends them to OpenAI or Gemini.
 *
 * Setup:
 * 1. Create a .env file with API keys:
 *    - OPENAI_API_KEY=your_key_here
 *    - GEMINI_API_KEY=your_key_here
 * 2. Optionally set AI_PROVIDER=openai|gemini
 */

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AIProvider = "openai" | "gemini";

type ChatRequestBody = {
  message: string;
  conversationHistory?: ChatMessage[];
};

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const AI_PROVIDER = (import.meta.env.VITE_AI_PROVIDER ?? "").toLowerCase();

const SYSTEM_PROMPT = `You are a knowledgeable and empathetic student loan advisor. Your role is to:

1. Answer questions about student loan repayment strategies, federal vs. private loans, and loan forgiveness programs
2. Explain repayment plans (Standard, Income-Driven, etc.)
3. Provide practical tips for managing student debt
4. Help users understand their personal financial situation related to student loans
5. Provide context about the student debt crisis and its impact

Key facts to know:
- Average student loan debt has grown from $18,230 (2007) to $39,550 (2025)
- Total US student loan debt exceeds $1.7 trillion
- Standard repayment is 10 years, but stretches to 20-30 years for higher balances
- Income-driven plans can help manage monthly payments

IMPORTANT: Always remind users that you provide educational information, not specific financial advice. For major decisions, they should consult a certified financial professional.

Be conversational, supportive, and clear in your explanations.`;

function resolveProvider(): AIProvider | null {
  if (AI_PROVIDER === "openai" && OPENAI_API_KEY) return "openai";
  if (AI_PROVIDER === "gemini" && GEMINI_API_KEY) return "gemini";
  if (OPENAI_API_KEY) return "openai";
  if (GEMINI_API_KEY) return "gemini";
  return null;
}

async function callOpenAI(messages: ChatMessage[]): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${details}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

async function callGemini(messages: ChatMessage[]): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: messages.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${details}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const parts = data.candidates?.[0]?.content?.parts ?? [];
  return parts.map((part) => part.text ?? "").join("\n").trim();
}

export async function POST(request: Request) {
  try {
    const { message, conversationHistory = [] } =
      (await request.json()) as ChatRequestBody;

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        { status: 400 }
      );
    }

    const provider = resolveProvider();

    if (!provider) {
      return new Response(
        JSON.stringify({
          error: "No AI provider configured",
          details:
            "Set OPENAI_API_KEY or GEMINI_API_KEY. Optionally set AI_PROVIDER=openai|gemini.",
        }),
        { status: 500 }
      );
    }

    // Format and validate conversation history
    const messages = conversationHistory
      .filter(
        (msg) =>
          (msg.role === "user" || msg.role === "assistant") &&
          typeof msg.content === "string" &&
          msg.content.trim().length > 0
      )
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    // Add the new user message
    messages.push({
      role: "user",
      content: message,
    });

    const reply =
      provider === "openai"
        ? await callOpenAI(messages)
        : await callGemini(messages);

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        error: "Failed to process chat message",
        details: errorMessage,
      }),
      { status: 500 }
    );
  }
}
