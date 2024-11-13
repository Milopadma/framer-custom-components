import { useEffect, useRef, useState } from "react";
import { addPropertyControls, ControlType } from "framer";

interface VideoToAsciiProps {
  videoAsset: string;
  fontSize?: number;
  density?: string;
  textColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  className?: string;
}

const ASCII_CHARS = " .:-=+*#%@";

export function VideoToAscii({
  videoAsset,
  fontSize = 8,
  density = ASCII_CHARS,
  textColor = "#00ff00",
  backgroundColor = "#000000",
  fontFamily = "monospace",
  className = "",
}: VideoToAsciiProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outputRef = useRef<HTMLPreElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const convertToAscii = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ): string => {
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let ascii = "";

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const offset = (i * width + j) * 4;
        const r = pixels[offset];
        const g = pixels[offset + 1];
        const b = pixels[offset + 2];
        const brightness = (r + g + b) / 3;
        const charIndex = Math.floor((brightness / 255) * (density.length - 1));
        ascii += density[charIndex];
      }
      ascii += "\n";
    }

    return ascii;
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const output = outputRef.current;

    if (!video || !canvas || !output) return;

    video.src = videoAsset;
    video.loop = true;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame: number;

    const render = () => {
      if (video.paused || video.ended) {
        setIsPlaying(false);
        return;
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const ascii = convertToAscii(context, canvas.width, canvas.height);
      output.textContent = ascii;

      animationFrame = requestAnimationFrame(render);
    };

    const handleVideoLoad = () => {
      canvas.width = Math.floor(video.videoWidth / fontSize);
      canvas.height = Math.floor(video.videoHeight / fontSize);

      void video
        .play()
        .then(() => {
          setIsPlaying(true);
          render();
        })
        .catch((error: Error) =>
          setError(`Error playing video: ${error.message}`)
        );
    };

    video.addEventListener("loadeddata", handleVideoLoad);

    return () => {
      video.removeEventListener("loadeddata", handleVideoLoad);
      cancelAnimationFrame(animationFrame);
    };
  }, [videoAsset, fontSize, density]);

  return (
    <div className={className}>
      {error && <div className="text-red-500">{error}</div>}
      <video
        ref={videoRef}
        style={{ display: "none" }}
        playsInline
        muted
        crossOrigin="anonymous"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <pre
        ref={outputRef}
        style={{
          fontSize: `${fontSize}px`,
          fontFamily,
          color: textColor,
          backgroundColor,
          margin: 0,
          lineHeight: 1,
          letterSpacing: "0.1em",
          whiteSpace: "pre",
          overflow: "hidden",
        }}
      />
    </div>
  );
}

addPropertyControls(VideoToAscii, {
  videoAsset: {
    type: ControlType.File,
    title: "Video",
    allowedFileTypes: ["mp4", "webm"],
  },
  fontSize: {
    type: ControlType.Number,
    title: "Font Size",
    defaultValue: 8,
    min: 4,
    max: 16,
    step: 1,
  },
  density: {
    type: ControlType.String,
    title: "ASCII Density",
    defaultValue: ASCII_CHARS,
  },
  textColor: {
    type: ControlType.Color,
    title: "Text Color",
    defaultValue: "#00ff00",
  },
  backgroundColor: {
    type: ControlType.Color,
    title: "Background Color",
    defaultValue: "#000000",
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
});
