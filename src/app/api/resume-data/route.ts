import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Fetch the most recently updated user with all relevant resume relations
        const user = await prisma.user.findFirst({
            orderBy: { updatedAt: 'desc' },
            include: {
                educations: true,
                extracurriculars: true
            },
        });

        if (!user) {
            return NextResponse.json({ message: "No user profile found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching resume data:", error);
        return NextResponse.json({ error: "Failed to fetch resume data" }, { status: 500 });
    }
}
