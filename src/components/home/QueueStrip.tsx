import { OpeningGround } from "@/components/home/OpeningGround";

const FIGURES = [
  { src: "/queue/late-for-class.png", aspect: 0.625, flip: false },
  { src: "/queue/mask.png", aspect: 0.4894, flip: true },
  { src: "/queue/wont-stop.png", aspect: 0.656, flip: false },
  { src: "/queue/gamestation.png", aspect: 0.4247, flip: false },
  { src: "/queue/consumer.png", aspect: 0.5484, flip: false },
  { src: "/queue/meela-pantalones.png", aspect: 0.2606, flip: false },
  { src: "/queue/fling.png", aspect: 0.6532, flip: false },
  { src: "/queue/mechanical-love.png", aspect: 0.6658, flip: false },
  { src: "/queue/reflecting.png", aspect: 1.0452, flip: false, pause: true },
  { src: "/queue/new-beginnings.png", aspect: 1.1567, flip: false },
  { src: "/queue/experiments.png", aspect: 1.2803, flip: false },
  { src: "/queue/puppy.png", aspect: 0.7278, flip: false },
] as const;

function Person({
  src,
  aspect,
  flip,
  pause,
}: {
  src: string;
  aspect: number;
  flip: boolean;
  pause?: boolean;
}) {
  return (
    <span
      className="essay-person"
      data-flip={flip ? "1" : undefined}
      data-pause={pause ? "1" : undefined}
      style={{
        aspectRatio: String(aspect),
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
      }}
    />
  );
}

export function QueueStrip() {
  return (
    <>
      <div className="essay-queue" aria-hidden>
        <div className="essay-queue-row">
          {FIGURES.map((figure) => (
            <Person key={figure.src} {...figure} />
          ))}
        </div>
      </div>
      <OpeningGround />
    </>
  );
}
