import { useState, useEffect } from "react";
import { addPropertyControls, ControlType } from "framer";
import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";

// types for the youtube feed
interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount?: string;
  duration?: string;
}

// simplified modal component
function Modal({
  isOpen,
  onClose,
  title,
  children,
  fontFamily,
  offset = 0,
  maxWidth = "90vw",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  fontFamily: string;
  offset?: number;
  maxWidth?: string | number;
}): JSX.Element {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return <></>;

  return (
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
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: maxWidth,
          maxHeight: "90vh",
          backgroundColor: "#000000",
          border: "2px solid #ffffff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transform: `translateX(${offset}px)`,
        }}
      >
        <div style={modalHeaderStyle}>
          <div style={mediaTitleContainerStyle}>
            <span style={{ ...modalTitleStyle, fontFamily }}>MEDIA</span>
          </div>
        </div>
        <div style={modalContentStyle}>
          <h2 style={{ ...latestVideosStyle, fontFamily }}>LATEST VIDEOS</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

// update the props interface
interface YouTubeFeedModalProps {
  text?: string;
  modalTitle?: string;
  apiKey: string;
  channelId: string;
  maxResults?: number;
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
  modalOffset?: number;
  modalWidth?: string | number;
  buttonFontFamily?: string;
  buttonFontSize?: number;
  buttonPaddingX?: number;
  buttonPaddingY?: number;
}

// add these interfaces at the top with other interfaces
interface GlitchButtonProps {
  text: string;
  onClick: () => void;
  fontSize: number;
  fontFamily: string;
  disabled?: boolean;
  paddingX: number;
  paddingY: number;
}

// Add the same type near the top of the file
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

// replace SimpleButton with this new animated button
function AnimatedButton({
  text,
  onClick,
  fontSize,
  fontFamily,
  disabled = false,
  paddingX,
  paddingY,
}: GlitchButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>(text);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [animationId, setAnimationId] = useState<number>(0);

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>[]{}";

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
    <motion.button
      onClick={onClick}
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
  );
}

// replace GlitchImage with simple image
function SimpleImage({
  src,
  alt,
  style,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}): JSX.Element {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        ...style,
      }}
    />
  );
}

// add this function before the main YouTubeFeedModal component
function renderVideos(videos: YouTubeVideo[], fontFamily: string): JSX.Element {
  const featuredVideos = videos.slice(0, 2);
  const textOnlyVideos = videos.slice(2, 5);

  return (
    <div style={containerStyle}>
      <div style={featuredGridStyle}>
        {featuredVideos.map((video) => (
          <a
            key={video.id}
            href={`https://youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={videoCardStyle}
          >
            <SimpleImage
              src={video.thumbnail}
              alt={video.title}
              style={thumbnailStyle}
            />
            <div style={videoInfoStyle}>
              <h3 style={{ ...videoTitleStyle, fontFamily }}>{video.title}</h3>
              <span style={{ ...dateStyle, fontFamily }}>
                {video.publishedAt}
              </span>
            </div>
          </a>
        ))}
      </div>

      <div style={textListStyle}>
        {textOnlyVideos.map((video) => (
          <a
            key={video.id}
            href={`https://youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={textVideoStyle}
          >
            <span style={{ ...textVideoTitleStyle, fontFamily }}>
              {video.title}
            </span>
            <div style={{ ...textVideoMetaStyle, fontFamily }}>
              <span>{video.publishedAt}</span>
              {video.viewCount && <span>{video.viewCount} views</span>}
              {video.duration && <span>{video.duration}</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// main component (simplified)
export function YouTubeFeedModal({
  text = "Open YouTube Feed",
  modalTitle = "Latest Videos",
  apiKey,
  channelId,
  maxResults = 6,
  backgroundColor = "#000000",
  textColor = "#ffffff",
  hoverColor = "rgba(255,255,255,0.1)",
  modalOffset = 0,
  modalWidth = "90vw",
  buttonFontFamily = "monospace",
  buttonFontSize = 16,
  buttonPaddingX = 24,
  buttonPaddingY = 12,
}: YouTubeFeedModalProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isModalOpen) {
      const fetchVideos = async (): Promise<void> => {
        try {
          const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;
          const response = await fetch(apiUrl);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `API Error (${response.status}): ${
                errorData.error?.message ?? "Unknown error"
              }`
            );
          }

          const data = await response.json();
          const formattedVideos: YouTubeVideo[] = data.items.map(
            (item: any) => ({
              id: item.id.videoId,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.high.url,
              publishedAt: new Date(
                item.snippet.publishedAt
              ).toLocaleDateString(),
            })
          );

          setVideos(formattedVideos);
        } catch (err) {
          console.error("DEBUG Error fetching videos:", err);
          setError(
            err instanceof Error ? err.message : "Failed to load videos"
          );
        } finally {
          setIsLoading(false);
        }
      };

      void fetchVideos();
    }
  }, [isModalOpen, apiKey, channelId, maxResults]);

  return (
    <>
      <AnimatedButton
        text={text}
        onClick={() => setIsModalOpen(true)}
        fontSize={buttonFontSize}
        fontFamily={buttonFontFamily}
        disabled={false}
        paddingX={buttonPaddingX}
        paddingY={buttonPaddingY}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        fontFamily={buttonFontFamily}
        offset={modalOffset}
        maxWidth={modalWidth}
      >
        <div style={{ ...containerStyle, backgroundColor }}>
          {isLoading && (
            <div style={loadingStyle}>
              <span style={{ color: textColor, fontFamily: buttonFontFamily }}>
                Loading videos...
              </span>
            </div>
          )}

          {error && (
            <div style={errorStyle}>
              <span style={{ color: "#EF4444", fontFamily: buttonFontFamily }}>
                {error}
              </span>
            </div>
          )}

          {renderVideos(videos, buttonFontFamily)}
        </div>
      </Modal>
    </>
  );
}

// styles
const buttonStyle: React.CSSProperties = {
  backgroundColor: "#000000",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  textTransform: "uppercase",
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  width: "100%",
  borderRadius: "12px",
  maxHeight: "70vh",
  overflowY: "auto",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "30px",
  padding: "30px",
};

const videoCardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  textDecoration: "none",
  backgroundColor: "#000000",
  border: "1px solid rgba(255,255,255,0.2)",
  transition: "all 0.3s ease",
  position: "relative",
};

const thumbnailStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "16/9",
  objectFit: "cover",
};

