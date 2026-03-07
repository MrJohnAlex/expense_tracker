import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const colors = {
  background: "#0F1628",
  surface:    "#1C2440",
  border:     "#2A3352",
  primary:    "#4F8EF7",
  accent:     "#7C5CBF",
  income:     "#2ECC71",
  incomeBg:   "#1A3D2B",
  expense:    "#E74C3C",
  expenseBg:  "#3D1A1A",
  textPrimary:   "#FFFFFF",
  textSecondary: "#8A94A6",
  textMuted:     "#4A5568",
  success: "#00D4AA",
  warning: "#F6A623",
};

export default function UserProfileScreen() {
  const userCtx = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving,  setIsSaving]  = useState(false);

  const [draft, setDraft] = useState({
    name:  userCtx.user?.name  ?? "",
    email: userCtx.user?.email ?? "",
  });

  const [errors, setErrors] = useState({
    name: false, phone: false, email: false,
  });

  function onEditHandler() {
    setDraft({
      name:  userCtx.user?.name  ?? "",
      phone: userCtx.user?.phone ?? "",
      email: userCtx.user?.email ?? "",
    });
    setErrors({ name: false, phone: false, email: false });
    setIsEditing(true);
  }

  function validate() {
    const newErrors = {
      name:  draft.name.trim().length === 0,
      email: !draft.email.includes("@"),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }

  async function onSaveHandler() {
    if (!validate()) return;
    setIsSaving(true);
    try {
      // ── Plug in your API call here ────────────────────
      // await updateUserApi({ token: userCtx.token, ...draft });
      // ─────────────────────────────────────────────────
      await userCtx.updateUserInfo(draft);
      setIsEditing(false);
    } catch (err) {
      Alert.alert("Error", "Could not save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function onCancelHandler() {
    setIsEditing(false);
    setErrors({ name: false, phone: false, email: false });
  }

  function onLogoutHandler() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: userCtx.logout },
    ]);
  }

  const displayName = userCtx.user?.name ?? "User";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.rootContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ───────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <Text style={styles.headerSub}>Account</Text>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      {/* ── Avatar card ──────────────────────────────────── */}
      <View style={styles.avatarCard}>
        <View style={styles.avatarCardCircle} />

        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || "?"}</Text>
          </View>
        </View>

        <View style={styles.nameRow}>
          {isEditing ? (
            <View style={styles.nameInputWrapper}>
              <TextInput
                style={[styles.nameInput, errors.name && styles.nameInputError]}
                value={draft.name}
                onChangeText={(v) => setDraft((d) => ({ ...d, name: v }))}
                selectionColor={colors.primary}
                autoFocus
                placeholder="Full name"
                placeholderTextColor={colors.textMuted}
              />
              {errors.name && (
                <Text style={styles.inlineError}>Name is required</Text>
              )}
            </View>
          ) : (
            <Text style={styles.nameText}>{displayName}</Text>
          )}
          {!isEditing && (
            <TouchableOpacity onPress={onEditHandler} style={styles.editIconBtn}>
              <Ionicons name="pencil-sharp" size={15} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.memberBadge}>
          <Text style={styles.memberBadgeText}>✦ Premium Member</Text>
        </View>
      </View>

      {/* ── Fields card ──────────────────────────────────── */}
      <View style={styles.fieldsCard}>
        <Text style={styles.fieldsTitle}>Personal Info</Text>

        {/* <FieldRow
          icon="call-outline"
          iconBg="rgba(79,142,247,0.12)"
          iconColor={colors.primary}
          label="Phone Number"
          value={userCtx.user?.phone ?? "—"}
          editing={isEditing}
          inputValue={draft.phone}
          onChangeText={(v) => setDraft((d) => ({ ...d, phone: v }))}
          keyboardType="phone-pad"
          error={errors.phone}
          errorMsg="Phone is required"
        />

        <View style={styles.fieldDivider} /> */}

        <FieldRow
          icon="mail-outline"
          iconBg="rgba(124,92,191,0.12)"
          iconColor={colors.accent}
          label="Email Address"
          value={userCtx.user?.email ?? "—"}
          editing={isEditing}
          inputValue={draft.email}
          onChangeText={(v) => setDraft((d) => ({ ...d, email: v }))}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          errorMsg="Enter a valid email"
        />
      </View>

      {/* ── Buttons ──────────────────────────────────────── */}
      {isEditing ? (
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onCancelHandler}
            activeOpacity={0.7}
            disabled={isSaving}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
            onPress={onSaveHandler}
            activeOpacity={0.8}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.editBtn}
          onPress={onEditHandler}
          activeOpacity={0.8}
        >
          <Ionicons name="pencil-sharp" size={16} color="#fff" />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      {/* ── Stats row ────────────────────────────────────── */}
      {/* <View style={styles.statsRow}>
        {[
          { label: "Member Since", value: "2024", icon: "calendar-outline",       color: colors.primary },
          { label: "Transactions", value: "128",  icon: "swap-horizontal-outline", color: colors.warning },
          { label: "Savings",      value: "32%",  icon: "trending-up-outline",     color: colors.success },
        ].map((s) => (
          <View key={s.label} style={styles.statBox}>
            <Ionicons name={s.icon} size={18} color={s.color} />
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View> */}

      {/* ── Sign out ─────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.signOutBtn}
        onPress={onLogoutHandler}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.expense} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ── Reusable field row ───────────────────────────────────────
function FieldRow({
  icon, iconBg, iconColor,
  label, value,
  editing, inputValue, onChangeText,
  keyboardType, autoCapitalize,
  error, errorMsg,
}) {
  return (
    <View style={styles.fieldGroup}>
      <View style={styles.fieldLabelRow}>
        <View style={[styles.fieldIconBubble, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={14} color={iconColor} />
        </View>
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>

      {editing ? (
        <>
          <TextInput
            style={[styles.fieldInput, error && styles.fieldInputError]}
            value={inputValue}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize ?? "sentences"}
            selectionColor={colors.primary}
            placeholderTextColor={colors.textMuted}
          />
          {error && <Text style={styles.inlineError}>{errorMsg}</Text>}
        </>
      ) : (
        <View style={styles.fieldValueRow}>
          <Text style={styles.fieldValue}>{value}</Text>
        </View>
      )}
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  rootContent: { padding: 20 },

  headerRow:  { marginBottom: 24 },
  headerSub: {
    fontSize: 12, color: colors.textSecondary,
    letterSpacing: 1, textTransform: "uppercase", marginBottom: 2,
  },
  headerTitle: {
    fontSize: 26, fontWeight: "800",
    color: colors.textPrimary, letterSpacing: -0.5,
  },

  avatarCard: {
    backgroundColor: "#1C2E5A", borderRadius: 24, padding: 24,
    alignItems: "center", marginBottom: 16, borderWidth: 1,
    borderColor: "rgba(79,142,247,0.15)", overflow: "hidden", position: "relative",
  },
  avatarCardCircle: {
    position: "absolute", top: -60, right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(79,142,247,0.06)",
  },
  avatarRing: {
    width: 92, height: 92, borderRadius: 46, borderWidth: 2,
    borderColor: "rgba(79,142,247,0.4)", alignItems: "center",
    justifyContent: "center", marginBottom: 4,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.accent, alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: colors.textPrimary },
  nameRow: {
    flexDirection: "row", alignItems: "center",
    gap: 8, marginTop: 14, marginBottom: 8,
  },
  nameText: { fontSize: 20, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.3 },
  nameInputWrapper: { alignItems: "center" },
  nameInput: {
    fontSize: 18, fontWeight: "700", color: colors.textPrimary,
    borderBottomWidth: 1.5, borderBottomColor: colors.primary,
    paddingBottom: 4, minWidth: 180, textAlign: "center",
  },
  nameInputError: { borderBottomColor: colors.expense },
  editIconBtn: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: "rgba(79,142,247,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  memberBadge: {
    backgroundColor: "rgba(79,142,247,0.1)", borderWidth: 1,
    borderColor: "rgba(79,142,247,0.25)", borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 5,
  },
  memberBadgeText: { color: colors.primary, fontSize: 11, fontWeight: "600" },

  fieldsCard: {
    backgroundColor: colors.surface, borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: colors.border, marginBottom: 16,
  },
  fieldsTitle: {
    fontSize: 13, fontWeight: "700", color: colors.textSecondary,
    letterSpacing: 0.5, marginBottom: 16, textTransform: "uppercase",
  },
  fieldGroup: { paddingVertical: 4 },
  fieldLabelRow: {
    flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8,
  },
  fieldIconBubble: {
    width: 26, height: 26, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
  fieldLabel: {
    fontSize: 11, color: colors.textMuted,
    fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase",
  },
  fieldValueRow: {
    backgroundColor: colors.background, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 14,
  },
  fieldValue: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  fieldInput: {
    backgroundColor: colors.background, 
    borderRadius: 12,
    paddingVertical: 12, 
    paddingHorizontal: 14, 
    fontSize: 15,
    fontWeight: "600", color: colors.textPrimary,
    borderWidth: 1.5, borderColor: colors.primary,
  },
  fieldInputError: { borderColor: colors.expense },
  fieldDivider: { height: 1, backgroundColor: colors.border, marginVertical: 14 },
  inlineError: { color: colors.expense, fontSize: 11, marginTop: 4, marginLeft: 2 },

  btnRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.surface, alignItems: "center",
  },
  cancelBtnText: { color: colors.textSecondary, fontSize: 15, fontWeight: "600" },
  saveBtn: {
    flex: 2, flexDirection: "row", paddingVertical: 14, borderRadius: 14,
    backgroundColor: colors.primary, alignItems: "center",
    justifyContent: "center", gap: 6,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  editBtn: {
    flexDirection: "row", paddingVertical: 14, borderRadius: 14,
    backgroundColor: colors.primary, alignItems: "center",
    justifyContent: "center", gap: 8, marginBottom: 16,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  editBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statBox: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 16,
    padding: 14, alignItems: "center", gap: 5,
    borderWidth: 1, borderColor: colors.border,
  },
  statValue: { fontSize: 16, fontWeight: "800" },
  statLabel: { fontSize: 10, color: colors.textMuted, textAlign: "center" },

  signOutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.expenseBg,
    backgroundColor: colors.expenseBg,
  },
  signOutText: { color: colors.expense, fontSize: 15, fontWeight: "600" },
});