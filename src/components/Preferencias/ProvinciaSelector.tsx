import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Provincia, PROVINCIA_LABEL } from '@/types/itinerario';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (provincia: Provincia) => void;
  selected?: Provincia;
}

const TODAS = Object.values(Provincia) as Provincia[];

// Defined at module scope so FlatList always receives a stable component reference
function ListSeparator() {
  return <View style={styles.separator} />;
}


export function ProvinciaSelector({ visible, onClose, onSelect, selected }: Readonly<Props>) {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? TODAS.filter((p) =>
      PROVINCIA_LABEL[p].toLowerCase().includes(search.toLowerCase()),
    )
    : TODAS;

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const handleSelect = (provincia: Provincia) => {
    setSearch('');
    onSelect(provincia);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Seleccionar Provincia</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar provincia..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selected === item;
              return (
                <TouchableOpacity
                  style={[styles.item, isSelected && styles.itemSelected]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                    {PROVINCIA_LABEL[item]}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={20} color="#2F65E3" />}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={ListSeparator}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  itemSelected: {
    backgroundColor: '#EFF4FF',
  },
  itemText: {
    fontSize: 15,
    color: '#374151',
  },
  itemTextSelected: {
    color: '#2F65E3',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
  },
});
