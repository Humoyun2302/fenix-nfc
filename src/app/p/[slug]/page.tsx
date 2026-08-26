import type { Metadata } from "next";
import { getPublicPage } from "@/lib/publishing/public";
import { PageCanvas } from "@/components/blocks/page-canvas";
import { PublicStateScreen } from "@/components/blocks/public-states";
import { PageTracker } from "@/components/analytics/page-tracker";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicPage(slug);
  if (result.state !== "ok") {
    return { title: "Page unavailable" };
  }
  const { snapshot } = result;
  const title = snapshot.seo.title ?? snapshot.title;
  const description = snapshot.seo.description;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: snapshot.seo.ogImage ? [{ url: snapshot.seo.ogImage }] : undefined,
      type: "website",
    },
    icons: snapshot.seo.favicon ? { icon: snapshot.seo.favicon } : undefined,
    robots: { index: true, follow: true },
  };
}

export default async function PublicPage({ params }: Params) {
  const { slug } = await params;
  const result = await getPublicPage(slug);

  if (result.state !== "ok") {
    return <PublicStateScreen state={result.state} />;
  }

  return (
    <main className="min-h-dvh">
      <PageTracker workspaceId={result.workspaceId} pageId={result.pageId} />
      <PageCanvas
        blocks={result.snapshot.blocks}
        design={result.snapshot.design}
        themeConfig={result.themeConfig}
        ctx={{
          workspaceId: result.workspaceId,
          pageId: result.pageId,
          interactive: true,
        }}
      />
    </main>
  );
}
