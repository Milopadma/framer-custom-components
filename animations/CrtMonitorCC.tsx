import type { ComponentType } from "react";
import { useState } from "react";

interface CrtMonitorProps {
  children: React.ReactNode;
  scanlineOpacity?: number;
  glowIntensity?: number;
  vignetteIntensity?: number;
  enableTextEffect?: boolean;
}

export function CrtMonitor({
  children,
  scanlineOpacity = 0.75,
  glowIntensity = 0.2,
  vignetteIntensity = 0.2,
  enableTextEffect = true,
}: CrtMonitorProps): JSX.Element {
  const [isPowered, setIsPowered] = useState<boolean>(true);

  return (
    <div
      className="container"
      style={{
        position: "fixed",
        top: "16px",
        left: "16px",
        right: "16px",
        bottom: "16px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#4a4a4a",
        padding: "32px",
        borderRadius: "24px",
        boxShadow: `
          0 0 0 4px #3a3a3a,
          0 0 0 8px #2a2a2a,
          0 4px 8px rgba(0, 0, 0, 0.4),
          0 8px 16px rgba(0, 0, 0, 0.2),
          inset 0 0 30px rgba(0, 0, 0, 0.4)
        `,
        backgroundImage: `
          linear-gradient(45deg, 
            #4a4a4a 25%, 
            #454545 25%, 
            #454545 50%, 
            #4a4a4a 50%, 
            #4a4a4a 75%, 
            #454545 75%, 
            #454545 100%
          )
        `,
        backgroundSize: "4px 4px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#2a2a2a",
          fontSize: "14px",
          fontFamily: "monospace",
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}
      >
        RetroTech 2000
      </div>

      <input
        type="checkbox"
        id="power-switch"
        checked={isPowered}
        onChange={(e) => setIsPowered(e.target.checked)}
      />
      <label htmlFor="power-switch" className="switch-label">
        <span>Power</span>
      </label>

      <div
        className="screen scanlines"
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          backgroundColor: "#111",
        }}
      >
        <style>
          {`
            .screen {
              clip-path: url(#crtPath);
            }

            .scanlines:before,
            .scanlines:after {
              display: block;
              pointer-events: none;
              content: '';
              position: absolute;
            }

            .scanlines:before {
              width: 100%;
              height: 2px;
              z-index: 2147483649;
              background: rgba(0, 0, 0, ${scanlineOpacity});
              animation: scan-moving 6s linear infinite;
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
                rgba(0, 0, 0, ${scanlineOpacity}) 51%
              );
              background-size: 100% 4px;
              animation: scan-crt 1s steps(60) infinite;
            }

            .contents {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              padding: 4rem;
              box-sizing: border-box;
              overflow: auto;
              display: flex;
              flex-direction: column;
            }

            .content-wrapper {
              flex: 1;
              width: 100%;
              height: 100%;
              min-height: 0;
              position: relative;
            }

            /* force override framer's width */
            .content-wrapper > div,
            .content-wrapper > div > div {
              width: 100% !important;
              position: relative !important;
            }

            /* ensure all direct children of content-wrapper respect container */
            .content-wrapper > * {
              max-width: 100%;
            }

            @keyframes scan-moving {
              0% { transform: translate3d(0,100vh,0); }
            }

            @keyframes scan-crt {
              0% { background-position: 0 50%; }
            }

            @keyframes crt-power-on {
              0% {
                transform: scale(1,0.8) translate3d(0,0,0);
                filter: brightness(30);
                opacity: 1
              }
              100% {
                transform: scale(1,1) translate3d(0,0,0);
                filter: contrast(1) brightness(1.2) saturate(1.3);
                opacity: 1;
              }
            }

            @keyframes crt-power-off {
              0% {
                transform: scale(1,1.3) translate3d(0,0,0);
                filter: brightness(1);
                opacity: 1;
              }
              100% {
                transform: scale(0.000, 0.0001) translate3d(0,0,0);
                filter: brightness(50);
              }
            }
          `}
        </style>

        <div
          className="contents"
          style={{
            backgroundColor: isPowered ? "#000" : "#111",
            animation: `${
              isPowered ? "crt-power-on" : "crt-power-off"
            } 0.55s forwards`,
            ...(enableTextEffect && {
              color: "#fff",
              fontFamily: "'VT323', monospace",
              textShadow: "0 0 2px rgba(255,255,255,0.8)",
            }),
          }}
        >
          <div className="content-wrapper">{children}</div>
        </div>

        <svg height="0" width="0" viewBox="0 0 93.88 76.19">
          <clipPath
            id="crtPath"
            clipPathUnits="objectBoundingBox"
            transform="scale(0.01065 0.01312)"
          >
            <path d="M47.78.5c11.65,0,38,.92,41.81,4,3.59,3,3.79,22.28,3.79,34.19,0,11.67-.08,27.79-3.53,31.24S60.3,75.69,47.78,75.69c-11.2,0-39.89-1.16-44-5.27S.57,52.42.57,38.73.31,8.56,4,4.88,34.77.5,47.78.5Z" />
          </clipPath>
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            width: "8px",
            height: "8px",
            backgroundColor: isPowered ? "#33ff33" : "#333",
            borderRadius: "50%",
            boxShadow: isPowered ? "0 0 4px #33ff33" : "none",
            transition: "all 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
