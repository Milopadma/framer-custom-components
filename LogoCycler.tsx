import { addPropertyControls, ControlType } from "framer";
import { useState, useEffect } from "react";

type LogoSize = "sm" | "md" | "lg" | "xl" | "2xl";
type PaddingSize = "none" | "sm" | "md" | "lg" | "xl";

// size mappings in pixels
const logoSizes: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 200, height: 80 },
  md: { width: 300, height: 120 },
  lg: { width: 400, height: 160 },
  xl: { width: 500, height: 200 },
  "2xl": { width: 600, height: 240 },
};

const paddingSizes: Record<PaddingSize, number> = {
  none: 0,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

// type definitions for our component
interface LogoCyclerProps {
  logoSize: LogoSize;
  paddingX: PaddingSize;
  paddingY: PaddingSize;
  interval: number;
  logoFiles?: string[];
  horizontalAlignment: "left" | "center" | "right";
  backgroundColor: string;
}

export default function LogoCycler(props: LogoCyclerProps) {
  const {
    logoSize = "md",
    paddingX = "md",
    paddingY = "md",
    interval = 500,
    logoFiles = [],
    horizontalAlignment = "center",
    backgroundColor = "#f5f5f5",
  } = props;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loadedLogos, setLoadedLogos] = useState<string[]>([]);

  const { width: logoWidth, height: logoHeight } = logoSizes[logoSize];
  const paddingXValue = paddingSizes[paddingX];
  const paddingYValue = paddingSizes[paddingY];

  useEffect(() => {
    const loadSVGs = async (): Promise<void> => {
      const filesToLoad = logoFiles?.length
        ? logoFiles
        : ["https://framerusercontent.com/images/default-logo.jpg"];

      try {
        const loadedImages = filesToLoad.map((file: string) => {
          if (!file) {
            console.error("DEBUG invalid file URL:", file);
            return "";
          }

          return `<img 
              src="${file}" 
              width="${logoWidth}" 
              height="${logoHeight}" 
              style="object-fit: contain; width: 100%; height: 100%;"
            />`;
        });

        const validImages = loadedImages.filter(Boolean);
        if (validImages.length > 0) {
          setLoadedLogos(validImages);
        }
      } catch (error: unknown) {
        console.error("DEBUG failed to load images:", error);
      }
    };

    void loadSVGs();
  }, [logoFiles as string[], logoWidth as number, logoHeight as number]);

  // cycle through logos
  useEffect(() => {
    if (loadedLogos.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev: number) => (prev + 1) % loadedLogos.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, loadedLogos.length]);

  // calculate container dimensions
  const containerWidth = logoWidth + paddingXValue * 2;
  const containerHeight = logoHeight + paddingYValue * 2;

  if (loadedLogos.length === 0) {
    return (
      <div
        style={{
          backgroundColor,
          width: containerWidth,
          height: containerHeight,
          display: "flex",
          alignItems: "center",
          justifyContent:
            horizontalAlignment === "center"
              ? "center"
              : horizontalAlignment === "left"
              ? "flex-start"
              : "flex-end",
          paddingLeft: paddingXValue,
          paddingRight: paddingXValue,
          paddingTop: paddingYValue,
          paddingBottom: paddingYValue,
          color: "#666",
          fontSize: "14px",
        }}
      >
        Loading logos...
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        backgroundColor,
        width: containerWidth,
        height: containerHeight,
        display: "flex",
        alignItems: "center",
        justifyContent:
          horizontalAlignment === "center"
            ? "center"
            : horizontalAlignment === "left"
            ? "flex-start"
            : "flex-end",
        paddingLeft: paddingXValue,
        paddingRight: paddingXValue,
        paddingTop: paddingYValue,
        paddingBottom: paddingYValue,
      }}
    >
      <div
        key={currentIndex}
        style={{
          width: logoWidth,
          height: logoHeight,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden", // prevent SVG from overflowing
          position: "relative", // create new stacking context
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          dangerouslySetInnerHTML={{
            __html: loadedLogos[currentIndex] ?? "",
          }}
        />
      </div>
    </div>
  );
}

// add property controls for Framer
addPropertyControls(LogoCycler, {
  logoSize: {
    type: ControlType.Enum,
    title: "Logo Size",
    options: ["sm", "md", "lg", "xl", "2xl"],
    defaultValue: "md",
  },
  paddingX: {
    type: ControlType.Enum,
    title: "Padding X",
    options: ["none", "sm", "md", "lg", "xl"],
    defaultValue: "md",
  },
  paddingY: {
    type: ControlType.Enum,
    title: "Padding Y",
    options: ["none", "sm", "md", "lg", "xl"],
    defaultValue: "md",
  },
  interval: {
    type: ControlType.Number,
    title: "Interval (ms)",
    defaultValue: 500,
    min: 100,
    step: 100,
  },
  horizontalAlignment: {
    type: ControlType.Enum,
    title: "Alignment",
    options: ["left", "center", "right"],
    defaultValue: "center",
  },
  logoFiles: {
    type: ControlType.Array,
    title: "Logo Files",
    control: {
      type: ControlType.File,
      allowedFileTypes: ["jpg", "jpeg", "png", "svg"],
    },
    defaultValue: [],
  },
  backgroundColor: {
    type: ControlType.Color,
    title: "Background",
    defaultValue: "#f5f5f5",
  },
});
