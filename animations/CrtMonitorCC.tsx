import type { ComponentType } from "react";

interface CrtMonitorProps {
  children: React.ReactNode;
  scanlineOpacity?: number;
  glowIntensity?: number;
  vignetteIntensity?: number;
}

export function CrtMonitor({
  children,
  scanlineOpacity = 0.1,
  glowIntensity = 0.2,
  vignetteIntensity = 0.2,
}: CrtMonitorProps): JSX.Element {
  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        left: "16px",
        right: "16px",
        bottom: "16px",
        padding: "32px",
        backgroundColor: "#2b2b2b",
        borderRadius: "24px",
        boxShadow: `
          0 0 0 2px #1a1a1a,
          0 0 0 4px #333,
          0 4px 8px rgba(0, 0, 0, 0.4),
          0 8px 16px rgba(0, 0, 0, 0.2)
        `,
        zIndex: 9999,
      }}
    >
      {/* screen bezel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
          borderRadius: "20px",
          padding: "4px",
          boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.8)",
          overflow: "hidden",
        }}
      >
        {/* curved screen container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "15px",
            overflow: "hidden",
            maskImage:
              "radial-gradient(ellipse 75% 75% at center, black 70%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 75% at center, black 70%, transparent 100%)",
            perspective: "1000px",
          }}
        >
          {/* content container with spherical distortion */}
          <div
            style={{
              position: "relative",
              width: "calc(100% + 60px)",
              height: "calc(100% + 60px)",
              margin: "-30px",
              zIndex: 1,
              overflow: "auto",
              backgroundColor: "#000",
              transform: `
                scale(0.93)
                perspective(1000px)
                rotateX(2deg)
              `,
              transformOrigin: "center center",
            }}
          >
            {children}
          </div>

          {/* scanlines overlay */}
          <div
            style={{
              position: "absolute",
              top: "-30px",
              left: "-30px",
              right: "-30px",
              bottom: "-30px",
              pointerEvents: "none",
              background: `
                linear-gradient(
                  rgba(18, 16, 16, ${scanlineOpacity}) 50%, 
                  rgba(0, 0, 0, ${scanlineOpacity}) 50%
                ),
                linear-gradient(
                  90deg,
                  rgba(255, 0, 0, 0.03),
                  rgba(0, 255, 0, 0.02),
                  rgba(0, 0, 255, 0.03)
                )
              `,
              backgroundSize: "100% 2px, 3px 100%",
              mixBlendMode: "multiply",
              zIndex: 2,
              transform: "scale(0.97)",
            }}
          />

          {/* vignette effect */}
          <div
            style={{
              position: "absolute",
              top: "-30px",
              left: "-30px",
              right: "-30px",
              bottom: "-30px",
              pointerEvents: "none",
              background: `radial-gradient(
                ellipse 75% 75% at center,
                transparent 30%,
                rgba(0, 0, 0, ${vignetteIntensity * 1.5}) 100%
              )`,
              zIndex: 3,
            }}
          />

          {/* screen glow */}
          <div
            style={{
              position: "absolute",
              top: "-30px",
              left: "-30px",
              right: "-30px",
              bottom: "-30px",
              pointerEvents: "none",
              boxShadow: `
                inset 0 0 ${glowIntensity * 100}px rgba(0, 255, 0, 0.15),
                inset 0 0 100px rgba(0, 0, 0, 0.5)
              `,
              zIndex: 4,
            }}
          />
        </div>
      </div>

      {/* power LED */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          right: "12px",
          width: "8px",
          height: "8px",
          backgroundColor: "#33ff33",
          borderRadius: "50%",
          boxShadow: "0 0 4px #33ff33",
        }}
      />
    </div>
  );
}
