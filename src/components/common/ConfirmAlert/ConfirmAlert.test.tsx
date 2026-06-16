import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmAlert } from './ConfirmAlert';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  text: '#212529',
  textSecondary: '#6c757d',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('ConfirmAlert', () => {
  const defaultProps = {
    visible: true,
    title: '¿Confirmar acción?',
    message: 'Esta acción no se puede deshacer.',
    cancelText: 'Cancelar',
    confirmText: 'Aceptar',
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all title and message texts when visible', () => {
    const { getByText } = render(<ConfirmAlert {...defaultProps} />);
    expect(getByText('¿Confirmar acción?')).toBeTruthy();
    expect(getByText('Esta acción no se puede deshacer.')).toBeTruthy();
    expect(getByText('Cancelar')).toBeTruthy();
    expect(getByText('Aceptar')).toBeTruthy();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const { getByText } = render(<ConfirmAlert {...defaultProps} />);
    const cancelBtn = getByText('Cancelar');
    fireEvent.press(cancelBtn);
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const { getByText } = render(<ConfirmAlert {...defaultProps} />);
    const confirmBtn = getByText('Aceptar');
    fireEvent.press(confirmBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });
});
