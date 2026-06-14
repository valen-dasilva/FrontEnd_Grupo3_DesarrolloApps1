import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EditableActivityCard } from './EditableActivityCard';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  surfaceHighlight: '#f5f5f5',
  primary: '#007bff',
  text: '#212529',
  textSecondary: '#6c757d',
  danger: '#dc3545',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('EditableActivityCard', () => {
  const defaultProps = {
    time: '09:00',
    title: 'Visita Museo',
    description: 'Recorrido por las salas de arte moderno',
    location: 'Museo de Arte',
    onEditPress: jest.fn(),
    onDeletePress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields correctly with formatted time', () => {
    const { getByText } = render(<EditableActivityCard {...defaultProps} />);

    expect(getByText('09:00')).toBeTruthy();
    expect(getByText('Visita Museo')).toBeTruthy();
    expect(getByText('Recorrido por las salas de arte moderno')).toBeTruthy();
    expect(getByText('Museo de Arte')).toBeTruthy();
  });

  it('triggers onEditPress when Edit button is clicked', () => {
    const { getByLabelText } = render(<EditableActivityCard {...defaultProps} />);
    const editBtn = getByLabelText('Editar actividad');

    fireEvent.press(editBtn);
    expect(defaultProps.onEditPress).toHaveBeenCalledTimes(1);
  });

  it('triggers onDeletePress when Delete button is clicked', () => {
    const { getByLabelText } = render(<EditableActivityCard {...defaultProps} />);
    const deleteBtn = getByLabelText('Eliminar actividad');

    fireEvent.press(deleteBtn);
    expect(defaultProps.onDeletePress).toHaveBeenCalledTimes(1);
  });
});
