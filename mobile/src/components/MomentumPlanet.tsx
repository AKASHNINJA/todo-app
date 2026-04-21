import { Canvas, Circle, Group, vec, BlurMask } from "@shopify/react-native-skia";
import { View } from "react-native";
import { THEMES } from "../constants/themes";

type Props = {
  score: number;
};

export function MomentumPlanet({ score }: Props) {
  const radius = Math.max(24, Math.min(44, 22 + score * 0.8));
  const theme = THEMES.deepSpace;

  return (
    <View style={{ width: 140, height: 140 }}>
      <Canvas style={{ flex: 1 }}>
        <Group>
          <Circle cx={70} cy={70} r={radius + 14} color={`${theme.accent}33`}>
            <BlurMask blur={20} />
          </Circle>
          <Circle cx={70} cy={70} r={radius} color={theme.accent} />
          <Circle cx={70} cy={70} r={radius * 0.72} color={theme.bgTop} />
          <Circle cx={82} cy={56} r={radius * 0.14} color="#FFFFFF66" />
          <Circle c={vec(70, 70)} r={radius + 22} color={`${theme.success}1A`} style="stroke" strokeWidth={1.2} />
        </Group>
      </Canvas>
    </View>
  );
}
