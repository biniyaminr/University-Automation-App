import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { programData, userProfile } = body;

        if (!programData || !userProfile) {
            return NextResponse.json(
                { error: "Invalid payload. 'programData' and 'userProfile' are required." },
                { status: 400 }
            );
        }

        console.log(`🧠 Evaluate: Grading match for ${userProfile.name} on ${programData.programName}...`);

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const systemPrompt = `You are an International Academic Advisor. Evaluate the user's profile against the program requirements. Calculate a matchScore (0-100) using this strict rubric: Start at 100. Deduct 40 points heavily if their major does not align. Pay special attention to international requirements like English proficiency (e.g., IELTS/TOEFL equivalents). Deduct 20 points if their GPA is below the competitive threshold for the program. Deduct 10 points for missing minor requirements.

Provide the integer score and a 2-sentence reasoning directly addressing the user as an international applicant.

Return a strict JSON object with two keys:
- matchScore (number)
- reasoning (string)

Do not return Markdown. Return ONLY the JSON object.`;

        const prompt = `
User Profile:
${JSON.stringify(userProfile, null, 2)}

Program Data Requirements:
${JSON.stringify(programData, null, 2)}
`.trim();

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0,
        });

        const responseText = response.choices[0]?.message?.content ?? "";
        console.log("🤖 AI Matchmaker Complete:", responseText);

        let parsedData;
        try {
            parsedData = JSON.parse(responseText);
        } catch (parseError) {
            console.error("🔥 Failed to parse Groq JSON output:", parseError, responseText);
            return NextResponse.json(
                { error: "AI returned invalid JSON format." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: parsedData,
            message: "Match successfully evaluated.",
        }, { status: 200 });

    } catch (error) {
        console.error("🔥 Evaluate Route Error:", error);

        const errorMessage = error instanceof Error ? error.message : "";
        if (errorMessage.includes("429") || errorMessage.includes("rate_limit")) {
            return NextResponse.json(
                { error: "AI rate limit reached. Please wait 60 seconds and try again." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error in Evaluate Endpoint" },
            { status: 500 }
        );
    }
}
