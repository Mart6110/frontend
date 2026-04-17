import { Box } from "@chakra-ui/react"
import type { BoxProps } from "@chakra-ui/react"
import type { ReactNode } from "react"

export interface WidgetProps extends BoxProps {
  children: ReactNode
  variant?: "default" | "subtle" | "elevated"
}

export function Widget({ 
  children, 
  variant = "default",
  ...props 
}: WidgetProps) {
  const variantStyles = {
    default: {
      borderWidth: "1px",
      borderColor: "rgba(0, 255, 170, 0.3)",
      borderRadius: "12px",
      backdropFilter: "blur(5px)",
      boxShadow: "0 4px 20px rgba(0, 255, 170, 0.1)",
      css: { WebkitBackdropFilter: "blur(5px)" }
    },
    subtle: {
      borderWidth: "1px",
      borderColor: "rgba(0, 255, 170, 0.15)",
      borderRadius: "8px",
      backdropFilter: "blur(3px)",
      boxShadow: "0 2px 10px rgba(0, 255, 170, 0.05)",
      css: { WebkitBackdropFilter: "blur(3px)" }
    },
    elevated: {
      borderWidth: "2px",
      borderColor: "rgba(0, 255, 170, 0.5)",
      borderRadius: "16px",
      backdropFilter: "blur(10px)",
      boxShadow: "0 8px 32px rgba(0, 255, 170, 0.2)",
      css: { WebkitBackdropFilter: "blur(10px)" }
    }
  }

  return (
    <Box
      p={{ base: 4, md: 6 }}
      {...variantStyles[variant]}
      {...props}
    >
      {children}
    </Box>
  )
}
