import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef, RootStackParamList } from '../services/NavigationService';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { PeersListScreen } from '../screens/PeersListScreen';
import { SyncStatusScreen } from '../screens/SyncStatusScreen';
import { PermissionsScreen } from '../screens/PermissionsScreen';
import { DiskUsageScreen } from '../screens/DiskUsageScreen';
import { QueryEditorScreen } from '../screens/QueryEditorScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Ditto Tools',
          }}
        />
        <Stack.Screen
          name="PeersList"
          component={PeersListScreen}
          options={{
            title: 'Peers List',
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="SyncStatus"
          component={SyncStatusScreen}
          options={{
            title: 'Sync Status',
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="Permissions"
          component={PermissionsScreen}
          options={{
            title: 'Permissions Health',
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="DiskUsage"
          component={DiskUsageScreen}
          options={{
            title: 'Disk Usage',
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="QueryEditor"
          component={QueryEditorScreen}
          options={{
            title: 'Query Editor',
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
