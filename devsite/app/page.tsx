import Image from "next/image";
import Link from "next/link";
import { Check, Fingerprint, KeyRound, Landmark, Lock, Plus } from "lucide-react";
import { DownloadButton } from "@/components/download-button";
import { EscrowDemo } from "@/components/escrow-demo";
import { Phone } from "@/components/phone";
import { StepsTimeline } from "@/components/steps-timeline";
import { GalleryStrip } from "@/components/gallery-strip";
import { LegalDocs } from "@/lib/legal";
import { FAQ, SUPPORT_EMAIL, TAGLINE } from "@/lib/site";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#wallet", label: "The app" },
  { href: "#who", label: "Freelancers & clients" },
  { href: "#trust", label: "Security" },
  { href: "#faq", label: "FAQ" },
];

/** Synthetic ledger rows, the same examples the app's receipts screen ships with. */
const LEDGER = [
  { date: "31 Oct 14:30", ref: "ESC-REL-8831", what: "Released · Milestone 2", amount: "2,000.00", state: "SENT" },
  { date: "30 Oct 10:15", ref: "ESC-FND-1029", what: "Escrow funding · Booking app", amount: "5,000.00", state: "HELD" },
  { date: "30 Oct 10:15", ref: "MOMO-WD-1029", what: "Payout to MTN MoMo", amount: "850.00", state: "SENT" },
  { date: "12 Oct 09:02", ref: "ESC-REL-8210", what: "Released · Learning dashboard", amount: "1,500.00", state: "SENT" },
];

const GALLERY = [
  { src: "/screens/home.jpg", label: "Jobs that fit your skills" },
  { src: "/screens/hub.jpg", label: "Your work in one place" },
  { src: "/screens/chat.jpg", label: "Chat inside the deal" },
  { src: "/screens/success.jpg", label: "Every step confirmed" },
  { src: "/screens/profile.jpg", label: "A profile clients trust" },
  { src: "/screens/earnings-dark.jpg", label: "Dark mode included" },
  { src: "/screens/policy.jpg", label: "Policies, one page at a time" },
  { src: "/screens/face-scan.jpg", label: "Face scan for verification" },
];

const TRUST = [
  { t: "Ghana Card verification", d: "Freelancers upload both sides of their Ghana Card. Clients verify their business." },
  { t: "A live face scan", d: "Look straight, turn left, turn right, blink. Your selfie is matched to your card photo." },
  { t: "Money held, not spent", d: "Escrowed money can’t be touched by either side until the milestone is settled." },
  { t: "Face ID and fingerprint", d: "Biometrics open the app. The check happens on your phone; DevPay never sees it." },
  { t: "One role per account", d: "An account is a client or a freelancer, never both, so nobody hires themselves." },
  { t: "Rules you actually read", d: "Terms, privacy, escrow and refunds, one page at a time before you start." },
];

const H2 = "text-[clamp(2.1rem,3.8vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.035em] [text-wrap:balance]";

