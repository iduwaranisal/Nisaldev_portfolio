"use client";

import React from "react";

export default function BackgroundElements() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Subtle Warm Grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-60" />

      {/* Gentle Warm Sunset Vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-70" />

      {/* Soft Top Ambient Sunset Glow */}
      <div
        className="absolute -top-20 left-1/3 w-[600px] h-[350px] opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(254, 215, 170, 0.45) 0%, rgba(254, 243, 199, 0.2) 50%, transparent 75%)",
        }}
      />

      {/* Soft Bottom Ambient Amber Glow */}
      <div
        className="absolute bottom-0 right-1/4 w-[600px] h-[350px] opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(253, 186, 116, 0.35) 0%, rgba(254, 240, 138, 0.15) 50%, transparent 75%)",
        }}
      />
    </div>
  );
}
