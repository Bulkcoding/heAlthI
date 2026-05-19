type BodyPartIconName =
  | "가슴"
  | "등"
  | "어깨"
  | "이두"
  | "삼두"
  | "하체"
  | "복근"
  | "전신"
  | "유산소";

type BodyPartIconProps = {
  name: BodyPartIconName;
};

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 96 96"
      aria-hidden="true"
      className="pf-muscle-icon"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

function ChestIcon() {
  return (
    <IconFrame>
      <path d="M34 14h28l4 8v10l-5 6v32H35V38l-5-6V22l4-8Z" className="pf-muscle-icon__outline" />
      <path d="M18 30c6-10 10-12 17-12M78 30c-6-10-10-12-17-12M28 70V46M68 70V46" className="pf-muscle-icon__outline" />
      <path d="M38 30c3-4 7-6 10-6s7 2 10 6l-2 10H40l-2-10ZM42 46h12v8H42zm0 12h12v8H42z" className="pf-muscle-icon__accent" />
    </IconFrame>
  );
}

function BackIcon() {
  return (
    <IconFrame>
      <path d="M34 14h28l4 8v10l-5 6v32H35V38l-5-6V22l4-8Z" className="pf-muscle-icon__outline" />
      <path d="M18 30c6-10 10-12 17-12M78 30c-6-10-10-12-17-12M28 70V46M68 70V46" className="pf-muscle-icon__outline" />
      <path d="M34 24c4 2 7 6 9 12l5 9 5-9c2-6 5-10 9-12l7 7-8 13-8 6-5 10-5-10-8-6-8-13 7-7Z" className="pf-muscle-icon__accent" />
    </IconFrame>
  );
}

function ShoulderIcon() {
  return (
    <IconFrame>
      <path d="M34 14h28l4 8v12l-6 8H36l-6-8V22l4-8Z" className="pf-muscle-icon__outline" />
      <path d="M18 32c5-8 10-11 16-11M78 32c-5-8-10-11-16-11M26 68V48M70 68V48" className="pf-muscle-icon__outline" />
      <path d="M22 28c4-5 8-7 13-7l6 4-3 10-12 2-4-9Zm52 0c-4-5-8-7-13-7l-6 4 3 10 12 2 4-9Z" className="pf-muscle-icon__accent" />
    </IconFrame>
  );
}

function BicepsIcon() {
  return (
    <IconFrame>
      <path d="M23 60c1-16 10-28 20-34 8-4 11-3 14 2 2 4 1 9-2 13l8 2c6 1 10 5 12 10" className="pf-muscle-icon__outline" />
      <path d="M19 66c8 4 18 4 27 0 9 3 16 3 24-1" className="pf-muscle-icon__outline" />
      <path d="M46 42c8 0 14 5 16 12-4 6-10 9-18 9-6 0-12-2-17-6 2-9 9-15 19-15Z" className="pf-muscle-icon__accent" />
    </IconFrame>
  );
}

function TricepsIcon() {
  return (
    <IconFrame>
      <path d="M40 18c7 2 13 9 16 20 1 7 0 16-2 26M55 18c4 2 8 7 10 13 3 9 2 19-2 29M34 22c1 9 2 20 1 34" className="pf-muscle-icon__outline" />
      <path d="M44 24c8 3 14 10 16 19-2 10-8 17-17 20-8-4-12-11-13-21 3-9 7-15 14-18Z" className="pf-muscle-icon__accent" />
    </IconFrame>
  );
}

function LegsIcon() {
  return (
    <IconFrame>
      <path d="M34 16h28M38 16l-4 16v20l-6 20M58 16l4 16v20l6 20M32 72h10M54 72h10" className="pf-muscle-icon__outline" />
      <path d="M36 28c-7 6-10 14-10 24 0 8 2 14 7 20 8-2 13-8 15-18V34l-12-6Zm24 0 12 6c7 6 10 14 10 24 0 8-2 14-7 20-8-2-13-8-15-18V34Z" className="pf-muscle-icon__accent" />
    </IconFrame>
  );
}

function AbsIcon() {
  return (
    <IconFrame>
      <path d="M34 14h28l4 8v12l-6 8H36l-6-8V22l4-8Z" className="pf-muscle-icon__outline" />
      <path d="M18 32c5-8 10-11 16-11M78 32c-5-8-10-11-16-11M30 70V44M66 70V44" className="pf-muscle-icon__outline" />
      <path d="M42 30h12v8H42zm-2 12h6v8h-6zm10 0h6v8h-6zm-10 12h6v8h-6zm10 0h6v8h-6Z" className="pf-muscle-icon__accent" />
    </IconFrame>
  );
}

function FullBodyIcon() {
  return (
    <IconFrame>
      <circle cx="48" cy="12" r="6" className="pf-muscle-icon__outline" />
      <path d="M36 22h24l4 12-6 10v16l6 16M60 22l-4 24h-16l-4-24m8 24v30m-12 0 8-18m20 18-8-18M26 36l10-10M70 36 60 26" className="pf-muscle-icon__outline" />
      <path d="M36 24 26 34l4 10 10 2 6 10h4l6-10 10-2 4-10-10-10-12 8-12-8Zm8 34h8v8h-8Z" className="pf-muscle-icon__accent" />
    </IconFrame>
  );
}

function CardioIcon() {
  return (
    <IconFrame>
      <path d="M60 58h20M57 66h21l-6 8H51m3-30h14l8 22M26 72h20" className="pf-muscle-icon__outline" />
      <path d="M32 56c5-4 9-8 11-14m-9 14 8 8m-6-28a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" className="pf-muscle-icon__outline" />
      <path d="M46 34c9 0 15 5 18 14-2 10-8 17-18 20-9-3-14-10-16-20 3-9 8-14 16-14Z" className="pf-muscle-icon__accent" />
    </IconFrame>
  );
}

export function BodyPartIcon({ name }: BodyPartIconProps) {
  switch (name) {
    case "가슴":
      return <ChestIcon />;
    case "등":
      return <BackIcon />;
    case "어깨":
      return <ShoulderIcon />;
    case "이두":
      return <BicepsIcon />;
    case "삼두":
      return <TricepsIcon />;
    case "하체":
      return <LegsIcon />;
    case "복근":
      return <AbsIcon />;
    case "전신":
      return <FullBodyIcon />;
    case "유산소":
      return <CardioIcon />;
    default:
      return <FullBodyIcon />;
  }
}
import type { ReactNode } from "react";
