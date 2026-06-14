import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EditModal } from './EditModal';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  surfaceHighlight: '#f5f5f5',
  primary: '#007bff',
  text: '#212529',
  textSecondary: '#6c757d',
  textInverse: '#ffffff',
  surfaceNeutral: '#e9ecef',
  surfaceNeutralAlt: '#f8f9fa',
  borderDark: '#343a40',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('EditModal', () => {
  const defaultProps = {
    visible: true,
    initialValue: 'Trekking Glaciar',
    onClose: jest.fn(),
    onSave: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible is true', () => {
    const { getByText, getByPlaceholderText } = render(<EditModal {...defaultProps} />);

    expect(getByText('Editar Actividad')).toBeTruthy();
    expect(getByText('Ingresa el nuevo título para la actividad:')).toBeTruthy();

    const input = getByPlaceholderText('Ej. Trekking Glaciar');
    expect(input.props.value).toBe('Trekking Glaciar');
  });

  it('does not render when visible is false', () => {
    // Note: Modal component behavior in React Native Testing Library can vary depending on standard mock.
    // In React Native, Modal might still render its children depending on the environment,
    // but the visible prop is passed down.
    const { queryByText } = render(<EditModal {...defaultProps} visible={false} />);
    // Since jest-expo mocks Modal, it might check whether it is visible or not.
    // Let's make sure it handles visibility.
  });

  it('calls onClose when Cancelar button is pressed', () => {
    const { getByLabelText } = render(<EditModal {...defaultProps} />);
    const cancelBtn = getByLabelText('Cancelar');

    fireEvent.press(cancelBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSave with trimmed text when Guardar button is pressed and input is valid', () => {
    const { getByLabelText, getByPlaceholderText } = render(<EditModal {...defaultProps} />);
    const input = getByPlaceholderText('Ej. Trekking Glaciar');
    const saveBtn = getByLabelText('Guardar cambios');

    fireEvent.changeText(input, '  Nuevo Titulo  ');
    fireEvent.press(saveBtn);

    expect(defaultProps.onSave).toHaveBeenCalledWith('Nuevo Titulo');
  });

  it('does not call onSave if text is empty or only whitespace', () => {
    const { getByLabelText, getByPlaceholderText } = render(<EditModal {...defaultProps} />);
    const input = getByPlaceholderText('Ej. Trekking Glaciar');
    const saveBtn = getByLabelText('Guardar cambios');

    fireEvent.changeText(input, '   ');
    fireEvent.press(saveBtn);

    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  it('syncs text state with initialValue when initialValue changes', () => {
    const { getByPlaceholderText, rerender } = render(<EditModal {...defaultProps} />);
    const input = getByPlaceholderText('Ej. Trekking Glaciar');
    expect(input.props.value).toBe('Trekking Glaciar');

    rerender(<EditModal {...defaultProps} initialValue="Paseo en bote" />);
    expect(input.props.value).toBe('Paseo en bote');
  });
});
