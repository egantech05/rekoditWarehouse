import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const isWide = width >= 900;

const COLORS = {
  brand: "#31FFD2",
  background: "#141414",
  surface: "#1B1B1B",
  surfaceSoft: "#202020",
  surfaceMuted: "#262626",
  border: "rgba(255,255,255,0.10)",
  text: "#F4F4F4",
  textSoft: "#B8B8B8",
  textMuted: "#8A8A8A",
  black: "#0E0E0E",
  successBg: "rgba(49,255,210,0.10)",
};

const features = [
  {
    title: "Custom inventory templates",
    desc: "Create inventory structures that match your workflow instead of forcing everything into one fixed format.",
  },
  {
    title: "QR code for every item",
    desc: "Each item can generate its own QR code and export it as a transparent PNG for labels and packaging.",
  },
  {
    title: "Public item access",
    desc: "Other users can scan a QR code to view the item and update its inventory state quickly.",
  },
  {
    title: "Multi-warehouse support",
    desc: "Manage multiple warehouses or inventories from the same application without losing clarity.",
  },
  {
    title: "Simple operational flow",
    desc: "Create templates, register items, print QR codes, and let users interact directly from the field.",
  },
  {
    title: "Feedback-driven product",
    desc: "Collect comments, bug reports, and feature requests directly from public users in one place.",
  },
];

const screenshots = [
  {
    badge: "Dashboard",
    title: "Inventory overview",
    desc: "A central view for tracking inventory structures, stock visibility, and operational movement.",
  },
  {
    badge: "QR Access",
    title: "Public item page",
    desc: "A scan-first flow that lets users reach an item directly from its QR code.",
  },
  {
    badge: "Templates",
    title: "Flexible setup",
    desc: "Template-driven item creation makes the app adaptable for different warehouse needs.",
  },
];

function RatingButton({ value, selected, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(value)}
      style={[styles.ratingButton, selected && styles.ratingButtonActive]}
    >
      <Text style={[styles.ratingButtonText, selected && styles.ratingButtonTextActive]}>
        {value}
      </Text>
    </Pressable>
  );
}

