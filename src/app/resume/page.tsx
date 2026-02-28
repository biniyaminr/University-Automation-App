"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, Wand2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export default function ResumeBuilder() {
    const [targetProgram, setTargetProgram] = useState("");
    const [targetUniversity, setTargetUniversity] = useState("");
    const [isTailoring, setIsTailoring] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isParsingPDF, setIsParsingPDF] = useState(false);
    const [parsedCvText, setParsedCvText] = useState("");
    const [resumeData, setResumeData] = useState<any>(null);
    const [tailoredSummary, setTailoredSummary] = useState("");
    const [educationList, setEducationList] = useState<any[]>([]);
    const [tailoredExperience, setTailoredExperience] = useState<any[]>([]);
    const [tailoredSkills, setTailoredSkills] = useState<string[]>([]);
    const resumeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch base profile data on load
        fetch("/api/resume-data")
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    setResumeData(data);
                    setEducationList(data.educations || []);
                }
            })
            .catch(err => console.error("Error fetching resume data", err));
    }, []);

    const handleTailor = async () => {
        if (!targetProgram || !targetUniversity) {
            alert("Please fill in both Target Program and Target University.");
            return;
        }

        if (!resumeData?.extracurriculars?.length && !parsedCvText) {
            alert("No extracurricular data found to tailor. Please add experience to your profile or upload a CV.");
            return;
        }

        setIsTailoring(true);

        try {
            const res = await fetch("/api/tailor-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetProgram,
                    targetUniversity,
                    extracurriculars: resumeData?.extracurriculars || [],
                    cvText: parsedCvText // Pass the optional parsed CV context
                })
            });

            if (res.ok) {
                const dataText = await res.text();
                try {
                    const parsedData = JSON.parse(dataText);
                    console.log("Parsed AI Data:", parsedData);

                    setTailoredSummary(parsedData.summary || "");

                    if (parsedData.education && Array.isArray(parsedData.education) && parsedData.education.length > 0) {
                        setEducationList(parsedData.education);
                    } else {
                        console.warn("AI returned empty education array. Falling back to DB profile education.");
                        // Keep the existing educationList (which was initialized with resumeData.educations)
                    }

                    setTailoredExperience(parsedData.experience || []);
                    setTailoredSkills(parsedData.skills || []);
                } catch (e) {
                    console.error("Failed to parse JSON API response:", e, dataText);
                    alert("The AI returned improperly formatted data. Please try again.");
                }
            } else {
                const errText = await res.text();
                console.error("Tailor API Error:", errText);
                alert(`Tailoring failed: ${errText}`);
            }
        } catch (error: any) {
            console.error("Tailoring failed", error);
            alert(`Network error: ${error.message}`);
        } finally {
            setIsTailoring(false);
        }
    };

    const handleExportPDF = useReactToPrint({
        contentRef: resumeRef,
        documentTitle: "Biniyam_Dereje_CV",
    }) as unknown as () => void;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== "application/pdf") {
            alert("Please upload a valid PDF file.");
            return;
        }

        setIsParsingPDF(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch('/api/parse-pdf', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.details || errData?.error || "Parse failed");
            }

            const data = await res.json();
            setParsedCvText(data.text);
            console.log("PDF parsed successfully. Length:", data.text.length);

        } catch (error: any) {
            console.error("Error reading PDF:", error);
            alert(`Failed to read the PDF: ${error.message}`);
            setParsedCvText("");
        } finally {
            setIsParsingPDF(false);
        }
    };

    if (!resumeData) {
        return (
            <div className="flex-1 flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 overflow-hidden flex flex-col lg:flex-row gap-8 print:p-0 print:m-0 print:overflow-visible print:bg-white print:text-black">
            <style dangerouslySetInnerHTML={{ __html: `@media print { @page { margin: 0 !important; } body { -webkit-print-color-adjust: exact; padding: 1cm !important; } }` }} />

            {/* Left Panel: Controls */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6 print:hidden">
                <Card className="bg-neutral-900/50 backdrop-blur-xl border-neutral-800 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
                            AI CV Maker
                        </CardTitle>
                        <CardDescription className="text-neutral-400">
                            Dynamically tailor your resume content to align perfectly with your target university program.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-300 ml-1">Target Program</label>
                                    <Input
                                        placeholder="e.g. Computer Science"
                                        value={targetProgram}
                                        onChange={(e) => setTargetProgram(e.target.value)}
                                        className="bg-neutral-800/50 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-300 ml-1">Target University</label>
                                    <Input
                                        placeholder="e.g. Stanford"
                                        value={targetUniversity}
                                        onChange={(e) => setTargetUniversity(e.target.value)}
                                        className="bg-neutral-800/50 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 h-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 ml-1">Upload Existing CV (Optional)</label>
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                    className="bg-neutral-800/50 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 h-10 file:text-white file:border-0 file:bg-neutral-700 file:rounded file:px-2 file:py-1 file:mr-2 cursor-pointer pt-1"
                                />
                                {isParsingPDF && (
                                    <p className="text-xs text-blue-400 flex items-center mt-1">
                                        <Loader2 className="w-3 h-3 animate-spin mr-1" /> Reading PDF...
                                    </p>
                                )}
                                {parsedCvText && !isParsingPDF && (
                                    <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                        PDF successfully parsed and acts as AI context.
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={handleTailor}
                            disabled={isTailoring || !targetProgram || !targetUniversity}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 transition-all font-semibold"
                        >
                            {isTailoring ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Tailoring with AI...</>
                            ) : (
                                <><Wand2 className="mr-2 h-5 w-5" /> Tailor with AI</>
                            )}
                        </Button>

                        <div className="pt-4 border-t border-neutral-800">
                            <Button
                                onClick={handleExportPDF}
                                disabled={isExporting}
                                variant="outline"
                                className="w-full h-12 border-neutral-700 hover:bg-neutral-800 text-neutral-100 transition-all"
                            >
                                {isExporting ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating PDF...</>
                                ) : (
                                    <><Download className="mr-2 h-4 w-4" /> Download PDF</>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Panel: A4 Live Preview */}
            <div className="hidden lg:flex flex-1 justify-center items-start overflow-y-auto pb-10 custom-scrollbar print:flex print:block print:overflow-visible print:p-0 print:m-0">
                {/* Fixed physical dimensions for A4 PDF calculation on screen; fluid on print */}
                <div className="bg-white shadow-2xl origin-top print:shadow-none print:transform-none print:w-full print:h-full print:!scale-100" style={{ width: '794px', minHeight: '1123px', transform: 'scale(0.85)' }}>
                    {/* The actual resume content */}
                    <div ref={resumeRef} className="w-full h-full bg-white p-12 text-black font-sans box-border print:p-0" style={{ minHeight: '1123px' }}>

                        {/* Header */}
                        <div className="border-b-2 border-neutral-800 pb-6 mb-6">
                            <h1 contentEditable={true} suppressContentEditableWarning={true} className="text-4xl font-bold uppercase tracking-wider text-neutral-900 hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 px-1 -ml-1">{resumeData.fullName}</h1>
                            <div className="flex gap-4 text-sm text-neutral-600 mt-3 font-medium">
                                <span contentEditable={true} suppressContentEditableWarning={true} className="hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 px-1 -ml-1">{resumeData.email}</span>
                                {resumeData.phone && <span contentEditable={true} suppressContentEditableWarning={true} className="hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 px-1">• {resumeData.phone}</span>}
                                {resumeData.address && <span contentEditable={true} suppressContentEditableWarning={true} className="hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 px-1">• {resumeData.address}, {resumeData.city}, {resumeData.country}</span>}
                            </div>
                        </div>

                        {/* Summary */}
                        {tailoredSummary && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold uppercase tracking-widest text-neutral-800 mb-2 border-b border-neutral-300 pb-1">Professional Summary</h2>
                                <p contentEditable={true} suppressContentEditableWarning={true} className="text-sm text-neutral-700 leading-relaxed hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 p-1 -ml-1">{tailoredSummary}</p>
                            </div>
                        )}

                        {/* Education */}
                        {educationList.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-bold uppercase tracking-widest text-neutral-800 mb-4 border-b border-neutral-300 pb-1">Education</h2>
                                <div className="space-y-4">
                                    {educationList.map((edu: any, i: number) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline font-bold text-neutral-900">
                                                <span contentEditable={true} suppressContentEditableWarning={true} className="hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 px-1 -ml-1">
                                                    {edu.institutionName || edu.institution}
                                                </span>
                                                <span contentEditable={true} suppressContentEditableWarning={true} className="text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 px-1">
                                                    {edu.date ? edu.date : edu.startDate
                                                        ? `${new Date(edu.startDate).getFullYear()} - ${edu.gradDate ? new Date(edu.gradDate).getFullYear() : 'Present'}`
                                                        : ''}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-baseline text-sm mt-1">
                                                <span contentEditable={true} suppressContentEditableWarning={true} className="italic text-neutral-700 hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 px-1 -ml-1">
                                                    {edu.degree}{edu.location ? `, ${edu.location}` : edu.city ? `, ${edu.city}` : ''}{edu.country && !edu.location ? `, ${edu.country}` : ''}
                                                </span>
                                                {edu.gpa && <span contentEditable={true} suppressContentEditableWarning={true} className="font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 px-1">GPA: {edu.gpa}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Extracurriculars / Experience */}
                        {(tailoredExperience.length > 0 || resumeData.extracurriculars?.length > 0) && (
                            <div className="mb-8">
                                <h2 className="text-lg font-bold uppercase tracking-widest text-neutral-800 mb-4 border-b border-neutral-300 pb-1">Experience & Activities</h2>
                                <div className="space-y-6">
                                    {(tailoredExperience.length > 0 ? tailoredExperience : resumeData.extracurriculars).map((ex: any, i: number) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline font-bold text-neutral-900">
                                                <span contentEditable={true} suppressContentEditableWarning={true} className="hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 px-1 -ml-1">{ex.role} <span className="font-normal text-neutral-500">at</span> {ex.organization || ex.company}</span>
                                                <span contentEditable={true} suppressContentEditableWarning={true} className="text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 px-1">
                                                    {ex.startDate
                                                        ? `${new Date(ex.startDate).getFullYear()} - ${ex.endDate ? new Date(ex.endDate).getFullYear() : 'Present'}`
                                                        : ex.date?.toString() || ''}
                                                </span>
                                            </div>

                                            {/* AI Tailored specific output rendering */}
                                            <ul className="list-disc list-outside ml-4 mt-2 text-sm text-neutral-700 space-y-1">
                                                {ex.bullets ? ex.bullets.map((point: string, idx: number) => (
                                                    <li key={idx} contentEditable={true} suppressContentEditableWarning={true} className="leading-relaxed pl-1 hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 p-0.5 -ml-1">{point}</li>
                                                )) : (ex.description || '').split('\n').filter((p: string) => p.trim() !== '').map((point: string, idx: number) => (
                                                    <li key={idx} contentEditable={true} suppressContentEditableWarning={true} className="leading-relaxed pl-1 hover:bg-neutral-100 transition-colors rounded outline-none focus:ring-1 focus:ring-blue-500/50 p-0.5 -ml-1">{point.replace(/^[-•]\s*/, '')}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {tailoredSkills.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-bold uppercase tracking-widest text-neutral-800 mb-4 border-b border-neutral-300 pb-1">Skills</h2>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tailoredSkills.map((skill, i) => (
                                        <span key={i} contentEditable={true} suppressContentEditableWarning={true} className="text-sm font-medium text-neutral-700 bg-neutral-100/80 px-3 py-1.5 rounded-sm border border-neutral-200 hover:bg-neutral-200 transition-colors outline-none focus:ring-1 focus:ring-blue-500/50">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
