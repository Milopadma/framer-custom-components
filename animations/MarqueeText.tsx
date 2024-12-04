import { motion } from "framer-motion";
import { addPropertyControls, ControlType } from "framer";

interface MarqueeTextProps {
  text: string;
  speed?: number;
  direction?: "left" | "right";
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  className?: string;
  gap?: number;
}

export function MarqueeText({
  text,
  speed = 20,
  direction = "left",
  textColor = "#00ff00",
  fontSize = 32,
  fontFamily = "monospace",
  className = "",
  gap = 32,
}: MarqueeTextProps): JSX.Element {
  const containerStyle: React.CSSProperties = {
    width: "100vw",
    overflow: "hidden",
    whiteSpace: "nowrap",
    position: "relative",
  };

  const textStyle: React.CSSProperties = {
    color: textColor,
    fontSize: `${fontSize}px`,
    fontFamily,
    marginRight: `${gap}px`,
    textShadow: `0 0 5px ${textColor}`,
    fontWeight: "bold",
    letterSpacing: "0.1em",
    display: "inline-block",
  };

  const marqueeVariants = {
    animate: {
      x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 100 / speed,
          ease: "linear",
        },
      },
    },
  };

  const content = <span style={textStyle}>{text}</span>;

  return (
    <div style={containerStyle} className={className}>
      <motion.div
        variants={marqueeVariants}
        animate="animate"
        style={{
          display: "flex",
          width: "fit-content",
        }}
      >
        {/* create enough copies to ensure continuous flow */}
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i}>{content}</span>
        ))}
      </motion.div>
    </div>
  );
}

// add property controls for framer
addPropertyControls(MarqueeText, {
  text: {
    type: ControlType.String,
    title: "Text",
    defaultValue: "MARQUEE TEXT",
  },
  speed: {
    type: ControlType.Number,
    title: "Speed",
    defaultValue: 20,
    min: 1,
    max: 100,
    step: 1,
  },
  direction: {
    type: ControlType.Enum,
    title: "Direction",
    options: ["left", "right"],
    defaultValue: "left",
  },
  fontSize: {
    type: ControlType.Number,
    title: "Font Size",
    defaultValue: 32,
    min: 8,
    max: 200,
    step: 1,
  },
  fontFamily: {
    type: ControlType.Enum,
    title: "Font Family",
    options: [
      "monospace",
      "Courier New",
      "Roboto Mono",
      "SF Mono",
      "Fira Code",
    ],
    defaultValue: "monospace",
  },
  textColor: {
    type: ControlType.Color,
    title: "Text Color",
    defaultValue: "#00ff00",
  },
  gap: {
    type: ControlType.Number,
    title: "Gap",
    defaultValue: 32,
    min: 0,
    max: 200,
    step: 1,
  },
});