function TypeButton({ label, value, selected, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(value)}
      style={[styles.typeButton, selected && styles.typeButtonActive]}
    >
      <Text style={[styles.typeButtonText, selected && styles.typeButtonTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ShotCard({ badge, title, desc }) {
  return (
    <View style={styles.shotCard}>
      <View style={styles.shotPreview}>
        <View style={styles.browserTop}>
          <View style={styles.browserDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <View style={styles.browserBar} />
        </View>

        <View style={styles.previewBody}>
          <View style={styles.previewSidebar}>
            <View style={styles.previewLineShort} />
            <View style={styles.previewLine} />
            <View style={styles.previewBoxTall} />
          </View>

          <View style={styles.previewMain}>
            <View style={styles.previewBoxLarge} />
            <View style={styles.previewRow}>
              <View style={styles.previewMini} />
              <View style={styles.previewMini} />
            </View>
            <View style={styles.previewLine} />
          </View>
        </View>
      </View>

      <View style={styles.shotTextWrap}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
        <Text style={styles.shotTitle}>{title}</Text>
        <Text style={styles.shotDesc}>{desc}</Text>
      </View>
    </View>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIcon} />
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  );
}

export default function Landing({ navigation }) {
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [feedbackType, setFeedbackType] = useState("comment");
  const [message, setMessage] = useState("");

  const mailtoUrl = useMemo(() => {
    const subject = encodeURIComponent(`REKODIT feedback - ${feedbackType}`);
    const body = encodeURIComponent(
      [
        `Email: ${email || "Not provided"}`,
        `Rating: ${rating}/5`,
        `Feedback type: ${feedbackType}`,
        "",
        "Message:",
        message || "No additional details provided.",
      ].join("\n")
    );

    return `mailto:eganxhart@gmail.com?subject=${subject}&body=${body}`;
  }, [email, rating, feedbackType, message]);

  const handleGetStarted = () => {
    navigation.navigate("Login");
  };

  const handleSendFeedback = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Please enter your email first.");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (!supported) {
        Alert.alert(
          "Email app unavailable",
          "This device could not open the email client."
        );
        return;
      }
      await Linking.openURL(mailtoUrl);
    } catch (error) {
      Alert.alert("Unable to send", "Something went wrong while opening the email app.");
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          <View style={styles.navbar}>
            <View>
              <Text style={styles.navBrand}>REKODIT</Text>
              <Text style={styles.navSub}>Inventory management, redesigned</Text>
            </View>

            <Pressable onPress={handleGetStarted} style={styles.navButton}>
              <Text style={styles.navButtonText}>Get Started</Text>
            </Pressable>
          </View>

          <View style={[styles.heroSection, isWide && styles.heroSectionWide]}>
            <View style={[styles.heroLeft, isWide && styles.heroLeftWide]}>
              <View style={styles.heroPill}>
                <View style={styles.heroPillDot} />
                <Text style={styles.heroPillText}>Built for modern inventory workflows</Text>
              </View>

              <Text style={styles.heroTitle}>
                Manage inventory with custom templates and QR-powered item access.
              </Text>

              <Text style={styles.heroDesc}>
                REKODIT helps teams create flexible inventory templates, add items to each
                template, generate downloadable QR codes, and let users scan into public item
                pages to update inventory quickly.
              </Text>

              <View style={styles.heroActions}>
                <Pressable onPress={handleGetStarted} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </Pressable>

                <Pressable
                  onPress={handleSendFeedback}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Send Feedback</Text>
                </Pressable>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>Custom</Text>
                  <Text style={styles.statLabel}>Template structure</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>Per-item</Text>
                  <Text style={styles.statLabel}>QR access</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>Multi</Text>
                  <Text style={styles.statLabel}>Warehouse ready</Text>
                </View>
              </View>
            </View>

            <View style={[styles.heroRight, isWide && styles.heroRightWide]}>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <View>
                    <Text style={styles.previewEyebrow}>Live product preview</Text>
                    <Text style={styles.previewTitle}>Warehouse operations at a glance</Text>
                  </View>
                  <View style={styles.previewTag}>
                    <Text style={styles.previewTagText}>Startup-ready</Text>
                  </View>
                </View>

                <View style={[styles.previewGrid, isWide && styles.previewGridWide]}>
                  <View style={styles.overviewCard}>
                    <Text style={styles.overviewLabel}>Inventory overview</Text>

                    {[
                      { label: "Warehouse 1", value: 78 },
                      { label: "Warehouse 2", value: 54 },
                      { label: "Warehouse 3", value: 92 },
                      { label: "Warehouse 4", value: 66 },
                    ].map((item) => (
                      <View key={item.label} style={styles.progressWrap}>
                        <View style={styles.progressHeader}>
                          <Text style={styles.progressLabel}>{item.label}</Text>
                          <Text style={styles.progressLabel}>{item.value}%</Text>
                        </View>
                        <View style={styles.progressTrack}>
                          <View style={[styles.progressFill, { width: `${item.value}%` }]} />
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.sideCards}>
                    <View style={styles.sideInfoCard}>
                      <Text style={styles.sideInfoTitle}>Item-linked QR codes</Text>
                      <Text style={styles.sideInfoDesc}>
                        Export transparent PNG QR files for real-world use.
                      </Text>
                    </View>

                    <View style={styles.sideInfoCard}>
                      <Text style={styles.sideInfoTitle}>Fast update flow</Text>
                      <Text style={styles.sideInfoDesc}>
                        Scan, open item page, and update stock from the public link.
                      </Text>
                    </View>

                    <View style={styles.sideInfoCard}>
                      <Text style={styles.sideInfoTitle}>Workflow</Text>
                      <Text style={styles.sideInfoDesc}>
                        Create template → add item → print QR → scan and update
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>Features</Text>
            <Text style={styles.sectionTitle}>
              Built to make inventory workflows more flexible and easier to use.
            </Text>
            <Text style={styles.sectionDesc}>
              The strongest public-facing value of REKODIT is the combination of flexible item
              structures, QR-linked access, and support for multiple inventories in one place.
            </Text>

            <View style={styles.featureGrid}>
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  desc={feature.desc}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>Screenshots</Text>
            <Text style={styles.sectionTitle}>
              Replace these placeholders with your real app screens later.
            </Text>
            <Text style={styles.sectionDesc}>
              The layout is already structured for polished product screenshots, so you can swap
              them in without changing the rest of the landing page.
            </Text>

            <View style={styles.shotGrid}>
              {screenshots.map((shot) => (
                <ShotCard
                  key={shot.title}
                  badge={shot.badge}
                  title={shot.title}
                  desc={shot.desc}
                />
              ))}
            </View>
          </View>

          <View style={styles.feedbackSection}>
            <View style={[styles.feedbackInfo, isWide && styles.feedbackInfoWide]}>
              <Text style={styles.sectionEyebrow}>Feedback</Text>
              <Text style={styles.feedbackTitle}>Help shape REKODIT.</Text>
              <Text style={styles.feedbackDesc}>
                Visitors can submit comments, bug reports, or feature requests. This version
                opens a prefilled email to your inbox so you can start collecting feedback
                without adding backend form handling yet.
              </Text>

              <View style={styles.feedbackBulletWrap}>
                <Text style={styles.feedbackBullet}>• Collects email, rating, and category</Text>
                <Text style={styles.feedbackBullet}>
                  • Supports comments, bug reports, and feature requests
                </Text>
                <Text style={styles.feedbackBullet}>
                  • Sends to eganxhart@gmail.com through the user’s email client
                </Text>
              </View>

              <View style={styles.emailPanel}>
                <Text style={styles.emailPanelLabel}>Destination email</Text>
                <Text style={styles.emailPanelValue}>eganxhart@gmail.com</Text>
              </View>
            </View>

            <View style={[styles.formCard, isWide && styles.formCardWide]}>
              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />

              <Text style={styles.formLabel}>Rating</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <RatingButton
                    key={value}
                    value={value}
                    selected={rating === value}
                    onPress={setRating}
                  />
                ))}
              </View>

              <Text style={styles.formLabel}>Feedback type</Text>
              <View style={styles.typeRow}>
                <TypeButton
                  label="Comment"
                  value="comment"
                  selected={feedbackType === "comment"}
                  onPress={setFeedbackType}
                />
                <TypeButton
                  label="Bug report"
                  value="bug report"
                  selected={feedbackType === "bug report"}
                  onPress={setFeedbackType}
                />
                <TypeButton
                  label="Feature request"
                  value="feature request"
                  selected={feedbackType === "feature request"}
                  onPress={setFeedbackType}
                />
              </View>

              <Text style={styles.formLabel}>Message (optional)</Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Tell us what worked, what felt confusing, what broke, or what you want next."
                placeholderTextColor={COLORS.textMuted}
                multiline
                textAlignVertical="top"
                style={[styles.input, styles.textarea]}
              />

              <Pressable onPress={handleSendFeedback} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Send Feedback</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              REKODIT — inventory workflows with custom templates and QR-connected item access.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  page: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 1240 : "100%",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  navbar: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  navBrand: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  navSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  navButton: {
    backgroundColor: COLORS.brand,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  navButtonText: {
    color: COLORS.black,
    fontWeight: "700",
    fontSize: 14,
  },
  heroSection: {
    marginTop: 8,
  },
  heroSectionWide: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  heroLeft: {
    marginBottom: 24,
  },
  heroLeftWide: {
    flex: 1.05,
    paddingRight: 18,
    marginBottom: 0,
  },
  heroRight: {},
  heroRightWide: {
    flex: 0.95,
    paddingLeft: 18,
  },
  heroPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 18,
  },
  heroPillDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: COLORS.brand,
    marginRight: 10,
  },
  heroPillText: {
    color: COLORS.textSoft,
    fontSize: 13,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: width >= 900 ? 54 : 38,
    lineHeight: width >= 900 ? 62 : 46,
    fontWeight: "800",
    letterSpacing: -1,
  },
  heroDesc: {
    color: COLORS.textSoft,
    fontSize: 17,
    lineHeight: 28,
    marginTop: 18,
    maxWidth: 700,
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    marginBottom: 26,
  },
  primaryButton: {
    backgroundColor: COLORS.brand,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 14,
    marginRight: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.black,
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 14,
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 15,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  statCard: {
    minWidth: 120,
    flexGrow: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 24,
    padding: 18,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  statValue: {
    color: COLORS.brand,
    fontWeight: "800",
    fontSize: 24,
  },
  statLabel: {
    color: COLORS.textMuted,
    marginTop: 4,
    fontSize: 13,
  },
  previewCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 30,
    padding: 16,
  },
  previewHeader: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewEyebrow: {
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  previewTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },
  previewTag: {
    borderWidth: 1,
    borderColor: "rgba(49,255,210,0.25)",
    backgroundColor: "rgba(49,255,210,0.10)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  previewTagText: {
    color: COLORS.brand,
    fontSize: 12,
    fontWeight: "700",
  },
  previewGrid: {},
  previewGridWide: {
    flexDirection: "row",
  },
  overviewCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  overviewLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 14,
  },
  progressWrap: {
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.brand,
    borderRadius: 999,
  },
  sideCards: {
    flex: isWide ? 0.9 : undefined,
    marginLeft: isWide ? 12 : 0,
  },
  sideInfoCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  sideInfoTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  sideInfoDesc: {
    color: COLORS.textSoft,
    fontSize: 13,
    lineHeight: 22,
  },
  section: {
    marginTop: 40,
  },
  sectionEyebrow: {
    color: COLORS.brand,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: width >= 900 ? 38 : 30,
    lineHeight: width >= 900 ? 46 : 38,
    fontWeight: "800",
    marginTop: 12,
    maxWidth: 800,
  },
  sectionDesc: {
    color: COLORS.textSoft,
    fontSize: 16,
    lineHeight: 27,
    marginTop: 12,
    maxWidth: 860,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
    marginTop: 22,
  },
  featureCard: {
    width: Platform.OS === "web" && width >= 1100 ? "31.8%" : width >= 700 ? "48%" : "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 28,
    padding: 20,
    marginHorizontal: "0.9%",
    marginBottom: 16,
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(49,255,210,0.14)",
    marginBottom: 14,
  },
  featureTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 8,
  },
  featureDesc: {
    color: COLORS.textSoft,
    fontSize: 14,
    lineHeight: 24,
  },
  shotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
    marginTop: 22,
  },
  shotCard: {
    width: Platform.OS === "web" && width >= 1100 ? "31.8%" : width >= 700 ? "48%" : "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 28,
    overflow: "hidden",
    marginHorizontal: "0.9%",
    marginBottom: 16,
  },
  shotPreview: {
    minHeight: 260,
    backgroundColor: "rgba(49,255,210,0.08)",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    padding: 14,
  },
  browserTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  browserDots: {
    flexDirection: "row",
    marginRight: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.28)",
    marginRight: 6,
  },
  browserBar: {
    flex: 1,
    height: 10,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  previewBody: {
    flexDirection: "row",
    flex: 1,
  },
  previewSidebar: {
    width: "34%",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(0,0,0,0.20)",
    borderRadius: 18,
    padding: 10,
    marginRight: 10,
  },
  previewMain: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(0,0,0,0.20)",
    borderRadius: 18,
    padding: 10,
  },
  previewLineShort: {
    width: "65%",
    height: 10,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginBottom: 10,
  },
  previewLine: {
    width: "100%",
    height: 10,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginBottom: 10,
  },
  previewBoxTall: {
    height: 120,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  previewBoxLarge: {
    height: 110,
    borderRadius: 16,
    backgroundColor: "rgba(49,255,210,0.14)",
    marginBottom: 10,
  },
  previewRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  previewMini: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginRight: 8,
  },
  shotTextWrap: {
    padding: 18,
  },
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  badgeText: {
    color: COLORS.textSoft,
    fontSize: 12,
    fontWeight: "600",
  },
  shotTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  shotDesc: {
    color: COLORS.textSoft,
    fontSize: 14,
    lineHeight: 24,
  },
  feedbackSection: {
    marginTop: 40,
    marginBottom: 24,
  },
  feedbackInfo: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 30,
    padding: 22,
    marginBottom: 16,
  },
  feedbackInfoWide: {
    marginBottom: 0,
    marginRight: 16,
    flex: 0.95,
  },
  feedbackTitle: {
    color: COLORS.text,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "800",
    marginTop: 12,
  },
  feedbackDesc: {
    color: COLORS.textSoft,
    fontSize: 16,
    lineHeight: 27,
    marginTop: 12,
  },
  feedbackBulletWrap: {
    marginTop: 22,
  },
  feedbackBullet: {
    color: COLORS.textSoft,
    fontSize: 15,
    lineHeight: 26,
    marginBottom: 6,
  },
  emailPanel: {
    marginTop: 22,
    borderWidth: 1,
    borderColor: "rgba(49,255,210,0.20)",
    backgroundColor: COLORS.successBg,
    borderRadius: 22,
    padding: 16,
  },
  emailPanelLabel: {
    color: COLORS.textSoft,
    fontSize: 13,
    marginBottom: 6,
  },
  emailPanelValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  formCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: 30,
    padding: 22,
  },
  formCardWide: {
    flex: 1.05,
  },
  formLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSoft,
    borderRadius: 18,
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 18,
  },
  textarea: {
    minHeight: 130,
    paddingTop: 14,
  },
  ratingRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  ratingButton: {
    minWidth: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSoft,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
  },
  ratingButtonActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  ratingButtonText: {
    color: COLORS.text,
    fontWeight: "700",
  },
  ratingButtonTextActive: {
    color: COLORS.black,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSoft,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  typeButtonActive: {
    borderColor: "rgba(49,255,210,0.40)",
    backgroundColor: "rgba(49,255,210,0.10)",
  },
  typeButtonText: {
    color: COLORS.textSoft,
    fontWeight: "600",
    fontSize: 14,
  },
  typeButtonTextActive: {
    color: COLORS.brand,
  },
  submitButton: {
    backgroundColor: COLORS.brand,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  submitButtonText: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: "800",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 20,
    marginTop: 8,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 22,
  },
});