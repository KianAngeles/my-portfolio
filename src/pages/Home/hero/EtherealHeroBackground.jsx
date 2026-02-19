import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";

export default function EtherealHeroBackground({ isDarkMode = true }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <EtherealShadow
        color={isDarkMode ? "rgba(180, 200, 255, 0.8)" : "rgba(186, 230, 253, 0.62)"}
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: isDarkMode ? 1 : 0.42, scale: 1.2 }}
        sizing="fill"
      />
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-b from-navy/30 via-navy/45 to-navy/70"
            : "bg-gradient-to-b from-white/35 via-sky-100/30 to-slate-200/55"
        }`}
      />
    </div>
  );
}