const videoInfoStyle: React.CSSProperties = {
  padding: "24px",
  backgroundColor: "#000000",
  borderTop: "1px solid rgba(255,255,255,0.2)",
};

const videoTitleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontFamily: "monospace",
  fontWeight: "500",
  marginBottom: "8px",
  lineHeight: "1.4",
};

const dateStyle: React.CSSProperties = {
  fontSize: "24px",
  fontFamily: "monospace",
  opacity: 0.7,
};

const loadingStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px",
};

const errorStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px",
};

const modalHeaderStyle: React.CSSProperties = {
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
};

const mediaTitleContainerStyle: React.CSSProperties = {
  backgroundColor: "#000000",
  padding: "0.5rem 2rem",
  border: "1px solid #ffffff",
};

const modalTitleStyle: React.CSSProperties = {
  fontSize: "32px",
  letterSpacing: "0.2em",
  fontWeight: "bold",
  color: "#ffffff",
};

const latestVideosStyle: React.CSSProperties = {
  fontSize: "24px",
  letterSpacing: "0.15em",
  color: "#ffffff",
  marginBottom: "2rem",
  fontWeight: "bold",
};

const modalContentStyle: React.CSSProperties = {
  padding: "1rem",
  backgroundColor: "#000000",
  color: "#ffffff",
  overflowY: "auto",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

const subTitleStyle: React.CSSProperties = {
  fontSize: "24px",
  letterSpacing: "0.15em",
  fontFamily: "monospace",
  color: "#ffffff",
  opacity: 0.8,
};

const featuredGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "30px",
  marginBottom: "30px",
};

const textListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  borderTop: "1px solid rgba(255, 255, 255, 0.2)",
  paddingTop: "20px",
};

const textVideoStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ffffff",
  padding: "10px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  transition: "background-color 0.3s ease",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  cursor: "pointer",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const textVideoTitleStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "500",
};

const textVideoMetaStyle: React.CSSProperties = {
  display: "flex",
  gap: "15px",
  fontSize: "12px",
  opacity: 0.7,
};

addPropertyControls(YouTubeFeedModal, {
  text: {
    type: ControlType.String,
    title: "Button Text",
    defaultValue: "Open YouTube Feed",
  },
  modalTitle: {
    type: ControlType.String,
    title: "Modal Title",
    defaultValue: "Latest Videos",
  },
  apiKey: {
    type: ControlType.String,
    title: "YouTube API Key",
  },
  channelId: {
    type: ControlType.String,
    title: "Channel ID",
  },
  maxResults: {
    type: ControlType.Number,
    title: "Max Results",
    defaultValue: 6,
    min: 1,
    max: 50,
    step: 1,
  },
  modalOffset: {
    type: ControlType.Number,
    title: "Modal Offset",
    defaultValue: 0,
    min: -500,
    max: 500,
    step: 10,
  },
  modalWidth: {
    type: ControlType.String,
    title: "Modal Width",
    defaultValue: "90vw",
  },
  buttonFontFamily: {
    type: ControlType.String,
    title: "Button Font Family",
    defaultValue: "monospace",
  },
  buttonFontSize: {
    type: ControlType.Number,
    title: "Button Font Size",
    defaultValue: 16,
    min: 8,
    max: 72,
    step: 1,
  },
  buttonPaddingX: {
    type: ControlType.Number,
    title: "Button Padding X",
    defaultValue: 24,
    min: 0,
    max: 100,
    step: 1,
  },
  buttonPaddingY: {
    type: ControlType.Number,
    title: "Button Padding Y",
    defaultValue: 12,
    min: 0,
    max: 100,
    step: 1,
  },
});
