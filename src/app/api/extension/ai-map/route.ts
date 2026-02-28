import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
        const systemInstruction = `You are an expert data mapper for university admissions. 
You will receive a list of scraped HTML labels from a university portal and a list of available document categories from a user's vault. 
Map each scraped label to the single most logically equivalent vault category. 
If no logical match exists, return null for that label.
CRITICAL: You must return a single, flat JSON object where the keys are the exact scraped labels and the values are the matched vault categories. DO NOT return an array. Example format: {'motivation letter': 'Personal Essay', 'curriculum vitae': 'Resume / CV'}.`;

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
        // AI Integration: Gemini 2.5 Flash
        // --------------------------------------------------------------------------------
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

        // Use gemini-2.5-flash with strict JSON output configuration
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction,
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        console.log("🧠 Generating AI mapping...");
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

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
