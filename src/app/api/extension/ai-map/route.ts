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
        const systemInstruction = `You are an intelligent form field mapper. You must return strictly a JSON object where the keys are the exact 'Scraped Labels' and the values are the closest matching 'Available Categories'. If there is no good match, return null for that key.
        Example format: {"motivation letter": "Personal Essay", "curriculum vitae": "Resume / CV"}`;

        const prompt = `
Available Categories:
${JSON.stringify(availableCategories)}

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
