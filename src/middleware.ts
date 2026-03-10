import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isPublicRoute = createRouteMatcher([
    "/",
    "/:locale",
    "/en",
    "/am",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhooks(.*)",
    "/api/extension(.*)",
    "/api/uploadthing",
]);

export default clerkMiddleware(async (auth, req) => {
    // Run next-intl locale middleware for non-API routes
    if (!req.nextUrl.pathname.startsWith("/api")) {
        const intlResponse = intlMiddleware(req);
        if (intlResponse) return intlResponse;
    }

    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Match all paths except Next.js internals and static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
