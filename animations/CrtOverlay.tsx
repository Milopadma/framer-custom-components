import type { ComponentType } from "react";
import { useState } from "react";

interface CrtOverlayProps {
  children: React.ReactNode;
  scanlineOpacity?: number;
  enableTextEffect?: boolean;
  isPowered?: boolean;
}

export function CrtOverlay({
  children,
  scanlineOpacity = 0.3,
  enableTextEffect = false,
  isPowered = true,
}: CrtOverlayProps): JSX.Element {
  return (
    <div className="screen scanlines" style={{ position: "relative" }}>
      <style>
        {`
          .scanlines:before,
          .scanlines:after {
            display: block;
            pointer-events: none;
            content: '';
            position: absolute;
          }

          .scanlines:before {
            width: 100%;
            height: 1px;
            z-index: 2147483649;
            background: rgba(0, 0, 0, ${scanlineOpacity});
            animation: scan-moving 8s linear infinite;
          }

          .scanlines:after {
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 2147483648;
            background: linear-gradient(
              to bottom,
              transparent 50%,
              rgba(0, 0, 0, ${scanlineOpacity * 0.7}) 51%
            );
            background-size: 100% 6px;
          }

          .contents {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: auto;
          }

          @keyframes scan-moving {
            0% { transform: translate3d(0,100vh,0); }
          }

          @keyframes crt-power-on {
            0% {
              transform: scale(1,0.8);
              filter: brightness(30);
              opacity: 1
            }
            100% {
              transform: scale(1,1);
              filter: contrast(1) brightness(1.1) saturate(1.2);
              opacity: 1;
            }
          }
        `}
      </style>

      <div
        className="contents"
        style={{
          animation: isPowered ? "crt-power-on 0.45s forwards" : "none",
          ...(enableTextEffect && {
            color: "#fff",
            fontFamily: "'VT323', monospace",
            textShadow: "0 0 2px rgba(255,255,255,0.8)",
          }),
        }}
      >
        {children}
      </div>
    </div>
  );
}
