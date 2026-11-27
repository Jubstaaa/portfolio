import { site } from '@/features/content/content'

interface OgCardProps {
    coverUrl?: string | undefined
    cta: string
    eyebrow: string
    path: string
    title: string
}

export function OgCard({ coverUrl, cta, eyebrow, path, title }: OgCardProps) {
    const overlay = coverUrl
        ? 'linear-gradient(90deg, rgba(18,20,25,0.95) 0%, rgba(18,20,25,0.88) 52%, rgba(18,20,25,0.6) 100%)'
        : '#16181d'

    return (
        <div
            style={{
                display: 'flex',
                height: '100%',
                position: 'relative',
                width: '100%',
            }}>
            {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    alt=""
                    height={630}
                    src={coverUrl}
                    style={{
                        left: 0,
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                    }}
                    width={1200}
                />
            ) : null}
            <div
                style={{
                    background: overlay,
                    height: '100%',
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                }}
            />

            <div
                style={{
                    borderTop: '10px solid #5aa6ea',
                    color: '#ece9e1',
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'Hermit',
                    height: '100%',
                    justifyContent: 'space-between',
                    padding: '72px',
                    position: 'relative',
                    width: '100%',
                }}>
                <div
                    style={{ color: '#8a93a1', display: 'flex', fontSize: 30 }}>
                    {path}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                        style={{
                            color: '#5aa6ea',
                            display: 'flex',
                            fontSize: 30,
                            marginBottom: 24,
                        }}>
                        {eyebrow}
                    </div>
                    <div
                        style={{
                            color: '#ece9e1',

                            display: '-webkit-box',
                            fontSize: 60,
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.12,
                            overflow: 'hidden',
                            // eslint-disable-next-line @typescript-eslint/no-deprecated -- Satori renders the clamp only through the -webkit-box pair
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                        }}>
                        {title}
                    </div>
                </div>

                <div
                    style={{
                        alignItems: 'center',
                        color: '#8a93a1',
                        display: 'flex',
                        fontSize: 28,
                        justifyContent: 'space-between',
                    }}>
                    <span>{`${site.name} · ${new URL(site.url).host}`}</span>
                    <div
                        style={{
                            alignItems: 'center',
                            background: '#5aa6ea',
                            borderRadius: 10,
                            color: '#16181d',
                            display: 'flex',
                            fontSize: 26,
                            fontWeight: 700,
                            padding: '12px 24px',
                        }}>
                        {`${cta} ->`}
                    </div>
                </div>
            </div>
        </div>
    )
}
