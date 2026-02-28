import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.application.delete({ where: { id } });
        return NextResponse.json({ message: "Application deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting application:", error);
        return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, deadline, url } = body;

        const updated = await prisma.application.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(deadline !== undefined && { deadline: String(deadline) }),
                ...(url !== undefined && { url: String(url) }),
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating application:", error);
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }
}
