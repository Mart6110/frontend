import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    breakpoints: {
      sm: "640px",   // Mobile landscape
      md: "768px",   // Tablet
      lg: "1024px",  // Desktop
      xl: "1280px",  // Large desktop
      "2xl": "1536px", // Extra large desktop
    },
    tokens: {
      fonts: {
        body: { value: "'Inter', system-ui, sans-serif" },
        heading: { value: "'Inter', system-ui, sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          value: {
            _light: "white",
            _dark: "#4A4A4A",
          },
        },
        "bg.subtle": {
          value: {
            _light: "gray.50",
            _dark: "#3A3A3A",
          },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
