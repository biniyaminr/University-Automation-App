"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { Home, FileText, User, GraduationCap, Briefcase, Compass, LogIn, CreditCard, Sparkles } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export function AppSidebar() {
    const pathname = usePathname();
    const t = useTranslations("Sidebar");

    const items = [
        {
            title: t("missionDashboard"),
            url: "/dashboard",
            icon: Home,
        },
        {
            title: t("masterProfile"),
            url: "/profile",
            icon: User,
        },
        {
            title: t("aiEssays"),
            url: "/essays",
            icon: FileText,
        },
        {
            title: t("aiCvMaker"),
            url: "/resume",
            icon: Briefcase,
        },
        {
            title: t("discoverPrograms"),
            url: "/discover",
            icon: Compass,
        },
        {
            title: t("applicationTracker"),
            url: "/applications",
            icon: GraduationCap,
        },
        {
            title: t("liveFeed"),
            url: "/feed",
            icon: Sparkles,
        },
        {
            title: t("pricing"),
            url: "/pricing",
            icon: CreditCard,
        },
    ];

    return (
        <Sidebar className="border-r border-border/50 bg-background/50 backdrop-blur-xl transition-all duration-300">
            <SidebarHeader className="h-16 flex items-center px-4 border-b border-border/50 bg-transparent">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-400">AssistedApp</h1>
            </SidebarHeader>
            <SidebarContent className="bg-transparent pt-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-muted-foreground font-semibold px-4 tracking-wider text-xs uppercase mb-2">{t("mainMenu")}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="px-2 space-y-1">
                            {items.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className={`
                        w-full justify-start gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isActive
                                                    ? 'bg-neutral-800/50 text-white shadow-sm ring-1 ring-white/10'
                                                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/30'
                                                }
                      `}
                                        >
                                            <Link href={item.url} className="flex items-center w-full">
                                                <item.icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110 text-neutral-200' : 'group-hover:scale-110'}`} />
                                                <span className="font-medium tracking-wide">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Auth Footer */}
            <SidebarFooter className="border-t border-border/50 p-4">
                <SignedOut>
                    <div className="flex flex-col gap-2">
                        <SignInButton mode="modal">
                            <button className="flex w-full items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-800/50 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-all hover:bg-neutral-700/60 hover:text-white">
                                <LogIn className="h-4 w-4" />
                                Log In
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-100">
                                Sign Up Free
                            </button>
                        </SignUpButton>
                    </div>
                </SignedOut>

                <SignedIn>
                    <div className="flex items-center gap-3 rounded-xl bg-neutral-800/50 px-4 py-3 ring-1 ring-white/5">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-8 w-8 rounded-lg",
                                },
                            }}
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-neutral-200">My Account</span>
                            <span className="text-xs text-neutral-500">Manage profile</span>
                        </div>
                    </div>
                </SignedIn>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}

