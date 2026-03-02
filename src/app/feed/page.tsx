"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, GraduationCap, DollarSign, Calendar, Globe, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Opportunity {
    id: string;
    university: string;
    programName: string;
    description: string | null;
    deadline: string | null;
    isScholarship: boolean;
    isFreeApp: boolean;
    country: string | null;
    link: string;
    createdAt: string;
}

export default function OpportunitiesFeed() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

    const fetchOpportunities = async () => {
        try {
            const response = await fetch("/api/opportunities");
            if (response.ok) {
                const data = await response.json();
                setOpportunities(data);
            }
        } catch (error) {
            console.error("Failed to fetch opportunities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const handleSync = async () => {
        setIsSyncing(true);
        const toastId = toast.loading("Syncing latest opportunities from Telegram...");
        try {
            const response = await fetch("/api/admin/sync-telegram");
            const data = await response.json();
            if (response.ok) {
                toast.success(`Sync complete! Added ${data.addedCount} new opportunities.`, { id: toastId });
                if (data.addedCount > 0) {
                    fetchOpportunities();
                }
            } else {
                toast.error(data.error || "Failed to sync opportunities.", { id: toastId });
            }
        } catch (error) {
            console.error("Sync error:", error);
            toast.error("An error occurred during sync.", { id: toastId });
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSaveToTracker = async (opp: Opportunity) => {
        setSavingIds((prev) => new Set(prev).add(opp.id));
        try {
            const response = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    universityName: opp.university,
                    programName: opp.programName,
                    url: opp.link,
                    status: "SAVED",
                }),
            });

            if (response.ok) {
                toast.success(`Saved ${opp.university} to your tracker!`);
                setSavedIds((prev) => new Set(prev).add(opp.id));
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to save to tracker.");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("An error occurred while saving.");
        } finally {
            setSavingIds((prev) => {
                const next = new Set(prev);
                next.delete(opp.id);
                return next;
            });
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Live Opportunities Feed</h1>
                    <p className="text-muted-foreground">
                        Discover latest scholarships, free application waivers, and program openings from top universities.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="w-full md:w-auto"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? "Syncing..." : "Sync Now"}
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="gap-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="gap-2">
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : opportunities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold">No opportunities found</h2>
                    <p className="text-muted-foreground">Check back later for new updates!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.map((opp) => (
                        <Card key={opp.id} className="group relative overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-lg dark:hover:bg-accent/10">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-wrap gap-2">
                                        {opp.isScholarship && (
                                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800 animate-pulse-slow">
                                                <GraduationCap className="mr-1 h-3 w-3" />
                                                🏆 Scholarship
                                            </Badge>
                                        )}
                                        {opp.isFreeApp && (
                                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                                                <DollarSign className="mr-1 h-3 w-3" />
                                                💸 Free Registration
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <CardTitle className="text-xl line-clamp-1">{opp.university}</CardTitle>
                                <CardDescription className="text-primary font-medium line-clamp-1">
                                    {opp.programName}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4.5rem]">
                                    {opp.description || "Explore this exciting opportunity and take the next step in your academic journey."}
                                </p>
                                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                                    {opp.country && (
                                        <div className="flex items-center">
                                            <Globe className="mr-2 h-3.5 w-3.5" />
                                            {opp.country}
                                        </div>
                                    )}
                                    {opp.deadline && (
                                        <div className="flex items-center">
                                            <Calendar className="mr-2 h-3.5 w-3.5" />
                                            Deadline: {format(new Date(opp.deadline), "PPP")}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button variant="outline" className="flex-1" asChild>
                                    <a href={opp.link} target="_blank" rel="noopener noreferrer">
                                        View Link
                                        <ExternalLink className="ml-2 h-3.5 w-3.5" />
                                    </a>
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={() => handleSaveToTracker(opp)}
                                    disabled={savingIds.has(opp.id) || savedIds.has(opp.id)}
                                >
                                    {savingIds.has(opp.id) ? (
                                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                                    ) : savedIds.has(opp.id) ? (
                                        "Saved ✓"
                                    ) : (
                                        "Save Tracker"
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

