import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';
import { Provincia, PROVINCIA_LABEL } from '@/types/itinerario';
import { BarraProgreso } from './BarraProgreso';

export interface LogroDetalle {
  nombre: string;
  emoji: string;
  color: string;
  descripcion: string;
  provincias: Provincia[];
  visitadas: number;
  total: number;
  desbloqueado: boolean;
}

interface Props {
  logro: LogroDetalle | null;
  visitadasSet: Set<string>;
  onClose: () => void;
}

export function LogroDetalleModal({ logro, visitadasSet, onClose }: Props) {
  const { theme } = useTheme();
  const porcentaje = logro ? Math.round((logro.visitadas / logro.total) * 100) : 0;
  const faltantes = logro ? logro.total - logro.visitadas : 0;

  return (
    <Modal
      visible={logro !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
        <View
          style={[styles.card, { backgroundColor: theme.card }]}
        >
          {logro && (
            <>
              <View
                style={[
                  styles.circulo,
                  {
                    backgroundColor: logro.desbloqueado
                      ? logro.color
                      : theme.surfaceNeutral,
                  },
                ]}
              >
                {logro.desbloqueado ? (
                  <Text style={styles.emoji}>{logro.emoji}</Text>
                ) : (
                  <Ionicons name="lock-closed" size={30} color={theme.gray} />
                )}
              </View>

              <Text style={[styles.nombre, { color: theme.text }]}>{logro.nombre}</Text>

              <Text style={[styles.descripcion, { color: theme.textSecondary }]}>
                {logro.descripcion}
              </Text>

              <View
                style={[
                  styles.progresoPill,
                  {
                    backgroundColor: logro.desbloqueado
                      ? `${logro.color}22`
                      : theme.surfaceNeutral,
                  },
                ]}
              >
                {logro.desbloqueado && (
                  <Ionicons name="trophy" size={14} color={logro.color} />
                )}
                <Text
                  style={[
                    styles.progresoTexto,
                    { color: logro.desbloqueado ? logro.color : theme.gray },
                  ]}
                >
                  {logro.desbloqueado
                    ? '¡Logro desbloqueado!'
                    : `${logro.visitadas} de ${logro.total} provincias`}
                </Text>
              </View>

              <View style={styles.progresoBloque}>
                <View style={styles.progresoHeader}>
                  <Text style={[styles.progresoLabel, { color: theme.text }]}>Progreso</Text>
                  <Text style={[styles.progresoPct, { color: logro.color }]}>{porcentaje}%</Text>
                </View>
                <BarraProgreso
                  porcentaje={porcentaje}
                  color={logro.color}
                  trackColor={theme.surfaceNeutral}
                />
                <Text style={[styles.faltantesTexto, { color: theme.textSecondary }]}>
                  {logro.desbloqueado
                    ? 'Completaste todas las provincias de este logro.'
                    : faltantes === 1
                      ? 'Te falta 1 provincia para desbloquearlo.'
                      : `Te faltan ${faltantes} provincias para desbloquearlo.`}
                </Text>
              </View>

              <View style={[styles.separador, { backgroundColor: theme.border }]} />

              <FlatList
                data={logro.provincias}
                keyExtractor={prov => prov}
                style={styles.lista}
                contentContainerStyle={styles.listaContent}
                nestedScrollEnabled
                showsVerticalScrollIndicator
                renderItem={({ item: prov }) => {
                  const visitada = visitadasSet.has(prov);
                  return (
                    <View key={prov} style={styles.filaProvincia}>
                      <Ionicons
                        name={visitada ? 'checkmark-circle' : 'ellipse-outline'}
                        size={20}
                        color={visitada ? logro.color : theme.gray}
                      />
                      <Text
                        style={[
                          styles.provinciaTexto,
                          {
                            color: visitada ? theme.text : theme.gray,
                            fontWeight: visitada ? '600' : '400',
                          },
                        ]}
                      >
                        {PROVINCIA_LABEL[prov]}
                      </Text>
                    </View>
                  );
                }}
              />

              <Pressable
                style={[styles.botonCerrar, { backgroundColor: theme.primary }]}
                onPress={onClose}
              >
                <Text style={[styles.botonCerrarTexto, { color: theme.textInverse }]}>
                  Cerrar
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '86%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  circulo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 36,
  },
  nombre: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  descripcion: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 14,
  },
  progresoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progresoTexto: {
    fontSize: 13,
    fontWeight: '700',
  },
  progresoBloque: {
    alignSelf: 'stretch',
    marginTop: 14,
    gap: 8,
  },
  progresoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progresoLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  progresoPct: {
    fontSize: 14,
    fontWeight: '800',
  },
  faltantesTexto: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  separador: {
    height: 1,
    alignSelf: 'stretch',
    marginVertical: 14,
  },
  lista: {
    alignSelf: 'stretch',
    maxHeight: 220,
    flexGrow: 0,
    flexShrink: 1,
  },
  listaContent: {
    paddingRight: 6,
  },
  filaProvincia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 7,
  },
  provinciaTexto: {
    fontSize: 15,
  },
  botonCerrar: {
    alignSelf: 'stretch',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 18,
  },
  botonCerrarTexto: {
    fontSize: 15,
    fontWeight: '700',
  },
});
