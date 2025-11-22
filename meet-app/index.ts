import 'expo-standard-web-crypto';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { Buffer } from 'buffer';
import { registerRootComponent } from 'expo';

import App from './App';

const globalScope = global as typeof globalThis;
if (!globalScope.Buffer) {
  globalScope.Buffer = Buffer;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
