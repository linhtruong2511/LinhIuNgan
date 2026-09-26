"use client";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
      <span className="text-white/60 text-sm font-light tracking-wide">
        Cuộn xuống nhé
      </span>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-teal-accent"
      >
        <path
          d="M12 4v16m0 0l-6-6m6 6l6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
