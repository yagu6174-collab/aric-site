const FIGURES = [
  { src: "/queue/late-for-class.png", aspect: 0.625, flip: false, scale: 0.96 },
  { src: "/queue/mask.png", aspect: 0.4894, flip: true, scale: 0.97 },
  { src: "/queue/wont-stop.png", aspect: 0.656, flip: false, scale: 0.97 },
  { src: "/queue/gamestation.png", aspect: 0.4247, flip: false, scale: 0.98 },
  { src: "/queue/consumer.png", aspect: 0.5484, flip: false, scale: 0.98 },
  { src: "/queue/meela-pantalones.png", aspect: 0.2606, flip: false, scale: 0.99 },
  { src: "/queue/fling.png", aspect: 0.6532, flip: false, scale: 0.99 },
  { src: "/queue/mechanical-love.png", aspect: 0.6658, flip: false, scale: 1 },
  { src: "/queue/reflecting.png", aspect: 1.0452, flip: false, pause: true, scale: 1 },
  { src: "/queue/new-beginnings.png", aspect: 1.1567, flip: false, scale: 1.02 },
  { src: "/queue/experiments.png", aspect: 1.2803, flip: false, scale: 1.02 },
  { src: "/queue/puppy.png", aspect: 0.7278, flip: false, scale: 1.03 },
] as const;

function Person({
  src,
  aspect,
  flip,
  pause,
  scale,
}: {
  src: string;
  aspect: number;
  flip: boolean;
  pause?: boolean;
  scale: number;
}) {
  return (
    <span
      className="person"
      data-flip={flip ? "1" : undefined}
      data-pause={pause ? "1" : undefined}
      style={{
        aspectRatio: String(aspect),
        ["--scale" as string]: String(scale),
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
      }}
    />
  );
}

export function QueueStrip() {
  return (
    <div className="frieze-wrap">
      <div className="frieze-glow" aria-hidden />
      <div className="frieze" aria-hidden>
        <div className="frieze-row">
          {FIGURES.map((figure) => (
            <Person key={figure.src} {...figure} />
          ))}
        </div>
      </div>
      <div className="frieze-horizon" aria-hidden />
    </div>
  );
}
