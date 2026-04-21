import { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { BrainDumpBar } from "./src/components/BrainDumpBar";
import { MomentumPlanet } from "./src/components/MomentumPlanet";
import { TaskCard } from "./src/components/TaskCard";
import { THEMES } from "./src/constants/themes";
import { useFocusShake } from "./src/hooks/useFocusShake";
import { parseBrainDump } from "./src/services/agentClient";
import { useOrbitStore } from "./src/store/useOrbitStore";

export default function App() {
  const theme = THEMES.deepSpace;
  const [promptHint, setPromptHint] = useState("Tasks orbiting");
  const [parsing, setParsing] = useState(false);
  const { tasks, momentumScore, focusMode, addParsedTasks, completeTask, snoozeTask, toggleFocusMode } = useOrbitStore();

  const activeTasks = useMemo(() => tasks.filter((task) => task.status === "active"), [tasks]);
  useFocusShake(() => {
    toggleFocusMode();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setPromptHint((prev) => (prev === "Focus mode on" ? "Focus mode off" : "Focus mode on"));
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient colors={[theme.bgTop, theme.bgBottom]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
          <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>Orbit</Text>
              <Text style={{ color: theme.textPrimary, fontSize: 24, fontWeight: "800" }}>{promptHint}</Text>
            </View>
            <MomentumPlanet score={momentumScore} />
          </View>

          <View style={{ marginTop: 8, flex: 1, opacity: focusMode ? 0.94 : 1 }}>
            {activeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => {
                  completeTask(task.id);
                  setPromptHint("Momentum +1");
                }}
                onSnooze={() => {
                  snoozeTask(task.id, 30);
                  setPromptHint("Snoozed 30m");
                }}
              />
            ))}
          </View>

          <BrainDumpBar
            parsing={parsing}
            onSubmit={async (text) => {
              try {
                setParsing(true);
                const result = await parseBrainDump(text);
                addParsedTasks(result.tasks.map((task) => ({ title: task.title, vibeTags: task.vibeTags, uncertain: task.uncertain })));
                setPromptHint("Parsed from brain dump");
              } catch {
                setPromptHint("Parse failed, try again");
              } finally {
                setParsing(false);
              }
            }}
          />
          <StatusBar style="light" />
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}
