import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { SPACING, FONT_SIZE } from '../constants/layout';

const NotificationsScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            type: 'workout',
            title: 'Antrenman Zamanı',
            message: 'Üst vücut antrenmanınız 30 dakika içinde başlayacak.',
            time: '10 dk önce',
            read: false,
        },
        {
            id: '2',
            type: 'achievement',
            title: 'Yeni Başarı!',
            message: '7 günlük antrenman serinizi tamamladınız!',
            time: '2 saat önce',
            read: false,
        },
        {
            id: '3',
            type: 'goal',
            title: 'Hedef Tamamlandı',
            message: 'Günlük adım hedefinize ulaştınız!',
            time: '5 saat önce',
            read: true,
        },
    ]);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'workout':
                return 'dumbbell';
            case 'achievement':
                return 'trophy';
            case 'goal':
                return 'flag-checkered';
            default:
                return 'bell';
        }
    };

    const markAsRead = useCallback((id) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === id 
                    ? { ...notification, read: true }
                    : notification
            )
        );
    }, []);

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bildirimler</Text>
            <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setNotifications([])}
            >
                <Icon name="trash-can-outline" size={24} color={colors.danger} />
            </TouchableOpacity>
        </View>
    );

    const renderNotification = ({ item }) => (
        <TouchableOpacity 
            style={[
                styles.notificationItem,
                item.read && styles.readNotification
            ]}
            onPress={() => markAsRead(item.id)}
        >
            <View style={[
                styles.iconContainer,
                item.read && styles.readIconContainer
            ]}>
                <Icon 
                    name={getNotificationIcon(item.type)} 
                    size={24} 
                    color={item.read ? colors.textLight : colors.primary} 
                />
            </View>
            <View style={styles.notificationContent}>
                <Text style={[
                    styles.notificationTitle,
                    item.read && styles.readText
                ]}>
                    {item.title}
                </Text>
                <Text style={[
                    styles.notificationMessage,
                    item.read && styles.readText
                ]}>
                    {item.message}
                </Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Icon name="bell-off-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyStateText}>Bildiriminiz bulunmuyor</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
            {renderHeader()}
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
        color: colors.text,
    },
    backButton: {
        padding: SPACING.xs,
    },
    clearButton: {
        padding: SPACING.xs,
    },
    listContainer: {
        padding: SPACING.md,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: SPACING.md,
        borderRadius: 12,
        marginBottom: SPACING.sm,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    readNotification: {
        backgroundColor: colors.background,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    readIconContainer: {
        backgroundColor: colors.border + '30',
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: FONT_SIZE.sm,
        color: colors.text,
        marginBottom: 4,
    },
    notificationTime: {
        fontSize: FONT_SIZE.xs,
        color: colors.textLight,
    },
    readText: {
        color: colors.textLight,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        marginLeft: SPACING.sm,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.xl * 2,
    },
    emptyStateText: {
        fontSize: FONT_SIZE.md,
        color: colors.textLight,
        marginTop: SPACING.md,
    },
});

export default NotificationsScreen; 