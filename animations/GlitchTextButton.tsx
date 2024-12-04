import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { addPropertyControls, ControlType } from "framer";

interface GlitchTextButtonProps {
  text: string;
  onClick?: () => void;
  fontSize?: number;
  fontFamily?: string;
  className?: string;
  disabled?: boolean;
  paddingX?: number;
  paddingY?: number;
  url?: string;
  openInNewTab?: boolean;
  pageLink?: string;
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>[]{}";

export function GlitchTextButton({
  text,
  onClick,
  fontSize = 16,
  fontFamily = "monospace",
  className = "",
  disabled = false,
  paddingX = 20,
  paddingY = 12,
  url = "",
  openInNewTab = false,
  pageLink = "",
}: GlitchTextButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>(text);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [animationId, setAnimationId] = useState<number>(0);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    if (!isGlitching) return;

    let frame: number;
    const startTime = Date.now();
    const duration = 500;
    const phases = 3;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        const phase = Math.floor(progress * phases);

        if (phase === 0) {
          setDisplayText(
            text
              .split("")
              .map(
                () => characters[Math.floor(Math.random() * characters.length)]
              )
              .join("")
          );
        } else if (phase === 1) {
          setDisplayText(
            text
              .split("")
              .map((char) =>
                Math.random() > 0.5
                  ? char
                  : characters[Math.floor(Math.random() * characters.length)]
              )
              .join("")
          );
        } else {
          setDisplayText(text);
        }

        frame = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        setIsGlitching(false);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      setDisplayText(text);
    };
  }, [isGlitching, text, animationId]);

  const handleHoverStart = () => {
    setIsHovered(true);
    setIsGlitching(true);
    setAnimationId((prev: number) => prev + 1);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    setIsGlitching(true);
    setAnimationId((prev: number) => prev + 1);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (pageLink) {
      window.location.href = pageLink;
      return;
    }

    if (url) {
      if (openInNewTab) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = url;
      }
    }
  };

  return (
    <motion.button
      className={className}
      onClick={handleClick}
      disabled={disabled}
      initial={false}
      animate={{
        color: isHovered ? "#000000" : "#ffffff",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      style={{
        position: "relative",
        display: "inline-block",
        border: "none",
        outline: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: "#000000",
        overflow: "hidden",
        padding: `${paddingY}px ${paddingX}px`,
        fontSize: `${fontSize}px`,
        fontFamily,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {/* background fill animation */}
      <motion.div
        initial={{ x: "-101%" }}
        animate={{
          x: isHovered ? "0%" : "-101%",
        }}
        transition={{
          type: "tween",
          duration: 0.3,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#ffffff",
          zIndex: 0,
        }}
      />

      {/* text container */}
      <motion.span
        style={{
          position: "relative",
          zIndex: 1,
          display: "block",
          fontWeight: "bold",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {displayText}
      </motion.span>
    </motion.button>
  );
}

addPropertyControls(GlitchTextButton, {
  text: {
    type: ControlType.String,
    title: "Button Text",
    defaultValue: "Click Me",
  },
  fontSize: {
    type: ControlType.Number,
    title: "Font Size",
    defaultValue: 16,
    min: 12,
    max: 48,
    step: 1,
  },
  paddingX: {
    type: ControlType.Number,
    title: "Padding X",
    defaultValue: 20,
    min: 0,
    max: 100,
    step: 1,
  },
  paddingY: {
    type: ControlType.Number,
    title: "Padding Y",
    defaultValue: 12,
    min: 0,
    max: 100,
    step: 1,
  },
  fontFamily: {
    type: ControlType.String,
    title: "Font Family",
    defaultValue: "monospace",
  },
  disabled: {
    type: ControlType.Boolean,
    title: "Disabled",
    defaultValue: false,
  },
  pageLink: {
    type: ControlType.Link,
    title: "Navigate to Page",
    description: "Select an existing page to navigate to",
  },
  url: {
    type: ControlType.String,
    title: "External URL",
    defaultValue: "",
    description: "External URL (used if no page selected)",
    hidden: (props) => !!props.pageLink,
  },
  openInNewTab: {
    type: ControlType.Boolean,
    title: "Open in New Tab",
    defaultValue: false,
    hidden: (props) => !props.url || !!props.pageLink,
  },
});
