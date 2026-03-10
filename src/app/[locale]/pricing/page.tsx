"use client";

import { useState } from "react";
import { Check, Loader2, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function PricingPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/chapa/checkout", {
                method: "POST",
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || "Failed to initialize payment");
            }
        } catch (error) {
            console.error("Payment Error:", error);
            toast.error("Payment Error", {
                description: "Failed to start payment process. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const basicFeatures = [
        "3 AI Program Scans per month",
        "1 AI Motivation Letter",
        "Basic Kanban Tracker",
        "Standard Support",
    ];

    const proFeatures = [
        "Unlimited AI Program Scans",
        "Unlimited AI Motivation Letters",
        "AI CV Tailoring (Groq Powered)",
        "Advanced Application Analytics",
        "Priority Support",
        "Early Access to new features",
    ];

    return (
        <div className="flex flex-col items-center gap-12 py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col items-center text-center gap-4 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-500">
                    Unlock Your Potential
                </h1>
                <p className="text-xl text-neutral-400">
                    Choose the plan that fits your academic journey. Localized payments for Ethiopia via Chapa.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                {/* Basic Plan */}
                <Card className="bg-neutral-900/40 border-neutral-800 backdrop-blur-sm relative overflow-hidden flex flex-col group transition-all hover:border-neutral-700">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-neutral-200">Basic</CardTitle>
                        <CardDescription className="text-neutral-400 text-lg">Foundation for your journey</CardDescription>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-neutral-100">0</span>
                            <span className="text-neutral-500 font-medium">ETB / month</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-4">
                            {basicFeatures.map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <div className="mt-1 bg-neutral-800 rounded-full p-0.5">
                                        <Check className="h-3.5 w-3.5 text-neutral-400" />
                                    </div>
                                    <span className="text-neutral-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full border-neutral-700 hover:bg-neutral-800 text-neutral-200" disabled>
                            Current Plan
                        </Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="bg-neutral-900 border-blue-500/30 backdrop-blur-md relative overflow-hidden flex flex-col group transition-all hover:border-blue-500/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]">
                    <div className="absolute top-0 right-0 p-2">
                        <div className="bg-blue-600 text-[10px] font-bold uppercase tracking-widest text-white px-2 py-1 rounded-bl-lg rounded-tr-lg">
                            Most Popular
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
                            Pro Plan
                            <Sparkles className="h-5 w-5 text-blue-400" />
                        </CardTitle>
                        <CardDescription className="text-neutral-300 text-lg font-medium">Accelerate your admission</CardDescription>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">1,000</span>
                            <span className="text-neutral-300 font-medium">ETB / lifetime</span>
                        </div>
                        <p className="text-xs text-blue-400/70 mt-2 font-medium">One-time payment during limited pilot</p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-4">
                            {proFeatures.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 group/item">
                                    <div className="mt-1 bg-blue-500/20 rounded-full p-0.5">
                                        <Zap className="h-3.5 w-3.5 text-blue-400 fill-blue-400" />
                                    </div>
                                    <span className="text-neutral-200 group-hover/item:text-white transition-colors">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 shadow-lg shadow-blue-900/20"
                            onClick={handleUpgrade}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Initializing...
                                </>
                            ) : (
                                "Pay with Telebirr / CBE"
                            )}
                        </Button>
                        <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                            <ShieldCheck className="h-4 w-4" />
                            Secure localized payments via Chapa
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
