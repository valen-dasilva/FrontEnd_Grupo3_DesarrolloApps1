global.IS_REACT_ACT_ENVIRONMENT = true;

// Mock React Native SafeArea Context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const insetValues = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    SafeAreaView: ({ children }) => React.createElement(React.Fragment, null, children),
    useSafeAreaInsets: () => insetValues,
  };
});

// Mock Expo Router
const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => {
  const React = require('react');
  return {
    useRouter: () => ({
      push: mockPush,
      back: mockBack,
      replace: mockReplace,
    }),
    useLocalSearchParams: () => ({}),
    useFocusEffect: (cb) => {
      React.useEffect(() => {
        cb();
      }, [cb]);
    },
    Stack: {
      Screen: () => null,
    },
  };
});

// Export mock router controls for checking in assertions
global.mockPush = mockPush;
global.mockBack = mockBack;
global.mockReplace = mockReplace;

// Mock Vector Icons
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

// Mock Color Scheme and Theme context
jest.mock('@/hooks/use-color-scheme', () => {
  const colors = {
    light: {
      background: '#FFFFFF',
      surface: '#F9FAFB',
      surfaceNeutral: '#F3F4F6',
      text: '#111827',
      textSecondary: '#4B5563',
      textInverse: '#FFFFFF',
      border: '#E5E7EB',
      primary: '#3B82F6',
      primaryBg: '#EFF6FF',
      danger: '#EF4444',
      warning: '#F59E0B',
      card: '#FFFFFF',
    },
    dark: {
      background: '#0B0F19',
      surface: '#11131A',
      surfaceNeutral: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF',
      textInverse: '#111827',
      border: '#374151',
      primary: '#3B82F6',
      primaryBg: '#1E3A8A',
      danger: '#EF4444',
      warning: '#F59E0B',
      card: '#11131A',
    },
  };
  return {
    useColorScheme: () => 'light',
    useTheme: () => ({
      colorScheme: 'light',
      toggleColorScheme: jest.fn(),
      setColorScheme: jest.fn(),
      theme: colors.light,
    }),
  };

});

// Mock services
jest.mock('@/src/services/favoritosService', () => ({
  postItinerario: jest.fn(() => Promise.resolve({ id: 999, idItinerarioUsuario: 999 })),
  deleteItinerario: jest.fn(() => Promise.resolve()),
  getItinerarios: jest.fn(() => Promise.resolve([])),
}));

jest.mock('@/src/services/itinerarioService', () => ({
  buscarPorPreferencias: jest.fn(() => Promise.resolve([])),
  obtenerItinerarioPorId: jest.fn(() => Promise.resolve(null)),
}));

// Mock custom hooks
jest.mock('@/hooks/useItinerarioDetalle', () => ({
  useItinerarioDetalle: jest.fn(() => ({
    itinerario: null,
    loading: false,
    error: null,
  })),
}));

jest.mock('@/src/hooks/favoritosHook', () => ({
  useFavoritosHook: jest.fn(() => ({
    listItinerarioResumen: [],
    loadItinerarios: jest.fn(),
    addItineraryToFavs: jest.fn(),
    quitItineraryFromFavs: jest.fn(),
    isLoading: false,
    error: null,
  })),
  useFavoritosDetailsHook: jest.fn(() => ({
    itineraryDetails: null,
    isLoading: false,
    error: null,
    loadItineraryInfo: jest.fn(),
  })),
}));

// 1. Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// 2. Mocks extras
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('@expo/vector-icons/Feather', () => 'Feather');
jest.mock('@expo/vector-icons/FontAwesome', () => 'FontAwesome');

// 3. Mock global 
jest.mock('expo-font', () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-asset', () => ({
  Asset: {
    loadAsync: jest.fn(() => Promise.resolve()),
  },
}));