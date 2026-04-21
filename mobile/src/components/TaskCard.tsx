import { memo } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { OrbitTask } from "../types/task";
import { MOTION } from "../constants/motion";
import { THEMES } from "../constants/themes";

type Props = {
  task: OrbitTask;
  onComplete: () => void;
  onSnooze: () => void;
};

export const TaskCard = memo(function TaskCard({ task, onComplete, onSnooze }: Props) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const theme = THEMES.deepSpace;

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (translateX.value > 85) {
        opacity.value = withSpring(0);
        translateX.value = withSpring(260);
        onComplete();
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return;
      }
      if (translateX.value < -85) {
        translateX.value = withSpring(0);
        onSnooze();
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return;
      }
      translateX.value = withSpring(0, MOTION.taskCard.spring);
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          {
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 18,
            marginBottom: 12,
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: task.uncertain ? "#FFD16688" : theme.cardBorder,
          },
          style,
        ]}
      >
        <Text style={{ color: theme.textPrimary, fontSize: 17, fontWeight: "700" }}>{task.title}</Text>
        <View style={{ flexDirection: "row", marginTop: 7, gap: 8 }}>
          {task.vibeTags.map((tag) => (
            <Text key={`${task.id}-${tag}`} style={{ color: theme.textMuted, fontSize: 12 }}>
              #{tag}
            </Text>
          ))}
          {task.uncertain ? <Text style={{ color: "#FFD166", fontSize: 12 }}>confirm?</Text> : null}
        </View>
      </Animated.View>
    </GestureDetector>
  );
});
