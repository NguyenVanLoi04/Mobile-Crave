import React from 'react';
import { View, StyleSheet, Image, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon, AppButton } from '../../../components/ui';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../../i18n';
import { useUserStore } from '../../../store';

const imgLogo = require('../../../../assets/images/logo.png');

interface UserNameFormData {
    name: string;
}

export interface OnboardingInputUserNameProps {
    value?: string;
    onChangeText?: (text: string) => void;
    onNext?: () => void;
}

export const OnboardingInputUserName: React.FC<OnboardingInputUserNameProps> = ({
    value,
    onChangeText,
    onNext,
}) => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const setStoreName = useUserStore((state) => state.setName);
    const storeName = useUserStore((state) => state.name);

    const { control, handleSubmit } = useForm<UserNameFormData>({
        defaultValues: {
            name: value ?? storeName ?? '',
        },
        mode: 'onSubmit',
    });

    const onSubmit = (data: UserNameFormData) => {
        const trimmed = data.name.trim();
        if (trimmed) {
            setStoreName(trimmed);
        }
        onChangeText?.(trimmed);
        if (onNext) {
            onNext();
        } else {
            navigation.navigate('MainTabs', { screen: 'Home' });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.boxContent}>
                <View style={styles.imageFrame}>
                    <Image source={imgLogo} style={styles.image} resizeMode='contain' />
                </View>
                <View>
                    <AppText style={styles.title}>{t.onboarding.nameTitle}</AppText>
                </View>
                <View>
                    <AppText style={styles.subTitle}>{t.onboarding.nameSubtitle}</AppText>
                </View>
                <View style={styles.inputFrame}>
                    <AppText style={styles.inputLabel}>{t.onboarding.nameLabel}</AppText>
                    <View style={styles.inputBox}>
                        <AppIcon
                            name="person-outline"
                            size={18}
                            color={colors.textLight}
                            style={styles.inputIcon}
                        />
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value: fieldValue } }) => (
                                <TextInput
                                    value={fieldValue}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder={t.onboarding.namePlaceholder}
                                    placeholderTextColor={colors.textLight}
                                    style={styles.textInput}
                                    autoCorrect={false}
                                    returnKeyType="done"
                                    onSubmitEditing={() => handleSubmit(onSubmit)()}
                                />
                            )}
                        />
                    </View>
                </View>
                <View style={styles.buttonFrame}>
                    <View style={styles.buttonFrame}>
                        <AppButton
                            title={t.onboarding.nameContinue}
                            style={styles.button}
                            iconRight={<AppIcon
                                name="arrow-forward"
                                size={13}
                                color={colors.bgWhite}
                            />}
                            onPress={() => handleSubmit(onSubmit)()}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: colors.bgSurface,
        width: '100%',
        height: '100%',
    },
    boxContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageFrame: {
        width: 120,
        height: 120,
        borderRadius: radius.xl,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        backgroundColor: colors.bgWhite,
        shadowColor: colors.primaryDark,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowRadius: 16,
    },
    image: {
        width: 90,
        height: 90,
    },
    title: {
        marginTop: spacing.base,
        fontWeight: 'bold',
        fontSize: 28,
        letterSpacing: -0.7,
        lineHeight: 34,
    },
    subTitle: {
        color: colors.textSecondary,
        fontSize: 15,
        fontWeight: 'regular',
        marginTop: spacing.sm,
    },
    inputFrame: {
        marginTop: spacing.xxxl,
        width: '100%',
        paddingHorizontal: spacing.xl,
        alignItems: 'flex-start',
    },
    inputLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: 'semibold',
        letterSpacing: 0.3,
        justifyContent: 'flex-start',
    },
    inputBox: {
        width: '100%',
        height: 54, // Chuẩn theo thông số Figma 350 Fill x 54
        backgroundColor: colors.bgWhite,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.borderLight,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
    },
    inputIcon: {
        marginRight: spacing.sm,
    },
    textInput: {
        flex: 1,
        height: '100%',
        fontSize: 15,
        color: colors.textPrimary,
        marginTop: spacing.xs
    },
    buttonFrame: {
        marginTop: spacing.xxxl,
        alignItems: 'center',
    },
    button: {
        width: 350,
        height: 52,
        backgroundColor: colors.primary,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.borderLight,
    }
});
