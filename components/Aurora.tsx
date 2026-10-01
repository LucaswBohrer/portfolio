"use client";

export default function Aurora() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* grid */}
      <div className="grid-bg absolute inset-0" />
      {/* aurora blobs */}
      <div
        className="absolute -top-[20vh] left-1/2 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full opacity-[0.16] blur-[120px]"
        style={{
          background: "radial-gradient(ellipse, #38e1ff 0%, #0e7490 45%, transparent 70%)",
          animation: "aurora-a 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[30vh] -left-[15vw] h-[50vh] w-[50vw] rounded-full opacity-[0.10] blur-[120px]"
        style={{
          background: "radial-gradient(ellipse, #6366f1 0%, transparent 70%)",
          animation: "aurora-b 24s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[55vh] -right-[12vw] h-[45vh] w-[45vw] rounded-full opacity-[0.08] blur-[120px]"
        style={{
          background: "radial-gradient(ellipse, #38e1ff 0%, transparent 70%)",
          animation: "aurora-a 28s ease-in-out infinite reverse",
        }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 120% 90% at 50% 10%, transparent 55%, rgba(7,9,13,0.85) 100%)" }}
      />
    </div>
  );
}
