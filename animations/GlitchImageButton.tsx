import { useState, useEffect, useMemo } from "react";
import { addPropertyControls, ControlType } from "framer";

interface GlitchImageButtonProps {
  imageUrl: string | { src: string } | null;
  onClick?: () => void;
  width?: number | string;
  height?: number | string;
  className?: string;
  disabled?: boolean;
  altText?: string;
  title?: string;
  subtitle?: string;
  location?: string;
  textColor?: string;
  subtitleColor?: string;
  locationColor?: string;
  fontFamily?: string;
}

export function GlitchImageButton({
  imageUrl,
  onClick,
  width = "100%",
  height = "100%",
  className = "",
  disabled = false,
  altText = "Glitch Image Button",
  title = "",
  subtitle = "",
  location = "",
  textColor = "#FFFFFF",
  subtitleColor = "#FFFFFF",
  locationColor = "#FFFFFF",
  fontFamily = "monospace",
}: GlitchImageButtonProps): JSX.Element {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const processedImageUrl = useMemo(() => {
    console.log("DEBUG raw imageUrl:", imageUrl);

    if (!imageUrl) return null;

    if (
      typeof imageUrl === "string" &&
      imageUrl.startsWith("https://framerusercontent.com/")
    ) {
      return imageUrl;
    }

    if (typeof imageUrl === "object" && "src" in imageUrl) {
      console.log("DEBUG using image src:", (imageUrl as { src: string }).src);
      return (imageUrl as { src: string }).src;
    }

    console.log("DEBUG fallback url:", imageUrl);
    return imageUrl;
  }, [imageUrl]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "24px",
        maxWidth: "100%",
        maxHeight: "100%",
        position: "relative",
      }}
    >
      <div
        onClick={!disabled ? onClick : undefined}
        style={{
          position: "relative",
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          overflow: "hidden",
          backgroundColor: "#000",
          border: "1px solid rgba(255,255,255,0.1)",
          aspectRatio: "1 / 1",
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {processedImageUrl && (
          <img
            src={processedImageUrl}
            alt={altText}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onLoad={() => {
              console.log("DEBUG image loaded:", processedImageUrl);
              setImageLoaded(true);
            }}
            onError={(e) => {
              console.log("DEBUG image error:", e);
              setImageLoaded(false);
            }}
          />
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily,
        }}
      >
        <h2
          style={{
            color: textColor,
            fontSize: "24px",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            color: subtitleColor,
            fontSize: "18px",
            marginBottom: "4px",
          }}
        >
          {subtitle}
        </p>
        <p
          style={{
            color: locationColor,
            fontSize: "14px",
          }}
        >
          {location}
        </p>
      </div>
    </div>
  );
}

addPropertyControls(GlitchImageButton, {
  imageUrl: {
    type: ControlType.Image,
    title: "Image",
  },
  width: {
    type: ControlType.Number,
    title: "Width",
    defaultValue: 200,
    min: 50,
    max: 1000,
    step: 1,
    hidden: () => false,
  },
  height: {
    type: ControlType.Number,
    title: "Height",
    defaultValue: 200,
    min: 50,
    max: 1000,
    step: 1,
    hidden: () => false,
  },
  disabled: {
    type: ControlType.Boolean,
    title: "Disabled",
    defaultValue: false,
  },
  altText: {
    type: ControlType.String,
    title: "Alt Text",
    defaultValue: "Glitch Image Button",
  },
  title: {
    type: ControlType.String,
    title: "Title",
    defaultValue: "NYC",
  },
  subtitle: {
    type: ControlType.String,
    title: "Subtitle",
    defaultValue: "12:45 PM",
  },
  location: {
    type: ControlType.String,
    title: "Location",
    defaultValue: "LOCATION#1",
  },
  textColor: {
    type: ControlType.Color,
    title: "Title Color",
    defaultValue: "#FFFFFF",
  },
  subtitleColor: {
    type: ControlType.Color,
    title: "Subtitle Color",
    defaultValue: "#FFFFFF",
  },
  locationColor: {
    type: ControlType.Color,
    title: "Location Color",
    defaultValue: "#666666",
  },
  fontFamily: {
    type: ControlType.String,
    title: "Font Family",
    defaultValue: "monospace",
  },
});
