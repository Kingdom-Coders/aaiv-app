import { createSystem, defineConfig } from "@chakra-ui/react";
import { layerStyles } from "./layer-styles";

const config = defineConfig({
  theme: {
    layerStyles,
  },
});

export default createSystem(defaultConfig, config);
