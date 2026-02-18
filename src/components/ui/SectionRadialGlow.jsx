export default function SectionRadialGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div className="absolute left-[-120px] top-[-120px] h-[360px] w-[360px] rounded-full bg-accent/15 blur-3xl dark:bg-accent/22" />
      <div className="absolute bottom-[-150px] right-[-120px] h-[440px] w-[440px] rounded-full bg-accent/18 blur-3xl dark:bg-accent/24" />
      <div className="absolute right-[2%] top-[42%] h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-accent/20 blur-[120px] dark:bg-accent/30" />
      <div className="absolute left-[14%] top-[58%] h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-navy/12 blur-[120px] dark:bg-white/10" />
      <div className="absolute left-[-140px] top-[-80px] h-[280px] w-[280px] rounded-full bg-navy/8 blur-3xl dark:bg-white/6" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/5 via-transparent to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent" />
    </div>
  );
}
