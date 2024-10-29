import React, { useState } from "react";
import { addPropertyControls, ControlType } from "framer";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  title: string;
  description: string;
}

interface StepsComponentProps {
  steps: Step[];
  backgroundColor: string;
  fontFamily: string;
  activeColor: string;
  inactiveColor: string;
  textColor: string;
  inactiveTextColor: string;
}

interface StepShapeProps {
  activeStep: number;
}

const defaultSteps: Step[] = [
  {
    title: "True Cost of Advertising / Set Your Budget",
    description:
      "The Attention Marketplace will establish attention as a commodity, as a price that can be tracked, just like gold, gas, and of course, Bitcoin. Right now, the price of attention is unknown, manipulated and set by the C.H.A.O.S. Cartel. Data provided to support their claims of engagement, reach, and conversion are not transparent.",
  },
  {
    title: "Choose Your Target Audience",
    description:
      "Define and select your ideal audience based on demographics, interests, and behaviors to ensure your advertising reaches the right people.",
  },
  {
    title: "Create Engaging Content",
    description:
      "Develop compelling and relevant content that resonates with your target audience, focusing on their needs and preferences to maximize engagement.",
  },
  {
    title: "Analyze and Optimize",
    description:
      "Continuously monitor campaign performance, analyze data, and make data-driven adjustments to improve your advertising effectiveness and ROI.",
  },
];

const StepShape: React.FC<StepShapeProps> = ({
  activeStep,
}: StepShapeProps) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 589 642"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_279_2285)">
      <mask
        id="mask0_279_2285"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="591"
        height="642"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M590.158 404.049V404.109V437.362C590.158 581.617 518.055 641.989 368.878 641.989H221.279C72.1022 641.989 0 581.617 0 437.362V205.616C0 61.3607 72.1022 0.988831 221.279 0.988831H368.878C518.055 0.988831 590.158 61.3607 590.158 205.616V238.929V404.049Z"
          fill="#EE2424"
        />
      </mask>
      <g mask="url(#mask0_279_2285)">
        <path
          d="M328.686 35.8361C328.727 35.2581 329.059 33.6582 329.474 31.7795C330.532 14.6036 344.88 0.988831 362.422 0.988831H491.009C544.789 0.988831 588.381 44.3621 588.381 97.8717V252.661C588.381 270.436 574.189 284.918 556.46 285.496L558.13 285.516C558.13 285.516 519.839 290.12 475.749 285.186C474.546 285.073 473.353 284.938 472.16 284.763C471.402 284.67 470.645 284.577 469.877 284.474H470.303C448.579 280.872 429.149 268 418.183 248.594C404.738 224.792 385.692 204.561 362.806 189.655C342.618 176.505 330.159 154.457 329.433 130.562C327.565 113.086 325.314 79.5604 328.675 35.8568L328.686 35.8361Z"
          fill={activeStep === 0 ? "white" : "grey"}
        />
        <path
          d="M259.695 35.8361C259.653 35.2581 259.322 33.6582 258.907 31.7795C257.848 14.6036 243.501 0.988831 225.958 0.988831H97.3714C43.592 0.988831 0 44.3621 0 97.8717V252.661C0 270.436 14.1918 284.918 31.9211 285.496L30.2509 285.516C30.2509 285.516 68.5417 290.12 112.632 285.186C113.835 285.073 115.028 284.938 116.221 284.763C116.978 284.67 117.736 284.577 118.503 284.474H118.078C139.801 280.872 159.232 268 170.198 248.594C183.642 224.792 202.689 204.561 225.575 189.655C245.763 176.505 258.222 154.457 258.948 130.562C260.815 113.086 263.067 79.5604 259.705 35.8568L259.695 35.8361Z"
          fill={activeStep === 1 ? "white" : "grey"}
        />
        <path
          d="M259.695 607.664C259.653 608.242 259.322 609.842 258.907 611.721C257.838 628.907 243.501 642.512 225.958 642.512H97.3714C43.592 642.512 0 599.138 0 545.629V390.85C0 373.075 14.1918 358.593 31.9211 358.015L30.2509 357.994C30.2509 357.994 68.5417 353.391 112.632 358.325C113.835 358.438 115.028 358.572 116.221 358.748C116.978 358.841 117.736 358.934 118.503 359.037H118.078C139.801 362.639 159.232 375.511 170.198 394.916C183.642 418.719 202.689 438.95 225.575 453.855C245.763 467.006 258.222 489.054 258.948 512.949C260.815 530.424 263.067 563.951 259.705 607.654L259.695 607.664Z"
          fill={activeStep === 2 ? "white" : "grey"}
        />
        <path
          d="M328.686 607.664C328.727 608.242 329.059 609.842 329.474 611.721C330.543 628.907 344.88 642.512 362.422 642.512H491.009C544.789 642.512 588.381 599.138 588.381 545.629V390.85C588.381 373.075 574.189 358.593 556.46 358.015L558.13 357.994C558.13 357.994 519.839 353.391 475.749 358.325C474.546 358.438 473.353 358.572 472.16 358.748L472.155 358.749C471.399 358.841 470.644 358.934 469.877 359.037H470.303C448.579 362.639 429.149 375.511 418.183 394.916C404.738 418.719 385.692 438.95 362.806 453.855C342.618 467.006 330.159 489.054 329.433 512.949C327.565 530.424 325.314 563.951 328.675 607.654L328.686 607.664Z"
          fill={activeStep === 3 ? "white" : "grey"}
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_279_2285">
        <rect
          width="588.212"
          height="641"
          fill="white"
          transform="translate(0 0.988831)"
        />
      </clipPath>
    </defs>
  </svg>
);

const stepWrapperStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  width: "140px",
  height: "140px",
  position: "relative",
};

export default function StepsComponent({
  steps = defaultSteps,
  backgroundColor,
  fontFamily,
  activeColor,
  inactiveColor,
  textColor,
  inactiveTextColor,
}: StepsComponentProps): JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(0);

  const currentSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div style={{ ...containerStyle, backgroundColor, fontFamily }}>
      <h2 style={{ ...titleStyle, color: textColor }}>how it works</h2>
      <div style={contentContainerStyle}>
        <div style={stepsContainerStyle}>
          <motion.div
            style={stepWrapperStyle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveStep(0)}
          >
            <StepShape
              color={activeStep === 0 ? activeColor : inactiveColor}
              activeStep={activeStep}
            />
          </motion.div>
        </div>
        <div style={stepContentStyle}>
          <div style={stepsNumbersContainerStyle}>
            {currentSteps.map((_, index) => (
              <motion.span
                key={index}
                style={{
                  ...stepNumberStyle,
                  color: index === activeStep ? textColor : inactiveTextColor,
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveStep(index)}
              >
                step {index + 1}
              </motion.span>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{ ...stepTitleStyle, color: textColor }}>
                {currentSteps[activeStep].title}
              </h3>
              <p style={{ ...descriptionStyle, color: textColor }}>
                {currentSteps[activeStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

addPropertyControls(StepsComponent, {
  steps: {
    type: ControlType.Array,
    title: "Steps",
    defaultValue: defaultSteps,
    control: {
      type: ControlType.Object,
      controls: {
        title: { type: ControlType.String, title: "Title" },
        description: { type: ControlType.String, title: "Description" },
      },
    },
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
  activeColor: {
    type: ControlType.Color,
    title: "Active Step Color",
    defaultValue: "#FFFFFF",
  },
  inactiveColor: {
    type: ControlType.Color,
    title: "Inactive Step Color",
    defaultValue: "#333333",
  },
  textColor: {
    type: ControlType.Color,
    title: "Text Color",
    defaultValue: "#FFFFFF",
  },
  inactiveTextColor: {
    type: ControlType.Color,
    title: "Inactive Text Color",
    defaultValue: "#888888",
  },
});

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "40px",
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
};

const titleStyle: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const stepsNumbersContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  gap: "20px",
  marginBottom: "20px",
};

const contentContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
};

const stepsContainerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "30px",
  marginRight: "40px",
  width: "300px",
};

const stepContentStyle: React.CSSProperties = {
  flex: 1,
};

const stepNumberStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "bold",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const stepTitleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "16px",
};

const descriptionStyle: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "1.5",
};