function Mark({ size = 28 }: { size?: number }) {
  return <Image src="/logo-mark.png" alt="" width={Math.round(size * (218 / 149))} height={size} priority />;
}

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-paper focus:px-4 focus:py-2">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <nav className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8" aria-label="Main">
          <Link href="/" className="flex items-center gap-2.5" aria-label="DevPay home">
            <Mark />
            <span className="text-[20px] font-extrabold tracking-[-0.03em]">
              Dev<span className="text-blue">Pay</span>
            </span>
          </Link>
          <ul className="hidden items-center gap-8 text-[15px] font-medium text-ink-2 lg:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#download" className="rounded-[10px] bg-blue px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-deep">
            Get the app
          </a>
        </nav>
      </header>

      <main id="main">
        {/* First viewport: the product itself */}
        <section className="bg-paper">
          <div className="mx-auto grid max-w-[1240px] gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-20">
            <div className="rise">
              <h1 className="text-[clamp(2.6rem,5.4vw,4.25rem)] font-extrabold leading-[1] tracking-[-0.04em]">
                <span className="block whitespace-nowrap">Money first.</span>
                <span className="block whitespace-nowrap text-blue">Then the work.</span>
              </h1>
              <p className="mt-7 max-w-[44ch] text-[19px] leading-[1.6] text-ink-2">
                DevPay holds every milestone in escrow before work starts. When the client approves, it’s released to the freelancer’s wallet, ready
                to withdraw to Mobile Money. Built in Ghana for freelancers and the people who hire them.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <DownloadButton />
                <a href="#how" className="text-[16px] font-semibold text-blue hover:underline">
                  See how escrow works
                </a>
              </div>
              <StoreChips className="mt-8" />
              <p className="mt-4 text-[14px] text-muted">Early access: payments switch on at public launch.</p>
            </div>

            <div className="relative overflow-hidden rounded-[20px] bg-blue px-5 pb-8 pt-8 sm:px-10 sm:pb-10 lg:min-h-[600px] lg:pt-12">
              {/* The real app behind the live component: cropped on phones, standing on desktop. */}
              <div className="mx-auto h-[150px] w-[200px] overflow-hidden lg:absolute lg:right-10 lg:top-12 lg:mx-0 lg:h-auto lg:w-[230px]">
                <Phone src="/screens/wallet-open.jpg" alt="The DevPay app (demo account) showing an escrow balance on the blue escrow card" width={230} priority />
              </div>
              <div className="relative z-10 -mt-12 lg:mt-24 lg:w-[80%]">
                <EscrowDemo />
              </div>
              <p className="mt-6 text-center text-[14px] text-on-blue-muted">Try it: you’re the client. Approve the work to release the money.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-line">
          <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-32">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
              <h2 className={H2}>Nobody starts work on a promise.</h2>
              <p className="max-w-[50ch] text-[18px] leading-relaxed text-ink-2">
                Every job is split into milestones. Each one moves through the same four steps, and money only moves when the step before it is done.
              </p>
            </div>
            <div className="mt-16">
              <StepsTimeline />
            </div>
          </div>
        </section>

        {/* The wallet */}
        <section id="wallet" className="bg-blue text-white">
          <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.4fr] lg:items-center lg:py-32">
            <div className="min-w-0">
              <h2 className={H2}>Your wallet stays shut until your PIN.</h2>
              <p className="mt-6 max-w-[46ch] text-[18px] leading-relaxed text-on-blue-muted">
                Your balance lives on a DevPay card that only slides out after your own 4-digit PIN. It closes again after two minutes or when you
                leave the app, and withdrawals ask for the same PIN.
              </p>
              <ul className="mt-8 space-y-3.5 text-[16px]">
                {[
                  { icon: KeyRound, t: "A PIN only you set, stored scrambled on your phone" },
                  { icon: Lock, t: "Five wrong tries locks entry for 30 seconds" },
                  { icon: Fingerprint, t: "Face ID or fingerprint to open the app" },
                ].map(({ icon: Icon, t }) => (
                  <li key={t} className="flex items-center gap-3">
                    <Icon className="size-5 flex-none" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mx-5 flex min-w-0 snap-x snap-mandatory items-end gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:justify-center sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
              {[
                { src: "/screens/wallet-locked.jpg", alt: "DevPay home screen with the wallet closed and the balance hidden", cap: "Closed", w: 210 },
                { src: "/screens/pin.jpg", alt: "The wallet PIN pad asking the user to create a 4-digit PIN", cap: "Your PIN", w: 250 },
                { src: "/screens/wallet-open.jpg", alt: "The blue DevPay escrow card out of the wallet showing GH₵ 28,500.00", cap: "Open", w: 210 },
              ].map((p) => (
                <figure key={p.cap} className={`flex-none snap-center ${p.cap === "Your PIN" ? "sm:-mb-8" : ""}`}>
                  <Phone src={p.src} alt={p.alt} width={p.w} />
                  <figcaption className="mt-4 text-center text-[14px] font-medium text-on-blue-muted">{p.cap}</figcaption>
                </figure>
              ))}
            </div>
            <p className="text-[13px] text-on-blue-muted lg:col-start-2 lg:text-center">Screens from the app’s demo account.</p>
          </div>
        </section>

        {/* Freelancers and clients */}
        <section id="who" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-line">
            <Audience
              title="For freelancers."
              line="Stop chasing payments."
              points={[
                "See the milestone is funded before you write a line",
                "Withdraw to MTN MoMo, Telecel Cash or your bank",
                "Paid automatically if the client goes quiet for 7 days",
                "A Verified badge from your Ghana Card and a face scan",
                "Jobs, proposals and live deadlines in one work hub",
              ]}
              phone={{ src: "/screens/hub.jpg", alt: "The My work hub listing open jobs from Volta Pay, Sankofa Studio and Kente Labs" }}
            />
            <Audience
              title="For clients."
              line="Pay for work you’ve seen."
              points={[
                "Money waits in escrow until you approve the delivery",
                "Up to two revision requests on every milestone",
                "Hire freelancers whose identity is verified",
                "A PDF receipt for every payment, ready for your books",
                "Chat, files and voice notes live inside the project",
              ]}
              phone={{ src: "/screens/chat.jpg", alt: "A project chat with a pinned note that Milestone 2 is funded and a submitted deliverable" }}
            />
          </div>
        </section>

        {/* Ledger */}
        <section className="bg-graphite text-white">
          <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:py-32">
            {/* min-w-0 lets the ledger table scroll inside its column instead of widening the page. */}
            <div className="min-w-0">
              <h2 className={H2}>Every cedi leaves a receipt.</h2>
              <p className="mt-6 max-w-[52ch] text-[18px] leading-relaxed text-on-graphite-muted">
                Funding, releases, payouts and fees each create a numbered receipt. Download it as a PDF or share it straight to WhatsApp.
              </p>
              <ul className="mt-10 border-y border-graphite-line sm:hidden" aria-label="Example DevPay ledger">
                {LEDGER.map((r) => (
                  <li key={r.ref} className="flex items-start justify-between gap-4 border-t border-graphite-line py-4 first:border-t-0">
                    <div className="min-w-0">
                      <p className="font-mono text-[13px] text-on-graphite-muted">
                        {r.ref} · {r.date}
                      </p>
                      <p className="mt-1 text-[15px]">{r.what}</p>
                    </div>
                    <div className="text-right font-mono">
                      <p className="tabular text-[15px]">{r.amount}</p>
                      <p className={`mt-1 text-[12px] font-semibold ${r.state === "HELD" ? "text-orange" : "text-teal"}`}>{r.state}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-10 hidden overflow-x-auto border-y border-graphite-line sm:block">
                <table className="w-full min-w-[560px] text-left">
                  <caption className="sr-only">Example DevPay ledger</caption>
                  <thead>
                    <tr className="text-[12px] uppercase tracking-[0.08em] text-on-graphite-muted">
                      <th className="py-3 pr-4 font-semibold">Date</th>
                      <th className="py-3 pr-4 font-semibold">Reference</th>
                      <th className="py-3 pr-4 font-semibold">Payment</th>
                      <th className="py-3 pr-4 text-right font-semibold">GH₵</th>
                      <th className="py-3 text-right font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="whitespace-nowrap font-mono text-[14px]">
                    {LEDGER.map((r) => (
                      <tr key={r.ref} className="border-t border-graphite-line">
                        <td className="py-3.5 pr-4 text-on-graphite-muted">{r.date}</td>
                        <td className="py-3.5 pr-4">{r.ref}</td>
                        <td className="py-3.5 pr-4 font-sans text-[15px]">{r.what}</td>
                        <td className="tabular py-3.5 pr-4 text-right">{r.amount}</td>
                        <td className={`py-3.5 text-right font-semibold ${r.state === "HELD" ? "text-orange" : "text-teal"}`}>{r.state}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[13px] text-on-graphite-muted">Example entries from the app’s demo account.</p>
            </div>
            <div className="flex justify-center">
              <Phone src="/screens/receipt.jpg" alt="A DevPay receipt for a GH₵ 850.00 payout to MTN MoMo with a Download PDF button" width={280} />
            </div>
          </div>
        </section>

        {/* Trust */}
        <section id="trust" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-[1fr_300px] lg:items-start">
            <div>
              <h2 className={`max-w-[16ch] ${H2}`}>Built for people who’ve been burned before.</h2>
              <figure className="mt-10 lg:hidden">
                <Phone src="/screens/face-scan.jpg" alt="DevPay’s face scan mid-check, asking the user to turn slightly right inside a ring of progress ticks" width={240} className="mx-auto" />
                <figcaption className="mt-4 text-center text-[14px] font-medium text-ink-2">The live face scan</figcaption>
              </figure>
              <dl className="mt-12 max-w-[720px]">
                {TRUST.map(({ t, d }) => (
                  <div key={t} className="grid gap-2 border-t border-line py-7 sm:grid-cols-[240px_1fr] sm:gap-8">
                    <dt className="text-[19px] font-semibold tracking-[-0.01em]">{t}</dt>
                    <dd className="text-[16px] leading-relaxed text-ink-2">{d}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure className="hidden lg:sticky lg:top-28 lg:block">
              <Phone src="/screens/face-scan.jpg" alt="DevPay’s face scan mid-check, asking the user to turn slightly right inside a ring of progress ticks" width={300} />
              <figcaption className="mt-4 text-center text-[14px] font-medium text-ink-2">The live face scan</figcaption>
            </figure>
          </div>
        </section>

        {/* Gallery */}
        <section aria-labelledby="gallery-title" className="border-y border-line bg-paper py-20 lg:py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <h2 id="gallery-title" className={H2}>
              The whole app, in your pocket.
            </h2>
          </div>
          <div className="mt-12">
            <GalleryStrip items={GALLERY} />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
            <h2 className={H2}>Questions, answered.</h2>
            <div className="border-t border-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[18px] font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Plus aria-hidden className="size-5 flex-none text-blue transition-transform duration-300 group-open:rotate-45" strokeWidth={2.2} />
                  </summary>
                  <p className="max-w-[62ch] pb-7 text-[17px] leading-relaxed text-ink-2">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Download */}
        <section id="download" className="px-5 pb-24 sm:px-8 lg:pb-32">
          <div className="mx-auto max-w-[1240px] rounded-[20px] bg-blue px-6 py-16 text-white sm:px-14 lg:px-20 lg:py-24">
            <h2 className="max-w-[18ch] text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">Work starts when the money’s in.</h2>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <DownloadButton tone="white" inert />
              <StoreChips tone="blue" />
            </div>
            <ol className="mt-14 grid max-w-[980px] gap-8 border-t border-blue-3 pt-10 sm:grid-cols-3">
              {[
                { t: "Download the APK", d: "Tap the button on your Android phone. The file is saved to Downloads." },
                { t: "Allow the install", d: "Android asks once to allow installs from your browser. That’s normal outside Google Play." },
                { t: "Sign up in minutes", d: "Pick client or freelancer, verify your number, read the policies, fill your profile." },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="grid size-8 flex-none place-items-center rounded-full bg-white text-[14px] font-bold text-blue">{i + 1}</span>
                  <div>
                    <p className="text-[18px] font-semibold">{s.t}</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-on-blue-muted">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-12 max-w-[70ch] text-[14px] leading-relaxed text-on-blue-muted">
              Early access: payments, Mobile Money payouts and identity checks switch on at public launch. Questions? Email{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-white underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-paper">
        <div className="mx-auto max-w-[1240px] px-5 pb-12 pt-16 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <Mark size={24} />
                <span className="text-[19px] font-extrabold tracking-[-0.03em]">
                  Dev<span className="text-blue">Pay</span>
                </span>
              </div>
              <p className="mt-4 max-w-[34ch] text-[15px] text-ink-2">{TAGLINE} Milestone escrow for Ghana, paid out to Mobile Money.</p>
            </div>
            <div>
              <p className="text-[14px] font-semibold">Policies</p>
              <ul className="mt-4 space-y-2.5 text-[15px] text-ink-2">
                {LegalDocs.map((d) => (
                  <li key={d.id}>
                    <Link href={`/legal/${d.id}`} className="hover:text-blue">
                      {d.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[14px] font-semibold">Contact</p>
              <ul className="mt-4 space-y-2.5 text-[15px] text-ink-2">
                <li>
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-blue">
                    {SUPPORT_EMAIL}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Landmark className="size-4" aria-hidden /> Accra, Ghana
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-14 border-t border-line pt-6 text-[13px] text-muted">© 2026 DevPay. Policies are drafts pending legal review.</p>
        </div>
      </footer>
    </>
  );
}

function Audience({ title, line, points, phone }: { title: string; line: string; points: string[]; phone: { src: string; alt: string } }) {
  return (
    <div className="flex flex-col gap-10 sm:flex-row sm:items-start lg:px-12 lg:first:pl-0 lg:last:pr-0">
      <div className="flex-1">
        <h2 className="text-[clamp(1.9rem,3vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
          <span className="text-blue">{title}</span> {line}
        </h2>
        <ul className="mt-8 space-y-4">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-[16px] leading-snug text-ink-2">
              <Check className="mt-0.5 size-5 flex-none text-teal-ink" strokeWidth={2.5} aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <Phone src={phone.src} alt={phone.alt} width={200} className="mx-auto flex-none sm:mx-0" />
    </div>
  );
}

/** Store listings are not live yet; plain chips say so rather than borrowing official badges. */
function StoreChips({ tone = "light", className = "" }: { tone?: "light" | "blue"; className?: string }) {
  const chip = tone === "blue" ? "border-blue-3 text-on-blue-muted" : "border-line bg-cloth text-ink-2";
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`} aria-label="Store availability">
      {["Google Play", "App Store"].map((store) => (
        <li key={store} className={`rounded-[10px] border px-3.5 py-2 text-[13px] ${chip}`}>
          <span className="font-semibold">{store}</span> · coming soon
        </li>
      ))}
    </ul>
  );
}
