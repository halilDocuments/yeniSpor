import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { SPACING, FONT_SIZE } from '../constants/layout';

const WorkoutDetailScreen = ({ route, navigation }) => {
    const { workout } = route.params;
    const [isCompleted, setIsCompleted] = useState(workout.completed);

    const exercises = [
        {
            id: 1,
            name: 'Bench Press',
            sets: 4,
            reps: '12',
            weight: '60 kg',
            rest: '90 sn',
            completed: false,
        },
        {
            id: 2,
            name: 'Lat Pulldown',
            sets: 3,
            reps: '15',
            weight: '45 kg',
            rest: '60 sn',
            completed: false,
        },
        {
            id: 3,
            name: 'Shoulder Press',
            sets: 4,
            reps: '10',
            weight: '40 kg',
            rest: '90 sn',
            completed: false,
        },
        {
            id: 4,
            name: 'Bicep Curl',
            sets: 3,
            reps: '12',
            weight: '30 kg',
            rest: '60 sn',
            completed: false,
        },
    ];

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Antrenman Detayı</Text>
            <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('EditWorkout', { workout })}
            >
                <Icon name="pencil" size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );

    const renderWorkoutInfo = () => (
        <View style={styles.workoutInfoCard}>
            <View style={styles.workoutHeader}>
                <View>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <Text style={styles.workoutTime}>{workout.time}</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        isCompleted && styles.completedButton,
                    ]}
                    onPress={() => setIsCompleted(!isCompleted)}
                >
                    <Icon 
                        name={isCompleted ? "check-circle" : "circle-outline"} 
                        size={24} 
                        color={isCompleted ? colors.white : colors.primary} 
                    />
                    <Text style={[
                        styles.completeButtonText,
                        isCompleted && styles.completedButtonText,
                    ]}>
                        {isCompleted ? 'Tamamlandı' : 'Tamamla'}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.workoutStats}>
                <View style={styles.statItem}>
                    <Icon name="clock-outline" size={24} color={colors.primary} />
                    <Text style={styles.statValue}>{workout.duration}</Text>
                    <Text style={styles.statLabel}>Süre</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Icon name="dumbbell" size={24} color={colors.primary} />
                    <Text style={styles.statValue}>{exercises.length}</Text>
                    <Text style={styles.statLabel}>Egzersiz</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Icon name="fire" size={24} color={colors.primary} />
                    <Text style={styles.statValue}>320</Text>
                    <Text style={styles.statLabel}>Kalori</Text>
                </View>
            </View>
        </View>
    );

    const renderExerciseCard = (exercise) => (
        <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <TouchableOpacity
                    style={styles.exerciseCheckbox}
                    onPress={() => {
                        exercise.completed = !exercise.completed;
                        // Force re-render
                        setIsCompleted(prev => !prev);
                    }}
                >
                    <Icon 
                        name={exercise.completed ? "check-circle" : "circle-outline"} 
                        size={24} 
                        color={exercise.completed ? colors.success : colors.textLight} 
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.exerciseDetails}>
                <View style={styles.exerciseDetail}>
                    <Text style={styles.detailLabel}>Set</Text>
                    <Text style={styles.detailValue}>{exercise.sets}</Text>
                </View>
                <View style={styles.exerciseDetail}>
                    <Text style={styles.detailLabel}>Tekrar</Text>
                    <Text style={styles.detailValue}>{exercise.reps}</Text>
                </View>
                <View style={styles.exerciseDetail}>
                    <Text style={styles.detailLabel}>Ağırlık</Text>
                    <Text style={styles.detailValue}>{exercise.weight}</Text>
                </View>
                <View style={styles.exerciseDetail}>
                    <Text style={styles.detailLabel}>Dinlenme</Text>
                    <Text style={styles.detailValue}>{exercise.rest}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
            {renderHeader()}
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {renderWorkoutInfo()}
                <View style={styles.exercisesContainer}>
                    <Text style={styles.sectionTitle}>Egzersizler</Text>
                    {exercises.map(renderExerciseCard)}
                </View>
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
    editButton: {
        padding: SPACING.xs,
    },
    scrollView: {
        flex: 1,
    },
    workoutInfoCard: {
        backgroundColor: colors.white,
        padding: SPACING.md,
        margin: SPACING.md,
        borderRadius: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    workoutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    workoutName: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    workoutTime: {
        fontSize: FONT_SIZE.md,
        color: colors.primary,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    completedButton: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    completeButtonText: {
        marginLeft: 8,
        fontSize: FONT_SIZE.md,
        color: colors.primary,
    },
    completedButtonText: {
        color: colors.white,
    },
    workoutStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
        color: colors.text,
        marginVertical: 4,
    },
    statLabel: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: colors.border,
    },
    exercisesContainer: {
        padding: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
        color: colors.text,
        marginBottom: SPACING.md,
    },
    exerciseCard: {
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
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    exerciseName: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
    },
    exerciseCheckbox: {
        padding: SPACING.xs,
    },
    exerciseDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    exerciseDetail: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: FONT_SIZE.md,
        fontWeight: '500',
        color: colors.text,
    },
});

export default WorkoutDetailScreen; 