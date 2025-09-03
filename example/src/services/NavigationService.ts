import { createNavigationContainerRef } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  PeersList: undefined;
  SyncStatus: undefined;
  Permissions: undefined;
  DiskUsage: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}
