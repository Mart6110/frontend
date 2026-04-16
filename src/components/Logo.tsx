import { Text, Flex } from "@chakra-ui/react"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | { base?: string; md?: string; lg?: string }
}

const sizeMap: Record<string, string> = {
  sm: "lg",
  md: "xl",
  lg: "2xl",
  xl: "3xl",
}

export function Logo({ size = "md" }: LogoProps) {
  // Handle responsive size object or string
  const fontSize = typeof size === "string" 
    ? sizeMap[size] 
    : {
        base: size.base ? sizeMap[size.base] : sizeMap.md,
        md: size.md ? sizeMap[size.md] : undefined,
        lg: size.lg ? sizeMap[size.lg] : undefined,
      }

  return (
    <Flex align="center" gap={0}>
      <Text
        fontSize={fontSize}
        fontWeight="700"
        color="#D4A373"
        letterSpacing="tight"
      >
        Dune
      </Text>
      <Text
        fontSize={fontSize}
        fontWeight="700"
        color="#0d9488"
        letterSpacing="tight"
      >
        Power
      </Text>
    </Flex>
  )
}
