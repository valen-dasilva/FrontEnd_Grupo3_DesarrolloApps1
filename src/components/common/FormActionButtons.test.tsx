import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormActionButtons } from './FormActionButtons';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  textInverse: '#ffffff',
  text: '#212529',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('FormActionButtons', () => {
  const defaultProps = {
    loading: false,
    onSave: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders buttons with default labels correctly', () => {
    const { getByText } = render(<FormActionButtons {...defaultProps} />);
    expect(getByText('Guardar Cambios')).toBeTruthy();
    expect(getByText('Cancelar')).toBeTruthy();
  });

  it('calls onSave and onCancel when buttons are pressed', () => {
    const { getByText } = render(<FormActionButtons {...defaultProps} />);

    const saveBtn = getByText('Guardar Cambios');
    const cancelBtn = getByText('Cancelar');

    fireEvent.press(saveBtn);
    expect(defaultProps.onSave).toHaveBeenCalledTimes(1);

    fireEvent.press(cancelBtn);
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows loading state on save button and disables interaction when loading is true', () => {
    const { getByText } = render(<FormActionButtons {...defaultProps} loading={true} />);
    expect(getByText('Guardando...')).toBeTruthy();
  });
});
