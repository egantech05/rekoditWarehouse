import React, {useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { Ionicons } from '@react-native-vector-icons/ionicons';

const { width } = Dimensions.get("window");
const isWide = width >= 900;

const COLORS = {
  bg: "#141414",
  surface: "#1B1B1B",
  surfaceSoft: "#202020",
  border: "rgba(255,255,255,0.10)",
  text: "#F4F4F4",
  textSoft: "#B8B8B8",
  textMuted: "#8A8A8A",
  brand: "#31FFD2",
  brandSoft: "rgba(49,255,210,0.10)",
  brandBorder: "rgba(49,255,210,0.22)",
  black: "#0E0E0E",
  whiteCard: "#F4F4F4",
};

const FEATURES = [
  {
    title: "Custom item templates",
    desc: "Create your own item properties so the system matches your workflow across stock, assets, tools, parts, or supplies.",
    icon: "flask-outline",
  },
  {
    title: "Easy item setup",
    desc: "Add items quickly using your selected template without complicated setup or rigid fields.",
    icon: "color-wand-outline",
  },
  {
    title: "QR code for every item",
    desc: "Each item gets its own QR code, ready to download as PNG and print for labels, shelves, bins, or equipment.",
    icon: "qr-code-outline",
  },
  {
    title: "Track item logs",
    desc: "Keep a clear history of stock intake, usage, and quantity changes for each item.",
    icon: "eye-outline",
  },
  {
    title: "Manage multiple inventories",
    desc: "Handle multiple inventory spaces or warehouse groups from one system.",
    icon: "file-tray-stacked-outline",
  },
  {
    title: "No extra hardware required",
    desc: "Start with your existing devices. Generate, print, and scan QR codes using standard tools.",
    icon: "build-outline",
  },
  {
    title: "Team collaboration",
    desc: "Assign teams and collaborate on items so inventory stays accurate and updated.",
    icon: "people-outline",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your inventory template",
    desc: "Define the properties that matter to your workflow.",
  },
  {
    number: "02",
    title: "Add items",
    desc: "Create item records using your custom structure.",
  },
  {
    number: "03",
    title: "Generate and print QR codes",
    desc: "Download QR codes as PNG and place them where needed.",
  },
  {
    number: "04",
    title: "Scan and update",
    desc: "Access items quickly and keep stock records current.",
  },
];

const DEMO_IMAGES = [
  {
    badge: "Home view",
    title: "See all items at a glance",
    desc: "A clear inventory view showing items, quantities, and quick access from one dashboard.",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    badge: "Item setup",
    title: "Create items in seconds",
    desc: "Add new records using your selected template and custom property structure.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    badge: "Logs",
    title: "Track stock activity",
    desc: "Review item history such as stock intake, usage, and quantity changes over time.",
    image:
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80",
  },
  {
    badge: "QR export",
    title: "Generate QR codes instantly",
    desc: "Every item includes its own QR code, ready to download as PNG and print.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    badge: "Multi-inventory",
    title: "Manage multiple inventories",
    desc: "Switch between inventory spaces or warehouse groups without changing systems.",
    image:
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1200&q=80",
  },
  {
    badge: "Templates",
    title: "Build your own item structure",
    desc: "Create custom properties that fit your business instead of forcing fixed fields.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
];

const HERO_IMAGE = require("../../assets/landing/mainHero.png");


function FeatureCard({ title, desc, icon }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <Ionicons name={icon} size={22} color={COLORS.brand} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </View>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <View style={styles.card}>
      <Text style={styles.stepNumber}>{number}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </View>
  );
}

function DemoCard({ badge, title, desc, image }) {
  return (
    <View style={styles.demoCard}>
      <Image source={{ uri: image }} style={styles.demoImage} resizeMode="cover" />
      <View style={styles.demoBody}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </View>
    </View>
  );
}

function RatingButton({ value, active, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(value)}
      style={[styles.ratingButton, active && styles.ratingButtonActive]}
    >
      <Text style={[styles.ratingButtonText, active && styles.ratingButtonTextActive]}>
        {value}
      </Text>
    </Pressable>
  );
}

