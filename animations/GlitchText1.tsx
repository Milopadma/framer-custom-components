import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { addPropertyControls, ControlType } from "framer";

interface GlitchTextProps {
  text: string;
  duration?: number;
  charactersToShuffle?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  className?: string;
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>[]{}";

const GlitchCharacter = ({
  char,
  duration = 0.5,
  charactersToShuffle = characters,
  style = {},
}: {
  char: string;
  duration?: number;
  charactersToShuffle?: string;
  style?: React.CSSProperties;
}): JSX.Element => {
  const [displayChar, setDisplayChar] = useState(char);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    let interval: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed < duration * 1000) {
        setDisplayChar(
          charactersToShuffle[
            Math.floor(Math.random() * charactersToShuffle.length)
          ]
        );
        interval = requestAnimationFrame(animate);
      } else {
        setDisplayChar(char);
        setIsAnimating(false);
      }
    };

    interval = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(interval);
  }, [char, isAnimating, duration, charactersToShuffle]);

  return <span style={style}>{displayChar}</span>;
};

export function GlitchText({
  text,
  duration = 0.5,
  charactersToShuffle = characters,
  textColor = "#000000",
  fontSize = 16,
  fontFamily = "monospace",
  className = "",
}: GlitchTextProps): JSX.Element {
  const textStyle: React.CSSProperties = {
    color: textColor,
    fontSize: `${fontSize}px`,
    fontFamily,
  };

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`inline-block ${className}`}
      style={textStyle}
    >
      {text.split("").map((char, idx) => (
        <GlitchCharacter
          key={idx}
          char={char}
          duration={duration + idx * 0.1}
          charactersToShuffle={charactersToShuffle}
          style={textStyle}
        />
      ))}
    </motion.span>
  );
}

// add property controls for framer
addPropertyControls(GlitchText, {
  text: {
    type: ControlType.String,
    title: "Text",
    defaultValue: "Matrix Text",
  },
  fontSize: {
    type: ControlType.Number,
    title: "Font Size",
    defaultValue: 16,
    min: 8,
    max: 200,
    step: 1,
    displayStepper: true,
  },
  fontFamily: {
    type: ControlType.Enum,
    title: "Font Family",
    options: [
      "monospace",
      "sans-serif",
      "serif",
      "system-ui",
      "Courier New",
      "Roboto Mono",
      "SF Mono",
      "Fira Code",
    ],
    defaultValue: "monospace",
  },
  duration: {
    type: ControlType.Number,
    title: "Base Duration",
    defaultValue: 0.5,
    min: 0.1,
    max: 2,
    step: 0.1,
  },
  charactersToShuffle: {
    type: ControlType.String,
    title: "Characters Pool",
    defaultValue: characters,
  },
  textColor: {
    type: ControlType.Color,
    title: "Text Color",
    defaultValue: "#00ff00",
  },
});
