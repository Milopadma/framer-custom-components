import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { addPropertyControls, ControlType } from "framer";

interface EmailSubscriptionFormProps {
  apiEndpoint: string;
  apiKey?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  fontFamily?: string;
  buttonText?: string;
  placeholderText?: string;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
}

export function EmailSubscriptionForm({
  apiEndpoint,
  apiKey = "",
  backgroundColor = "#000000",
  textColor = "#ffffff",
  accentColor = "#ffffff",
  fontFamily = '"VT323", monospace',
  buttonText = "Subscribe",
  placeholderText = "Enter your email",
  successMessage = "Successfully subscribed!",
  errorMessage = "Something went wrong. Please try again.",
  className = "",
}: EmailSubscriptionFormProps): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [isGlitching, setIsGlitching] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setStatus("loading");
    setIsGlitching(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("DEBUG subscription error:", error);
      setStatus("error");
    } finally {
      setIsGlitching(false);
    }
  };

  return (
    <motion.div
      className={className}
      style={{
        backgroundColor,
        padding: "2rem",
        borderRadius: "0",
        fontFamily,
        maxWidth: "32rem",
        width: "100%",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 2 }}>
        <div style={{ marginBottom: "1rem" }}>
          <motion.input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder={placeholderText.toUpperCase()}
            required
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "0",
              color: textColor,
              fontFamily,
              fontSize: "1.2rem",
              caretColor: "#ffffff",
              outline: "none",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              "::placeholder": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              },
            }}
            whileFocus={{
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
              scale: 1.01,
            }}
            animate={{
              x: isGlitching ? Math.random() * 4 - 2 : 0,
              y: isGlitching ? Math.random() * 4 - 2 : 0,
            }}
          />
        </div>

        <motion.button
          type="submit"
          disabled={status === "loading"}
          style={{
            width: "100%",
            padding: "1rem",
            backgroundColor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "0",
            color: "#ffffff",
            fontFamily,
            fontSize: "1.2rem",
            cursor: status === "loading" ? "wait" : "pointer",
            position: "relative",
            overflow: "hidden",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
          whileHover={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
            scale: 1.02,
          }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={status}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              style={{ display: "block" }}
            >
              {status === "loading"
                ? "SUBSCRIBING..."
                : buttonText.toUpperCase()}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </form>

      <AnimatePresence>
        {(status === "success" || status === "error") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              marginTop: "1rem",
              color: status === "success" ? "#ffffff" : "#ff3333",
              textAlign: "center",
              fontSize: "1rem",
              fontFamily,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {status === "success"
              ? successMessage.toUpperCase()
              : errorMessage.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

addPropertyControls(EmailSubscriptionForm, {
  apiEndpoint: {
    type: ControlType.String,
    title: "API Endpoint",
    defaultValue: "https://api.example.com/subscribe",
  },
  apiKey: {
    type: ControlType.String,
    title: "API Key",
    defaultValue: "",
  },
  backgroundColor: {
    type: ControlType.Color,
    title: "Background Color",
    defaultValue: "#000000",
  },
  textColor: {
    type: ControlType.Color,
    title: "Text Color",
    defaultValue: "#ffffff",
  },
  accentColor: {
    type: ControlType.Color,
    title: "Accent Color",
    defaultValue: "#ffffff",
  },
  fontFamily: {
    type: ControlType.String,
    title: "Font Family",
    defaultValue: '"VT323", monospace',
  },
  buttonText: {
    type: ControlType.String,
    title: "Button Text",
    defaultValue: "Subscribe",
  },
  placeholderText: {
    type: ControlType.String,
    title: "Placeholder Text",
    defaultValue: "Enter your email",
  },
  successMessage: {
    type: ControlType.String,
    title: "Success Message",
    defaultValue: "Successfully subscribed!",
  },
  errorMessage: {
    type: ControlType.String,
    title: "Error Message",
    defaultValue: "Something went wrong. Please try again.",
  },
});
