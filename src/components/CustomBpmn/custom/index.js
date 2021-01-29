import CustomPalette from "./CustomPalette";
import CustomContextPadProvider from "./CustomContextPadProvider";
import CustomRenderer from './CustomRenderer';
export default {
  __init__: ["paletteProvider","contextPadProvider", 'customRenderer'],
  paletteProvider: ["type", CustomPalette],
  contextPadProvider: ["type", CustomContextPadProvider],
  customRenderer: [ 'type', CustomRenderer ]
};