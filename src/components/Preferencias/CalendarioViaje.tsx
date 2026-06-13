import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

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

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (fechaInicio: string, fechaFin: string) => void;
  initialStart?: string;
  initialEnd?: string;
}

type MarkedDates = Record<string, {
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  textColor?: string;
}>;

const PRIMARY = '#2F65E3';
const RANGE_COLOR = 'rgba(255,255,255,0.35)';
const SELECTED_COLOR = '#FFFFFF';
const SELECTED_TEXT = PRIMARY;

export function CalendarioViaje({ visible, onClose, onConfirm, initialStart, initialEnd }: Readonly<Props>) {
  const [startDate, setStartDate] = useState<string | null>(initialStart ?? null);
  const [endDate, setEndDate] = useState<string | null>(initialEnd ?? null);

  const handleDayPress = (day: DateData) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else if (day.dateString < startDate) {
      setEndDate(startDate);
      setStartDate(day.dateString);
    } else if (day.dateString === startDate) {
      setStartDate(null);
    } else {
      setEndDate(day.dateString);
    }
  };

  const buildMarkedDates = (): MarkedDates => {
    if (!startDate) return {};
    const marked: MarkedDates = {};

    if (!endDate) {
      marked[startDate] = {
        startingDay: true,
        endingDay: true,
        color: SELECTED_COLOR,
        textColor: SELECTED_TEXT,
      };
      return marked;
    }

    marked[startDate] = { startingDay: true, color: SELECTED_COLOR, textColor: SELECTED_TEXT };
    marked[endDate] = { endingDay: true, color: SELECTED_COLOR, textColor: SELECTED_TEXT };

    const cur = new Date(startDate + 'T00:00:00');
    cur.setDate(cur.getDate() + 1);
    const end = new Date(endDate + 'T00:00:00');
    while (cur < end) {
      const key = cur.toISOString().split('T')[0];
      marked[key] = { color: RANGE_COLOR, textColor: '#FFFFFF' };
      cur.setDate(cur.getDate() + 1);
    }
    return marked;
  };

  const canConfirm = Boolean(startDate && endDate);

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm(startDate!, endDate!);
      onClose();
    }
  };

  const handleClose = () => {
    setStartDate(initialStart ?? null);
    setEndDate(initialEnd ?? null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Calendario de Viaje</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Calendar
            onDayPress={handleDayPress}
            markedDates={buildMarkedDates()}
            markingType="period"
            minDate={new Date().toISOString().split('T')[0]}
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
            style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            disabled={!canConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmText}>Confirmar Fechas</Text>
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
    backgroundColor: '#2F65E3',
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
    color: '#2F65E3',
    fontSize: 16,
    fontWeight: '700',
  },
});
