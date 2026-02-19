import { motion, useReducedMotion } from "framer-motion";
import { resume } from "@/data/resume";
import SectionHeader from "../components/SectionHeader";
import { containerStagger, EASE_OUT, fadeUp } from "../motionVariants";
import useIsMobile from "@/hooks/useIsMobile";
import { getMotionProps } from "@/utils/motion";

const SECTION_VIEWPORT = { once: true, amount: 0.25 };

function SkillInlineList({ items, prefersReducedMotion }: { items: string[]; prefersReducedMotion: boolean }) {
  return (
    <motion.span
      className="flex flex-wrap items-center gap-x-2 gap-y-1.5"
      variants={containerStagger(prefersReducedMotion, 0.02, 0.045)}
    >
      {items.map((item, index) => (
        <motion.span
          key={`${item}-${index}`}
          variants={fadeUp(prefersReducedMotion, 0, 4, 0.18)}
          className="inline-flex items-center gap-2"
        >
          {index > 0 ? (
            <span aria-hidden className="h-1 w-1 rounded-full bg-slate-500/60 dark:bg-white/35" />
          ) : null}
          <span>{item}</span>
        </motion.span>
      ))}
    </motion.span>
  );
}

function sectionBodyVariants(prefersReducedMotion: boolean) {
  return fadeUp(prefersReducedMotion, 0.2, 8, 0.34);
}

function educationLineVariants(prefersReducedMotion: boolean) {
  return {
    hidden: {
      opacity: prefersReducedMotion ? 0 : 1,
      scaleY: prefersReducedMotion ? 1 : 0,
    },
    show: {
      opacity: 1,
      scaleY: 1,
      transition: {
        duration: prefersReducedMotion ? 0.18 : 0.48,
        ease: EASE_OUT,
        delay: prefersReducedMotion ? 0 : 0.16,
      },
    },
  };
}

function projectLinkVariants(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return {
      rest: { x: 0, scaleX: 1 },
      hover: { x: 0, scaleX: 1 },
    };
  }

  return {
    rest: { x: 0, scaleX: 0 },
    hover: { x: 4, scaleX: 1 },
  };
}

type ResumeDetailsSectionProps = {
  shouldAnimate?: boolean;
};

