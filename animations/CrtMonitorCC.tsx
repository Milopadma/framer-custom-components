import type { ComponentType } from "react";
import { useState } from "react";
import { addPropertyControls, ControlType } from "framer";

interface CrtMonitorProps {
  children: React.ReactNode;
  scanlineOpacity?: number;
  bezelImage?: string;
  horizontalBezelScale?: number;
  verticalBezelScale?: number;
  bezelSizeUnit?: "px" | "%";
  bezelWidth?: number;
  bezelHeight?: number;
  movingScanlineHeight?: number;
  staticScanlineHeight?: number;
}

export function CrtMonitor({
  children,
  scanlineOpacity = 0.75,
  bezelImage,
  horizontalBezelScale = 32,
  verticalBezelScale = 32,
  bezelSizeUnit = "px",
  bezelWidth = 100,
  bezelHeight = 100,
  movingScanlineHeight = 2,
  staticScanlineHeight = 4,
}: CrtMonitorProps): JSX.Element {
  return (
    <div
      className="container"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: `${verticalBezelScale}px ${horizontalBezelScale}px`,
        ...(bezelImage && {
          backgroundImage: `url(${bezelImage})`,
          backgroundSize: `${bezelWidth}${bezelSizeUnit} ${bezelHeight}${bezelSizeUnit}`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }),
      }}
    >
      <div
        className="screen scanlines"
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          backgroundColor: "transparent",
        }}
      >
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
              height: ${movingScanlineHeight}px;
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
              background-size: 100% ${staticScanlineHeight}px;
              animation: scan-crt 1s steps(60) infinite;
            }

            .contents {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
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

            .content-wrapper > div,
            .content-wrapper > div > div {
              width: 100% !important;
              position: relative !important;
            }

            .content-wrapper > * {
              max-width: 100%;
            }

            @keyframes scan-moving {
              0% { transform: translate3d(0,100vh,0); }
            }

            @keyframes scan-crt {
              0% { background-position: 0 50%; }
            }
          `}
        </style>

        <div className="contents">
          <div className="content-wrapper">{children}</div>
        </div>
      </div>
    </div>
  );
}

addPropertyControls(CrtMonitor, {
  bezelImage: {
    type: ControlType.Image,
    title: "Bezel Image",
  },
  bezelSizeUnit: {
    type: ControlType.Enum,
    title: "Bezel Size Unit",
    options: ["px", "%"],
    defaultValue: "px",
  },
  bezelWidth: {
    type: ControlType.Number,
    title: "Bezel Width",
    defaultValue: 100,
    min: 0,
    max: 2000,
    step: 1,
    displayStepper: true,
  },
  bezelHeight: {
    type: ControlType.Number,
    title: "Bezel Height",
    defaultValue: 100,
    min: 0,
    max: 2000,
    step: 1,
    displayStepper: true,
  },
  horizontalBezelScale: {
    type: ControlType.Number,
    title: "Horizontal Bezel Scale",
    defaultValue: 32,
    min: 0,
    max: 200,
    step: 1,
    displayStepper: true,
  },
  verticalBezelScale: {
    type: ControlType.Number,
    title: "Vertical Bezel Scale",
    defaultValue: 32,
    min: 0,
    max: 200,
    step: 1,
    displayStepper: true,
  },
  scanlineOpacity: {
    type: ControlType.Number,
    title: "Scanline Opacity",
    defaultValue: 0.75,
    min: 0,
    max: 1,
    step: 0.05,
  },
  movingScanlineHeight: {
    type: ControlType.Number,
    title: "Moving Scanline Height",
    defaultValue: 2,
    min: 1,
    max: 20,
    step: 1,
    displayStepper: true,
  },
  staticScanlineHeight: {
    type: ControlType.Number,
    title: "Static Scanline Height",
    defaultValue: 4,
    min: 1,
    max: 20,
    step: 1,
    displayStepper: true,
  },
});
