import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { promises as fs } from "fs";
import path from "path";

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

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const name = formData.get("name") as string;
        const type = formData.get("type") as string;
        const applicationId = formData.get("applicationId") as string | null;

        if (!file || !name || !type) {
            return NextResponse.json({ error: "Missing required fields (file, name, type)" }, { status: 400 });
        }

        // Prepare physical upload directory
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        // Build a unique and safe file name
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        const uniqueFileName = `${Date.now()}-${cleanFileName}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        // Write the file buffer to disk
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(filePath, buffer);

        // Save relative path for browser access
        const fileUrl = `/uploads/${uniqueFileName}`;

        const newDoc = await prisma.document.create({
            data: {
                name,
                type,
                fileUrl,
                applicationId: applicationId || null,
                userId: user.id
            },
            include: { application: true }
        });

        return NextResponse.json(newDoc, { status: 201 });
    } catch (error) {
        console.error("Error uploading document:", error);
        return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
    }
}
