import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.topBar}>
        <View style={styles.logoMark}>
          <View style={styles.logoDot} />
        </View>
        <Text style={styles.logo}>TILTY</Text>
        <Text style={styles.version}>01</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>A BALANCE GAME</Text>
        <Text style={styles.title}>Find your way{`\n`}through the tilt.</Text>
        <Text style={styles.description}>
          Guide the light through shifting mazes. Stay steady, beat the clock,
          and make it to the exit.
        </Text>
      </View>

      <View style={styles.preview}>
        <View style={[styles.wall, styles.wallTop]} />
        <View style={[styles.wall, styles.wallLeft]} />
        <View style={[styles.wall, styles.wallRight]} />
        <View style={[styles.wall, styles.wallBottom]} />
        <View style={styles.previewBall} />
        <View style={styles.previewExit} />
        <Text style={styles.previewLabel}>LEVEL 01</Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Choose a level"
          onPress={() => router.push("/levels")}
          style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}
        >
          <Text style={styles.startButtonText}>START GAME</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>
        <Text style={styles.footerHint}>USE YOUR DEVICE TO TILT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090B16",
    paddingHorizontal: 28,
    paddingTop: 24,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  logoMark: {
    alignItems: "center",
    backgroundColor: "#B8FF5A",
    borderRadius: 7,
    height: 28,
    justifyContent: "center",
    transform: [{ rotate: "45deg" }],
    width: 28,
  },
  logoDot: {
    backgroundColor: "#090B16",
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  logo: {
    color: "#F7F7FA",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 4,
  },
  version: {
    color: "#62667C",
    fontSize: 11,
    letterSpacing: 1,
    marginLeft: "auto",
  },
  hero: {
    marginTop: 84,
  },
  eyebrow: {
    color: "#B8FF5A",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
  },
  title: {
    color: "#F7F7FA",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 46,
    marginTop: 14,
  },
  description: {
    color: "#8A8EA4",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 20,
    maxWidth: 320,
  },
  preview: {
    alignSelf: "center",
    backgroundColor: "#101426",
    borderColor: "#1E2740",
    borderRadius: 20,
    height: 180,
    marginTop: 40,
    overflow: "hidden",
    width: 180,
  },
  wall: {
    backgroundColor: "#59617A",
    borderRadius: 4,
    position: "absolute",
  },
  wallTop: { height: 8, left: 28, top: 27, width: 122 },
  wallLeft: { height: 100, left: 28, top: 27, width: 8 },
  wallRight: { height: 82, right: 28, top: 27, width: 8 },
  wallBottom: { bottom: 27, height: 8, left: 28, width: 122 },
  previewBall: {
    backgroundColor: "#B8FF5A",
    borderColor: "#E2FFB9",
    borderRadius: 10,
    borderWidth: 3,
    height: 20,
    left: 65,
    position: "absolute",
    top: 72,
    width: 20,
  },
  previewExit: {
    borderColor: "#FF749E",
    borderRadius: 8,
    borderWidth: 2,
    height: 16,
    position: "absolute",
    right: 56,
    top: 103,
    width: 16,
  },
  previewLabel: {
    bottom: 15,
    color: "#62667C",
    fontSize: 10,
    fontWeight: "700",
    left: 0,
    letterSpacing: 2,
    position: "absolute",
    right: 0,
    textAlign: "center",
  },
  footer: {
    marginTop: "auto",
    paddingBottom: 28,
  },
  startButton: {
    alignItems: "center",
    backgroundColor: "#B8FF5A",
    borderRadius: 14,
    flexDirection: "row",
    height: 62,
    justifyContent: "center",
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  startButtonText: {
    color: "#090B16",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
  arrow: {
    color: "#090B16",
    fontSize: 25,
    fontWeight: "300",
    marginLeft: 16,
  },
  footerHint: {
    color: "#62667C",
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 17,
    textAlign: "center",
  },
});
