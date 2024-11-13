import type { ComponentType } from "react";

interface Props {
  style?: React.CSSProperties;
  [key: string]: any;
}

export function CrtEffect(Component: ComponentType): ComponentType {
  return (props: Props) => {
    return (
      <Component
        {...props}
        style={{
          ...props.style,
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          mixBlendMode: "multiply",
          "&::after": {
            content: '""',
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(
                rgba(18, 16, 16, 0.1) 50%, 
                rgba(0, 0, 0, 0.1) 50%
              ),
              linear-gradient(
                90deg,
                rgba(255, 0, 0, 0.03),
                rgba(0, 255, 0, 0.02),
                rgba(0, 0, 255, 0.03)
              )
            `,
            backgroundSize: "100% 2px, 3px 100%",
            pointerEvents: "none",
            zIndex: 2,
            backdropFilter: "brightness(1.2) contrast(1.1)",
          },
          "&::before": {
            content: '""',
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.2) 100%)",
            pointerEvents: "none",
            zIndex: 3,
          },
        }}
      />
    );
  };
}
