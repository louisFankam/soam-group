import { notFound } from "next/navigation";
import { eq, and, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { pages, sections } from "@/lib/schema";
import { RenduSection } from "@/components/sections/RenduSection";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugChaine = slug.join("/");
  const page = await db.select().from(pages).where(and(eq(pages.slug, slugChaine), eq(pages.isPublished, true))).get();
  if (!page) return {};
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    keywords: page.metaKeywords,
  };
}

export default async function CmsPageCatchAll({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugChaine = slug.join("/");
  const page = await db.select().from(pages).where(and(eq(pages.slug, slugChaine), eq(pages.isPublished, true))).get();
  if (!page) notFound();

  const sectionsPage = await db
    .select()
    .from(sections)
    .where(and(eq(sections.pageId, page.id), eq(sections.isVisible, true)))
    .orderBy(asc(sections.orderColumn));

  return (
    <main className={page.cssClasses || ""}>
      {sectionsPage.map((section) => (
        <RenduSection key={section.id} section={section} />
      ))}
      {sectionsPage.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-headings font-bold text-3xl text-foreground mb-4">{page.title}</h1>
          <p className="text-muted-foreground">Cette page est en cours de construction.</p>
        </div>
      )}
    </main>
  );
}