export default function ResumeDetailsSection({ shouldAnimate = true }: ResumeDetailsSectionProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = !!useReducedMotion() || isMobile;

  const skillGroups = [
    { label: "Frontend Development", items: resume.technicalSkills.frontendDevelopment },
    { label: "Backend Development", items: resume.technicalSkills.backendDevelopment },
    { label: "Tools & Technologies", items: resume.technicalSkills.toolsAndTechnologies },
    { label: "Additional", items: resume.technicalSkills.additional },
  ];

  const splitSoftSkillsAt = Math.ceil(resume.softSkills.length / 2);
  const softSkillsLeft = resume.softSkills.slice(0, splitSoftSkillsAt);
  const softSkillsRight = resume.softSkills.slice(splitSoftSkillsAt);
  const sectionMotionProps = getMotionProps(
    isMobile,
    shouldAnimate
      ? {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: SECTION_VIEWPORT,
      }
      : {
        initial: false as const,
        animate: "show" as const,
      },
  );

  return (
    <section className="relative px-4 pb-16 sm:px-6 md:pb-24">
      <div className="mx-auto w-full max-w-[84rem]">
        <div className="rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-10">
              <motion.section
                {...sectionMotionProps}
                variants={containerStagger(prefersReducedMotion, 0, 0.08)}
              >
                <SectionHeader index="01" title="Career Objective" prefersReducedMotion={prefersReducedMotion} />
                <motion.p
                  variants={sectionBodyVariants(prefersReducedMotion)}
                  className="max-w-2xl text-sm leading-7 text-slate-700 dark:text-white/75 sm:text-[15px]"
                >
                  {resume.careerObjective}
                </motion.p>
              </motion.section>

              <motion.section
                {...sectionMotionProps}
                variants={containerStagger(prefersReducedMotion, 0, 0.08)}
              >
                <SectionHeader index="02" title="Education" prefersReducedMotion={prefersReducedMotion} />
                <motion.div variants={sectionBodyVariants(prefersReducedMotion)} className="relative pl-6">
                  <motion.span
                    variants={educationLineVariants(prefersReducedMotion)}
                    className="absolute left-0 top-2 h-[calc(100%-0.65rem)] w-px bg-slate-300/70 dark:bg-white/14"
                    style={{ transformOrigin: "top" }}
                  />

                  <motion.div className="space-y-5" variants={containerStagger(prefersReducedMotion, 0.08, 0.12)}>
                    {resume.education.map((item) => (
                      <motion.article
                        key={`${item.degree}-${item.school}`}
                        variants={fadeUp(prefersReducedMotion, 0, 8, 0.3)}
                        className="rounded-xl p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white/75">{item.degree}</h3>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-white/55">{item.yearRange}</p>
                        </div>
                        <p className="mt-1 text-sm text-slate-700 dark:text-white/72">{item.school}</p>
                        {Array.isArray(item.honors) && item.honors.length > 0 ? (
                          <p className="mt-2 text-xs text-slate-600 dark:text-white/60">{item.honors.join(" | ")}</p>
                        ) : null}
                      </motion.article>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.section>

              <motion.section
                {...sectionMotionProps}
                variants={containerStagger(prefersReducedMotion, 0, 0.08)}
              >
                <SectionHeader index="03" title="Certifications" prefersReducedMotion={prefersReducedMotion} />
                <motion.ul
                  variants={containerStagger(prefersReducedMotion, 0.06, 0.09)}
                  className="space-y-2 text-sm text-slate-700 dark:text-white/75"
                >
                  {resume.certifications.map((certification) => (
                    <motion.li key={certification} variants={fadeUp(prefersReducedMotion, 0, 6, 0.24)} className="rounded-lg px-4 py-2.5">
                      {certification}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.section>

              <motion.section
                {...sectionMotionProps}
                variants={containerStagger(prefersReducedMotion, 0, 0.08)}
              >
                <SectionHeader index="04" title="Soft Skills" prefersReducedMotion={prefersReducedMotion} />
                <motion.div variants={sectionBodyVariants(prefersReducedMotion)} className="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
                  <ul className="space-y-2.5">
                    {softSkillsLeft.map((skill) => (
                      <li key={skill} className="border-l border-slate-400/70 pl-3 text-[15px] leading-7 text-slate-700 dark:border-white/28 dark:text-white/75">
                        {skill}
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-2.5">
                    {softSkillsRight.map((skill) => (
                      <li key={skill} className="border-l border-slate-400/70 pl-3 text-[15px] leading-7 text-slate-700 dark:border-white/28 dark:text-white/75">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.section>

              <motion.section
                {...sectionMotionProps}
                variants={containerStagger(prefersReducedMotion, 0, 0.08)}
              >
                <SectionHeader index="05" title="Hobbies & Interests" prefersReducedMotion={prefersReducedMotion} />
                <motion.div variants={sectionBodyVariants(prefersReducedMotion)} className="pt-1">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm leading-7 text-slate-600 dark:text-white/64">
                    {resume.hobbies.map((hobby, index) => (
                      <span key={hobby} className="inline-flex items-center gap-2">
                        {index > 0 ? (
                          <span aria-hidden className="h-1 w-1 rounded-full bg-slate-500/70 dark:bg-white/35" />
                        ) : null}
                        <span>{hobby}</span>
                      </span>
                    ))}
                  </p>
                </motion.div>
              </motion.section>

              <motion.section
                {...sectionMotionProps}
                variants={containerStagger(prefersReducedMotion, 0, 0.08)}
              >
                <SectionHeader index="06" title="References" prefersReducedMotion={prefersReducedMotion} />
                <motion.p variants={sectionBodyVariants(prefersReducedMotion)} className="pt-1 text-sm leading-7 text-slate-700 dark:text-white/75">
                  {resume.references}
                </motion.p>
              </motion.section>
            </div>

            <div className="space-y-10">
              <motion.section
                {...sectionMotionProps}
                variants={containerStagger(prefersReducedMotion, 0, 0.08)}
              >
                <SectionHeader index="06" title="Technical Skills" prefersReducedMotion={prefersReducedMotion} />
                <motion.div variants={containerStagger(prefersReducedMotion, 0.02, 0.12)} className="space-y-8 pt-1">
                  {skillGroups.map((group) => (
                    <motion.div key={group.label} variants={fadeUp(prefersReducedMotion, 0, 8, 0.28)}>
                      <p className="text-lg font-semibold text-slate-800 dark:text-white/75">{group.label}</p>
                      <div className="mt-2 text-[15px] leading-7 text-slate-700 dark:text-white/75">
                        <SkillInlineList items={group.items} prefersReducedMotion={prefersReducedMotion} />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>

              <motion.section
                {...sectionMotionProps}
                variants={containerStagger(prefersReducedMotion, 0, 0.08)}
              >
                <SectionHeader index="07" title="Projects" prefersReducedMotion={prefersReducedMotion} />
                <motion.div variants={containerStagger(prefersReducedMotion, 0.04, 0.12)} className="space-y-8 pt-1">
                  {resume.projects.map((project, index) => {
                    const linkVariants = projectLinkVariants(prefersReducedMotion);

                    return (
                      <motion.article
                        key={project.name}
                        variants={fadeUp(prefersReducedMotion, 0, 8, 0.3)}
                        className={index > 0 ? "border-t border-slate-300/70 pt-8 dark:border-white/12" : ""}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="text-[30px] font-semibold leading-none text-slate-900 dark:text-white/75">{project.name}</h3>
                          <motion.a
                            href="/projects"
                            {...getMotionProps(isMobile, {
                              initial: "rest",
                              animate: "rest",
                              whileHover: prefersReducedMotion ? "rest" : "hover",
                            })}
                            className="relative text-sm font-semibold text-slate-600 transition hover:text-slate-900 dark:text-white/75 dark:hover:text-white/90"
                          >
                            <span className="inline-flex items-center">
                              View
                              <motion.span
                                aria-hidden
                                variants={{
                                  rest: { x: 0 },
                                  hover: { x: 4 },
                                }}
                                transition={{ duration: 0.2, ease: EASE_OUT }}
                                className="ml-1 inline-block"
                              >
                                -&gt;
                              </motion.span>
                            </span>
                            <motion.span
                              aria-hidden
                              className="absolute -bottom-0.5 left-0 h-px w-full bg-current"
                              style={{ transformOrigin: "left" }}
                              variants={{
                                rest: { scaleX: linkVariants.rest.scaleX },
                                hover: { scaleX: linkVariants.hover.scaleX },
                              }}
                              transition={{ duration: 0.22, ease: EASE_OUT }}
                            />
                          </motion.a>
                        </div>
                        <p className="mt-2 text-[13px] font-medium text-slate-600 dark:text-white/56">{project.type}</p>
                        <p className="mt-2 text-[15px] leading-7 text-slate-700 dark:text-white/73">{project.overview}</p>
                        <ul className="mt-3 list-disc space-y-1.5 pl-4 marker:text-slate-500/80 dark:marker:text-white/45">
                          {project.highlights.map((highlight) => (
                            <li key={highlight} className="text-[14px] leading-7 text-slate-600 dark:text-white/75">
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </motion.article>
                    );
                  })}
                </motion.div>
              </motion.section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
