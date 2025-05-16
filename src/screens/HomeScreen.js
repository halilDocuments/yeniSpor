import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform, Dimensions, Image, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { SPACING, FONT_SIZE, ICON_SIZE } from '../constants/layout';
import { MENU_ITEMS } from '../types';
import PRTable from '../components/PRTable';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [userData, setUserData] = useState({
        id: '1',
        name: 'Halil Harman',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        streak: 5,
        points: 1250,
        level: 8,
        notifications: 2,
        dailyGoals: {
            calories: { current: 1200, target: 2000 },
            water: { current: 1.5, target: 2.5 },
            steps: { current: 6500, target: 10000 }
        },
        nextWorkout: {
            type: 'Üst Vücut',
            time: '09:00',
            duration: '45 dk',
            exercises: 6,
            progress: 0,
            day: 1
        }
    });

    const [weeklyProgram, setWeeklyProgram] = useState([
        {
            id: 1,
            day: 'Pazartesi',
            type: 'Üst Vücut',
            duration: '45 dk',
            exercises: 6,
            progress: 0,
            status: 'today'
        },
        {
            id: 2,
            day: 'Salı',
            type: 'Alt Vücut',
            duration: '50 dk',
            exercises: 5,
            progress: 0,
            status: 'upcoming'
        },
        {
            id: 3,
            day: 'Çarşamba',
            type: 'Tam Vücut',
            duration: '60 dk',
            exercises: 8,
            progress: 0,
            status: 'upcoming'
        },
        {
            id: 4,
            day: 'Perşembe',
            type: 'Göğüs & Sırt',
            duration: '45 dk',
            exercises: 6,
            progress: 0,
            status: 'upcoming'
        },
        {
            id: 5,
            day: 'Cuma',
            type: 'Kol & Omuz',
            duration: '40 dk',
            exercises: 5,
            progress: 0,
            status: 'upcoming'
        },
        {
            id: 6,
            day: 'Cumartesi',
            type: 'Bacak',
            duration: '55 dk',
            exercises: 7,
            progress: 0,
            status: 'upcoming'
        },
        {
            id: 7,
            day: 'Pazar',
            type: 'Esneme & Yoga',
            duration: '30 dk',
            exercises: 4,
            progress: 0,
            status: 'upcoming'
        }
    ]);

    // Sayfa her odaklandığında verileri güncelle
    useFocusEffect(
        useCallback(() => {
            fetchUserData();
            return () => {
                // Cleanup
            };
        }, [])
    );

    const fetchUserData = async () => {
        try {
            // API çağrısı yapılacak
            // const response = await api.getUserData();
            // setUserData(response.data);
            console.log('Veriler başarıyla güncellendi');
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            Alert.alert(
                'Hata',
                'Veriler güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'
            );
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchUserData();
        } catch (error) {
            console.error('Yenileme hatası:', error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    const Header = useCallback(() => {
        const [greeting, setGreeting] = useState('');

        useEffect(() => {
            const hour = new Date().getHours();
            if (hour < 12) setGreeting('Günaydın');
            else if (hour < 18) setGreeting('İyi Günler');
            else setGreeting('İyi Akşamlar');
        }, []);

        return (
            <View style={styles.header}>
                <View style={styles.profileSection}>
                    <TouchableOpacity 
                        style={styles.profileImageContainer}
                        onPress={() => navigation.navigate('Profile', { userId: userData.id })}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        {/* <Icon name="account-circle" size={ICON_SIZE.lg} color={colors.primary} /> */}
                        <Image source={require('../../assets/avatarresim.png')} style={styles.avatar} />
                    </TouchableOpacity>
                    <View style={styles.greeting}>
                        <Text style={styles.greetingText}>{greeting}</Text>
                        <Text style={styles.username}>{userData.name}</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.notificationButton}
                        onPress={() => navigation.navigate('Notifications')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Icon name="bell-outline" size={30} color={colors.text} />
                        {userData.notifications > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationCount}>
                                    {userData.notifications}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={styles.settingsButton}
                    onPress={() => navigation.navigate('Settings')}
                >
                        <Icon name="cog" size={30} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }, [userData, navigation]);

    const WeeklyProgress = useCallback(() => (
        <View style={styles.weeklyProgressCard}> 
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Haftalık İlerleme</Text>
            </View>
            <PRTable />
        </View>
    ), []);

    const DailyGoalCard = useCallback(() => (
        <TouchableOpacity 
            style={styles.dailyGoalCard}
            onPress={() => navigation.navigate('DailyGoals', { goals: userData.dailyGoals })}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Günlük Hedefler</Text>
                <Icon name="chevron-right" size={24} color={colors.textLight} />
            </View>
            <View style={styles.goalProgress}>
                <View style={styles.goalItem}>
                    <Icon name="fire" size={24} color={colors.primary} />
                    <Text style={styles.goalValue}>
                        {`${userData.dailyGoals.calories.current}/${userData.dailyGoals.calories.target}`}
                    </Text>
                    <Text style={styles.goalLabel}>Kalori</Text>
                </View>
                <View style={styles.goalItem}>
                    <Icon name="water" size={24} color={colors.primary} />
                    <Text style={styles.goalValue}>
                        {`${userData.dailyGoals.water.current}/${userData.dailyGoals.water.target}L`}
                    </Text>
                    <Text style={styles.goalLabel}>Su</Text>
                </View>
                <View style={styles.goalItem}>
                    <Icon name="walk" size={24} color={colors.primary} />
                    <Text style={styles.goalValue}>
                        {`${userData.dailyGoals.steps.current}/${userData.dailyGoals.steps.target}`}
                    </Text>
                    <Text style={styles.goalLabel}>Adım</Text>
                </View>
            </View>
        </TouchableOpacity>
    ), [userData.dailyGoals, navigation]);

    const getWorkoutIcon = (type) => {
        switch (type) {
            case 'Üst Vücut':
                return 'arm-flex';
            case 'Alt Vücut':
                return 'leg';
            case 'Tam Vücut':
                return 'human-handsup';
            case 'Göğüs & Sırt':
                return 'chest';
            case 'Kol & Omuz':
                return 'arm-flex-outline';
            case 'Bacak':
                return 'leg-outline';
            case 'Esneme & Yoga':
                return 'yoga';
            default:
                return 'dumbbell';
        }
    };

    const getWorkoutColor = (type) => {
        switch (type) {
            case 'Üst Vücut':
                return '#FF6B6B';
            case 'Alt Vücut':
                return '#4ECDC4';
            case 'Tam Vücut':
                return '#45B7D1';
            case 'Göğüs & Sırt':
                return '#96CEB4';
            case 'Kol & Omuz':
                return '#FFEEAD';
            case 'Bacak':
                return '#D4A5A5';
            case 'Esneme & Yoga':
                return '#9B59B6';
            default:
                return colors.primary;
        }
    };

    const renderWeeklyProgram = () => (
        <View style={styles.weeklyProgramContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Haftalık Program</Text>
                <TouchableOpacity 
                    style={styles.seeAllButton}
                    onPress={() => navigation.navigate('Workout')}
                >
                    <Text style={styles.seeAllText}>Tümünü Gör</Text>
                    <Icon name="chevron-right" size={16} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.weeklyProgramScroll}
            >
                {weeklyProgram.map((workout) => {
                    const workoutColor = getWorkoutColor(workout.type);
                    return (
                        <TouchableOpacity
                            key={workout.id}
                            style={[
                                styles.workoutCard,
                                workout.status === 'today' && styles.todayWorkoutCard,
                                { borderLeftWidth: 4, borderLeftColor: workoutColor }
                            ]}
                            onPress={() => navigation.navigate('Workout', { workoutId: workout.id })}
                        >
                            <View style={styles.workoutCardHeader}>
                                <Text style={[
                                    styles.workoutDay,
                                    workout.status === 'today' && styles.todayWorkoutDay
                                ]}>
                                    {workout.day}
                                </Text>
                                {workout.status === 'today' && (
                                    <View style={[styles.todayBadge, { backgroundColor: workoutColor + '15' }]}>
                                        <Text style={[styles.todayBadgeText, { color: workoutColor }]}>Bugün</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.workoutCardContent}>
                                <View style={[styles.iconContainer, { backgroundColor: workoutColor + '15' }]}>
                                    <Icon 
                                        name={getWorkoutIcon(workout.type)} 
                                        size={24} 
                                        color={workoutColor} 
                                    />
                                </View>
                                <Text style={[
                                    styles.workoutType,
                                    workout.status === 'today' && styles.todayWorkoutType
                                ]}>
                                    {workout.type}
                                </Text>
                            </View>
                            <View style={styles.workoutCardFooter}>
                                <View style={styles.workoutInfo}>
                                    <Icon name="clock-outline" size={14} color={colors.textLight} />
                                    <Text style={styles.workoutInfoText}>{workout.duration}</Text>
                                </View>
                                <View style={styles.workoutInfo}>
                                    <Icon name="dumbbell" size={14} color={colors.textLight} />
                                    <Text style={styles.workoutInfoText}>{workout.exercises} egzersiz</Text>
                                </View>
                            </View>
                            {workout.status === 'today' && (
                                <View style={styles.progressContainer}>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: `${workout.progress}%`, backgroundColor: workoutColor }]} />
                                    </View>
                                    <Text style={styles.progressText}>{workout.progress}%</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                    />
                }
            >
                <Header />
                <DailyGoalCard />
                {renderWeeklyProgram()}
                <WeeklyProgress />
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
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },
    greeting: {
        flex: 1,
        marginLeft: SPACING.sm,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 60,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greetingText: {
        fontSize: FONT_SIZE.md,
        color: colors.textLight,
    },
    username: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
        color: colors.text,
    },
    notificationButton: {
        padding: SPACING.xs,
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
    },
    settingsButton: {
        padding: SPACING.xs,
        marginLeft: SPACING.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    seeAllText: {
        fontSize: FONT_SIZE.sm,
        color: colors.primary,
        fontWeight: '500',
    },
    weeklyProgressCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        margin: SPACING.md,
        padding: SPACING.md,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    dailyGoalCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        margin: SPACING.md,
        padding: SPACING.md,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
    },
    goalProgress: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.md,
    },
    goalItem: {
        alignItems: 'center',
    },
    goalValue: {
        fontSize: FONT_SIZE.sm,
        fontWeight: '600',
        color: colors.text,
        marginTop: SPACING.xs,
    },
    goalLabel: {
        fontSize: FONT_SIZE.xs,
        color: colors.textLight,
        marginTop: 2,
    },
    nextWorkoutCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        margin: SPACING.md,
        padding: SPACING.md,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    workoutInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xs,
    },
    workoutDetails: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    workoutTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
    },
    workoutTime: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        marginTop: 2,
    },
    startButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: 20,
    },
    startButtonText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: FONT_SIZE.sm,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: SPACING.md,
        marginTop: SPACING.sm,
        marginBottom: SPACING.xl,
    },
    actionButton: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: SPACING.md,
        alignItems: 'center',
        width: '45%',
        marginHorizontal: SPACING.xs,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xs,
    },
    actionText: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
        marginTop: SPACING.xs,
    },
    notificationCount: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    weeklyProgramContainer: {
        marginTop: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllText: {
        fontSize: FONT_SIZE.sm,
        color: colors.primary,
        fontWeight: '500',
    },
    weeklyProgramScroll: {
        paddingRight: SPACING.md,
    },
    workoutCard: {
        width: 160,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: SPACING.md,
        marginRight: SPACING.md,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    todayWorkoutCard: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primary + '20',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    workoutCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    workoutDay: {
        fontSize: FONT_SIZE.sm,
        fontWeight: '600',
        color: colors.textLight,
    },
    todayWorkoutDay: {
        color: colors.primary,
    },
    todayBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    todayBadgeText: {
        fontSize: FONT_SIZE.xs,
        fontWeight: '600',
    },
    workoutCardContent: {
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    workoutType: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
        marginTop: 4,
        textAlign: 'center',
    },
    todayWorkoutType: {
        color: colors.primary,
    },
    workoutCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    workoutInfoText: {
        fontSize: FONT_SIZE.xs,
        color: colors.textLight,
        marginLeft: 4,
    },
    progressContainer: {
        marginTop: SPACING.sm,
    },
    progressBar: {
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        fontSize: FONT_SIZE.xs,
        color: colors.textLight,
        marginTop: 4,
        textAlign: 'right',
    },
});

export default HomeScreen; 