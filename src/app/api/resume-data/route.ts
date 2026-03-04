import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch the specific user with all relevant resume relations
        const user = await prisma.user.findUnique({
            where: { userId: clerkId },
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
