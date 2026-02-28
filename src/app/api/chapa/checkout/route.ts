import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = user.emailAddresses[0]?.emailAddress || "test@example.com";
        const firstName = user.firstName || "Biniyam";
        const lastName = user.lastName || "Dereje";

        const tx_ref = `TX-${Date.now()}-${user.id.slice(-5)}`;

        console.log(`💳 Initializing Chapa transaction for ${email} (${tx_ref})...`);

        const chapaResponse = await fetch("https://api.chapa.co/v1/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: "1000",
                currency: "ETB",
                email: email,
                first_name: firstName,
                last_name: lastName,
                tx_ref: tx_ref,
                return_url: "http://localhost:3000/dashboard?success=true",
                customization: {
                    title: "AssistedApp Pro",
                    description: "Lifetime access to all AI features",
                },
            }),
        });

        const data = await chapaResponse.json();

        if (!chapaResponse.ok) {
            console.error("Chapa API Error:", data);
            return NextResponse.json({
                error: data.message || "Failed to initialize transaction",
                details: data
            }, { status: 500 });
        }

        if (data.status === "success" && data.data?.checkout_url) {
            return NextResponse.json({ url: data.data.checkout_url });
        } else {
            console.error("Chapa unexpected response format:", data);
            return NextResponse.json({ error: "Chapa returned an unexpected response format" }, { status: 500 });
        }

    } catch (error) {
        console.error("🔥 Chapa Checkout Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
