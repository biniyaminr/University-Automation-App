import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemInstruction = `You are an elite International University Admissions Consultant. Your task is to write a compelling, professional Motivation Letter / Statement of Purpose for the user. You will be provided with the user's profileData and the target program's applicationData.

CRITICAL RULES:
- Address the letter to the Admissions Committee of the specific university.
- Weave their specific major and background into a narrative that directly aligns with the program's requirements.
- Frame any academic pivots (like moving from engineering to economics) as a unique analytical advantage.
- Maintain a confident, formal, yet passionate tone.
- Structure it with standard formal letter spacing, an engaging introduction, 2-3 body paragraphs highlighting specific skills/experiences, and a strong concluding call to action.
- Return ONLY the text of the letter. Do not include markdown formatting or commentary.`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { profileData, applicationData } = body;

        if (!profileData || !applicationData) {
            return NextResponse.json(
                { error: "Invalid payload. Both 'profileData' and 'applicationData' are required." },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction,
        });

        const prompt = `
APPLICANT PROFILE:
${JSON.stringify(profileData, null, 2)}

TARGET PROGRAM:
${JSON.stringify(applicationData, null, 2)}

Write the motivation letter now.
`.trim();

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.8, // Slightly creative for compelling prose
                maxOutputTokens: 1500,
            },
        });

        const essay = result.response.text();

        return NextResponse.json({ essay }, { status: 200 });

    } catch (error) {
        console.error("🔥 Essay Generator Error:", error);

        const errorMessage = error instanceof Error ? error.message : "";
        if (errorMessage.includes("429") || errorMessage.includes("Quota exceeded")) {
            return NextResponse.json(
                { error: "AI rate limit reached. Please wait 60 seconds and try again." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Failed to generate essay. Please try again." },
            { status: 500 }
        );
    }
}
