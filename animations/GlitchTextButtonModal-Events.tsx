import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { addPropertyControls, ControlType } from "framer";
import type { ReactNode, CSSProperties } from "react";

// simple markdown parser function
const parseMarkdown = (markdown: string): string => {
  return (
    markdown
      // code blocks
      .replace(
        /```([\s\S]*?)```/g,
        '<pre style="background-color: #1f2937; padding: 1rem; border-radius: 0.375rem; overflow-x: auto; margin: 1rem 0;"><code style="font-family: monospace; font-size: 0.875rem; color: #e5e7eb;">$1</code></pre>'
      )
      // inline code
      .replace(
        /`([^`]+)`/g,
        '<code style="background-color: #1f2937; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875rem; color: #e5e7eb;">$1</code>'
      )
      // bold
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="font-weight: 600;">$1</strong>'
      )
      // italic
      .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
      // links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" style="color: #60a5fa; text-decoration: underline; transition: color 0.15s;" onmouseover="this.style.color=\'#93c5fd\'" onmouseout="this.style.color=\'#60a5fa\'">$1</a>'
      )
      // lists
      .replace(
        /^\s*-\s+(.*)$/gm,
        '<li style="margin-left: 1.25rem; margin-bottom: 0.5rem;">$1</li>'
      )
      // paragraphs
      .split("\n\n")
      .map(
        (p) => `<p style="margin-bottom: 1rem; line-height: 1.625;">${p}</p>`
      )
      .join("")
  );
};

interface GlitchTextButtonModalProps {
  text: string;
  modalTitle?: string;
  modalContent?: string | React.ReactNode;
  fontSize?: number;
  fontFamily?: string;
  className?: string;
  disabled?: boolean;
  paddingX?: number;
  paddingY?: number;
  modalOffset?: number;
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>[]{}";

type MarkdownCodeProps = {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
};

type MarkdownLinkProps = {
  node?: unknown;
  children?: ReactNode;
  [key: string]: unknown;
};

const EVENTS_CONTENT = `
WE BRING BRILLIANT MINDS TOGETHER TO SPARK IDEAS AND COLLABORATION. FROM NYC TO DC, OUR EVENTS INSPIRE CONNECTION AND CREATIVITY. SEE WHAT'S NEXT AND SAVE THE DATE!

UPCOMING EVENTS

[AGGREGATED EVENTS FROM NYC + DC][CURRENTLY EVENTS ARE ON MEETUP.COM BUT WILL BE SWITCHING TO LUMA]

NEW JERSEY - 05.01.2025 - 19:00

DIRTY COIN
THE BITCOIN MINING DOCUMENTARY
AT PUBKEY
25 SEPT '24
6:30-11:00PM
85 Washington Place New York, NY
`;

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  offset = 0,
  fontFamily = '"VT323", monospace',
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  offset?: number;
  fontFamily?: string;
}): JSX.Element => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 9999,
            padding: "1rem",
          }}
          onClick={onClose}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              zIndex: 10000,
              transform: `translateX(${offset}px)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                border: "1px solid white",
                background: "black",
                width: "100%",
              }}
            >
              <div
                style={{
                  position: "relative",
                  padding: "1rem",
                  backgroundColor: "#000000",
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    #000000,
                    #000000 2px,
                    #ffffff 2px,
                    #ffffff 4px
                  )`,
                  borderBottom: "2px solid #ffffff",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#000000",
                    padding: "0.5rem 2rem",
                    border: "1px solid #ffffff",
                  }}
                >
                  <span
                    style={{
                      fontSize: "32px",
                      letterSpacing: "0.2em",
                      fontWeight: "bold",
                      color: "#ffffff",
                      fontFamily,
                    }}
                  >
                    {title}
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: "2rem",
                  color: "white",
                  fontFamily,
                  fontSize: "1.2rem",
                  lineHeight: 1.6,
                  backgroundColor: "#000000",
                }}
              >
                {typeof children === "string" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(children),
                    }}
                  />
                ) : (
                  children
                )}
                <button
                  style={{
                    background: "white",
                    color: "black",
                    width: "100%",
                    padding: "1rem",
                    textAlign: "center",
                    fontFamily,
                    fontSize: "1.2rem",
                    border: "none",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    marginTop: "2rem",
                  }}
                >
                  JOIN NOW →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

type MotionStyleWithPosition = {
  position?: "fixed" | "absolute" | "relative" | "static" | "sticky";
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  zIndex?: number;
  width?: string | number;
  maxWidth?: string | number;
  transform?: string;
} & Omit<React.CSSProperties, 'position' | 'top' | 'left' | 'right' | 'bottom' | 'zIndex' | 'width' | 'maxWidth' | 'transform'>;

export function GlitchTextButtonModal(
  props: GlitchTextButtonModalProps
): JSX.Element {
  const {
    text = "EVENTS",
    modalTitle = "EVENTS",
    modalContent = EVENTS_CONTENT,
    fontSize = 16,
    fontFamily = '"VT323", monospace',
    className = "",
    disabled = false,
    paddingX = 20,
    paddingY = 12,
    modalOffset = 0,
  } = props;

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>(text);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [animationId, setAnimationId] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  return (
    <>
      <motion.button
        className={className}
        onClick={() => setIsModalOpen(true)}
        disabled={disabled}
        initial={false}
        animate={{
          color: isHovered ? "#000000" : "#ffffff",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        style={
          {
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
          } as MotionStyleWithPosition
        }
      >
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
          style={
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#ffffff",
              zIndex: 0,
            } as MotionStyleWithPosition
          }
        />

        <motion.span
          style={
            {
              position: "relative",
              zIndex: 1,
              display: "block",
              fontWeight: "bold",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            } as MotionStyleWithPosition
          }
        >
          {displayText}
        </motion.span>
      </motion.button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        offset={modalOffset}
        fontFamily={fontFamily}
      >
        {modalContent}
      </Modal>
    </>
  );
}

addPropertyControls(GlitchTextButtonModal, {
  text: {
    type: ControlType.String,
    title: "Button Text",
    defaultValue: "EVENTS",
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
    defaultValue: '"VT323", monospace',
  },
  disabled: {
    type: ControlType.Boolean,
    title: "Disabled",
    defaultValue: false,
  },
  modalOffset: {
    type: ControlType.Number,
    title: "Modal Offset",
    defaultValue: 0,
    min: -500,
    max: 500,
    step: 10,
    description: "Horizontal offset from center (pixels)",
  },
});
