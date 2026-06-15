import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProvinciaSelector } from './ProvinciaSelector';
import { Provincia, PROVINCIA_LABEL } from '@/types/itinerario';
import { TextInput, TouchableOpacity } from 'react-native';

// Mock FlatList using ScrollView to bypass react 19 VirtualizedList compatibility issue
jest.mock('react-native/Libraries/Lists/FlatList', () => {
  const React = require('react');
  const { ScrollView } = require('react-native');
  const Component = React.forwardRef(({ data, renderItem, ItemSeparatorComponent, ...props }: any, ref: any) => {
    return React.createElement(
      ScrollView,
      { ...props, ref },
      data.map((item: any, index: number) => {
        const key = props.keyExtractor ? props.keyExtractor(item, index) : index;
        const element = renderItem({ item, index });
        const elementWithKey = React.cloneElement(element, { key });
        if (ItemSeparatorComponent && index < data.length - 1) {
          return React.createElement(
            React.Fragment,
            { key },
            elementWithKey,
            React.createElement(ItemSeparatorComponent, { key: `${key}-separator` })
          );
        }
        return elementWithKey;
      })
    );
  });
  return { __esModule: true, default: Component };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    SafeAreaView: ({ children, ...props }: any) => React.createElement(View, props, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

describe('ProvinciaSelector', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    onSelect: jest.fn(),
    selected: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when visible is false', () => {
    // In React Native, the Modal might render its content inside unless visible is false,
    // but in our Jest environment with mocked Modal, let's verify if the Modal prop visible is false.
    const { UNSAFE_getByType } = render(<ProvinciaSelector {...defaultProps} visible={false} />);
    const modal = UNSAFE_getByType('Modal');
    expect(modal.props.visible).toBe(false);
  });

  it('renders correctly when visible is true', () => {
    const { getByText, getByPlaceholderText } = render(<ProvinciaSelector {...defaultProps} />);

    expect(getByText('Seleccionar Provincia')).toBeTruthy();
    expect(getByPlaceholderText('Buscar provincia...')).toBeTruthy();
    
    // Check that some province labels from PROVINCIA_LABEL are rendered
    expect(getByText(PROVINCIA_LABEL[Provincia.BUENOS_AIRES])).toBeTruthy();
    expect(getByText(PROVINCIA_LABEL[Provincia.RIO_NEGRO])).toBeTruthy();
    expect(getByText(PROVINCIA_LABEL[Provincia.SALTA])).toBeTruthy();
  });

  it('highlights the selected province and shows a checkmark', () => {
    // Let's pass CABA as selected
    const { getByText, UNSAFE_getAllByType } = render(
      <ProvinciaSelector {...defaultProps} selected={Provincia.CABA} />
    );

    // Selected item has a checkmark icon "checkmark".
    // Let's find "checkmark" icon or verify it does not crash.
    // In our jest.setup.js, we mock @expo/vector-icons Ionicons.
    // So we can find 'Ionicons' elements and verify one has name="checkmark"
    const ionicIcons = UNSAFE_getAllByType('Ionicons');
    const checkmarks = ionicIcons.filter(icon => icon.props.name === 'checkmark');
    expect(checkmarks.length).toBe(1);
  });

  it('filters provinces dynamically when typing in search input', () => {
    const { getByPlaceholderText, queryByText } = render(
      <ProvinciaSelector {...defaultProps} />
    );

    const searchInput = getByPlaceholderText('Buscar provincia...');
    
    // Let's search for "Río Negro"
    fireEvent.changeText(searchInput, 'Río Negro');

    // "Río Negro" should be visible
    expect(queryByText(PROVINCIA_LABEL[Provincia.RIO_NEGRO])).toBeTruthy();
    
    // "Buenos Aires" should NOT be visible
    expect(queryByText(PROVINCIA_LABEL[Provincia.BUENOS_AIRES])).toBeNull();
  });

  it('allows clearing the search query using the clear button', () => {
    const { getByPlaceholderText, queryByText, UNSAFE_getAllByType } = render(
      <ProvinciaSelector {...defaultProps} />
    );

    const searchInput = getByPlaceholderText('Buscar provincia...');
    
    // Type query
    fireEvent.changeText(searchInput, 'Salta');
    expect(queryByText(PROVINCIA_LABEL[Provincia.BUENOS_AIRES])).toBeNull();

    // The clear button is an Ionicons with name="close-circle" wrapped in TouchableOpacity
    // Let's locate the clear button. Inside searchContainer:
    // 1st Icon: search-outline
    // 2nd Icon: close-circle (only when search has content)
    // Let's verify that the clear button TouchableOpacity exists and trigger it.
    // In the ProvinciaSelector render:
    // Ionicons "search-outline", TextInput, and if search.length > 0: TouchableOpacity with Ionicons "close-circle"
    // So we can find the TouchableOpacity containing Ionicons close-circle
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    const clearButton = touchables.find(t => {
      try {
        const icon = t.findByType('Ionicons');
        return icon.props.name === 'close-circle';
      } catch (e) {
        return false;
      }
    });

    expect(clearButton).toBeTruthy();
    fireEvent.press(clearButton!);

    // Search query should be cleared and Buenos Aires should be visible again
    expect(searchInput.props.value).toBe('');
    expect(queryByText(PROVINCIA_LABEL[Provincia.BUENOS_AIRES])).toBeTruthy();
  });

  it('calls onSelect and onClose when selecting a province', () => {
    const { getByText } = render(<ProvinciaSelector {...defaultProps} />);

    const saltaItem = getByText(PROVINCIA_LABEL[Provincia.SALTA]);
    fireEvent.press(saltaItem);

    expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSelect).toHaveBeenCalledWith(Provincia.SALTA);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking close button in header', () => {
    const { UNSAFE_getAllByType } = render(<ProvinciaSelector {...defaultProps} />);

    // Header close button is a TouchableOpacity with Ionicons "close"
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    const closeBtn = touchables.find(t => {
      try {
        const icon = t.findByType('Ionicons');
        return icon.props.name === 'close';
      } catch (e) {
        return false;
      }
    });

    expect(closeBtn).toBeTruthy();
    fireEvent.press(closeBtn!);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Modal triggers onRequestClose', () => {
    const { UNSAFE_getByType } = render(<ProvinciaSelector {...defaultProps} />);

    const modal = UNSAFE_getByType('Modal');
    // Simulate Android back button / request close
    modal.props.onRequestClose();

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
