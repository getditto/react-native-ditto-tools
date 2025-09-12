import React from 'react';
import { StatusBar } from 'react-native';
import DittoProvider from './src/providers/DittoProvider';
import { AppNavigator } from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <DittoProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
      <AppNavigator />
    </DittoProvider>
  );
}

export default App;
