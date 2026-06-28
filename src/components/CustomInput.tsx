import React, { useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';
import { icons } from '@/constants/icons';

interface CustomInputProps extends TextInputProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  label?: string;
  showEyeButton?: boolean;
  onEyePress?: () => void;
}

export const CustomInput: React.FC<CustomInputProps> = ({ 
  iconName, 
  label, 
  style, 
  onFocus, 
  onBlur, 
  secureTextEntry, 
  showEyeButton = true,
  onEyePress,
  ...props 
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureInternal, setIsSecureInternal] = useState(secureTextEntry);

  const isSecure = onEyePress ? secureTextEntry : isSecureInternal;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const toggleSecureEntry = () => {
    if (onEyePress) {
      onEyePress();
    } else {
      setIsSecureInternal(!isSecureInternal);
    }
  };

  const maxLength = props.maxLength;
  const currentLength = typeof props.value === 'string' ? props.value.length : 0;
  const isMaxReached = maxLength !== undefined && currentLength >= maxLength;

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      )}
      <View style={[
        styles.container,
        {
          backgroundColor: theme.inputBg,
          borderColor: isFocused ? theme.primary : theme.border
        },
        props.multiline && { height: undefined, minHeight: 100, alignItems: 'flex-start' }
      ]}>
        {iconName && (
          <Ionicons name={iconName} size={20} color={theme.textSecondary} style={[styles.icon, props.multiline && { marginTop: 12 }]} />
        )}
        <TextInput
          style={[
            styles.input,
            iconName ? styles.inputWithIcon : undefined,
            (secureTextEntry !== undefined && showEyeButton) ? styles.inputWithRightButton : undefined,
            { color: theme.text },
            props.multiline && { textAlignVertical: 'top', paddingVertical: 12 },
            style
          ]}
          placeholderTextColor={theme.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecure}
          underlineColorAndroid="transparent"
          {...props}
        />
        {secureTextEntry !== undefined && showEyeButton && (
          <Pressable onPress={toggleSecureEntry} style={styles.eyeButton} accessibilityRole="button" accessibilityLabel={isSecure ? "Mostrar contraseña" : "Ocultar contraseña"}>
            <MaterialIcons
              name={isSecure ? (icons.VisibilityOff as any) : (icons.Visibility as any)}
              size={22}
              color={theme.textSecondary}
            />
          </Pressable>
        )}
      </View>
      {maxLength !== undefined && (
        <View style={styles.footer}>
          <Text
            style={[
              styles.counter,
              { color: isMaxReached ? theme.danger : theme.textSecondary },
            ]}
          >
            {currentLength}/{maxLength}
          </Text>
        </View>
      )}
      {isMaxReached && (
        <Text style={[styles.maxMessage, { color: theme.danger }]}>
          Máximo de caracteres alcanzado
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
  },
  icon: {
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputWithIcon: {
    paddingLeft: 10,
  },
  inputWithRightButton: {
    paddingRight: 5,
  },
  eyeButton: {
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  counter: {
    fontSize: 12,
    fontWeight: '500',
  },
  maxMessage: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
