import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/hooks/useColorScheme';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';
import { colors } from '@/constants/colors';

export type Vista = 'guardados' | 'misViajes';

interface Props {
  vista: Vista;
  onChangeVista: (vista: Vista) => void;
  onCrearDesdeCero: () => void;
}

// Título y subtítulo por vista, fuera del componente para no recrearlos en cada render
const TEXTOS: Record<Vista, { titulo: string; subtitulo: string }> = {
  guardados: {
    titulo: 'Favoritos guardados',
    subtitulo: 'Plantillas que guardaste. Creá una copia para personalizarla.',
  },
  misViajes: {
    titulo: 'Mis viajes',
    subtitulo: 'Tus itinerarios propios, listos para editar y completar.',
  },
};

/**
 * Header compartido por las dos tabs de Favoritos. Se pasa como
 * ListHeaderComponent de cada FlatList para que scrollee con la lista.
 */
export function FavoritosHeader({ vista, onChangeVista, onCrearDesdeCero }: Props) {
  const { theme } = useTheme();
  const { titulo, subtitulo } = TEXTOS[vista];

  return (
    <View style={styles.pageHeader}>
      <Text style={[styles.pageTitle, { color: theme.text }]}>{titulo}</Text>
      <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>{subtitulo}</Text>

      {/* Toggle de tabs: la activa se pinta con el color primario */}
      <View style={[styles.toggleRow, { backgroundColor: theme.surfaceNeutral }]}>
        <Pressable
          onPress={() => onChangeVista('guardados')}
          style={[styles.toggleBtn, vista === 'guardados' && { backgroundColor: theme.primary }]}
        >
          <Text style={[styles.toggleText, { color: vista === 'guardados' ? theme.textInverse : theme.textSecondary }]}>
            Guardados
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onChangeVista('misViajes')}
          style={[styles.toggleBtn, vista === 'misViajes' && { backgroundColor: theme.primary }]}
        >
          <Text style={[styles.toggleText, { color: vista === 'misViajes' ? theme.textInverse : theme.textSecondary }]}>
            Mis viajes
          </Text>
        </Pressable>
      </View>

      {/* "Crear desde cero" solo tiene sentido en la tab de copias propias */}
      {vista === 'misViajes' && (
        <Pressable
          onPress={onCrearDesdeCero}
          style={[styles.crearDesdeCeroBtn, { borderColor: theme.primary }]}
          accessibilityRole="button"
        >
          <MaterialIcons name="add" size={20} color={theme.primary} />
          <Text style={[styles.crearDesdeCeroText, { color: theme.primary }]}>Crear itinerario desde cero</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    paddingHorizontal: paddings.spacing.lg,
    paddingTop: paddings.spacing.lg,
    paddingBottom: paddings.spacing.xxl,
  },
  pageTitle: {
    fontFamily: fonts.family.headingBold,
    fontSize: fonts.size.xxxl,
    fontWeight: fonts.weight.bold,
    lineHeight: 42,
    color: colors.text,
    marginBottom: paddings.spacing.sm,
  },
  pageSubtitle: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  toggleRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginTop: 16,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  crearDesdeCeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
  },
  crearDesdeCeroText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
