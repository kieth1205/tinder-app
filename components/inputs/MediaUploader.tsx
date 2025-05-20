import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

// Định nghĩa các types
type MediaType = 'image' | 'video';

interface MediaItem {
    uri: string;
    type: MediaType;
    name: string;
    width?: number;
    height?: number;
    duration?: number;
    fileSize?: number;
}

interface MediaUploaderProps {
    maxFiles?: number;
    allowedTypes?: MediaType[];
    maxFileSize?: number; // in bytes
    onMediaSelected?: (selectedMedia: MediaItem[]) => void;
    columns?: number;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
    maxFiles = 6,
    allowedTypes = ['image', 'video'],
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    onMediaSelected,
    columns = 3,
}) => {
    const [media, setMedia] = useState<MediaItem[]>([]);

    const screenWidth = Dimensions.get('window').width;
    const itemMargin = 10;
    const itemWidth = (screenWidth - 40 - (itemMargin * (columns - 1))) / columns;
    const itemHeight = itemWidth * 1.5; // Tỷ lệ chiều cao/chiều rộng khoảng 1.5

    const requestPermissions = async (): Promise<boolean> => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
            alert('Cần cấp quyền truy cập camera và thư viện để tiếp tục!');
            return false;
        }
        return true;
    };

    const pickMedia = async (): Promise<void> => {
        if (media.length >= maxFiles) {
            alert(`Chỉ có thể tải lên tối đa ${maxFiles} file`);
            return;
        }

        const hasPermissions = await requestPermissions();
        if (!hasPermissions) return;

        // Hiển thị options cho người dùng chọn
        const options = ['Chọn ảnh', 'Chụp ảnh'];
        if (allowedTypes.includes('video')) {
            options.push('Chọn video', 'Quay video');
        }
        options.push('Hủy');

        // Hiển thị alert cho người dùng chọn option
        // Lưu ý: Trong thực tế, hãy sử dụng ActionSheet hoặc custom modal
        const selectedOption = await new Promise<string>((resolve) => {
            const select = (option: string) => {
                resolve(option);
            };
            Alert.alert(
                'Chọn nguồn media',
                '',
                options.map((option) => ({
                    text: option,
                    onPress: () => select(option),
                    style: option === 'Hủy' ? 'cancel' : 'default',
                })),
                { cancelable: true }
            );
        });

        // Xử lý lựa chọn của người dùng
        switch (selectedOption) {
            case 'Chọn ảnh':
                await pickImage();
                break;
            case 'Chụp ảnh':
                await takePhoto();
                break;
            case 'Chọn video':
                await pickVideo();
                break;
            case 'Quay video':
                await recordVideo();
                break;
            default:
                // Người dùng hủy
                break;
        }
    };

    const pickImage = async (): Promise<void> => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const newMedia: MediaItem = {
                uri: asset.uri,
                type: 'image',
                name: asset.uri.split('/').pop() || `image-${Date.now()}.jpg`,
                width: asset.width,
                height: asset.height,
                fileSize: asset.fileSize,
            };

            const updatedMedia = [...media, newMedia];
            setMedia(updatedMedia);
            
            // Notify parent component about selected media
            if (onMediaSelected) {
                onMediaSelected(updatedMedia);
            }
        }
    };

    const takePhoto = async (): Promise<void> => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const newMedia: MediaItem = {
                uri: asset.uri,
                type: 'image',
                name: asset.uri.split('/').pop() || `image-${Date.now()}.jpg`,
                width: asset.width,
                height: asset.height,
                fileSize: asset.fileSize,
            };

            const updatedMedia = [...media, newMedia];
            setMedia(updatedMedia);
            
            // Notify parent component about selected media
            if (onMediaSelected) {
                onMediaSelected(updatedMedia);
            }
        }
    };

    const pickVideo = async (): Promise<void> => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
            videoMaxDuration: 60,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const newMedia: MediaItem = {
                uri: asset.uri,
                type: 'video',
                name: asset.uri.split('/').pop() || `video-${Date.now()}.mp4`,
                width: asset.width,
                height: asset.height,
                duration: asset.duration as number,
                fileSize: asset.fileSize,
            };

            setMedia([...media, newMedia]);
        }
    };

    const recordVideo = async (): Promise<void> => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
            videoMaxDuration: 60,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const newMedia: MediaItem = {
                uri: asset.uri,
                type: 'video',
                name: asset.uri.split('/').pop() || `video-${Date.now()}.mp4`,
                width: asset.width,
                height: asset.height,
                duration: asset.duration as number,
                fileSize: asset.fileSize,
            };

            setMedia([...media, newMedia]);
        }
    };

    const removeMedia = (index: number): void => {
        const updatedMedia = [...media];
        updatedMedia.splice(index, 1);
        setMedia(updatedMedia);
        
        // Notify parent component about updated media
        if (onMediaSelected) {
            onMediaSelected(updatedMedia);
        }
    };



    const renderMediaItem = (item: MediaItem, index: number): React.ReactNode => {
        return (
            <View
                key={index}
                style={[
                    styles.mediaItem,
                    {
                        width: itemWidth,
                        height: itemHeight,
                        marginRight: (index + 1) % columns === 0 ? 0 : itemMargin
                    }
                ]}
            >
                {item.type === 'image' ? (
                    <Image source={{ uri: item.uri }} style={styles.mediaContent} />
                ) : (
                    <Video
                        source={{ uri: item.uri }}
                        style={styles.mediaContent}
                        useNativeControls
                    // resizeMode="cover"
                    />
                )}
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeMedia(index)}
                >
                    <MaterialIcons name="close" size={20} color="white" />
                </TouchableOpacity>

                {item.type === 'video' && (
                    <View style={styles.videoIndicator}>
                        <MaterialIcons name="play-arrow" size={24} color="white" />
                    </View>
                )}
            </View>
        );
    };

    // Tạo mảng cho các ô trống để hiển thị đúng định dạng lưới
    const renderGrid = () => {
        const items = [];

        // Thêm các media items đã có
        for (let i = 0; i < media.length; i++) {
            items.push(renderMediaItem(media[i], i));
        }

        // Thêm các ô trống với nút thêm cho đến khi đạt đủ maxFiles
        for (let i = media.length; i < maxFiles; i++) {
            items.push(
                <TouchableOpacity
                    key={`empty-${i}`}
                    style={[
                        styles.emptyItem,
                        {
                            width: itemWidth,
                            height: itemHeight,
                            marginRight: (i + 1) % columns === 0 ? 0 : itemMargin
                        }
                    ]}
                    onPress={pickMedia}
                >
                    <View style={styles.addButton}>
                        <MaterialIcons name="add" size={24} color="white" />
                    </View>
                </TouchableOpacity>
            );
        }

        return items;
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.mediaGrid}>
                    {renderGrid()}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mediaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    mediaItem: {
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 10,
        position: 'relative',
    },
    mediaContent: {
        width: '100%',
        height: '100%',
    },
    emptyItem: {
        borderRadius: 8,
        marginBottom: 10,
        position: 'relative',
        borderWidth: 2,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    addButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#ff4d4f',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    videoIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadButton: {
        backgroundColor: '#1890ff',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#91d5ff',
    },
    uploadButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
});

export { MediaUploader }