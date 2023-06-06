import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import Spending from './components/spending';
import Statistics from './components/statistics';
import Settings from './components/settings';

export default function App() {
  const [getMode, setMode] = useState("spending");
  return (
    <View style={styles.container}>
      <Spending
        getMode={getMode}
        setMode={setMode}
      />
      <Statistics
        getMode={getMode}
        setMode={setMode}
      />
      <Settings
        getMode={getMode}
        setMode={setMode}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
