import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { SPACING, FONT_SIZE } from '../constants/layout';

const ProfileScreen = ({ route, navigation }) => {
    const [userData, setUserData] = useState({
        name: 'Halil Harman',
        email: 'halil@example.com',
        age: 28,
        height: 180,
        weight: 75,
        goals: ['Kas Kazanımı', 'Güç Artışı'],
        achievements: [
            { id: 1, title: '30 Gün Streak', icon: 'fire' },
            { id: 2, title: '100 Antrenman', icon: 'dumbbell' },
            { id: 3, title: '50kg Bench Press', icon: 'weight-lifter' },
        ],
        stats: {
            workouts: 87,
            calories: 24500,
            hours: 65,
        }
    });

    const ProfileHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerRight}>
                <TouchableOpacity 
                    style={styles.settingsButton}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Icon name="cog" size={24} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <Icon name="pencil" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const ProfileInfo = () => (
        <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
                <Image source={require('../../assets/avatarresim.png')} style={styles.avatar} />
                <TouchableOpacity style={styles.editAvatarButton}>
                    <Icon name="camera" size={20} color={colors.white} />
                </TouchableOpacity>
            </View>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.email}>{userData.email}</Text>
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{userData.stats.workouts}</Text>
                    <Text style={styles.statLabel}>Antrenman</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{userData.stats.calories}</Text>
                    <Text style={styles.statLabel}>Kalori</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{userData.stats.hours}</Text>
                    <Text style={styles.statLabel}>Saat</Text>
                </View>
            </View>
        </View>
    );

    const PersonalInfo = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Icon name="calendar" size={20} color={colors.primary} />
                    <Text style={styles.infoLabel}>Yaş</Text>
                    <Text style={styles.infoValue}>{userData.age}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Icon name="human-male-height" size={20} color={colors.primary} />
                    <Text style={styles.infoLabel}>Boy</Text>
                    <Text style={styles.infoValue}>{userData.height} cm</Text>
                </View>
                <View style={styles.infoItem}>
                    <Icon name="scale-bathroom" size={20} color={colors.primary} />
                    <Text style={styles.infoLabel}>Kilo</Text>
                    <Text style={styles.infoValue}>{userData.weight} kg</Text>
                </View>
            </View>
        </View>
    );

    const Goals = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hedefler</Text>
            <View style={styles.goalsContainer}>
                {userData.goals.map((goal, index) => (
                    <View key={index} style={styles.goalItem}>
                        <Icon name="target" size={20} color={colors.primary} />
                        <Text style={styles.goalText}>{goal}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const Achievements = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Başarılar</Text>
            <View style={styles.achievementsContainer}>
                {userData.achievements.map((achievement) => (
                    <View key={achievement.id} style={styles.achievementItem}>
                        <Icon name={achievement.icon} size={24} color={colors.primary} />
                        <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <ProfileHeader />
                <ProfileInfo />
                <PersonalInfo />
                <Goals />
                <Achievements />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary + '15',
    },
    backButton: {
        padding: SPACING.xs,
    },
    editButton: {
        padding: SPACING.xs,
    },
    profileInfo: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: SPACING.md,
    },
    editAvatarButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: colors.primary,
        padding: SPACING.xs,
        borderRadius: 15,
    },
    name: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '600',
        color: colors.text,
        marginBottom: SPACING.xs,
    },
    email: {
        fontSize: FONT_SIZE.md,
        color: colors.textLight,
        marginBottom: SPACING.md,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: SPACING.xl,
        marginTop: SPACING.md,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
        color: colors.text,
    },
    statLabel: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        marginTop: SPACING.xs,
    },
    section: {
        padding: SPACING.md,
        backgroundColor: colors.white,
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.md,
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
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoItem: {
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        marginTop: SPACING.xs,
    },
    infoValue: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
        marginTop: SPACING.xs,
    },
    goalsContainer: {
        gap: SPACING.sm,
    },
    goalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary + '15',
        padding: SPACING.sm,
        borderRadius: 12,
    },
    goalText: {
        marginLeft: SPACING.sm,
        fontSize: FONT_SIZE.md,
        color: colors.text,
    },
    achievementsContainer: {
        gap: SPACING.sm,
    },
    achievementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary + '15',
        padding: SPACING.sm,
        borderRadius: 12,
    },
    achievementTitle: {
        marginLeft: SPACING.sm,
        fontSize: FONT_SIZE.md,
        color: colors.text,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    settingsButton: {
        padding: SPACING.xs,
    },
});

export default ProfileScreen; 