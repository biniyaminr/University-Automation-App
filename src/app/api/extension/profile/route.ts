import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const user = await prisma.user.findFirst({
            orderBy: { updatedAt: 'desc' },
            include: { educations: true, documents: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        // Attach Base64 File Encoded strings to overcome Mixed Content blockers on HTTPS portals
        const documentsWithFiles = (user.documents || []).map((doc: any) => {
            let fileBase64 = "";
            if (doc.fileUrl) {
                const filePath = path.join(process.cwd(), 'public', doc.fileUrl);
                if (fs.existsSync(filePath)) {
                    const fileBuffer = fs.readFileSync(filePath);
                    fileBase64 = fileBuffer.toString('base64');
                }
            }
            return {
                ...doc,
                fileBase64
            };
        });

        const userPayload = { ...user, documents: documentsWithFiles };

        // Return the user profile data with CORS headers explicitly enabling the extension to fetch it
        return NextResponse.json(userPayload, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    } catch (error) {
        console.error("Extension API Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch master profile" }, { status: 500 });
    }
}
