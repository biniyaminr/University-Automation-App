import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // In a real app with auth, we'd get the user ID from the session.
        // For this prototype, we'll fetch the most recently updated user profile.
        const user = await prisma.user.findFirst({
            orderBy: { updatedAt: 'desc' },
            include: { educations: true },
        });

        if (!user) {
            return NextResponse.json({ message: "No user profile found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, email, phone, address, dob, citizenship, zipCode, institutionName, major, city, country, gpa, startDate, gradDate } = body;

        // Validate required fields
        if (!fullName || !email) {
            return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
        }

        // In a prototype without auth, we'll try to find an existing user by email
        // or create a new one. In reality, we'd update by Auth User ID.
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                fullName,
                phone,
                address,
                dob: dob ? new Date(dob) : null,
                citizenship,
                zipCode,
            },
            create: {
                fullName,
                email,
                phone,
                address,
                dob: dob ? new Date(dob) : null,
                citizenship,
                zipCode,
            },
        });

        // Handle Education entry if provided
        if (institutionName) {
            // For simplicity in this demo, we'll clear old education records and create a new one
            // to simulate saving the "primary" education history section.
            await prisma.education.deleteMany({
                where: { userId: user.id },
            });

            await prisma.education.create({
                data: {
                    institutionName,
                    major,
                    city,
                    country,
                    gpa: gpa ? parseFloat(gpa) : null,
                    startDate: startDate ? new Date(startDate) : null,
                    gradDate: gradDate ? new Date(gradDate) : null,
                    userId: user.id,
                },
            });
        }

        return NextResponse.json({ message: "Profile saved successfully", user }, { status: 200 });
    } catch (error) {
        console.error("Error saving profile:", error);
        return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
    }
}
