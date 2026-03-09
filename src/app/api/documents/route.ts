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
            return NextResponse.json([], { status: 200 }); // Return empty if no profile
        }

        const documents = await prisma.document.findMany({
            where: { userId: user.id },
            include: { application: true },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(documents, { status: 200 });
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { userId: clerkId }
        });

        if (!user) {
            return NextResponse.json({ error: "No master profile found." }, { status: 400 });
        }

        const body = await request.json();
        const { name, type, fileUrl, applicationId } = body;

        if (!name || !type || !fileUrl) {
            return NextResponse.json({ error: "Missing required fields (name, type, fileUrl)" }, { status: 400 });
        }

        const newDoc = await prisma.document.create({
            data: {
                name,
                type,
                fileUrl,
                applicationId: applicationId && applicationId !== "none" ? applicationId : null,
                userId: user.id
            },
            include: { application: true }
        });

        return NextResponse.json(newDoc, { status: 201 });
    } catch (error) {
        console.error("Error creating document record:", error);
        return NextResponse.json({ error: "Failed to create document record" }, { status: 500 });
    }
}
