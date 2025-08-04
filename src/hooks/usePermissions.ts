import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Permission } from 'react-native';

export const useDittoPermissions = () => {
  console.log('useDittoPermissions called');
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<Record<string, string>>({});

  const requestPermissions = async () => {
    if (Platform.OS !== 'android') {
      setPermissionsGranted(true);
      return true;
    }

    try {
      const permissions: Permission[] = [];
      
      // These permissions are only available on Android 12+ (API 31+)
      if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
        permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      }
      if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE) {
        permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE);
      }
      if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN) {
        permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
      }
      if (PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES) {
        permissions.push(PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES);
      }

      if (permissions.length === 0) {
        // For older Android versions, no runtime permissions needed
        setPermissionsGranted(true);
        return true;
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      const allGranted = Object.values(granted).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );

      setPermissionStatus(granted);
      setPermissionsGranted(allGranted);

      Object.entries(granted).forEach(([permission, result]) => {
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          console.log(`${permission} granted`);
        } else {
          console.log(`${permission} denied`);
        }
      });

      return allGranted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setPermissionsGranted(false);
      return false;
    }
  };

  useEffect(() => {
    void requestPermissions();
  }, []);

  return {
    permissionsGranted,
    permissionStatus,
    requestPermissions,
  };
};