import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { scrapedLabels, availableCategories } = body;

        if (!scrapedLabels || !availableCategories || !Array.isArray(scrapedLabels) || !Array.isArray(availableCategories)) {
            return NextResponse.json(
                { error: "Invalid payload. 'scrapedLabels' and 'availableCategories' arrays are required." },
                { status: 400 }
            );
        }

        // --------------------------------------------------------------------------------
        // Prompt Engineering Engine
        // --------------------------------------------------------------------------------
        const systemInstruction = `You are an expert data mapper for a university application tool. Your job is to read the provided file input labels from a university website and map them to our internal database document categories.

You MUST map each website label to ONE of the following exact string values. Do not invent new categories:

- TRANSCRIPT       → Use for academic records, grades, diploma supplements, university transcripts
- RESUME           → Use for CVs, curriculum vitae, work history. Map "curriculum vitae" to "RESUME".
- PASSPORT         → Use for ID cards, passports, identification documents
- ENGLISH_PROFICIENCY → Use for IELTS, TOEFL, language certificates, certificate of proficiency in english
- RECOMMENDATION   → Use for reference letters, letters of recommendation, letters of support
- ESSAY            → Use for motivation letters, statement of purpose, personal statements, cover letters

STRICT MAPPING EXAMPLES:
- "curriculum vitae" or "cv" → RESUME
- "transcript" or "university transcript" → TRANSCRIPT
- "motivation letter" or "lettera motivazionale" → ESSAY
- "certificate of proficiency in english" → ENGLISH_PROFICIENCY

IMPORTANT RULES:
1. Ignore extra text in website labels such as "(obbligatorio/mandatory)", "(required)", or any foreign language translations. Focus solely on the core requested document type.
2. Return null ONLY if the website label is completely unrelated to any category above (e.g. "payment receipt", "photo", "birth certificate"). When in doubt, pick the closest match — do NOT return null for obvious documents.
3. Your response MUST be a strict JSON object. Keys are the exact scraped label strings. Values are one of the five category strings above, or null.

Example output: {"curriculum vitae (obbligatorio/mandatory)": "RESUME", "university transcript": "TRANSCRIPT", "motivation letter": "ESSAY", "IELTS score report": "ENGLISH_PROFICIENCY"}`;

        const prompt = `
Map each of the following scraped website labels to one of these allowed values ONLY:
TRANSCRIPT | RESUME | PASSPORT | ENGLISH_PROFICIENCY | RECOMMENDATION | ESSAY | null

Scraped Labels to Map:
${JSON.stringify(scrapedLabels)}
        `.trim();

        console.log("--- AI Prompt Generated ---");
        console.log(prompt);
        console.log("---------------------------");

        // --------------------------------------------------------------------------------
        // AI Integration: Groq (Llama 3.3 70B)
        // --------------------------------------------------------------------------------
        console.log("🧠 Generating AI mapping via Groq...");

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const responseText = response.choices[0]?.message?.content || "{}";
        console.log("🤖 AI Response Raw:", responseText);

        const aiResponseJSON = JSON.parse(responseText);

        return NextResponse.json({
            success: true,
            mappedData: aiResponseJSON,
            message: "AI mapping complete"
        }, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });

    } catch (error) {
        console.error("🔥 AI Mapping Endpoint Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error in AI Mapping Endpoint or AI failed to respond" },
            { status: 500 }
        );
    }
}

// Handle CORS preflight requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
