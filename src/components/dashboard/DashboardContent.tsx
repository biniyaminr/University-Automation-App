"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ClockIcon, CheckCircle2Icon, AlertCircleIcon, FileIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

export function DashboardContent() {
    const [applications, setApplications] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [universityName, setUniversityName] = useState("");
    const [programName, setProgramName] = useState("");
    const [deadline, setDeadline] = useState("");
    const [portalUrl, setPortalUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const [appsRes, docsRes] = await Promise.all([
                fetch('/api/applications'),
                fetch('/api/documents')
            ]);

            if (appsRes.ok) setApplications(await appsRes.json());
            if (docsRes.ok) setDocuments(await docsRes.json());
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/applications', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ universityName, programName, deadline, portalUrl })
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error(error.error || "Failed to create application");
                return;
            }

            toast.success("Application created successfully!");
            setIsDialogOpen(false);
            setUniversityName("");
            setProgramName("");
            setDeadline("");
            setPortalUrl("");
            fetchData();
        } catch (error) {
            toast.error("Network error creating application");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Derived State
    const totalApps = applications.length;
    const submittedApps = applications.filter(a => a.status === 'SUBMITTED').length;
    const completionRate = totalApps === 0 ? 0 : Math.round((submittedApps / totalApps) * 100);

    // Nearest Deadline
    const futureDeads = applications.filter(a => new Date(a.deadline) > new Date()).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    const nextDeadline = futureDeads.length > 0 ? futureDeads[0] : null;
    const nextDeadDays = nextDeadline ? Math.ceil((new Date(nextDeadline.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null;

    // Progress Pipeline
    const inProgress = applications.filter(a => a.status === 'IN_PROGRESS').length;
    const ready = applications.filter(a => a.status === 'READY').length;
    const notStarted = applications.filter(a => a.status === 'NOT_STARTED').length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">Mission Control</h2>
                    <p className="text-neutral-400 text-lg">Here's an overview of your application progress.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-500/20">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            New Application
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-neutral-100">
                        <DialogHeader>
                            <DialogTitle>Add New Application</DialogTitle>
                            <DialogDescription className="text-neutral-400">
                                Enter the details of your target university and program.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateApplication} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="universityName" className="text-neutral-300">University Name</Label>
                                <Input id="universityName" value={universityName} onChange={e => setUniversityName(e.target.value)} required placeholder="e.g. Stanford University" className="bg-neutral-950/50 border-neutral-800 text-neutral-200" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="programName" className="text-neutral-300">Program / Major</Label>
                                <Input id="programName" value={programName} onChange={e => setProgramName(e.target.value)} required placeholder="e.g. Computer Science, BS" className="bg-neutral-950/50 border-neutral-800 text-neutral-200" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deadline" className="text-neutral-300">Application Deadline</Label>
                                <Input id="deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required className="bg-neutral-950/50 border-neutral-800 text-neutral-200 [color-scheme:dark]" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="portalUrl" className="text-neutral-300">Portal URL (Optional)</Label>
                                <Input id="portalUrl" type="url" value={portalUrl} onChange={e => setPortalUrl(e.target.value)} placeholder="https://apply.university.edu" className="bg-neutral-950/50 border-neutral-800 text-neutral-200" />
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                                    {isSubmitting ? "Saving..." : "Create Application"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-neutral-900/40 border-border/50 backdrop-blur-sm shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-neutral-300">Total Applications</CardTitle>
                        <AlertCircleIcon className="w-4 h-4 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-neutral-100">{totalApps}</div>
                        <p className="text-xs text-neutral-500 mt-1">{futureDeads.length} active deadlines</p>
                    </CardContent>
                </Card>

                <Card className="bg-neutral-900/40 border-border/50 backdrop-blur-sm shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-neutral-300">Submitted</CardTitle>
                        <CheckCircle2Icon className="w-4 h-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-neutral-100">{submittedApps}</div>
                        <p className="text-xs text-neutral-500 mt-1">{completionRate}% completion rate</p>
                    </CardContent>
                </Card>

                <Card className="bg-neutral-900/40 border-border/50 backdrop-blur-sm shadow-xl relative overflow-hidden group border-amber-500/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-100" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-amber-200">Next Deadline</CardTitle>
                        <ClockIcon className="w-4 h-4 text-amber-400 animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-100">
                            {nextDeadDays !== null ? `${nextDeadDays} Days` : "-"}
                        </div>
                        <p className="text-xs text-amber-400/80 mt-1 truncate">
                            {nextDeadline ? nextDeadline.universityName : "No upcoming deadlines"}
                        </p>
                    </CardContent>
                </Card>

                <Link href="/documents" className="block focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-xl">
                    <Card className="bg-neutral-900/40 border-border/50 backdrop-blur-sm shadow-xl relative overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-neutral-300">Documents</CardTitle>
                            <FileIcon className="w-4 h-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-neutral-100">{documents.length}</div>
                            <p className="text-xs text-neutral-500 mt-1">Uploaded to vault</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1 bg-neutral-900/40 border-border/50 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-neutral-200">Application Progress</CardTitle>
                        <CardDescription className="text-neutral-400">Your pipeline status across all universities.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-300">In Progress</span>
                                <span className="font-medium text-neutral-100">{inProgress}</span>
                            </div>
                            <Progress value={totalApps ? (inProgress / totalApps) * 100 : 0} className="h-2 bg-neutral-800" indicatorClass="bg-blue-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-300">Ready</span>
                                <span className="font-medium text-neutral-100">{ready}</span>
                            </div>
                            <Progress value={totalApps ? (ready / totalApps) * 100 : 0} className="h-2 bg-neutral-800" indicatorClass="bg-indigo-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-300">Not Started</span>
                                <span className="font-medium text-neutral-100">{notStarted}</span>
                            </div>
                            <Progress value={totalApps ? (notStarted / totalApps) * 100 : 0} className="h-2 bg-neutral-800" indicatorClass="bg-neutral-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-300">Submitted</span>
                                <span className="font-medium text-neutral-100">{submittedApps}</span>
                            </div>
                            <Progress value={totalApps ? (submittedApps / totalApps) * 100 : 0} className="h-2 bg-neutral-800" indicatorClass="bg-emerald-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 bg-neutral-900/40 border-border/50 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-neutral-200">Upcoming Deadlines</CardTitle>
                        <CardDescription className="text-neutral-400">Applications needing your attention soon.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {futureDeads.length > 0 ? (
                                futureDeads.slice(0, 3).map((app, i) => {
                                    const daysLeft = Math.ceil((new Date(app.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                    return (
                                        <div key={app.id || i} className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/30 border border-neutral-800/50 hover:bg-neutral-800/50 transition-colors">
                                            <div>
                                                <p className="font-medium text-neutral-200">{app.universityName}</p>
                                                <p className="text-xs text-neutral-500">{app.programName}</p>
                                            </div>
                                            <Badge variant="outline" className={
                                                daysLeft < 7 ? "text-red-400 border-red-400/30 bg-red-400/10" :
                                                    daysLeft < 15 ? "text-amber-400 border-amber-400/30 bg-amber-400/10" :
                                                        "text-indigo-400 border-indigo-400/30 bg-indigo-400/10"
                                            }>{daysLeft} Days</Badge>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="text-center py-6 text-neutral-500 text-sm">
                                    No upcoming deadlines. Click "New Application" to add one!
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
