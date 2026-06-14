// Mock the specific React Native component implementation paths to bypass the prototype.constructor crashes
jest.mock('react-native/Libraries/Text/Text', () => {
  const React = require('react');
  const Component = React.forwardRef((props, ref) => {
    return React.createElement('Text', { ...props, ref }, props.children);
  });
  Component.displayName = 'Text';
  return { __esModule: true, default: Component };
});

jest.mock('react-native/Libraries/Components/TextInput/TextInput', () => {
  const React = require('react');
  const Component = React.forwardRef((props, ref) => {
    return React.createElement('TextInput', { ...props, ref }, props.children);
  });
  Component.displayName = 'TextInput';
  return { __esModule: true, default: Component };
});

jest.mock('react-native/Libraries/Modal/Modal', () => {
  const React = require('react');
  const Component = React.forwardRef((props, ref) => {
    return React.createElement('Modal', { ...props, ref }, props.children);
  });
  Component.displayName = 'Modal';
  return { __esModule: true, default: Component };
});

jest.mock('react-native/Libraries/Components/ScrollView/ScrollView', () => {
  const React = require('react');
  const Component = React.forwardRef((props, ref) => {
    return React.createElement('ScrollView', { ...props, ref }, props.children);
  });
  Component.displayName = 'ScrollView';
  return { __esModule: true, default: Component };
});

jest.mock('react-native/Libraries/Components/ActivityIndicator/ActivityIndicator', () => {
  const React = require('react');
  const Component = React.forwardRef((props, ref) => {
    return React.createElement('ActivityIndicator', { ...props, ref }, props.children);
  });
  Component.displayName = 'ActivityIndicator';
  return { __esModule: true, default: Component };
});

jest.mock('react-native/Libraries/Image/Image', () => {
  const React = require('react');
  const Component = React.forwardRef((props, ref) => {
    return React.createElement('Image', { ...props, ref }, props.children);
  });
  Component.displayName = 'Image';
  return { __esModule: true, default: Component };
});

// Mock expo vector icons to prevent loading expo-font in Jest environment
jest.mock('@expo/vector-icons/MaterialIcons', () => {
  const React = require('react');
  const Component = React.forwardRef((props, ref) => {
    return React.createElement('MaterialIcons', { ...props, ref }, props.children);
  });
  Component.displayName = 'MaterialIcons';
  return Component;
});

// Mock the main @expo/vector-icons package
jest.mock('@expo/vector-icons', () => {
  const React = require('react');

  const createMockIcon = (name) => {
    const Component = React.forwardRef((props, ref) => {
      return React.createElement(name, { ...props, ref }, props.children);
    });
    Component.displayName = name;
    return Component;
  };

  return {
    Ionicons: createMockIcon('Ionicons'),
    MaterialCommunityIcons: createMockIcon('MaterialCommunityIcons'),
    MaterialIcons: createMockIcon('MaterialIcons'),
  };
});
