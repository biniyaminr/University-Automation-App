import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Layout from "@/components/layout/Layout";
import { notFound } from "next/navigation";

const locales = ["en", "am"];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Layout>{children}</Layout>
    </NextIntlClientProvider>
  );
}
