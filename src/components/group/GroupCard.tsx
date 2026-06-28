import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/hooks/useColorScheme';
import { icons } from '@/constants/icons';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';
import { GroupSummary } from '@/types/grupo';

interface GroupCardProps {
  group: GroupSummary;
  onPress: () => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onPress }) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        pressed && { opacity: 0.8 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Grupo ${group.nombre}`}
    >
      {group.fotoPortada ? (
        <Image
          source={{ uri: group.fotoPortada }}
          style={styles.cover}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.coverPlaceholder, { backgroundColor: theme.surfaceHighlight }]}>
          <MaterialIcons name={icons.Groups} size={32} color={theme.primary} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {group.nombre}
        </Text>
        <View style={styles.row}>
          <MaterialIcons name={icons.People} size={14} color={theme.textSecondary} />
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            {group.cantidadMiembros} {group.cantidadMiembros === 1 ? 'miembro' : 'miembros'}
          </Text>
        </View>
        {group.soyCreador && (
          <View style={[styles.badge, { backgroundColor: theme.surfaceHighlight }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>Creador</Text>
          </View>
        )}
        {group.tieneEncuestaAbierta && (
          <View style={[styles.badge, { backgroundColor: theme.categorySelected }]}>
            <MaterialIcons name={icons.Poll} size={12} color={theme.primary} />
            <Text style={[styles.badgeText, { color: theme.primary, marginLeft: 4 }]}>
              Encuesta abierta
            </Text>
          </View>
        )}
      </View>

      <MaterialIcons
        name={icons['chevron.right']}
        size={24}
        color={theme.button_gray}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: paddings.spacing.md,
    borderRadius: paddings.radius.md,
    borderWidth: 1,
    marginBottom: paddings.spacing.md,
  },
  cover: {
    width: 64,
    height: 64,
    borderRadius: paddings.radius.sm,
  },
  coverPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: paddings.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: paddings.spacing.md,
  },
  name: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.md,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  meta: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.sm,
    marginLeft: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: paddings.radius.sm,
    marginTop: 6,
  },
  badgeText: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.xs,
  },
});
