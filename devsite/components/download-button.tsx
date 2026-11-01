import { Download } from "lucide-react";
import { APK_URL, APK_VERSION } from "@/lib/site";

/** The one primary action on the site. Falls back to the download section until the APK link is set. */
export function DownloadButton({
  tone = "blue",
  className = "",
  inert = false,
}: {
  tone?: "blue" | "white";
  className?: string;
  /** Inside the download section itself: with no APK yet, render a disabled control instead of a link to itself. */
  inert?: boolean;
}) {
  const ready = !!APK_URL;
  const colors =
    tone === "blue"
      ? "bg-blue text-white hover:bg-blue-deep"
      : "bg-white text-blue hover:bg-on-blue-muted";
  if (!ready && inert) {
    return (
      <span
        role="link"
        aria-disabled="true"
        className={`inline-flex cursor-not-allowed items-center gap-3 rounded-[14px] px-6 py-4 font-semibold opacity-70 ${colors.split(" hover:")[0]} ${className}`}
      >
        <Download className="size-5" aria-hidden />
        <span className="flex flex-col leading-tight">
          <span className="text-[17px]">Download for Android</span>
          <span className={`text-[12px] font-medium ${tone === "blue" ? "text-on-blue-muted" : "text-blue/70"}`}>APK coming soon</span>
        </span>
      </span>
    );
  }
  return (
    <a
      href={ready ? APK_URL : "#download"}
      {...(ready ? { download: `DevPay-${APK_VERSION}.apk` } : {})}
      className={`group inline-flex items-center gap-3 rounded-[14px] px-6 py-4 font-semibold transition-colors duration-200 ${colors} ${className}`}
    >
      <Download className="size-5 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
      <span className="flex flex-col leading-tight">
        <span className="text-[17px]">Download for Android</span>
        <span className={`text-[12px] font-medium ${tone === "blue" ? "text-on-blue-muted" : "text-blue/70"}`}>
          {ready ? `APK · version ${APK_VERSION}` : "APK coming soon"}
        </span>
      </span>
    </a>
  );
}
