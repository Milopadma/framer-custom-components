// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers/

import React, { useState } from "react";
import { addPropertyControls, ControlType } from "framer";

interface MailInputProps {
  nocodbApiToken: string;
  title: string;
  subtitle: string;
  placeholder: string;
  buttonLabel: string;
  buttonColor: string;
  backgroundColor: string;
  fontFamily: string;
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
  title,
  subtitle,
  placeholder,
  buttonLabel,
  buttonColor,
  backgroundColor,
  fontFamily,
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
    <div
      style={{
        ...containerStyle,
        backgroundColor,
        fontFamily: "Rouben Bold",
      }}
    >
      <h1 style={titleStyle}>{title}</h1>
      <p
        style={subtitleStyle}
        dangerouslySetInnerHTML={{
          __html: subtitle.replace(/\*(.*?)\*/g, "<strong>$1</strong>"),
        }}
      ></p>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ ...inputStyle, fontFamily }}
          placeholder={placeholder}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{ ...buttonStyle, backgroundColor: buttonColor, fontFamily }}
        >
          {isLoading ? "Submitting..." : buttonLabel}
        </button>
      </form>
      {message && (
        <p
          style={{
            ...messageStyle,
            color: message.includes("error") ? "#EF4444" : "#10B981",
            fontFamily,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

addPropertyControls(MailInput, {
  nocodbApiToken: {
    type: ControlType.String,
    title: "NocoDB API Token",
    defaultValue: "",
  },
  title: {
    type: ControlType.String,
    title: "Title",
    defaultValue: "sign up for beta app",
  },
  subtitle: {
    type: ControlType.String,
    title: "Subtitle",
    defaultValue:
      "let's find out what our attention is really worth—*together.*",
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
});

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px",
  borderRadius: "24px",
  backdropFilter: "blur(10px)",
  color: "white",
  textAlign: "center",
  maxWidth: "600px",
  margin: "0 auto",
};

const titleStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "8px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "16px",
  marginBottom: "24px",
  opacity: 0.8,
};

const formStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  gap: "8px",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "12px 16px",
  borderRadius: "24px",
  border: "none",
  fontSize: "16px",
  backgroundColor: "rgba(255,255,255,0.1)",
  color: "white",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 24px",
  borderRadius: "24px",
  border: "none",
  fontSize: "16px",
  fontWeight: "bold",
  color: "white",
  cursor: "pointer",
};

const messageStyle: React.CSSProperties = {
  marginTop: "16px",
  fontSize: "14px",
};
