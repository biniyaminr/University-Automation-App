import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { name, type, applicationId } = body;

        const updatedDoc = await prisma.document.update({
            where: { id },
            data: {
                name,
                type,
                applicationId: applicationId === "none" ? null : applicationId
            }
        });

        return NextResponse.json(updatedDoc, { status: 200 });
    } catch (error) {
        console.error("Error updating document:", error);
        return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        const doc = await prisma.document.findUnique({ where: { id } });

        if (!doc) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        // Attempt physical file deletion if fileUrl is physical
        if (doc.fileUrl && doc.fileUrl.startsWith('/uploads/')) {
            try {
                const filePath = path.join(process.cwd(), "public", doc.fileUrl);
                await fs.unlink(filePath);
            } catch (err) {
                console.warn("Could not delete physical file:", err);
                // We'll proceed to delete the record anyway
            }
        }

        await prisma.document.delete({ where: { id } });

        return NextResponse.json({ message: "Document deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting document:", error);
        return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
    }
}
