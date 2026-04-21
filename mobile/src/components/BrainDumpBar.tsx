import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import { THEMES } from "../constants/themes";

type Props = {
  onSubmit: (text: string) => void;
  parsing?: boolean;
};

export function BrainDumpBar({ onSubmit, parsing = false }: Props) {
  const [value, setValue] = useState("");
  const [isHoldingVoice, setIsHoldingVoice] = useState(false);
  const theme = THEMES.deepSpace;

  return (
    <View
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 22,
        borderRadius: 18,
        padding: 10,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        backgroundColor: "#0F1737E6",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Drop anything... tasks, plans, chaos."
          placeholderTextColor={theme.textMuted}
          style={{ flex: 1, color: theme.textPrimary, fontSize: 15, paddingHorizontal: 8, paddingVertical: 8 }}
          onSubmitEditing={() => {
            const trimmed = value.trim();
            if (!trimmed) return;
            onSubmit(trimmed);
            setValue("");
          }}
        />
        <Pressable
          disabled={parsing}
          onPressIn={() => {
            setIsHoldingVoice(true);
            void Haptics.selectionAsync();
          }}
          onPressOut={() => setIsHoldingVoice(false)}
          style={{
            borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 8,
            backgroundColor: isHoldingVoice ? "#FFD16633" : "#7DFF9D2E",
          }}
        >
          <Text style={{ color: theme.textPrimary, fontWeight: "700" }}>
            {parsing ? "..." : isHoldingVoice ? "REC" : "MIC"}
          </Text>
        </Pressable>
      </View>
      <Text style={{ color: theme.textMuted, marginTop: 6, fontSize: 12 }}>
        Hold for voice. Swipe right to complete. Swipe left to snooze.
      </Text>
    </View>
  );
}