function TypeButton({ label, value, active, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(value)}
      style={[styles.typeButton, active && styles.typeButtonActive]}
    >
      <Text style={[styles.typeButtonText, active && styles.typeButtonTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function LandingPage({ navigation }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [form, setForm] = useState({
    email: "",
    rating: 5,
    type: "comment",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);


  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openFeedback = () => {
    setShowFeedback(true);
  };

  const closeFeedback = () => {
    setShowFeedback(false);
  };

  const handleGetStarted = () => {
    if (navigation?.navigate) {
      navigation.navigate("Login");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!form.email.trim()) {
      Alert.alert("Missing email", "Please enter your email.");
      return;
    }
  
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    try {
      const payload = {
        email: form.email.trim(),
        rating: form.rating,
        type: form.type,
        message: form.message.trim() || null,
        source: "landing",
      };
  
      const { error } = await supabase.from("feedback").insert(payload);
      if (error) throw error;
  
      Alert.alert("Thanks!", "Your feedback was sent.");
      setShowFeedback(false);
      setForm({ email: "", rating: 5, type: "comment", message: "" });
    } catch (e) {
      Alert.alert("Unable to send", e?.message ?? "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.page}>
          <View style={styles.header}>
            <View style={styles.brandWrap}>
              <View style={styles.brandIcon}>
                    <Ionicons name="film-outline" size={32} color={COLORS.surface} />        
              </View>
              <View>
                <Text style={styles.brandTitle}>REKODIT</Text>
                <Text style={styles.brandSub}>INVENTORY</Text>
              </View>
            </View>

            <View style={styles.headerButtons}>
              <Pressable onPress={openFeedback} style={styles.headerGhostButton}>
                <Text style={styles.headerGhostButtonText}>Feedback</Text>
              </Pressable>
              <Pressable onPress={handleGetStarted} style={styles.headerPrimaryButton}>
                <Text style={styles.headerPrimaryButtonText}>Get Started</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.heroSection, isWide && styles.heroSectionWide]}>
            <View style={[styles.heroLeft, isWide && styles.heroLeftWide]}>
              <View style={styles.pill}>
                <View style={styles.pillDot} />
                <Text style={styles.pillText}>
                  Easy-to-set-up inventory management for any workflow
                </Text>
              </View>

              <Text style={styles.heroTitle}>Simple inventory setup for any business.</Text>

              <Text style={styles.heroDesc}>
                Create custom item templates, manage multiple inventories, generate QR
                codes for every item, and track stock activity in one place. No extra
                hardware required.
              </Text>

              <View style={styles.heroButtons}>
                <Pressable onPress={handleGetStarted} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </Pressable>
                <Pressable onPress={openFeedback} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Leave Feedback</Text>
                </Pressable>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>Custom templates</Text>
                  <Text style={styles.statLabel}>Flexible format</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>Auto QR Generation</Text>
                  <Text style={styles.statLabel}>Flexible access</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>No extra hardware</Text>
                  <Text style={styles.statLabel}>Easy Deployment</Text>
                </View>
              </View>
            </View>

            <View style={[styles.heroRight, isWide && styles.heroRightWide]}>
              <View style={styles.heroImageWrap}>
              <Image source={HERO_IMAGE} style={styles.heroImage} resizeMode="cover" />

              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>Features</Text>
            <Text style={styles.sectionTitle}>Built for flexible inventory workflows.</Text>
            <Text style={styles.sectionDesc}>
              REKODIT is designed for teams that need a simple way to organise items,
              define their own data fields, and connect physical labels to digital records
              through QR codes.
            </Text>

            <View style={styles.gridWrap}>
              {FEATURES.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  desc={feature.desc}
                  icon={feature.icon}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>How it works</Text>
            <Text style={styles.sectionTitle}>From setup to tracking in minutes.</Text>
            <Text style={styles.sectionDesc}>
              Create a template, add items, generate QR codes, and begin tracking stock
              activity without specialized hardware or complicated setup.
            </Text>

            <View style={styles.stepsWrap}>
              {STEPS.map((step) => (
                <StepCard
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  desc={step.desc}
                />
              ))}
            </View>
          </View>
{/*
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>Demo screens</Text>
            <Text style={styles.sectionTitle}>Real product views that support the workflow.</Text>
            <Text style={styles.sectionDesc}>
              Temporary online images are used here as placeholders. Replace them later
              with your own screenshots or generated visuals.
            </Text>

            <View style={styles.gridWrap}>
              {DEMO_IMAGES.map((item) => (
                <DemoCard
                  key={item.title}
                  badge={item.badge}
                  title={item.title}
                  desc={item.desc}
                  image={item.image}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.bottomFeatureRow}>
              <View style={styles.card}>
                <View style={styles.cardIcon} />
                <Text style={styles.cardTitle}>PNG QR export</Text>
                <Text style={styles.cardDesc}>
                  Download item QR codes in PNG format and print them as labels, tags,
                  shelf markers, or equipment stickers.
                </Text>
              </View>

              <View style={styles.card}>
                <View style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Easy scan workflow</Text>
                <Text style={styles.cardDesc}>
                  Connect physical items to digital records so users can reach the right
                  item quickly and update it with less friction.
                </Text>
              </View>

              <View style={styles.card}>
                <View style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Fast to adopt</Text>
                <Text style={styles.cardDesc}>
                  Built for teams that want something practical, lightweight, and easy to
                  set up without operational overhead.
                </Text>
              </View>
            </View>
          </View>

*/}

          <View style={styles.ctaPanel}>
            <Text style={styles.ctaTitle}>Start simple. Scale when ready.</Text>
            <Text style={styles.ctaDesc}>
              Set up your inventory structure, generate QR codes, and keep stock records
              current from one place.
            </Text>
            <View style={styles.ctaButtons}>
              <Pressable onPress={handleGetStarted} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </Pressable>
              <Pressable onPress={openFeedback} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Send Feedback</Text>
              </Pressable>
              
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              REKODIT by EGANTECH
            </Text>
            <Text style={styles.footerText}>Built for flexible business workflows.</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showFeedback}
        transparent
        animationType="fade"
        onRequestClose={closeFeedback}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Send feedback</Text>
                <Text style={styles.modalSubtitle}>
                  Share a comment, bug report, or feature request.
                </Text>
              </View>
              <Pressable onPress={closeFeedback} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              value={form.email}
              onChangeText={(value) => updateField("email", value)}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <Text style={styles.formLabel}>Rating</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((value) => (
                <RatingButton
                  key={value}
                  value={value}
                  active={form.rating === value}
                  onPress={(v) => updateField("rating", v)}
                />
              ))}
            </View>

            <Text style={styles.formLabel}>Feedback type</Text>
            <View style={styles.typeRow}>
              <TypeButton
                label="Comment"
                value="comment"
                active={form.type === "comment"}
                onPress={(v) => updateField("type", v)}
              />
              <TypeButton
                label="Bug report"
                value="bug"
                active={form.type === "bug"}
                onPress={(v) => updateField("type", v)}
              />
              <TypeButton
                label="Feature request"
                value="feature"
                active={form.type === "feature"}
                onPress={(v) => updateField("type", v)}
              />
            </View>

            <Text style={styles.formLabel}>Message</Text>
            <TextInput
              value={form.message}
              onChangeText={(value) => updateField("message", value)}
              placeholder="Tell us what worked, what felt confusing, what broke, or what you want next."
              placeholderTextColor={COLORS.textMuted}
              multiline
              textAlignVertical="top"
              style={styles.textarea}
            />

            <View style={styles.modalButtons}>
              <Pressable onPress={closeFeedback} style={styles.modalGhostButton}>
                <Text style={styles.modalGhostButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSubmitFeedback}
                disabled={isSubmitting}
                style={styles.modalPrimaryButton}
                >
                <Text style={styles.modalPrimaryButtonText}>
                {isSubmitting ? "Sending..." : "Send Feedback"}
                </Text>
            </Pressable>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const cardWidth = isWide ? "31.8%" : "100%";
const stepWidth = isWide ? "23.5%" : "100%";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  glowOne: {
    position: "absolute",
    top: -100,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "rgba(49,255,210,0.10)",
    opacity: 1,
  },
  glowTwo: {
    position: "absolute",
    top: 240,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(49,255,210,0.08)",
    opacity: 1,
  },
  page: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 1280 : "100%",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 28,
  },
  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: COLORS.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  brandIconText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "800",
  },
  brandTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.6,
  },
  brandSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  headerGhostButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerGhostButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  headerPrimaryButton: {
    backgroundColor: COLORS.brand,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerPrimaryButtonText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: "800",
  },
  heroSection: {
    marginTop: 8,
  },
  heroSectionWide: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroLeft: {
    marginBottom: 24,
  },
  heroLeftWide: {
    flex: 1.05,
    paddingRight: 18,
    marginBottom: 0,
  },
  heroRightWide: {
    flex: 0.95,
    paddingLeft: 18,
  },
  pill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: COLORS.brand,
    marginRight: 10,
  },
  pillText: {
    color: COLORS.textSoft,
    fontSize: 13,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: isWide ? 56 : 40,
    lineHeight: isWide ? 62 : 48,
    fontWeight: "800",
    marginTop: 22,
    letterSpacing: -1,
  },
  heroDesc: {
    color: COLORS.textSoft,
    fontSize: 17,
    lineHeight: 28,
    marginTop: 18,
    maxWidth: 700,
  },
  heroButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 28,
  },
  primaryButton: {
    backgroundColor: COLORS.brand,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 34,
    marginHorizontal: -6,
  },
  statCard: {
    minWidth: 180,
    flexGrow: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 18,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  statValue: {
    color: COLORS.brand,
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 6,
  },
  heroImageWrap: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 32,
    overflow: "hidden",
    minHeight: 420,
  },
  heroImage: {
    width: "100%",
    height: isWide ? 560 : 360,
  },
  section: {
    marginTop: 34,
    paddingBottom: 32,
  },
  sectionEyebrow: {
    color: COLORS.brand,
    fontSize: 12,
    letterSpacing: 2.5,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: isWide ? 38 : 30,
    lineHeight: isWide ? 46 : 38,
    fontWeight: "800",
    marginTop: 12,
    maxWidth: 860,
  },
  sectionDesc: {
    color: COLORS.textSoft,
    fontSize: 16,
    lineHeight: 27,
    marginTop: 12,
    maxWidth: 860,
  },
  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
    marginTop: 22,
  },
  stepsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
    marginTop: 22,
  },
  bottomFeatureRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  card: {
    width: isWide ? cardWidth : "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 28,
    padding: 22,
    marginHorizontal: "0.9%",
    marginBottom: 16,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.brandSoft,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 28,
  },
  cardDesc: {
    color: COLORS.textSoft,
    fontSize: 14,
    lineHeight: 24,
    marginTop: 10,
  },
  stepNumber: {
    color: COLORS.brand,
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 16,
  },
  demoCard: {
    width: isWide ? cardWidth : "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 28,
    overflow: "hidden",
    marginHorizontal: "0.9%",
    marginBottom: 16,
  },
  demoImage: {
    width: "100%",
    height: 240,
  },
  demoBody: {
    padding: 20,
  },
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 14,
  },
  badgeText: {
    color: COLORS.textSoft,
    fontSize: 12,
    fontWeight: "600",
  },
  ctaPanel: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 32,
    padding: 28,
    marginTop: 10,
    marginBottom: 26,
  },
  ctaTitle: {
    color: COLORS.text,
    fontSize: isWide ? 34 : 28,
    lineHeight: isWide ? 42 : 36,
    fontWeight: "800",
  },
  ctaDesc: {
    color: COLORS.textSoft,
    fontSize: 16,
    lineHeight: 27,
    marginTop: 12,
    maxWidth: 760,
  },
  ctaButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 22,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 6,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 22,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "800",
  },
  modalSubtitle: {
    color: COLORS.textSoft,
    fontSize: 14,
    marginTop: 6,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  formLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 12,
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
  },
  textarea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSoft,
    borderRadius: 18,
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    minHeight: 130,
  },
  ratingRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
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
  },
  ratingButtonActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  ratingButtonText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 14,
  },
  ratingButtonTextActive: {
    color: COLORS.black,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSoft,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  typeButtonActive: {
    borderColor: COLORS.brandBorder,
    backgroundColor: COLORS.brandSoft,
  },
  typeButtonText: {
    color: COLORS.textSoft,
    fontSize: 14,
    fontWeight: "600",
  },
  typeButtonTextActive: {
    color: COLORS.brand,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },
  modalGhostButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSoft,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalGhostButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  modalPrimaryButton: {
    flex: 1,
    backgroundColor: COLORS.brand,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalPrimaryButtonText: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: "800",
  },
});