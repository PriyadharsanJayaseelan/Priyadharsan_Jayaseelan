import { useScrollProgress } from "../hooks/useScrollProgress";

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-[2px] transition-all duration-75"
      style={{
        width: `${progress}%`,
        background:
          "linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,255,255,0.7))",
      }}
    />
  );
}
