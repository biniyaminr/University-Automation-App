import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

        // Documents already contain a `fileUrl` pointing to the Uploadthing CDN (https://utfs.io/...).
        // The Chrome extension fetches the file directly from that URL using the DataTransfer API.
        // No base64 encoding is needed here anymore.
        const userPayload = { ...user };

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
