import { Accelerometer, type AccelerometerMeasurement } from "expo-sensors";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const UPDATE_INTERVAL = 100;

export default function TiltTest() {
  const [measurement, setMeasurement] = useState<AccelerometerMeasurement>({
    x: 0,
    y: 0,
    z: 0,
  });
  const [sensorAvailable, setSensorAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let subscription: ReturnType<typeof Accelerometer.addListener> | undefined;
    let active = true;

    const startSensor = async () => {
      const available = await Accelerometer.isAvailableAsync();
      if (!active) return;
      setSensorAvailable(available);
      if (!available) return;

      Accelerometer.setUpdateInterval(UPDATE_INTERVAL);
      subscription = Accelerometer.addListener(setMeasurement);
    };

    void startSensor();
    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  const ballPosition = {
    left: `${50 + measurement.x * 28}%`,
    top: `${50 - measurement.y * 28}%`,
  } as const;
  const status =
    sensorAvailable === null
      ? "CHECKING SENSOR..."
      : sensorAvailable
        ? "SENSOR ACTIVE"
        : "NO SENSOR DETECTED";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>TILT TEST</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.intro}>
        <Text style={styles.eyebrow}>HARDWARE CHECK</Text>
        <Text style={styles.title}>Move your device.</Text>
        <Text style={styles.description}>
          Tilt your phone in any direction and watch the ball respond in real
          time.
        </Text>
      </View>

      <View style={styles.testArea}>
        <View style={[styles.crosshair, styles.crosshairHorizontal]} />
        <View style={[styles.crosshair, styles.crosshairVertical]} />
        <View style={[styles.ball, ballPosition]} />
        <Text style={styles.centerLabel}>LEVEL</Text>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, sensorAvailable && styles.statusDotActive]} />
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.values}>
        <Value label="X AXIS" value={measurement.x} />
        <Value label="Y AXIS" value={measurement.y} />
        <Value label="Z AXIS" value={measurement.z} />
      </View>

      <Text style={styles.hint}>KEEP THE BALL CLOSE TO THE CENTER</Text>
    </View>
  );
}

function Value({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.value}>
      <Text style={styles.valueLabel}>{label}</Text>
      <Text style={styles.valueText}>{value.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#090B16", flex: 1, paddingHorizontal: 24, paddingTop: 22 },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  backButton: { alignItems: "center", backgroundColor: "#151A2D", borderRadius: 14, height: 48, justifyContent: "center", width: 48 },
  backIcon: { color: "#F7F7FA", fontSize: 34, fontWeight: "300", lineHeight: 38 },
  headerTitle: { color: "#F7F7FA", fontSize: 14, fontWeight: "800", letterSpacing: 3 },
  headerSpacer: { width: 48 },
  intro: { marginTop: 52 },
  eyebrow: { color: "#B8FF5A", fontSize: 11, fontWeight: "700", letterSpacing: 3 },
  title: { color: "#F7F7FA", fontSize: 34, fontWeight: "800", letterSpacing: -1, marginTop: 12 },
  description: { color: "#8A8EA4", fontSize: 15, lineHeight: 22, marginTop: 12, maxWidth: 320 },
  testArea: { alignSelf: "center", backgroundColor: "#101426", borderColor: "#2A3450", borderRadius: 150, borderWidth: 1, height: 280, justifyContent: "center", marginTop: 42, overflow: "hidden", width: 280 },
  crosshair: { backgroundColor: "#242A41", position: "absolute" },
  crosshairHorizontal: { height: 1, left: 0, right: 0, top: "50%" },
  crosshairVertical: { bottom: 0, left: "50%", top: 0, width: 1 },
  ball: { backgroundColor: "#B8FF5A", borderColor: "#E4FFC1", borderRadius: 18, borderWidth: 3, height: 36, marginLeft: -18, marginTop: -18, position: "absolute", width: 36 },
  centerLabel: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 2, textAlign: "center" },
  statusRow: { alignItems: "center", alignSelf: "center", flexDirection: "row", marginTop: 25 },
  statusDot: { backgroundColor: "#FF749E", borderRadius: 4, height: 8, marginRight: 8, width: 8 },
  statusDotActive: { backgroundColor: "#B8FF5A" },
  statusText: { color: "#8A8EA4", fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  values: { borderColor: "#242A41", borderTopWidth: 1, flexDirection: "row", justifyContent: "space-between", marginTop: 32, paddingTop: 20 },
  value: { alignItems: "center", flex: 1 },
  valueLabel: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  valueText: { color: "#F7F7FA", fontSize: 20, fontVariant: ["tabular-nums"], fontWeight: "700", marginTop: 6 },
  hint: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 1.5, marginTop: "auto", paddingBottom: 28, textAlign: "center" },
});
