import React, { useState, useEffect } from "react";
import { addPropertyControls, ControlType } from "framer";
import { motion, AnimatePresence } from "framer-motion";

// types should ideally be in types/ folder
interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

interface YouTubeFeedProps {
  apiKey: string;
  channelId: string;
  maxResults: number;
  backgroundColor: string;
  fontFamily: string;
  textColor: string;
  hoverColor: string;
}

export default function YouTubeFeed({
  apiKey,
  channelId,
  maxResults = 6,
  backgroundColor,
  fontFamily,
  textColor,
  hoverColor,
}: YouTubeFeedProps): JSX.Element {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchVideos = async (): Promise<void> => {
      try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;

        // debug the exact URL being used
        console.log("DEBUG comparing URLs:");
        console.log(
          "Working URL:",
          "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBz9EGJ4jnPeKZ-A0jltcmzjXDfeINgBVs&channelId=UCduTlYCkTTd1gCU6w9iwK7A&part=snippet,id&order=date&maxResults=3&type=video"
        );
        console.log("Generated URL:", apiUrl);

        const response = await fetch(apiUrl);

        // debug the response status
        console.log("DEBUG Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("DEBUG Full error response:", errorData);
          throw new Error(
            `API Error (${response.status}): ${
              errorData.error?.message ?? "Unknown error"
            }`
          );
        }

        const data = await response.json();
        console.log("DEBUG YouTube API response:", data);

        if (!data.items || !Array.isArray(data.items)) {
          throw new Error("Invalid response format from YouTube API");
        }

        const formattedVideos: YouTubeVideo[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        }));

        setVideos(formattedVideos);
      } catch (err) {
        console.error("DEBUG Error fetching videos:", err);
        setError(err instanceof Error ? err.message : "Failed to load videos");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchVideos();
  }, [apiKey, channelId, maxResults]);

  return (
    <div style={{ ...containerStyle, backgroundColor, fontFamily }}>
      <h2 style={{ ...titleStyle, color: textColor }}>Latest Videos</h2>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={loadingStyle}
        >
          <span style={{ color: textColor }}>Loading videos...</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={errorStyle}
        >
          <span style={{ color: "#EF4444" }}>{error}</span>
        </motion.div>
      )}

      <div style={gridStyle}>
        <AnimatePresence>
          {videos.map((video: YouTubeVideo) => (
            <motion.a
              key={video.id}
              href={`https://youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{
                scale: 1.05,
                backgroundColor: hoverColor,
              }}
              style={videoCardStyle}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                style={thumbnailStyle}
              />
              <div style={videoInfoStyle}>
                <h3
                  style={{
                    ...videoTitleStyle,
                    color: textColor,
                  }}
                >
                  {video.title}
                </h3>
                <span style={{ ...dateStyle, color: textColor }}>
                  {video.publishedAt}
                </span>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

addPropertyControls(YouTubeFeed, {
  apiKey: {
    type: ControlType.String,
    title: "YouTube API Key",
    defaultValue: "AIzaSyBz9EGJ4jnPeKZ-A0jltcmzjXDfeINgBVs",
  },
  channelId: {
    type: ControlType.String,
    title: "Channel ID",
    defaultValue: "UCduTlYCkTTd1gCU6w9iwK7A",
  },
  maxResults: {
    type: ControlType.Number,
    title: "Max Results",
    defaultValue: 6,
    min: 1,
    max: 50,
    step: 1,
  },
  backgroundColor: {
    type: ControlType.Color,
    title: "Background Color",
    defaultValue: "#000000",
  },
  fontFamily: {
    type: ControlType.String,
    title: "Font Family",
    defaultValue: "Inter, sans-serif",
  },
  textColor: {
    type: ControlType.Color,
    title: "Text Color",
    defaultValue: "#FFFFFF",
  },
  hoverColor: {
    type: ControlType.Color,
    title: "Hover Color",
    defaultValue: "rgba(255,255,255,0.1)",
  },
});

// !!! DESIGNERS WHO DON'T KNOW CODE: IF YOU WANT TO CHANGE STYLES; JUST CHANGE THE LINES BELOW THIS ONE.
const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "40px",
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  borderRadius: "24px",
  maxHeight: "100vh",
  overflowY: "auto",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch",
};

const titleStyle: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: "bold",
  marginBottom: "32px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "24px",
  paddingBottom: "24px",
};

const videoCardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  borderRadius: "16px",
  overflow: "hidden",
  textDecoration: "none",
  backgroundColor: "rgba(255,255,255,0.05)",
  transition: "background-color 0.3s ease",
};

const thumbnailStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "16/9",
  objectFit: "cover",
};

const videoInfoStyle: React.CSSProperties = {
  padding: "16px",
};

const videoTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "500",
  marginBottom: "8px",
  lineHeight: "1.4",
};

const dateStyle: React.CSSProperties = {
  fontSize: "14px",
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
