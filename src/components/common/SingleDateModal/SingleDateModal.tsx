import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

// Locale español (idempotente: configurarlo de nuevo no rompe nada aunque
// CalendarioViaje ya lo haya hecho).
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ],
  monthNamesShort: [
    'Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.',
    'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.',
  ],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

const PRIMARY = '#2F65E3';
const SELECTED_COLOR = '#FFFFFF';
const SELECTED_TEXT = PRIMARY;

interface Props {
  visible: boolean;
  /** Fecha preseleccionada (formato YYYY-MM-DD). */
  initialDate?: string;
  title?: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: (fecha: string) => void;
}

/**
 * Modal para elegir <strong>una sola fecha</strong>. Reutiliza el estilo del
 * CalendarioViaje (rango) pero con marcado simple. Se usa, por ejemplo, para
 * reprogramar la fecha de inicio de un itinerario.
 */
export function SingleDateModal({
  visible,
  initialDate,
  title = 'Elegí una fecha',
  confirmLabel = 'Confirmar',
  onClose,
  onConfirm,
}: Readonly<Props>) {
  const [selected, setSelected] = useState<string | null>(initialDate ?? null);

  // Sincroniza la selección cuando cambia la fecha inicial entre aperturas.
  useEffect(() => {
    if (visible) setSelected(initialDate ?? null);
  }, [visible, initialDate]);

  const handleDayPress = (day: DateData) => {
    setSelected(day.dateString);
  };

  const handleConfirm = () => {
    if (selected) {
      onConfirm(selected);
      onClose();
    }
  };

  const markedDates = selected
    ? { [selected]: { selected: true, selectedColor: SELECTED_COLOR, selectedTextColor: SELECTED_TEXT } }
    : {};

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            renderArrow={(direction) => (
              <Ionicons
                name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
                size={20}
                color="#FFFFFF"
              />
            )}
            theme={{
              backgroundColor: PRIMARY,
              calendarBackground: PRIMARY,
              textSectionTitleColor: 'rgba(255,255,255,0.7)',
              selectedDayBackgroundColor: SELECTED_COLOR,
              selectedDayTextColor: SELECTED_TEXT,
              todayTextColor: '#FACC15',
              dayTextColor: '#FFFFFF',
              textDisabledColor: 'rgba(255,255,255,0.3)',
              monthTextColor: '#FFFFFF',
              textMonthFontWeight: '700',
              textMonthFontSize: 16,
              textDayFontSize: 14,
              textDayHeaderFontSize: 12,
              arrowColor: '#FFFFFF',
            }}
          />

          <TouchableOpacity
            style={[styles.confirmBtn, !selected && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            disabled={!selected}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  confirmBtn: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.5,
  },
  confirmText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: '700',
  },
});
