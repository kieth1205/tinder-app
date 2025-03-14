import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

interface LocationData {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
    timestamp: number;
}

interface LocationTrackerProps {
    onLocationChange?: (location: LocationData) => void;
    watchPosition?: boolean;
    highAccuracy?: boolean;
    distanceInterval?: number;
    timeInterval?: number;
}

const LocationTracker: React.FC<LocationTrackerProps> = ({
    onLocationChange,
    watchPosition = false,
    highAccuracy = true,
    distanceInterval = 1, // meters
    timeInterval = 1000, // milliseconds
}) => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [watching, setWatching] = useState<boolean>(false);
    const [locationWatcher, setLocationWatcher] = useState<Location.LocationSubscription | null>(null);

    useEffect(() => {
        return () => {
            // Cleanup function to remove location watcher when component unmounts
            if (locationWatcher) {
                locationWatcher.remove();
            }
        };
    }, [locationWatcher]);

    const requestPermissions = async (): Promise<boolean> => {
        setLoading(true);
        setErrorMsg(null);

        try {
            const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

            if (foregroundStatus !== 'granted') {
                setErrorMsg('Quyền truy cập vị trí đã bị từ chối');
                setLoading(false);
                return false;
            }

            // If watch position is enabled, also request background permissions on iOS
            if (watchPosition && Platform.OS === 'ios') {
                const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
                if (backgroundStatus !== 'granted') {
                    // Just warn but don't prevent using foreground location
                    Alert.alert(
                        'Thông báo',
                        'Quyền truy cập vị trí trong nền không được cấp. Ứng dụng sẽ không thể theo dõi vị trí khi đang chạy trong nền.'
                    );
                }
            }

            return true;
        } catch (error) {
            setErrorMsg('Không thể yêu cầu quyền truy cập vị trí');
            setLoading(false);
            return false;
        }
    };

    const getLocation = async (): Promise<void> => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: highAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced,
            });

            const locationData: LocationData = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                altitude: currentLocation.coords.altitude,
                accuracy: currentLocation.coords.accuracy,
                altitudeAccuracy: currentLocation.coords.altitudeAccuracy,
                heading: currentLocation.coords.heading,
                speed: currentLocation.coords.speed,
                timestamp: currentLocation.timestamp,
            };

            setLocation(locationData);
            setErrorMsg(null);

            if (onLocationChange) {
                onLocationChange(locationData);
            }
        } catch (error) {
            setErrorMsg('Không thể lấy vị trí hiện tại');
        } finally {
            setLoading(false);
        }
    };

    const startWatching = async (): Promise<void> => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            // Stop any existing watcher
            if (locationWatcher) {
                locationWatcher.remove();
            }

            const watcher = await Location.watchPositionAsync(
                {
                    accuracy: highAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced,
                    distanceInterval,
                    timeInterval,
                },
                (newLocation: any) => {
                    const locationData: LocationData = {
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                        altitude: newLocation.coords.altitude,
                        accuracy: newLocation.coords.accuracy,
                        altitudeAccuracy: newLocation.coords.altitudeAccuracy,
                        heading: newLocation.coords.heading,
                        speed: newLocation.coords.speed,
                        timestamp: newLocation.timestamp,
                    };

                    setLocation(locationData);

                    if (onLocationChange) {
                        onLocationChange(locationData);
                    }
                }
            );

            setLocationWatcher(watcher);
            setWatching(true);
            setErrorMsg(null);
        } catch (error) {
            setErrorMsg('Không thể theo dõi vị trí');
            setWatching(false);
        } finally {
            setLoading(false);
        }
    };

    const stopWatching = (): void => {
        if (locationWatcher) {
            locationWatcher.remove();
            setLocationWatcher(null);
        }
        setWatching(false);
    };

    const renderLocationInfo = () => {
        if (!location) return null;

        return (
            <View style={styles.locationInfoContainer}>
                <Text style={styles.locationTitle}>Thông tin vị trí</Text>
                <View style={styles.coordContainer}>
                    <Text style={styles.coordLabel}>Vĩ độ:</Text>
                    <Text style={styles.coordValue}>{location.latitude.toFixed(6)}</Text>
                </View>
                <View style={styles.coordContainer}>
                    <Text style={styles.coordLabel}>Kinh độ:</Text>
                    <Text style={styles.coordValue}>{location.longitude.toFixed(6)}</Text>
                </View>
                {location.altitude !== null && (
                    <View style={styles.coordContainer}>
                        <Text style={styles.coordLabel}>Độ cao:</Text>
                        <Text style={styles.coordValue}>{location.altitude.toFixed(2)} m</Text>
                    </View>
                )}
                {location.accuracy !== null && (
                    <View style={styles.coordContainer}>
                        <Text style={styles.coordLabel}>Độ chính xác:</Text>
                        <Text style={styles.coordValue}>{location.accuracy.toFixed(2)} m</Text>
                    </View>
                )}
                {location.speed !== null && (
                    <View style={styles.coordContainer}>
                        <Text style={styles.coordLabel}>Tốc độ:</Text>
                        <Text style={styles.coordValue}>{(location.speed * 3.6).toFixed(2)} km/h</Text>
                    </View>
                )}
                <Text style={styles.timestamp}>
                    Cập nhật: {new Date(location.timestamp).toLocaleTimeString()}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                {!watching ? (
                    <>
                        <TouchableOpacity
                            style={[styles.button, styles.getLocationButton]}
                            onPress={getLocation}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <>
                                    <MaterialIcons name="my-location" size={24} color="white" />
                                    <Text style={styles.buttonText}>Lấy vị trí hiện tại</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {watchPosition && (
                            <TouchableOpacity
                                style={[styles.button, styles.watchButton]}
                                onPress={startWatching}
                                disabled={loading}
                            >
                                <MaterialIcons name="location-searching" size={24} color="white" />
                                <Text style={styles.buttonText}>Theo dõi vị trí</Text>
                            </TouchableOpacity>
                        )}
                    </>
                ) : (
                    <TouchableOpacity
                        style={[styles.button, styles.stopButton]}
                        onPress={stopWatching}
                    >
                        <MaterialIcons name="location-disabled" size={24} color="white" />
                        <Text style={styles.buttonText}>Dừng theo dõi</Text>
                    </TouchableOpacity>
                )}
            </View>

            {errorMsg ? (
                <View style={styles.errorContainer}>
                    <MaterialIcons name="error" size={24} color="#ff4d4f" />
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            ) : null}

            {renderLocationInfo()}

            {watching && (
                <View style={styles.watchingIndicator}>
                    <View style={styles.pulsingDot} />
                    <Text style={styles.watchingText}>Đang theo dõi vị trí...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
    },
    getLocationButton: {
        backgroundColor: '#1890ff',
        marginRight: 8,
    },
    watchButton: {
        backgroundColor: '#52c41a',
    },
    stopButton: {
        backgroundColor: '#ff4d4f',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff2f0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ffccc7',
    },
    errorText: {
        color: '#ff4d4f',
        marginLeft: 8,
        flex: 1,
    },
    locationInfoContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    locationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    coordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    coordLabel: {
        fontSize: 16,
        color: '#666',
        flex: 1,
    },
    coordValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        flex: 1,
        textAlign: 'right',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 8,
        textAlign: 'right',
    },
    watchingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulsingDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#52c41a',
        marginRight: 8,
    },
    watchingText: {
        color: '#52c41a',
        fontWeight: '500',
    },
});

export { LocationTracker };