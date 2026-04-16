import { Slider as ChakraSlider } from "@chakra-ui/react"
import { forwardRef } from "react"

export interface SliderRootProps extends ChakraSlider.RootProps {
  colorPalette?: string
}

export const SliderRoot = forwardRef<HTMLDivElement, SliderRootProps>(
  function SliderRoot({ colorPalette = "teal", ...props }, ref) {
    return <ChakraSlider.Root ref={ref} colorPalette={colorPalette} {...props} />
  }
)

export const Slider = {
  Root: SliderRoot,
  Control: ChakraSlider.Control,
  Track: ChakraSlider.Track,
  Range: ChakraSlider.Range,
  Thumb: ChakraSlider.Thumb,
  Label: ChakraSlider.Label,
  ValueText: ChakraSlider.ValueText,
  Marker: ChakraSlider.Marker,
  MarkerGroup: ChakraSlider.MarkerGroup,
  HiddenInput: ChakraSlider.HiddenInput,
}
