import React, { useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { colors, radius, spacing, typography } from '../../../theme';
import { AppIcon } from '../../../components/ui';
import { useTranslation } from '../../../i18n';

export interface SearchFormData {
  query: string;
}

export interface HomeSearchBarProps {
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  onSearch?: (query?: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export const HomeSearchBar: React.FC<HomeSearchBarProps> = ({
  value,
  defaultValue = '',
  onChangeText,
  onSearch,
  onClear,
  placeholder,
}) => {
  const { t } = useTranslation();
  const actualPlaceholder = placeholder ?? t.home.searchPlaceholder;

  // React Hook Form for uncontrolled high-performance input
  const { control, handleSubmit, setValue } = useForm<SearchFormData>({
    defaultValues: {
      query: value ?? defaultValue,
    },
    mode: 'onSubmit',
  });

  const currentQuery = useWatch({
    control,
    name: 'query',
    defaultValue: value ?? defaultValue,
  });

  useEffect(() => {
    if (value !== undefined) {
      setValue('query', value);
    }
  }, [value, setValue]);

  const handleClear = () => {
    setValue('query', '');
    onChangeText?.('');
    if (onClear) {
      onClear();
    } else {
      onSearch?.('');
    }
  };

  const onSubmit = (data: SearchFormData) => {
    onSearch?.(data.query);
  };

  return (
    <View style={styles.container}>
      {/* Search Input Box */}
      <View style={styles.inputWrapper}>
        <AppIcon
          name="search-outline"
          size={18}
          color={colors.textMuted}
          style={styles.searchIcon}
        />
        <Controller
          control={control}
          name="query"
          render={({ field: { onChange, onBlur, value: fieldValue } }) => (
            <TextInput
              value={fieldValue}
              onChangeText={(text) => {
                onChange(text);
                onChangeText?.(text);
              }}
              onBlur={onBlur}
              placeholder={actualPlaceholder}
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
              onSubmitEditing={() => handleSubmit(onSubmit)()}
              style={styles.input}
            />
          )}
        />
        {currentQuery && currentQuery.length > 0 ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClear}
            style={styles.clearBtn}
          >
            <AppIcon name="close-circle" size={17} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Primary Search Button (Triggers search explicitly) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSubmit(onSubmit)()}
        style={styles.searchButton}
      >
        <AppIcon name="search" size={20} color={colors.bgWhite} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  inputWrapper: {
    flex: 1,
    height: 48,
    backgroundColor: colors.bgWhite,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    ...typography.bodyLarge,
    color: colors.textPrimary,
  },
  clearBtn: {
    padding: spacing.xs,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#005EB8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 4,
  },
});
