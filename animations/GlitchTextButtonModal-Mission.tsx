import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { addPropertyControls, ControlType } from "framer";
import type { ReactNode, CSSProperties } from "react";

const VT323_FONT_FAMILY = '"VT323", monospace';

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
  CSSProperties,
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
    if (typeof children === "string") {
      return (
        <div
          className="markdown-content"
          style={{
            color: "#ffffff",
            fontSize: "1rem",
            lineHeight: "1.5",
            fontFamily: VT323_FONT_FAMILY,
          }}
          dangerouslySetInnerHTML={{
            __html: parseMarkdown(children),
          }}
        />
      );
    }
    return children;
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
                max-height: calc(90vh - 4rem);
                font-family: ${VT323_FONT_FAMILY};
              }
              .modal-content::-webkit-scrollbar {
                display: none;
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
                  maxWidth: "600px",
                  maxHeight: "90vh",
                  backgroundColor: "#000000",
                  border: "1px solid white",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                } as MotionStyleWithPosition
              }
            >
              <div style={{ height: "1px", backgroundColor: "white" }} />

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
                  padding: "2rem",
                  color: "#ffffff",
                  backgroundColor: "#000000",
                }}
                className="modal-content"
              >
                {renderContent()}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const MISSION_CONTENT = `
WHO WE ARE

PUBKEY BRINGS CULTURE, COMMUNITY, AND CREATIVITY TOGETHER. BY DAY, IT'S A COZY BAR AND RESTAURANT; BY NIGHT, A VIBRANT SPACE FOR EVENTS, MEETUPS, AND CELEBRATIONS—BECOMING, PURPOSEDLY, AND A BIT IRREVERENT.

OUR MISSION

PUBKEY IS ON A MISSION TO BUILD VIBRANT LOCAL BITCOIN COMMUNITIES WHILE CONNECTING THEM GLOBALLY. WITH OUR UNIQUE MIX OF PHYSICAL VENUES AND MEDIA PRODUCTION CAPABILITIES—FOSTERING RELATIONSHIPS, DRIVING INNOVATION, AND KEEPING THINGS FUN ALONG THE WAY.

OUR VISION

WE COMBINE THE PHYSICAL AND DIGITAL WORLDS TO CURATE MEANINGFUL CONNECTIONS, FOSTER LOCAL COMMUNITIES, AND AMPLIFY BITCOIN'S IMPACT GLOBALLY. OUR APPROACH BLENDS SIGNAL AND NOISE—SERIOUS IDEAS WITH A PLAYFUL EDGE.

WHAT WE DO

1. BAR & RESTAURANT
SERVING UP CLASSIC BAR FOOD AND DRINKS WITH AN AUTHENTIC, COMMUNITY-FIRST VIBE.

2. EVENT SPACE
WHETHER IT'S CONFERENCE AFTER-PARTIES, LOCAL CELEBRATIONS, OR CORPORATE EVENTS, PUBKEY PROVIDES A LIVELY AND ADAPTABLE VENUE.

3. PUBKEY PRODUCTIONS
A LIVESTREAM PRODUCTION STUDIO FOR HOSTING EVENTS, RECORDING PODCASTS, AND CONNECTING DIGITALLY.

- WEEKLY LIVE BITCOIN MEETUPS AND TWITTER SPACES.
- COLLABORATIONS WITH LEADING PODCASTERS LIKE WHAT BITCOIN DID, TFTC, AND GALAXY BRAINS.
- EQUIPMENT RENTALS AND PRIVATE RECORDING SPACE FOR CREATORS

ACCOMPLISHMENTS

DESPITE LAUNCHING DURING A BEAR MARKET, PUBKEY HAS ESTABLISHED MULTIPLE REVENUE STREAMS WITHIN 18 MONTHS:

- BAR & RESTAURANT: WE OPENED OUR BUSTLING NYC VENUE WITH A LOYAL BITCOIN AND LOCAL COMMUNITY.
- EVENT SPACE: 150+ BITCOIN MEETUPS HOSTED, WITH OVER 50 COMPANIES ENGAGED.
- LIVESTREAM PRODUCTION STUDIO: HIGH-QUALITY CONTENT AND PARTNERSHIPS WITH TOP INDUSTRY VOICES.
- SPONSORSHIPS & PARTNERSHIPS: COLLABORATIVE EFFORTS WITH BRANDS AND ORGANIZATIONS THAT ALIGN WITH OUR VISION.
- PRESS COVERAGE: FEATURED IN BLOOMBERG, FORBES, AND BITCOIN MAGAZINE.`;

export function GlitchTextButtonModal({
  text = "MISSIONS",
  modalTitle = "MISSIONS",
  modalContent = MISSION_CONTENT,
  fontSize = 16,
  fontFamily = '"VT323", monospace',
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
    defaultValue: "MISSIONS",
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
