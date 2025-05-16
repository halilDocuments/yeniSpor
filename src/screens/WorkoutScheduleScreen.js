import React, { useState, useCallback } from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,SafeAreaView,StatusBar,Platform,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar } from 'react-native-calendars';
import { colors } from '../theme/colors';
import { SPACING, FONT_SIZE } from '../constants/layout';

const WorkoutScheduleScreen = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [workoutSchedule, setWorkoutSchedule] = useState({
        '2024-03-20': {
            workouts: [
                {
                    id: 1,
                    name: 'Üst Vücut Antrenmanı',
                    time: '07:30',
                    duration: '45 dk',
                    type: 'strength',
                    completed: false,
                },
            ],
        },
        '2024-03-21': {
            workouts: [
                {
                    id: 2,
                    name: 'Kardiyo',
                    time: '18:00',
                    duration: '30 dk',
                    type: 'cardio',
                    completed: true,
                },
                {
                    id: 3,
                    name: 'Core Egzersizleri',
                    time: '18:45',
                    duration: '20 dk',
                    type: 'strength',
                    completed: true,
                },
            ],
        },
    });

    const getMarkedDates = () => {
        const marked = {};
        Object.keys(workoutSchedule).forEach(date => {
            marked[date] = {
                marked: true,
                dotColor: colors.primary,
                selected: date === selectedDate,
                selectedColor: colors.primary + '20',
            };
        });
        return marked;
    };

    const renderWorkoutCard = useCallback((workout) => {
        const getTypeIcon = (type) => {
            switch (type) {
                case 'strength':
                    return 'dumbbell';
                case 'cardio':
                    return 'run';
                case 'flexibility':
                    return 'yoga';
                default:
                    return 'dumbbell';
            }
        };

        return (
            <TouchableOpacity
                key={workout.id}
                style={styles.workoutCard}
                onPress={() => navigation.navigate('WorkoutDetail', { workout })}
            >
                <View style={styles.workoutHeader}>
                    <View style={styles.workoutInfo}>
                        <Text style={styles.workoutTime}>{workout.time}</Text>
                        <Text style={styles.workoutName}>{workout.name}</Text>
                        <Text style={styles.workoutDuration}>{workout.duration}</Text>
                    </View>
                    <View style={styles.workoutActions}>
                        <Icon 
                            name={getTypeIcon(workout.type)} 
                            size={24} 
                            color={colors.primary} 
                        />
                        {workout.completed && (
                            <Icon 
                                name="check-circle" 
                                size={24} 
                                color={colors.success}
                                style={styles.completedIcon} 
                            />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, [navigation]);

    const renderWorkouts = () => {
        if (!selectedDate || !workoutSchedule[selectedDate]) {
            return (
                <View style={styles.noWorkouts}>
                    <Icon name="calendar-blank" size={48} color={colors.textLight} />
                    <Text style={styles.noWorkoutsText}>
                        Bu tarih için planlanmış antrenman yok
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.workoutsList}>
                {workoutSchedule[selectedDate].workouts.map(renderWorkoutCard)}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Antrenman Programı</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddWorkout')}
                >
                    <Icon name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <Calendar
                    style={styles.calendar}
                    theme={{
                        backgroundColor: colors.white,
                        calendarBackground: colors.white,
                        textSectionTitleColor: colors.text,
                        selectedDayBackgroundColor: colors.primary,
                        selectedDayTextColor: colors.white,
                        todayTextColor: colors.primary,
                        dayTextColor: colors.text,
                        textDisabledColor: colors.textLight,
                        dotColor: colors.primary,
                        monthTextColor: colors.text,
                        indicatorColor: colors.primary,
                        arrowColor: colors.primary,
                    }}
                    markedDates={getMarkedDates()}
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                />
                {renderWorkouts()}
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
    addButton: {
        padding: SPACING.xs,
    },
    scrollView: {
        flex: 1,
    },
    calendar: {
        marginBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    workoutsList: {
        padding: SPACING.md,
    },
    workoutCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    workoutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    workoutInfo: {
        flex: 1,
    },
    workoutTime: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 4,
    },
    workoutName: {
        fontSize: FONT_SIZE.md,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    workoutDuration: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
    },
    workoutActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completedIcon: {
        marginLeft: SPACING.sm,
    },
    noWorkouts: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    noWorkoutsText: {
        fontSize: FONT_SIZE.md,
        color: colors.textLight,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
});

export default WorkoutScheduleScreen; 