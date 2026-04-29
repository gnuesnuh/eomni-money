import type { NativeAd } from "@/lib/ads";

interface NativeAdCardProps {
  ad: NativeAd;
}

export function NativeAdCard({ ad }: NativeAdCardProps) {
  return (
    <article className="relative rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <span className="absolute top-3 right-3 text-[10px] text-gray-500 bg-gray-50 border border-gray-200 rounded px-2 py-0.5">
        광고
      </span>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-10 h-10 rounded-lg border flex items-center justify-center text-xs font-semibold ${ad.logoBg} ${ad.logoColor}`}
            aria-hidden
          >
            {ad.logoText}
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-gray-900">{ad.brand}</div>
            <div className="text-xs text-gray-500">{ad.brandTag}</div>
          </div>
        </div>
        <h3 className="text-base font-bold leading-snug text-gray-900 mb-1.5">
          {ad.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{ad.desc}</p>
        <button
          type="button"
          className="text-sm font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5"
        >
          {ad.cta}
        </button>
      </div>
    </article>
  );
}
