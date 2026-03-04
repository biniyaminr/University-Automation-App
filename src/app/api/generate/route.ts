import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
    try {
        const { targetUniversity, essayPrompt, keyNarrative } = await request.json();

        if (!targetUniversity || !essayPrompt) {
            return NextResponse.json({ error: "Target University and Essay Prompt are required" }, { status: 400 });
        }

        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 1. Fetch User Context from Prisma ensuring data isolation
        const user = await prisma.user.findUnique({
            where: { userId },
            include: {
                educations: true,
                extracurriculars: true,
                testScores: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "No user profile found. Please fill out your Master Profile first." },
                { status: 404 }
            );
        }

        // 2. Format Context String
        let contextString = `Applicant Name: ${user.fullName}\n`;
        contextString += `Citizenship: ${user.citizenship || "Not specified"}\n\n`;

        if (user.educations?.length > 0) {
            contextString += "Education History:\n";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user.educations.forEach((edu: any) => {
                contextString += `- ${edu.institutionName} (${edu.city || ""}, ${edu.country || ""}). GPA: ${edu.gpa || "N/A"}.\n`;
            });
            contextString += "\n";
        }

        if (user.extracurriculars?.length > 0) {
            contextString += "Extracurricular Activities:\n";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user.extracurriculars.forEach((ec: any) => {
                contextString += `- ${ec.role} at ${ec.organization} (${ec.hoursPerWeek} hrs/wk). ${ec.description}\n`;
            });
            contextString += "\n";
        }

        if (user.testScores?.length > 0) {
            contextString += "Test Scores:\n";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user.testScores.forEach((ts: any) => {
                contextString += `- ${ts.testType}: ${ts.score}\n`;
            });
            contextString += "\n";
        }

        // 3. Build system prompt
        let systemPrompt = `You are an expert, highly sought-after university admissions counselor. Your task is to write a compelling, authentic, and memorable application essay draft for a student applying to ${targetUniversity}.

You MUST base the essay entirely on the provided Student Profile Context. Do not invent new skills or experiences. Weave their specific achievements, background, and stats into a narrative that directly answers the Essay Prompt.

Make the tone reflective, ambitious, and sophisticated.\n\n`;

        if (keyNarrative) {
            systemPrompt += `CRITICAL NARRATIVE INSTRUCTION: The applicant explicitly wants you to focus the essay around this specific narrative angle:\n"${keyNarrative}"\nEnsure this narrative is woven beautifully into the essay.\n\n`;
        }

        systemPrompt += `Student Profile Context:\n${contextString}`;

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Essay Prompt to Answer: "${essayPrompt}"\n\nPlease provide the essay draft below:` },
            ],
            temperature: 0.8,
            max_tokens: 1500,
        });

        const draft = response.choices[0]?.message?.content ?? "";

        return NextResponse.json({ draft }, { status: 200 });

    } catch (error) {
        console.error("🔥 Error generating essay:", error);

        const errorMessage = error instanceof Error ? error.message : "";
        if (errorMessage.includes("429") || errorMessage.includes("rate_limit")) {
            return NextResponse.json(
                { error: "AI rate limit reached. Please wait 60 seconds and try again." },
                { status: 429 }
            );
        }

        return NextResponse.json({ error: "Failed to generate essay." }, { status: 500 });
    }
}
