// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers/

import React, { useState } from "react";
import { addPropertyControls, ControlType } from "framer";
import { motion, AnimatePresence } from "framer-motion";

interface MailInputProps {
  nocodbApiToken: string;
  placeholder: string;
  buttonLabel: string;
  buttonColor: string;
  backgroundColor: string;
  fontFamily: string;
  isStackedLayout: boolean;
  inputPaddingX: number;
  inputPaddingY: number;
  buttonPaddingX: number;
  buttonPaddingY: number;
  buttonTextAlignment: "left" | "center" | "right";
}

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/components/auto-sizing
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function MailInput({
  nocodbApiToken,
  placeholder,
  buttonLabel,
  buttonColor,
  backgroundColor,
  fontFamily,
  inputPaddingX,
  inputPaddingY,
  buttonPaddingX,
  buttonPaddingY,
  isStackedLayout,
  buttonTextAlignment = "center",
}: MailInputProps): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://app.nocodb.com/api/v2/tables/m0bdeehh4s7fxrq/records",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xc-token": nocodbApiToken,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit email");
      }

      setMessage("Email submitted successfully!");
    } catch (error) {
      console.error("DEBUG Error submitting email:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ ...containerStyle, backgroundColor, fontFamily }}>
      <form
        onSubmit={handleSubmit}
        style={{
          ...formStyle,
          flexDirection: isStackedLayout ? "column" : "row",
        }}
      >
        <motion.input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            ...inputStyle,
            fontFamily,
            paddingLeft: inputPaddingX,
            paddingRight: inputPaddingX,
            paddingTop: inputPaddingY,
            paddingBottom: inputPaddingY,
            width: isStackedLayout ? "100%" : "auto",
          }}
          placeholder={placeholder}
          whileFocus={{ scale: 1.02 }}
          animate={{ flex: isLoading ? 0.7 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.button
          type="submit"
          disabled={isLoading}
          style={{
            ...buttonStyle,
            backgroundColor: buttonColor,
            fontFamily,
            paddingLeft: buttonPaddingX,
            paddingRight: buttonPaddingX,
            paddingTop: buttonPaddingY,
            paddingBottom: buttonPaddingY,
            width: isStackedLayout ? "100%" : "auto",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ flex: isLoading ? 0.3 : 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isLoading ? "submitting" : "submit"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                width: "100%",
                textAlign: buttonTextAlignment,
              }}
            >
              {isLoading ? "Submitting..." : buttonLabel}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </form>
      <div style={messageContainerStyle}>
        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              style={{
                ...messageStyle,
                color: message.includes("error") ? "#EF4444" : "#10B981",
                fontFamily,
              }}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

addPropertyControls(MailInput, {
  nocodbApiToken: {
    type: ControlType.String,
    title: "NocoDB API Token",
    defaultValue: "",
  },
  placeholder: {
    type: ControlType.String,
    title: "Placeholder",
    defaultValue: "your@email.com",
  },
  buttonLabel: {
    type: ControlType.String,
    title: "Button Label",
    defaultValue: "Submit",
  },
  buttonColor: {
    type: ControlType.Color,
    title: "Button Color",
    defaultValue: "#4F46E5",
  },
  backgroundColor: {
    type: ControlType.Color,
    title: "Background Color",
    defaultValue: "rgba(0,0,0,0.5)",
  },
  fontFamily: {
    type: ControlType.Font,
    title: "Font Family",
  },
  inputPaddingX: {
    type: ControlType.Number,
    title: "Input Padding X",
    defaultValue: 24,
    min: 0,
    max: 100,
    step: 1,
  },
  inputPaddingY: {
    type: ControlType.Number,
    title: "Input Padding Y",
    defaultValue: 16,
    min: 0,
    max: 100,
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
    defaultValue: 24,
    min: 0,
    max: 100,
    step: 1,
  },
  isStackedLayout: {
    type: ControlType.Boolean,
    title: "Stacked Layout",
    defaultValue: false,
  },
  buttonTextAlignment: {
    type: ControlType.Enum,
    title: "Button Text Alignment",
    options: ["left", "center", "right"],
    defaultValue: "center",
  },
});

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  borderRadius: "24px",
  maxWidth: "600px",
  width: "100%",
  margin: "0 auto",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  gap: "8px",
};

const inputStyle: React.CSSProperties = {
  borderRadius: "24px",
  border: "none",
  fontSize: "16px",
  backgroundColor: "rgba(255,255,255,0.1)",
  color: "white",
  minWidth: "100px",
};

const buttonStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "24px",
  border: "none",
  fontSize: "16px",
  fontWeight: "bold",
  color: "white",
  cursor: "pointer",
  overflow: "hidden",
  whiteSpace: "nowrap",
  minWidth: "140px",
  textAlign: "center",
};

const messageContainerStyle: React.CSSProperties = {
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
};

const messageStyle: React.CSSProperties = {
  fontSize: "14px",
  textAlign: "center",
};
