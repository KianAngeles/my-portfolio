import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";

export default function EtherealHeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <EtherealShadow
        color="rgba(180, 200, 255, 0.8)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-navy/45 to-navy/70" />
    </div>
  );
}
