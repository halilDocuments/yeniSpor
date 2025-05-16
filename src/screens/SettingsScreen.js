import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    SafeAreaView,
    StatusBar,
    Platform,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { SPACING, FONT_SIZE } from '../constants/layout';

const SettingsScreen = ({ navigation }) => {
    const [settings, setSettings] = React.useState({
        notifications: true,
        darkMode: false,
        sound: true,
        vibration: true,
        language: 'Türkçe',
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const Header = () => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ayarlar</Text>
        </View>
    );

    const SettingItem = ({ icon, title, value, onToggle, type = 'switch' }) => (
        <TouchableOpacity 
            style={styles.settingItem}
            onPress={type === 'select' ? onToggle : null}
        >
            <View style={styles.settingItemLeft}>
                <Icon name={icon} size={24} color={colors.primary} />
                <Text style={styles.settingItemTitle}>{title}</Text>
            </View>
            {type === 'switch' ? (
                <Switch
                    value={value}
                    onValueChange={onToggle}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.white}
                />
            ) : (
                <View style={styles.settingItemRight}>
                    <Text style={styles.settingItemValue}>{value}</Text>
                    <Icon name="chevron-right" size={24} color={colors.textLight} />
                </View>
            )}
        </TouchableOpacity>
    );

    const Section = ({ title, children }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <Section title="Genel">
                    <SettingItem
                        icon="bell-outline"
                        title="Bildirimler"
                        value={settings.notifications}
                        onToggle={() => toggleSetting('notifications')}
                    />
                    <SettingItem
                        icon="theme-light-dark"
                        title="Karanlık Mod"
                        value={settings.darkMode}
                        onToggle={() => toggleSetting('darkMode')}
                    />
                </Section>
                <Section title="Ses ve Titreşim">
                    <SettingItem
                        icon="volume-high"
                        title="Ses"
                        value={settings.sound}
                        onToggle={() => toggleSetting('sound')}
                    />
                    <SettingItem
                        icon="vibrate"
                        title="Titreşim"
                        value={settings.vibration}
                        onToggle={() => toggleSetting('vibration')}
                    />
                </Section>
                <Section title="Dil ve Bölge">
                    <SettingItem
                        icon="translate"
                        title="Dil"
                        value={settings.language}
                        onToggle={() => Alert.alert('Dil seçimi yakında eklenecek')}
                        type="select"
                    />
                </Section>
                <Section title="Hesap">
                    <TouchableOpacity 
                        style={styles.settingItem}
                        onPress={() => Alert.alert('Çıkış yapıldı', 'Uygulamadan çıkış yapıldı.')}
                    >
                        <View style={styles.settingItemLeft}>
                            <Icon name="logout" size={24} color={colors.error} />
                            <Text style={[styles.settingItemTitle, { color: colors.error }]}>
                                Çıkış Yap
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Section>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginLeft: SPACING.md,
    },
    backButton: {
        padding: SPACING.xs,
    },
    section: {
        padding: SPACING.md,
        backgroundColor: colors.white,
        marginHorizontal: SPACING.md,
        marginTop: SPACING.md,
        borderRadius: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
        marginBottom: SPACING.md,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    settingItemTitle: {
        fontSize: FONT_SIZE.md,
        color: colors.text,
    },
    settingItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    settingItemValue: {
        fontSize: FONT_SIZE.md,
        color: colors.textLight,
    },
});

export default SettingsScreen; 