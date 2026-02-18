export default function SectionRadialGlowAlt() {
  return (
    <div className="pointer-events-none absolute inset-x-0 -inset-y-20 -z-10 overflow-visible" aria-hidden="true">
      <div className="absolute right-[70px] top-[-70px] h-[320px] w-[320px] rounded-full bg-accent/10 blur-[80px] dark:bg-accent/14" />
      <div className="absolute bottom-[80px] left-[60px] h-[540px] w-[540px] rounded-full bg-accent/8 blur-[85px] dark:bg-accent/12" />
      <div className="absolute left-[19%] top-[42%] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[90px] dark:bg-white/8" />
      <div className="absolute bottom-[18%] right-[16%] h-[200px] w-[200px] rounded-full bg-navy/10 blur-[90px] dark:bg-white/7" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 dark:from-transparent dark:via-transparent dark:to-accent/6" />
    </div>
  );
}
