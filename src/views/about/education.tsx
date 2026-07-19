import { SectionHeading } from '@/components/section-heading/section-heading'
import { Timeline } from '@/components/timeline/timeline'
import { getEducationSorted } from '@/lib/content'

export function Education() {
    const educations = getEducationSorted()

    return (
        <div className="space-y-6">
            <SectionHeading number="03" title="education" />
            <Timeline
                items={educations}
                renderContent={edu => (
                    <>
                        <p className="text-foreground">{edu.school}</p>
                        <p className="text-muted-foreground text-xs">
                            {edu.degree}
                            {edu.field ? (
                                <>
                                    <span
                                        aria-hidden
                                        className="mx-2 select-none">
                                        ·
                                    </span>
                                    {edu.field}
                                </>
                            ) : null}
                            {edu.location ? (
                                <>
                                    <span
                                        aria-hidden
                                        className="mx-2 select-none">
                                        ·
                                    </span>
                                    {edu.location}
                                </>
                            ) : null}
                        </p>
                        {edu.notes ? (
                            <p className="text-muted-foreground max-w-prose text-sm">
                                {edu.notes}
                            </p>
                        ) : null}
                    </>
                )}
            />
        </div>
    )
}
