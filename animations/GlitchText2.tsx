import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { addPropertyControls, ControlType } from "framer";

interface GlitchTextProps {
  text: string;
  duration?: number;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  className?: string;
  lineColor?: string;
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>[]{}";

const GlitchCharacter = ({
  char,
  delay = 0,
  style = {},
}: {
  char: string;
  delay: number;
  style?: React.CSSProperties;
}): JSX.Element => {
  const [displayChar, setDisplayChar] = useState(
    () => characters[Math.floor(Math.random() * characters.length)]
  );
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const shuffleDuration = 500;
    const startTime = Date.now();
    let shuffleInterval: number;

    const shuffle = () => {
      if (Date.now() - startTime < shuffleDuration) {
        setDisplayChar(
          characters[Math.floor(Math.random() * characters.length)]
        );
        shuffleInterval = requestAnimationFrame(shuffle);
      } else {
        // Set the final character first, then handle opacity
        setDisplayChar(char);
        setOpacity(0);

        setTimeout(() => {
          setOpacity(1);
        }, delay);
      }
    };

    shuffleInterval = requestAnimationFrame(shuffle);
    return () => cancelAnimationFrame(shuffleInterval);
  }, [char, delay]);

  return (
    <span
      style={{
        ...style,
        opacity,
        transition: "opacity 0.15s ease-in-out",
        display: "inline-block",
      }}
    >
      {displayChar}
    </span>
  );
};

const StrikeLine = ({ delay, color }: { delay: number; color: string }) => (
  <motion.div
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{
      duration: 0.3,
      delay,
      ease: "easeInOut",
    }}
    style={{
      position: "absolute",
      left: 0,
      height: "2px",
      width: "100%",
      backgroundColor: color,
      transformOrigin: "left",
    }}
  />
);

export function GlitchText2({
  text,
  duration = 1.5,
  textColor = "#000000",
  lineColor = "#ff0000",
  fontSize = 16,
  fontFamily = "monospace",
  className = "",
}: GlitchTextProps): JSX.Element {
  const textStyle: React.CSSProperties = {
    color: textColor,
    fontSize: `${fontSize}px`,
    fontFamily,
    position: "relative",
    whiteSpace: "pre", // Preserve spaces
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    padding: "0.5em 0",
  };

  // Calculate positions for 5 strike-through lines
  const linePositions = [-0.4, -0.2, 0, 0.2, 0.4];

  return (
    <div style={containerStyle} className={className}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: "relative",
          whiteSpace: "pre", // Preserve spaces
        }}
      >
        {text.split("").map((char, idx) => (
          <GlitchCharacter
            key={idx}
            char={char}
            delay={500 + idx * 50}
            style={textStyle}
          />
        ))}
      </motion.div>

      {/* Strike-through lines */}
      {linePositions.map((pos, idx) => (
        <div
          key={`line-${idx}`}
          style={{
            position: "absolute",
            top: "50%",
            width: "100%",
            transform: `translateY(${pos * fontSize}px)`,
          }}
        >
          <StrikeLine delay={idx * 0.1} color={lineColor} />
        </div>
      ))}
    </div>
  );
}

// add property controls for framer
addPropertyControls(GlitchText2, {
  text: {
    type: ControlType.String,
    title: "Text",
    defaultValue: "GLITCH TEXT",
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
  duration: {
    type: ControlType.Number,
    title: "Duration",
    defaultValue: 1.5,
    min: 0.5,
    max: 3,
    step: 0.1,
  },
  textColor: {
    type: ControlType.Color,
    title: "Text Color",
    defaultValue: "#000000",
  },
  lineColor: {
    type: ControlType.Color,
    title: "Line Color",
    defaultValue: "#ff0000",
  },
});
