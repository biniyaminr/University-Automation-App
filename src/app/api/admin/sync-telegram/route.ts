import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import { load } from "cheerio";
import { auth } from "@clerk/nextjs/server";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const CHANNELS = [
    "OHUB4AllET",
    "scholarshipscorner",
    "mulukenbafa",
    "BrightScholarship",
    "Global_Dreamss",
];

export async function GET() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let allNewOpportunities: any[] = [];
        let addCount = 0;

        for (const channel of CHANNELS) {
            console.log(`Syncing channel: ${channel}`);

            const response = await fetch(`https://t.me/s/${channel}`);
            const html = await response.text();
            const $ = load(html);

            // Extract text from the last 3 messages
            const posts = $(".tgme_widget_message_text")
                .slice(-3)
                .map((i, el) => $(el).text())
                .get()
                .join("\n\n---\n\n");

            if (!posts) {
                console.log(`No posts found for ${channel}`);
                continue;
            }

            // AI Parser with Groq
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an AI data extractor. Read these Telegram posts and extract scholarship/university opportunities. Return strictly a JSON object with an array named opportunities. Each object must have: university (string), programName (string), description (short string), isScholarship (boolean), isFreeApp (boolean), and link (URL string). If a post doesn't have a clear university and link, ignore it.",
                    },
                    {
                        role: "user",
                        content: posts,
                    },
                ],
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" },
            });

            const result = JSON.parse(completion.choices[0].message.content || '{"opportunities": []}');
            const opportunities = result.opportunities || [];

            // Database Injection
            for (const opt of opportunities) {
                if (!opt.university || !opt.link) continue;

                // Filter by Clerk ID for collisions to ensure isolation
                const existing = await prisma.opportunity.findFirst({
                    where: {
                        link: opt.link,
                        userId: clerkId
                    },
                });

                if (!existing) {
                    await prisma.opportunity.create({
                        data: {
                            userId: clerkId,
                            university: opt.university,
                            programName: opt.programName || "Unknown Program",
                            description: opt.description,
                            isScholarship: !!opt.isScholarship,
                            isFreeApp: !!opt.isFreeApp,
                            link: opt.link,
                        },
                    });
                    addCount++;
                    allNewOpportunities.push(opt);
                }
            }
        }

        return NextResponse.json({
            success: true,
            addedCount: addCount,
            newOpportunities: allNewOpportunities,
        });
    } catch (error) {
        console.error("Error syncing Telegram:", error);
        return NextResponse.json(
            { error: "Failed to sync Telegram opportunities" },
            { status: 500 }
        );
    }
}
