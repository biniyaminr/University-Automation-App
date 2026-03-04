import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: Request) {
  try {
    const { targetProgram, targetUniversity, extracurriculars, cvText, baseProfile } = await request.json();

    if (!targetProgram || !targetUniversity || !extracurriculars) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const originalDataString = JSON.stringify(extracurriculars, null, 2);

    const systemPrompt = `You are an expert career advisor and resume writer specialising in university applications.
The user is applying to study "${targetProgram}" at "${targetUniversity}".

Your task is to produce a tailored CV data object. Return ONLY a valid JSON object with EXACTLY this structure:
{
  "fullName": "Extracted Name or fallback",
  "email": "Extracted Email or fallback",
  "phone": "Extracted Phone or fallback",
  "summary": "A 2-3 sentence tailored professional summary...",
  "education": [
    { "institution": "...", "degree": "...", "date": "...", "location": "..." }
  ],
  "experience": [
    { "role": "...", "organization": "...", "startDate": "...", "endDate": "...", "bullets": ["Bullet 1...", "Bullet 2..."] }
  ],
  "skills": ["Skill 1", "Skill 2"]
}

RULES:
- Rewrite the 'description' fields from the provided extracurricular data into punchy, impactful 'bullets' using strong action verbs.
- Highlight transferable skills, leadership, and quantitative impact relevant to the target program.
- Extract ALL education entries from the provided CV text. Do NOT stop at the first institution. Populate the 'education' array with every school, university, or institution found.
- If a parsed PDF text is provided, you MUST extract the Name, Email, and Phone Number directly from the PDF text to use in the CV header.
- ONLY use the provided database profile details (Name: ${baseProfile?.name || 'N/A'}, Email: ${baseProfile?.email || 'N/A'}, Phone: ${baseProfile?.phone || 'N/A'}) as a fallback IF the parsed PDF text is missing contact information, or if no PDF was uploaded.
- Do not return Markdown. Do not wrap in \`\`\`json. Return raw, pure JSON only.`;

    let userMessage = `Original extracurricular data to tailor:\n${originalDataString}`;

    if (cvText) {
      userMessage += `\n\nCRITICAL CONTEXT — Uploaded CV Text (extract all education, metrics, name, and contact info from this):\n---\n${cvText.substring(0, 4000)}\n---`;
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const rawOutput = response.choices[0]?.message?.content ?? "";

    try {
      const updatedCV = JSON.parse(rawOutput);

      if (!updatedCV.education || updatedCV.education.length === 0) {
        console.log("⚠️ AI failed to extract education entries — frontend fallback will handle this.");
      }

      return NextResponse.json(updatedCV, { status: 200 });
    } catch (_parseError) {
      console.error("🔥 Failed to parse Groq JSON response:", rawOutput);
      return NextResponse.json({ error: "AI returned invalid format" }, { status: 500 });
    }

  } catch (error) {
    console.error("🔥 Error tailoring resume:", error);

    const errorMessage = error instanceof Error ? error.message : "";
    if (errorMessage.includes("429") || errorMessage.includes("rate_limit")) {
      return NextResponse.json(
        { error: "AI rate limit reached. Please wait 60 seconds and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
