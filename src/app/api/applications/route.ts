import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { userId: clerkId }
        });

        if (!user) {
            return NextResponse.json([], { status: 200 });
        }

        const applications = await prisma.application.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(applications, { status: 200 });
    } catch (error) {
        console.error("Error fetching applications:", error);
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let user = await prisma.user.findUnique({
            where: { userId: clerkId }
        });

        if (!user) {
            // If they have no profile yet, we create a skeleton profile
            user = await prisma.user.create({
                data: {
                    userId: clerkId,
                    fullName: "Student",
                    email: `user_${clerkId}@temporary.com`, // Fallback email
                }
            });
        }

        const body = await request.json();
        const { universityName, programName, url, deadline, matchScore } = body;

        if (!universityName || !programName) {
            return NextResponse.json({ error: "Missing required fields: University and Program Name" }, { status: 400 });
        }

        const newApp = await prisma.application.create({
            data: {
                universityName,
                programName,
                url: url || "",
                deadline: deadline ? String(deadline) : null,
                matchScore: matchScore ? parseInt(matchScore) : null,
                status: "SAVED",
                userId: user.id
            }
        });

        return NextResponse.json(newApp, { status: 201 });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
    }
}
