import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon, AppButton } from '../../../components/ui';
import { AppHeader } from '../../../components/shared';
import { useTranslation, Language } from '../../../i18n';
import { useUserStore, useAppStore, ThemeMode, LocationOption } from '../../../store';

export interface ProfileScreenProps {
  navigation?: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { t, language, setLanguage } = useTranslation();
  const s = t.settings;
  const c = t.common;

  // ─── Modal States ─────────────────────────────────────────────────────────
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [isThemeModalVisible, setThemeModalVisible] = useState(false);
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);
  const [isFeedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [isTermsModalVisible, setTermsModalVisible] = useState(false);

  // ─── Zustand Stores ────────────────────────────────────────────────────────
  const { name: userName, setName } = useUserStore();
  const {
    theme,
    setTheme,
    notifications,
    setNotifications,
    hapticFeedback,
    setHapticFeedback,
    locationSetting,
    setLocationSetting,
    cacheSize,
    clearCache,
  } = useAppStore();

  // ─── Local Edit Profile Inputs ────────────────────────────────────────────
  const [editName, setEditName] = useState(userName);

  // Keep local edit inputs in sync when modal opens
  const handleOpenEditProfile = () => {
    setEditName(userName);
    setEditProfileVisible(true);
  };

  // ─── Feedback State ───────────────────────────────────────────────────────
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState<'feedback' | 'bug' | 'idea'>('feedback');

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert(c.error, s.nameRequired);
      return;
    }
    setName(editName.trim());
    setEditProfileVisible(false);
    Alert.alert(c.success, s.profileUpdated);
  };

  const handleClearCache = () => {
    if (cacheSize === '0 KB') {
      Alert.alert(s.clearCache, s.cacheClean);
      return;
    }
    Alert.alert(
      s.clearCache,
      s.clearCacheConfirm,
      [
        { text: c.cancel, style: 'cancel' },
        {
          text: s.clearCache,
          style: 'destructive',
          onPress: () => {
            clearCache();
            Alert.alert(c.success, s.cacheClearedSuccess);
          },
        },
      ]
    );
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert(s.helpFeedback, s.feedbackEmpty);
      return;
    }
    setFeedbackText('');
    setFeedbackModalVisible(false);
    Alert.alert(c.success, s.feedbackSuccess);
  };

  const handleLogout = () => {
    Alert.alert(
      s.logOut,
      s.logOutConfirm,
      [
        { text: c.cancel, style: 'cancel' },
        {
          text: s.logOut,
          style: 'destructive',
          onPress: () => navigation?.navigate('Onboarding1'),
        },
      ]
    );
  };

  const getThemeLabel = (mode: 'Light' | 'Dark' | 'System') => {
    if (mode === 'Light') return s.themeLight;
    if (mode === 'Dark') return s.themeDark;
    return s.themeSystem;
  };

  const getLocationLabel = () => {
    if (locationSetting === 'WhileUsing') return s.locationWhileUsing;
    if (locationSetting === 'Always') return s.locationAlways;
    return s.locationNever;
  };

  return (
    <View style={styles.screen}>
      <AppHeader title={s.title} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 64,
            paddingBottom: insets.bottom + 90,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Profile Card ─────────────────────────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleOpenEditProfile}
          style={styles.profileCard}
        >
          <View style={styles.avatar}>
            <AppIcon name="person" size={26} color={colors.bgWhite} />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <AppText variant="h3" color={colors.textPrimary}>
                {userName}
              </AppText>
            </View>
            <AppText variant="labelSmall" color={colors.textMuted}>
              {s.foodieBadge} • {s.editProfile}
            </AppText>
          </View>
          <AppIcon name="chevron-forward" size={16} color={colors.textMuted} />

        </TouchableOpacity>

        {/* ─── GROUP 1: PREFERENCES ───────────────────────────────────── */}
        <View style={styles.section}>
          <AppText variant="labelSmall" color={colors.textMuted} style={styles.sectionTitle}>
            {s.preferencesGroup}
          </AppText>
          <View style={styles.groupCard}>
            {/* Appearance */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.row}
              onPress={() => setThemeModalVisible(true)}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
                <AppIcon name="sunny-outline" size={18} color="#D97706" />
              </View>
              <AppText variant="bodyLarge" color={colors.textPrimary} style={styles.rowLabel}>
                {s.appearance}
              </AppText>
              <AppText variant="body" color={colors.textMuted} style={styles.rowValue}>
                {getThemeLabel(theme)}
              </AppText>
              <AppIcon name="chevron-forward" size={16} color={colors.textLight} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Language Selection */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.row}
              onPress={() => setLanguageModalVisible(true)}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                <AppIcon name="globe-outline" size={18} color="#9333EA" />
              </View>
              <AppText variant="bodyLarge" color={colors.textPrimary} style={styles.rowLabel}>
                {s.language}
              </AppText>
              <View style={styles.langBadgeRow}>
                <AppText variant="body" color={colors.textMuted} style={styles.rowValue}>
                  {language === 'vi' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}
                </AppText>
              </View>
              <AppIcon name="chevron-forward" size={16} color={colors.textLight} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Notifications */}
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                <AppIcon name="notifications-outline" size={18} color={colors.primary} />
              </View>
              <AppText variant="bodyLarge" color={colors.textPrimary} style={styles.rowLabel}>
                {s.notifications}
              </AppText>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor={colors.bgWhite}
              />
            </View>

            <View style={styles.divider} />

            {/* Haptic Feedback */}
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                <AppIcon name="phone-portrait-outline" size={18} color="#16A34A" />
              </View>
              <AppText variant="bodyLarge" color={colors.textPrimary} style={styles.rowLabel}>
                {s.hapticFeedback}
              </AppText>
              <Switch
                value={hapticFeedback}
                onValueChange={setHapticFeedback}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor={colors.bgWhite}
              />
            </View>
          </View>
        </View>

        {/* ─── GROUP 2: DATA & PRIVACY ────────────────────────────────── */}
        <View style={styles.section}>
          <AppText variant="labelSmall" color={colors.textMuted} style={styles.sectionTitle}>
            {s.dataPrivacyGroup}
          </AppText>
          <View style={styles.groupCard}>
            {/* Clear Cache */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.row}
              onPress={handleClearCache}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
                <AppIcon name="trash-outline" size={18} color="#DC2626" />
              </View>
              <AppText variant="bodyLarge" color={colors.textPrimary} style={styles.rowLabel}>
                {s.clearCache}
              </AppText>
              <AppText
                variant="body"
                color={cacheSize === '0 KB' ? '#16A34A' : colors.textMuted}
                style={styles.rowValue}
              >
                {cacheSize}
              </AppText>
              <AppIcon name="chevron-forward" size={16} color={colors.textLight} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Location Access */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.row}
              onPress={() => setLocationModalVisible(true)}
            >
              <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                <AppIcon name="location-outline" size={18} color="#0284C7" />
              </View>
              <AppText variant="bodyLarge" color={colors.textPrimary} style={styles.rowLabel}>
                {s.locationAccess}
              </AppText>
              <AppText variant="body" color={colors.textMuted} style={styles.rowValue}>
                {getLocationLabel()}
              </AppText>
              <AppIcon name="chevron-forward" size={16} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── GROUP 3: SUPPORT & ABOUT ───────────────────────────────── */}
        <View style={styles.section}>
          <AppText variant="labelSmall" color={colors.textMuted} style={styles.sectionTitle}>
            {s.supportGroup}
          </AppText>
          <View style={styles.groupCard}>
            {/* Help & Feedback */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.row}
              onPress={() => setFeedbackModalVisible(true)}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                <AppIcon name="chatbubble-ellipses-outline" size={18} color="#475569" />
              </View>
              <AppText variant="bodyLarge" color={colors.textPrimary} style={styles.rowLabel}>
                {s.helpFeedback}
              </AppText>
              <AppIcon name="chevron-forward" size={16} color={colors.textLight} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Terms of Service */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.row}
              onPress={() => setTermsModalVisible(true)}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                <AppIcon name="document-text-outline" size={18} color="#475569" />
              </View>
              <AppText variant="bodyLarge" color={colors.textPrimary} style={styles.rowLabel}>
                {s.termsPrivacy}
              </AppText>
              <AppIcon name="chevron-forward" size={16} color={colors.textLight} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* App Version */}
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#F8FAFC' }]}>
                <AppIcon name="information-circle-outline" size={18} color="#64748B" />
              </View>
              <AppText variant="bodyLarge" color={colors.textPrimary} style={styles.rowLabel}>
                {s.appVersion}
              </AppText>
              <AppText variant="body" color={colors.textMuted}>
                1.2.0 (Build 42)
              </AppText>
            </View>
          </View>
        </View>

        {/* ─── LOG OUT BUTTON ────────────────────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <AppIcon name="log-out-outline" size={18} color={colors.accentRed} />
          <AppText variant="labelMedium" color={colors.accentRed} style={styles.logoutText}>
            {s.logOut}
          </AppText>
        </TouchableOpacity>
      </ScrollView>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 1: EDIT PROFILE ───────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={isEditProfileVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditProfileVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback onPress={() => setEditProfileVisible(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <AppText variant="h2" color={colors.textPrimary}>
                {s.editProfile}
              </AppText>
              <TouchableOpacity onPress={() => setEditProfileVisible(false)}>
                <AppIcon name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <AppText variant="labelSmall" color={colors.textMuted} style={styles.inputLabel}>
                  {s.fullName}
                </AppText>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Alex Nguyen"
                  placeholderTextColor={colors.textLight}
                  style={styles.textInput}
                />
              </View>

              <AppButton
                title={c.save}
                variant="primary"
                size="lg"
                onPress={handleSaveProfile}
                style={styles.modalSaveBtn}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 2: LANGUAGE SELECTOR ──────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={isLanguageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setLanguageModalVisible(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.dialogSheet}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.dialogTitle}>
              {s.selectLanguage}
            </AppText>

            {[
              { code: 'vi' as const, flag: '🇻🇳', name: 'Tiếng Việt', sub: 'Giao diện tiếng Việt chuẩn' },
              { code: 'en' as const, flag: '🇺🇸', name: 'English', sub: 'Native English interface' },
            ].map((item) => {
              const isSelected = language === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  activeOpacity={0.7}
                  style={styles.langOptionRow}
                  onPress={() => {
                    setLanguage(item.code);
                    setLanguageModalVisible(false);
                  }}
                >
                  <View style={styles.langLeft}>
                    <AppText style={styles.langFlag}>{item.flag}</AppText>
                    <View>
                      <AppText variant="bodyLarge" color={colors.textPrimary} style={styles.langName}>
                        {item.name}
                      </AppText>
                      <AppText variant="labelSmall" color={colors.textMuted}>
                        {item.sub}
                      </AppText>
                    </View>
                  </View>
                  {isSelected && (
                    <AppIcon name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 3: APPEARANCE SELECTOR ────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={isThemeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setThemeModalVisible(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.dialogSheet}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.dialogTitle}>
              {s.chooseTheme}
            </AppText>

            {(['Light', 'Dark', 'System'] as const).map((mode) => {
              const isSelected = theme === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  activeOpacity={0.7}
                  style={styles.optionRow}
                  onPress={() => {
                    setTheme(mode);
                    setThemeModalVisible(false);
                  }}
                >
                  <AppText variant="bodyLarge" color={colors.textPrimary}>
                    {mode === 'Light'
                      ? `☀️ ${s.themeLight}`
                      : mode === 'Dark'
                        ? `🌙 ${s.themeDark}`
                        : `⚙️ ${s.themeSystem}`}
                  </AppText>
                  {isSelected && (
                    <AppIcon name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 4: LOCATION ACCESS ─────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={isLocationModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setLocationModalVisible(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.dialogSheet}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.dialogTitle}>
              {s.locationModalTitle}
            </AppText>
            <AppText variant="body" color={colors.textSecondary} style={styles.dialogDesc}>
              {s.locationModalDesc}
            </AppText>

            {[
              { key: 'WhileUsing' as const, label: s.locationWhileUsing },
              { key: 'Always' as const, label: s.locationAlways },
              { key: 'Never' as const, label: s.locationNever },
            ].map((item) => {
              const isSelected = locationSetting === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.7}
                  style={styles.optionRow}
                  onPress={() => {
                    setLocationSetting(item.key);
                    setLocationModalVisible(false);
                  }}
                >
                  <AppText variant="bodyLarge" color={colors.textPrimary}>
                    {item.label}
                  </AppText>
                  {isSelected && (
                    <AppIcon name="checkmark-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 5: FEEDBACK & BUG REPORT ──────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={isFeedbackModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback onPress={() => setFeedbackModalVisible(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <AppText variant="h2" color={colors.textPrimary}>
                {s.sendFeedback}
              </AppText>
              <TouchableOpacity onPress={() => setFeedbackModalVisible(false)}>
                <AppIcon name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              {/* Type Category Chips */}
              <View style={styles.chipRow}>
                {[
                  { key: 'feedback' as const, label: s.feedbackTypeFeedback },
                  { key: 'bug' as const, label: s.feedbackTypeBug },
                  { key: 'idea' as const, label: s.feedbackTypeIdea },
                ].map((item) => {
                  const isSelected = feedbackCategory === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => setFeedbackCategory(item.key)}
                      style={[styles.prefChip, isSelected && styles.prefChipActive]}
                    >
                      <AppText
                        variant="labelSmall"
                        color={isSelected ? colors.bgWhite : colors.textPrimary}
                      >
                        {item.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                value={feedbackText}
                onChangeText={setFeedbackText}
                placeholder={s.feedbackPlaceholder}
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={4}
                style={styles.feedbackInput}
              />

              <AppButton
                title={s.sendFeedback}
                variant="primary"
                size="lg"
                onPress={handleSendFeedback}
                style={styles.modalSaveBtn}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 6: TERMS & PRIVACY ─────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={isTermsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setTermsModalVisible(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.dialogSheet}>
            <View style={styles.termsHeader}>
              <AppIcon name="shield-checkmark" size={24} color={colors.primary} />
              <AppText variant="h3" color={colors.textPrimary}>
                {s.termsTitle}
              </AppText>
            </View>
            <AppText variant="body" color={colors.textSecondary} style={styles.termsBody}>
              {s.termsDesc}
            </AppText>
            <AppButton
              title={c.close}
              variant="secondary"
              size="md"
              onPress={() => setTermsModalVisible(false)}
              style={styles.modalSaveBtn}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgScreen,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
    borderRadius: radius.xl,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  foodieBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.accentBlue,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeLabel: {
    fontWeight: '700',
    fontSize: 10,
  },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.accentBlue,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  section: {
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: spacing.base,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowLabel: {
    flex: 1,
    fontWeight: '500',
  },
  rowValue: {
    marginRight: 6,
  },
  langBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 58,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F0',
    paddingVertical: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#FFD1D1',
    gap: 8,
    marginTop: spacing.xs,
    marginBottom: spacing.base,
  },
  logoutText: {
    fontWeight: '700',
  },

  /* ─── Modals ─────────────────────────────────────────── */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(6, 28, 53, 0.55)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalSheet: {
    backgroundColor: colors.bgWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.borderLight,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  modalForm: {
    gap: spacing.md,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontWeight: '700',
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.bgSurface,
  },
  feedbackInput: {
    height: 110,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    padding: spacing.base,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.bgSurface,
    textAlignVertical: 'top',
  },
  modalSaveBtn: {
    marginTop: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prefChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  prefChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  /* ─── Dialog Sheet ───────────────────────────────────── */
  dialogSheet: {
    backgroundColor: colors.bgWhite,
    marginHorizontal: spacing.xl,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: 'auto',
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  dialogTitle: {
    marginBottom: spacing.xs,
  },
  dialogDesc: {
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  langOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  langFlag: {
    fontSize: 26,
  },
  langName: {
    fontWeight: '700',
    marginBottom: 2,
  },
  termsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.xs,
  },
  termsBody: {
    lineHeight: 22,
    marginVertical: spacing.sm,
  },
});
