import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const user = await prisma.user.findFirst();
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
        // Find existing user or create a default one to satisfy relational constraints
        let user = await prisma.user.findFirst();
        if (!user) {
            user = await prisma.user.create({
                data: {
                    fullName: "Mission Commander",
                    email: "commander@assistedapp.com",
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
