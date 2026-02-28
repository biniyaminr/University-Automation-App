import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
    // Ignore broken SSL certificates from legacy university websites
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
        const body = await req.json();
        const { url } = body;

        if (!url || typeof url !== "string") {
            return NextResponse.json(
                { error: "Invalid payload. A valid 'url' string is required." },
                { status: 400 }
            );
        }

        console.log(`🌍 Discover Scraper: Fetching HTML from ${url}...`);

        // 1. Fetch HTML
        let htmlResponse;
        try {
            htmlResponse = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                },
            });

            if (!htmlResponse.ok) {
                throw new Error(`HTTP error! status: ${htmlResponse.status}`);
            }
        } catch (fetchError) {
            console.error("🔥 Failed to fetch URL:", fetchError);
            return NextResponse.json(
                { error: "Failed to fetch the provided URL. The site might be blocking scrapers or is offline." },
                { status: 400 }
            );
        }

        const rawHtml = await htmlResponse.text();

        // 2. Extract Visible Text (Strip HTML)
        console.log("🧹 Cleaning HTML...");
        let textContent = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
        textContent = textContent.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");
        textContent = textContent.replace(/<[^>]+>/g, " ");
        textContent = textContent.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        textContent = textContent.replace(/\s+/g, " ").trim();

        // 3. Token Safety: Slice to 30,000 characters max
        if (textContent.length > 30000) {
            console.log("⚠️ Text too long, slicing to 30,000 characters.");
            textContent = textContent.substring(0, 30000);
        }

        if (textContent.length < 100) {
            return NextResponse.json(
                { error: "Extracted text is too short. The page might be empty or heavily JavaScript dependent." },
                { status: 400 }
            );
        }

        console.log(`📄 Extracted ${textContent.length} characters of clean text.`);

        // 4. The Groq Analyst
        console.log("🧠 Sending to Groq Llama 3 for analysis...");
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const systemPrompt = `You are an expert International Admissions Specialist. Read the scraped university website. CRITICAL RULE: You must ONLY extract requirements, deadlines, and summaries that apply to International / Non-EU applicants. Completely ignore any domestic requirements, Italian grading systems (like CFU credits), or local entrance exams unless they explicitly apply to international students. Return a strict JSON object with:
- universityName (string)
- programName (string)
- deadline (specifically the international deadline)
- requirements (array of strings, e.g., ['IELTS 6.5', 'Translated Bachelor Degree'])
- summary (a short 2-sentence summary of the program)

Do not return Markdown. Return ONLY the JSON object.`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Scraped Website Text:\n${textContent}` },
            ],
            response_format: { type: "json_object" },
        });

        const responseText = response.choices[0]?.message?.content ?? "";
        console.log("🤖 AI Analysis Complete:", responseText);

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
            message: "Program details successfully extracted.",
        }, { status: 200 });

    } catch (error) {
        console.error("🔥 Discover Scraper Error:", error);

        const errorMessage = error instanceof Error ? error.message : "";
        if (errorMessage.includes("429") || errorMessage.includes("rate_limit")) {
            return NextResponse.json(
                { error: "AI rate limit reached. Please wait 60 seconds and try again." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error in Discover Scraper" },
            { status: 500 }
        );
    }
}
