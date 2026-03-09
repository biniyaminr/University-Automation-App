import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

export async function POST(request: Request) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { opportunityTitle, opportunityDescription } = body;

        if (!opportunityTitle) {
            return NextResponse.json({ error: "Opportunity title is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { userId: clerkId },
            include: { educations: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User profile not found. Please complete your profile first." }, { status: 404 });
        }

        // Initialize Groq client
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // Format user profile
        const profileText = `
Name: ${user.fullName || 'N/A'}
GPA: ${user.educations?.[0]?.gpa || 'N/A'}
Major: ${user.educations?.[0]?.major || 'N/A'}
Institution: ${user.educations?.[0]?.institutionName || 'N/A'}
Citizenship: ${user.citizenship || 'N/A'}
`;

        const systemPrompt = `You are an expert university admissions officer. I will provide a user's academic profile and an opportunity description (scholarship/program). You must evaluate their chances of acceptance based on the available information.
Return ONLY a valid JSON object with exactly three keys:
- 'score': an integer from 1 to 100 representing the fit score.
- 'strengths': a concise 1-sentence summary of why they are a good fit.
- 'missing': a concise 1-sentence summary of what they might lack or need to improve.
Do not use markdown blocks, backticks, or any other formatting around the JSON object.`;

        const userMessage = `User Profile:\n${profileText}\n\nOpportunity:\nTitle: ${opportunityTitle}\nDescription: ${opportunityDescription || 'No detailed description provided.'}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1, // Low temp for more consistent JSON output
        });

        const rawOutput = chatCompletion.choices[0]?.message?.content || "";

        let parsedResult;
        try {
            // Strip out any accidental markdown formatting
            const cleanedOutput = rawOutput.replace(/```json/gi, "").replace(/```/g, "").trim();
            parsedResult = JSON.parse(cleanedOutput);
        } catch (e) {
            console.error("Failed to parse Groq outcome:", rawOutput);
            return NextResponse.json({ error: "Failed to parse evaluation response" }, { status: 500 });
        }

        return NextResponse.json(parsedResult, { status: 200 });
    } catch (error) {
        console.error("Evaluation API Error:", error);
        return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
    }
}
