import { SectionHeading } from '@/components/section-heading/section-heading'
import { Timeline } from '@/components/timeline/timeline'
import { getExperiencesSorted } from '@/lib/content'

export function Experience() {
    const experiences = getExperiencesSorted()

    return (
        <div className="space-y-6">
            <SectionHeading number="02" title="experience" />
            <Timeline
                items={experiences}
                renderContent={exp => (
                    <>
                        <p className="text-foreground">
                            {exp.company}
                            <span
                                aria-hidden
                                className="text-muted-foreground mx-2 select-none">
                                ·
                            </span>
                            <span className="text-muted-foreground">
                                {exp.role}
                            </span>
                        </p>
                        <p className="text-muted-foreground text-xs">
                            {exp.location}
                        </p>
                        {exp.summary ? (
                            <p className="text-muted-foreground max-w-prose text-sm">
                                {exp.summary}
                            </p>
                        ) : null}
                        {exp.highlights.length > 0 ? (
                            <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                                {exp.highlights.map(h => (
                                    <li key={h} className="arrow-bullet">
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                        {exp.stack.length > 0 ? (
                            <p className="text-muted-foreground mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                                {exp.stack.map(s => (
                                    <span key={s}>{s}</span>
                                ))}
                            </p>
                        ) : null}
                    </>
                )}
            />
        </div>
    )
}
