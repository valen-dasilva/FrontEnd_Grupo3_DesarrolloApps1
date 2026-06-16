import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BottomNavBar } from './BottomNavBar';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  button_gray: '#6c757d',
  surfaceHighlight: '#f5f5f5',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('BottomNavBar', () => {
  it('renders all tabs correctly', () => {
    const { getByText } = render(<BottomNavBar activeTab="Favoritos" />);
    expect(getByText('Inicio')).toBeTruthy();
    expect(getByText('Explorar')).toBeTruthy();
    expect(getByText('Favoritos')).toBeTruthy();
    expect(getByText('Perfil')).toBeTruthy();
  });

  it('marks the active tab as selected in accessibilityState', () => {
    const { getAllByRole } = render(
      <BottomNavBar activeTab="Favoritos" />
    );

    // Let's query tab items by accessibility role
    const tabs = getAllByRole('tab');
    expect(tabs.length).toBe(4);

    // Find the one for Favoritos
    const favoritesTab = tabs.find(
      (tab) =>
        tab.props.accessibilityState &&
        tab.props.accessibilityState.selected === true
    );
    expect(favoritesTab).toBeTruthy();
  });

  it('triggers onTabPress when a tab is clicked', () => {
    const onTabPress = jest.fn();
    const { getByText } = render(
      <BottomNavBar activeTab="Favoritos" onTabPress={onTabPress} />
    );

    const exploreTab = getByText('Explorar');
    fireEvent.press(exploreTab);
    expect(onTabPress).toHaveBeenCalledWith('Explorar');
  });
});
