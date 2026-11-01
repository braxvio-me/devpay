import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDoc, LegalDocs, POLICY_VERSION } from "@/lib/legal";

export function generateStaticParams() {
  return LegalDocs.map((d) => ({ doc: d.id }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[doc]">): Promise<Metadata> {
  const doc = getDoc((await params).doc);
  return { title: doc ? `${doc.title} · DevPay` : "Policy · DevPay" };
}

export default function LegalPage({ params }: PageProps<"/legal/[doc]">) {
  return (
    <main className="mx-auto max-w-[760px] px-5 py-14 sm:px-8 sm:py-20">
      <Link href="/" className="inline-flex items-center gap-2 text-[15px] font-semibold text-blue hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> Back to DevPay
      </Link>
      <div className="mt-10 border-t border-line" />
      <Suspense fallback={<div className="mt-10 h-[60vh]" />}>
        <Policy params={params} />
      </Suspense>
    </main>
  );
}

async function Policy({ params }: { params: PageProps<"/legal/[doc]">["params"] }) {
  const doc = getDoc((await params).doc);
  if (!doc) notFound();

  return (
    <>
      <h1 className="mt-10 text-[clamp(2.25rem,6vw,3.5rem)] font-extrabold leading-[1] tracking-[-0.03em]">{doc.title}</h1>
      <p className="mt-4 text-[18px] text-ink-2">{doc.summary}</p>
      <p className="mt-2 text-[14px] text-muted">Version {POLICY_VERSION} · Draft pending legal review</p>
      <div className="mt-12 space-y-10 border-t border-line pt-10">
        {doc.sections.map((s, i) => (
          <section key={s.h}>
            <h2 className="text-[20px] font-semibold">
              {i + 1}. {s.h}
            </h2>
            <p className="mt-3 text-[17px] leading-[1.7] text-ink-2">{s.p}</p>
          </section>
        ))}
      </div>
      <nav className="mt-16 border-t border-line pt-8" aria-label="Other policies">
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
          {LegalDocs.filter((d) => d.id !== doc.id).map((d) => (
            <li key={d.id}>
              <Link href={`/legal/${d.id}`} className="text-blue hover:underline">
                {d.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
