import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CalendarioViaje } from './CalendarioViaje';

// Mock react-native-calendars
jest.mock('react-native-calendars', () => {
  const { View, Button, Text } = require('react-native');
  return {
    Calendar: ({ onDayPress, markedDates }: any) => (
      <View testID="mock-calendar">
        <Text>Mock Calendar</Text>
        {/* Helper buttons to trigger state changes in the parent component */}
        <Button
          title="Select Day 1 (15)"
          onPress={() => onDayPress({ dateString: '2026-06-15' })}
        />
        <Button
          title="Select Day 2 (20)"
          onPress={() => onDayPress({ dateString: '2026-06-20' })}
        />
        <Button
          title="Select Day 3 (10)"
          onPress={() => onDayPress({ dateString: '2026-06-10' })}
        />
        <Button
          title="Select Day 4 (15)"
          onPress={() => onDayPress({ dateString: '2026-06-15' })}
        />
      </View>
    ),
    LocaleConfig: {
      locales: {
        es: {}
      },
      defaultLocale: '',
    },
  };
});

describe('CalendarioViaje', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to find the parent button component containing the onPress handler
  const getButtonFromText = (renderResult: any, text: string) => {
    let node = renderResult.getByText(text);
    while (node && node.props?.onPress === undefined) {
      node = node.parent;
    }
    return node;
  };

  it('renders correctly when visible', () => {
    const { getByText, getByTestId } = render(<CalendarioViaje {...defaultProps} />);

    expect(getByText('Calendario de Viaje')).toBeTruthy();
    expect(getByTestId('mock-calendar')).toBeTruthy();
  });

  it('handles selecting date range correctly', () => {
    const renderResult = render(<CalendarioViaje {...defaultProps} />);
    const selectDay1Btn = renderResult.getByText('Select Day 1 (15)');
    const selectDay2Btn = renderResult.getByText('Select Day 2 (20)');

    // Initially confirm button is disabled because no dates are chosen
    expect(getButtonFromText(renderResult, 'Confirmar Fechas').props.disabled).toBe(true);

    // Select start date
    fireEvent.press(selectDay1Btn);
    expect(getButtonFromText(renderResult, 'Confirmar Fechas').props.disabled).toBe(true);

    // Select end date
    fireEvent.press(selectDay2Btn);
    
    // Now confirm button should be enabled
    const confirmBtn = getButtonFromText(renderResult, 'Confirmar Fechas');
    expect(confirmBtn.props.disabled).toBeFalsy();

    // Confirm range
    fireEvent.press(confirmBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalledWith('2026-06-15', '2026-06-20');
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('handles selecting an earlier date to swap start and end', () => {
    const renderResult = render(<CalendarioViaje {...defaultProps} />);
    const selectDay1Btn = renderResult.getByText('Select Day 1 (15)');
    const selectDay3Btn = renderResult.getByText('Select Day 3 (10)'); // earlier than day 1

    // Select start date: 15
    fireEvent.press(selectDay1Btn);

    // Select earlier date: 10. The code should set startDate to 10 and endDate to 15.
    fireEvent.press(selectDay3Btn);

    // Confirm range
    const confirmBtn = getButtonFromText(renderResult, 'Confirmar Fechas');
    expect(confirmBtn.props.disabled).toBeFalsy();
    fireEvent.press(confirmBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalledWith('2026-06-10', '2026-06-15');
  });

  it('resets start date when selected day matches start date', () => {
    const renderResult = render(<CalendarioViaje {...defaultProps} />);
    const selectDay1Btn = renderResult.getByText('Select Day 1 (15)');
    const selectDay4Btn = renderResult.getByText('Select Day 4 (15)'); // same as day 1

    // Select start date: 15
    fireEvent.press(selectDay1Btn);

    // Select start date again: 15. Code should set startDate to null.
    fireEvent.press(selectDay4Btn);

    // Select end date (should become the new start date)
    const selectDay2Btn = renderResult.getByText('Select Day 2 (20)');
    fireEvent.press(selectDay2Btn);

    // Confirm should still be disabled because only start date is selected
    expect(getButtonFromText(renderResult, 'Confirmar Fechas').props.disabled).toBe(true);
  });

  it('restores initial values on cancel/close', () => {
    const renderResult = render(
      <CalendarioViaje
        {...defaultProps}
        initialStart="2026-06-01"
        initialEnd="2026-06-05"
      />
    );

    // Find the close icon container (which contains name="close")
    // Or we can find by parent of close icon.
    // In CalendarioViaje.tsx:
    // <TouchableOpacity onPress={handleClose} ...>
    //   <Ionicons name="close" ... />
    // </TouchableOpacity>
    // Since close icon is rendered inside a TouchableOpacity, let's find the TouchableOpacity that calls handleClose or parent.
    // Let's traverse up from close icon:
    const closeIcon = renderResult.UNSAFE_getByProps({ name: 'close' });
    let closeBtn = closeIcon;
    while (closeBtn && closeBtn.props?.onPress === undefined) {
      closeBtn = closeBtn.parent;
    }

    fireEvent.press(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
