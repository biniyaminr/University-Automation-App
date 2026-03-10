"use client";

import { useEffect, useState } from "react";
import { Application } from "@prisma/client";
import {
    Building2, GraduationCap, Calendar, Loader2, LinkIcon,
    Sparkles, BookmarkIcon, CheckCircle2, Trash2, ChevronRight, ChevronLeft
} from "lucide-react";

// Status pipeline order
const STATUS_ORDER = ["SAVED", "IN_PROGRESS", "SUBMITTED"] as const;
type AppStatus = typeof STATUS_ORDER[number];

const STATUS_META: Record<AppStatus, { label: string; colorClass: string; textClass: string; borderClass: string }> = {
    SAVED: {
        label: "Saved",
        colorClass: "bg-blue-900/20",
        textClass: "text-blue-300",
        borderClass: "border-blue-800/30",
    },
    IN_PROGRESS: {
        label: "In Progress",
        colorClass: "bg-amber-900/20",
        textClass: "text-amber-300",
        borderClass: "border-amber-800/30",
    },
    SUBMITTED: {
        label: "Submitted",
        colorClass: "bg-emerald-900/20",
        textClass: "text-emerald-300",
        borderClass: "border-emerald-800/30",
    },
};

export default function ApplicationsDashboard() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await fetch("/api/applications");
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data);
                }
            } catch (error) {
                console.error("Failed to load applications", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApps();
    }, []);

    const handleDelete = async (id: string) => {
        // Optimistic update: remove from state instantly
        setApplications(prev => prev.filter(app => app.id !== id));
        try {
            const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
            if (!res.ok) {
                // Rollback by re-fetching if it fails
                const refreshed = await fetch("/api/applications");
                if (refreshed.ok) setApplications(await refreshed.json());
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleStatusChange = async (id: string, newStatus: AppStatus) => {
        // Optimistic update
        setApplications(prev =>
            prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
        );
        try {
            await fetch(`/api/applications/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (error) {
            console.error("Status update failed:", error);
        }
    };

    const getAdjacentStatuses = (currentStatus: string) => {
        const idx = STATUS_ORDER.indexOf(currentStatus as AppStatus);
        return {
            prev: idx > 0 ? STATUS_ORDER[idx - 1] : null,
            next: idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null,
        };
    };

    const savedApps = applications.filter(app => app.status === "SAVED" || app.status === "NOT_STARTED");
    const inProgressApps = applications.filter(app => app.status === "IN_PROGRESS");
    const submittedApps = applications.filter(app => app.status === "SUBMITTED");

    const AppCard = ({ app }: { app: Application }) => {
        const { prev, next } = getAdjacentStatuses(app.status);
        const score = app.matchScore;

        return (
            <div className="group relative rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm transition-all duration-200 hover:bg-neutral-800/70 hover:shadow-lg hover:border-neutral-700">
                <div className="flex flex-col gap-3">
                    {/* University */}
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                        <Building2 className="h-4 w-4 shrink-0" />
                        <span className="truncate">{app.universityName}</span>
                    </div>

                    {/* Program */}
                    <div className="flex items-start gap-2 text-white">
                        <GraduationCap className="h-5 w-5 shrink-0 text-neutral-500 mt-0.5" />
                        <h3 className="text-base font-semibold leading-tight line-clamp-2">{app.programName}</h3>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        {app.deadline && (
                            <div className="flex items-center gap-1.5 rounded-md bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-300 border border-blue-800/30">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                {app.deadline}
                            </div>
                        )}
                        {score !== null && (
                            <div className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium border ${score >= 80 ? "bg-emerald-900/20 text-emerald-300 border-emerald-800/30" :
                                    score >= 50 ? "bg-yellow-900/20 text-yellow-300 border-yellow-800/30" :
                                        "bg-red-900/20 text-red-300 border-red-800/30"
                                }`}>
                                <Sparkles className="h-3 w-3 shrink-0" />
                                {score}% Match
                            </div>
                        )}
                    </div>

                    {/* Portal Link */}
                    {app.url && (
                        <a
                            href={app.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors w-fit"
                        >
                            <LinkIcon className="h-3.5 w-3.5" />
                            Portal Link
                        </a>
                    )}

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-neutral-800">
                        {/* Stage Arrows */}
                        <div className="flex items-center gap-1">
                            {prev && (
                                <button
                                    onClick={() => handleStatusChange(app.id, prev)}
                                    title={`Move to ${STATUS_META[prev].label}`}
                                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    {STATUS_META[prev].label}
                                </button>
                            )}
                            {next && (
                                <button
                                    onClick={() => handleStatusChange(app.id, next)}
                                    title={`Move to ${STATUS_META[next].label}`}
                                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all"
                                >
                                    {STATUS_META[next].label}
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Delete */}
                        <button
                            onClick={() => handleDelete(app.id)}
                            title="Delete application"
                            className="rounded-md p-1.5 text-neutral-600 hover:bg-red-900/30 hover:text-red-400 transition-all"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    type ColumnProps = {
        title: string;
        icon: React.ElementType;
        apps: Application[];
        accentClass: string;
    };

    const Column = ({ title, icon: Icon, apps, accentClass }: ColumnProps) => (
        <div className="flex flex-col min-w-[320px] max-w-sm flex-1">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${accentClass}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">{title}</h2>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-medium text-neutral-400">
                    {apps.length}
                </span>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl bg-neutral-950/50 p-4 border border-white/5 min-h-[500px]">
                {apps.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center opacity-40">
                        <Icon className="h-8 w-8 text-neutral-500 mb-3" />
                        <p className="text-sm text-neutral-400">Empty pipeline stage</p>
                    </div>
                ) : (
                    apps.map(app => <AppCard key={app.id} app={app} />)
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
                    Application Tracker
                </h1>
                <p className="text-neutral-400 text-lg">
                    Manage your pipeline from discovery to submission.
                </p>
            </div>

            {isLoading ? (
                <div className="flex flex-1 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
                </div>
            ) : (
                <div className="flex flex-1 gap-6 overflow-x-auto pb-4">
                    <Column
                        title="Saved"
                        icon={BookmarkIcon}
                        apps={savedApps}
                        accentClass="bg-blue-900/30 text-blue-400"
                    />
                    <Column
                        title="In Progress"
                        icon={Loader2}
                        apps={inProgressApps}
                        accentClass="bg-amber-900/30 text-amber-400"
                    />
                    <Column
                        title="Submitted"
                        icon={CheckCircle2}
                        apps={submittedApps}
                        accentClass="bg-emerald-900/30 text-emerald-400"
                    />
                </div>
            )}
        </div>
    );
}
