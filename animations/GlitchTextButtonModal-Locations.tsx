import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { addPropertyControls, ControlType } from "framer";
import type { ReactNode, CSSProperties } from "react";

const VT323_FONT_FAMILY = '"VT323", monospace';

// simple markdown parser function
const parseMarkdown = (markdown: string): string => {
  return (
    markdown
      // headers
      .replace(
        /^# (.*$)/gm,
        '<h1 style="font-size: 2rem; margin-bottom: 2rem;">$1</h1>'
      )
      // lists
      .replace(
        /^\s*-\s+(.*)$/gm,
        '<li style="list-style: none; margin-bottom: 1rem; display: flex; align-items: start;">$1</li>'
      )
      // paragraphs with proper spacing
      .split("\n\n")
      .map((p) =>
        p.startsWith("-")
          ? `<ul style="padding: 0; margin: 0 0 2rem 0;">${p}</ul>`
          : `<p style="margin-bottom: 2rem; line-height: 1.625;">${p}</p>`
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
} & Omit<
  React.CSSProperties,
  | "position"
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "zIndex"
  | "width"
  | "maxWidth"
  | "transform"
>;

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  offset = 0,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  offset?: number;
}): JSX.Element => {
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const html = document.documentElement;
      const body = document.body;

      const originalHtmlOverflow = html.style.overflow;
      const originalBodyOverflow = body.style.overflow;

      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        html.style.overflow = originalHtmlOverflow;
        body.style.overflow = originalBodyOverflow;
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        body.style.paddingRight = "";

        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const renderContent = () => {
    const content = `
# NYC

WELCOME TO PUBKEY NYC, A COZY WEST VILLAGE DIVE BAR WHERE LOCALS AND BITCOINERS SHARE PINTS, BANTER, AND THE OCCASIONAL KARAOKE. WHETHER IT'S FOR CLASSIC BURGERS, LIVELY BITCOIN MEETUPS, OR LAID-BACK VIBES, THIS IS YOUR HOME AWAY FROM HOME.

WHAT TO EXPECT:

- A DIVE BAR THAT'S EQUAL PARTS GRIT AND WIT.
- WEEKLY BITCOIN MEETUPS WHERE THE IDEAS FLOW AS FREELY AS THE BEERS.
- A MENU THAT MAKES YOU FEEL LIKE YOU'RE EATING AT YOUR COOL UNCLE'S KITCHEN TABLE.

VISIT US:

- 📍 85 WASHINGTON PLACE, NEW YORK, NY 10011
- ⏰ OPEN DAILY. CHECK OUR SCHEDULE FOR WILD EVENTS AND WILD NIGHTS.

POP IN. STAY LATE. TELL US YOUR WILDEST IDEAS OVER A COLD ONE.

WANT TO HOST AN EVENT?

BOTH LOCATIONS ARE AVAILABLE FOR PRIVATE BOOKINGS, CORPORATE EVENTS, OR JUST A GOOD OLD-FASHIONED PARTY.

JOIN NOW ->

JOIN TO US ->
`;

    return (
      <div
        className="markdown-content"
        style={{
          color: "#ffffff",
          fontSize: "1.125rem",
          lineHeight: "1.5",
          fontFamily: VT323_FONT_FAMILY,
          textTransform: "uppercase",
          padding: "0 1rem",
        }}
        dangerouslySetInnerHTML={{
          __html: parseMarkdown(content),
        }}
      />
    );
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
              
              .modal-content {
                -ms-overflow-style: none;
                scrollbar-width: none;
                overflow-y: auto;
                max-height: calc(90vh - 4rem - 60px);
                font-family: ${VT323_FONT_FAMILY};
              }
              .modal-content::-webkit-scrollbar {
                display: none;
              }
              .location-button {
                background: transparent;
                border: 1px solid white;
                color: white;
                padding: 8px 24px;
                font-family: ${VT323_FONT_FAMILY};
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 120px;
              }
              .location-button:hover {
                background: white;
                color: black;
              }
              .location-active {
                background: white;
                color: black;
              }
              .header-lines {
                display: flex;
                align-items: center;
                width: 100%;
                padding: 0 1rem;
              }
              
              .header-line {
                flex: 1;
                height: 1px;
                background: repeating-linear-gradient(
                  to right,
                  white,
                  white 4px,
                  transparent 4px,
                  transparent 8px
                );
              }
              
              .location-button {
                background: transparent;
                border: 1px solid white;
                color: white;
                padding: 8px 32px;
                font-family: ${VT323_FONT_FAMILY};
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 160px;
                margin: 0 4px;
              }
              
              .dotted-line {
                width: 100%;
                height: 1px;
                background: repeating-linear-gradient(
                  to right,
                  white,
                  white 2px,
                  transparent 2px,
                  transparent 4px
                );
                margin-top: 1rem;
              }
            `}
          </style>
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            style={
              {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                zIndex: 1000,
                padding: "1rem",
              } as MotionStyleWithPosition
            }
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0, x: offset }}
              animate={{ scale: 1, x: offset }}
              exit={{ scale: 0, x: offset }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 400,
                duration: 0,
              }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              style={
                {
                  width: "100%",
                  maxWidth: "800px",
                  maxHeight: "90vh",
                  backgroundColor: "#000000",
                  border: "1px solid white",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                } as MotionStyleWithPosition
              }
            >
              {/* Replace the existing header with new style */}
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
                    #ffffff 4px,
                    #000000 4px,
                    #000000 6px,
                    #ffffff 6px,
                    #ffffff 8px
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
                      fontFamily: VT323_FONT_FAMILY,
                    }}
                  >
                    {title}
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: "1.5rem",
                  color: "#ffffff",
                  backgroundColor: "#000000",
                  overflowY: "auto",
                  flexGrow: 1,
                  fontFamily: VT323_FONT_FAMILY,
                }}
                className="modal-content"
              >
                {renderContent()}
              </div>

              {/* footer with join buttons */}
              <div
                style={{
                  borderTop: "1px solid white",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <button
                  className="location-button"
                  style={{
                    width: "100%",
                    background: "white",
                    color: "black",
                    padding: "0.5rem",
                  }}
                >
                  JOIN NOW -&gt;
                </button>
                <button
                  className="location-button"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    background: "transparent",
                  }}
                >
                  JOIN TO US -&gt;
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export function GlitchTextButtonModal({
  text,
  modalTitle = "Modal Title",
  modalContent = "Modal Content",
  fontSize = 16,
  fontFamily = "monospace",
  className = "",
  disabled = false,
  paddingX = 20,
  paddingY = 12,
  modalOffset = 0,
}: GlitchTextButtonModalProps): JSX.Element {
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
    defaultValue: "Open Modal",
  },
  modalTitle: {
    type: ControlType.String,
    title: "Modal Title",
    defaultValue: "Modal Title",
  },
  modalContent: {
    type: ControlType.String,
    title: "Modal Content",
    defaultValue: "Modal Content",
    displayTextArea: true,
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
