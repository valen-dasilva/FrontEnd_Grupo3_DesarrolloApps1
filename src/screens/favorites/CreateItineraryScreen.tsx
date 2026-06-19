import { useTheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Header } from '@/components/common/Header/Header';
import { CalendarioViaje } from '@/components/Preferencias/CalendarioViaje';
import { CategoriaGrid } from '@/components/Preferencias/CategoriaGrid';
import { DestinoInput } from '@/components/Preferencias/DestinoInput';
import { FechaRangeSelector } from '@/components/Preferencias/FechaRangeSelector';
import { ProvinciaSelector } from '@/components/Preferencias/ProvinciaSelector';
import { useItinerariosHook } from '@/hooks/useItinerarios';
import { CategoriaItinerario, Provincia, PROVINCIA_LABEL } from '@/types/itinerario';

export default function CreateItineraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, toggleColorScheme } = useTheme();

  const { crearItinerario, isCreando } = useItinerariosHook();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [provincia, setProvincia] = useState<Provincia | undefined>();
  const [fechaInicio, setFechaInicio] = useState<string | undefined>();
  const [fechaFin, setFechaFin] = useState<string | undefined>();
  const [categorias, setCategorias] = useState<Set<CategoriaItinerario>>(new Set());

  const [showCalendario, setShowCalendario] = useState(false);
  const [showProvincia, setShowProvincia] = useState(false);

  const toggleCategoria = (cat: CategoriaItinerario) => {
    setCategorias((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleCrear = async () => {
    if (!titulo.trim()) {
      Toast.show({ type: 'error', text1: 'Falta el título', text2: 'Ponele un nombre a tu itinerario.' });
      return;
    }
    if (!provincia) {
      Toast.show({ type: 'error', text1: 'Falta la provincia', text2: 'Elegí a dónde vas a viajar.' });
      return;
    }
    if (!fechaInicio || !fechaFin) {
      Toast.show({ type: 'error', text1: 'Faltan las fechas', text2: 'Elegí el rango de fechas del viaje.' });
      return;
    }

    try {
      await crearItinerario({
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        provincia,
        fechaInicio,
        fechaFin,
        etiquetas: categorias.size > 0 ? Array.from(categorias) : undefined,
      });
      Toast.show({
        type: 'success',
        text1: '¡Itinerario creado!',
        text2: 'Agregale actividades desde "Mis viajes".',
      });
      router.back();
    } catch {
      // el hook ya muestra el Alert de error
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Header
        title="Nuevo itinerario"
        showBackButton
        onBackPress={() => router.back()}
        onThemeTogglePress={toggleColorScheme}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Título */}
        <View style={styles.seccion}>
          <Text style={[styles.pregunta, { color: theme.text }]}>¿Cómo se llama tu viaje?</Text>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ej: Finde en Mendoza"
            placeholderTextColor={theme.gray}
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            maxLength={200}
          />
        </View>

        {/* Descripción */}
        <View style={styles.seccion}>
          <Text style={[styles.labelSeccion, { color: theme.textSecondary }]}>DESCRIPCIÓN (OPCIONAL)</Text>
          <TextInput
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Una breve descripción de tu viaje..."
            placeholderTextColor={theme.gray}
            style={[styles.input, styles.inputMultiline, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            multiline
            numberOfLines={3}
            maxLength={2000}
          />
        </View>

        {/* Provincia */}
        <View style={styles.seccion}>
          <Text style={[styles.pregunta, { color: theme.text }]}>¿A dónde vas?</Text>
          <DestinoInput
            value={provincia ? PROVINCIA_LABEL[provincia] : undefined}
            placeholder="Elegí una provincia..."
            onPress={() => setShowProvincia(true)}
            onClear={() => setProvincia(undefined)}
          />
        </View>

        {/* Fechas */}
        <View style={styles.seccion}>
          <Text style={[styles.labelSeccion, { color: theme.textSecondary }]}>FECHAS DEL VIAJE</Text>
          <FechaRangeSelector
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            onPress={() => setShowCalendario(true)}
            onClear={() => {
              setFechaInicio(undefined);
              setFechaFin(undefined);
            }}
          />
        </View>

        {/* Categorías */}
        <CategoriaGrid seleccionadas={categorias} onToggle={toggleCategoria} />
      </ScrollView>

      {/* Botón fijo */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.btnCrear, { backgroundColor: theme.primary }, isCreando && styles.btnLoading]}
          onPress={handleCrear}
          disabled={isCreando}
          activeOpacity={0.85}
        >
          {isCreando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.btnCrearText}>Crear itinerario</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <CalendarioViaje
        visible={showCalendario}
        onClose={() => setShowCalendario(false)}
        onConfirm={(inicio, fin) => {
          setFechaInicio(inicio);
          setFechaFin(fin);
        }}
        initialStart={fechaInicio}
        initialEnd={fechaFin}
      />

      <ProvinciaSelector
        visible={showProvincia}
        onClose={() => setShowProvincia(false)}
        onSelect={setProvincia}
        selected={provincia}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  seccion: { marginTop: 24 },
  pregunta: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  labelSeccion: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  btnCrear: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
  },
  btnLoading: { opacity: 0.7 },
  btnCrearText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
