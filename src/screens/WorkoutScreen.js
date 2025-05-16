import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    Dimensions,
    ActivityIndicator,
    TextInput,
    Animated,
    Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_ANIMATION_DURATION = 300;

const WorkoutScreen = () => {
    const navigation = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState('cardio');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        level: null,
        duration: null,
        calories: null,
    });

    // Animasyon değerleri
    const searchBarHeight = useRef(new Animated.Value(0)).current;
    const filterOpacity = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(1)).current;

    const categories = useMemo(() => [
        { id: 'cardio', name: 'Kardio', icon: 'run' },
        { id: 'strength', name: 'Güç', icon: 'dumbbell' },
        { id: 'flexibility', name: 'Esneklik', icon: 'yoga' },
    ], []);

    const exercises = useMemo(() => ({
        cardio: [
            {
                id: 1,
                name: 'Koşu',
                icon: 'run',
                calories: '400-600',
                duration: '30-45',
                level: 'Orta',
                benefits: ['Kalp sağlığı', 'Kilo verme', 'Dayanıklılık'],
                description: 'Tempolu koşu ile kalp sağlığınızı koruyun ve kalori yakın.',
            },
            {
                id: 2,
                name: 'Bisiklet',
                icon: 'bike',
                calories: '300-500',
                duration: '30-45',
                level: 'Düşük',
                benefits: ['Eklem dostu', 'Bacak kası', 'Dayanıklılık'],
            },
            {
                id: 3,
                name: 'Yüzme',
                icon: 'swim',
                calories: '400-700',
                duration: '30-45',
                level: 'Orta',
                benefits: ['Tam vücut', 'Eklem dostu', 'Kas tonu'],
            },
            {
                id: 4,
                name: 'İp Atlama',
                icon: 'jump-rope',
                calories: '200-300',
                duration: '15-20',
                level: 'Yüksek',
                benefits: ['Koordinasyon', 'Kalp sağlığı', 'Kilo verme'],
            },
            {
                id: 5,
                name: 'Eliptik',
                icon: 'file-question-outline',
                calories: '300-400',
                duration: '30-40',
                level: 'Düşük',
                benefits: ['Eklem dostu', 'Tam vücut', 'Kilo verme'],
            },
        ],
        strength: [
            {
                id: 6,
                name: 'Ağırlık Kaldırma',
                icon: 'weight-lifter',
                calories: '200-400',
                duration: '30-60',
                level: 'Yüksek',
                benefits: ['Kas gücü', 'Metabolizma', 'Kemik yoğunluğu'],
            },
            {
                id: 7,
                name: 'Squat',
                icon: 'file-question-outline',
                calories: '150-300',
                duration: '20-30',
                level: 'Orta',
                benefits: ['Bacak kası', 'Kalça', 'Denge'],
            },
        ],
        flexibility: [
            {
                id: 8,
                name: 'Yoga',
                icon: 'yoga',
                calories: '200-300',
                duration: '30-60',
                level: 'Düşük',
                benefits: ['Esneklik', 'Stres azaltma', 'Denge'],
            },
            {
                id: 9,
                name: 'Pilates',
                icon: 'yoga',
                calories: '180-280',
                duration: '30-60',
                level: 'Orta',
                benefits: ['Esneklik', 'Kas gücü', 'Duruş'],
            },
        ],
    }), []);

    const filteredExercises = useMemo(() => {
        if (!exercises[selectedCategory]) return [];
        
        return exercises[selectedCategory].filter(exercise => {
            const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                exercise.benefits.some(benefit => benefit.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesLevel = !selectedFilters.level || exercise.level === selectedFilters.level;
            const matchesDuration = !selectedFilters.duration || exercise.duration.includes(selectedFilters.duration);
            const matchesCalories = !selectedFilters.calories || exercise.calories.includes(selectedFilters.calories);

            return matchesSearch && matchesLevel && matchesDuration && matchesCalories;
        });
    }, [selectedCategory, searchQuery, selectedFilters, exercises]);

    const toggleFilters = useCallback(() => {
        setShowFilters(prev => !prev);
        Animated.parallel([
            Animated.timing(filterOpacity, {
                toValue: showFilters ? 0 : 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(cardScale, {
                toValue: showFilters ? 1 : 0.98,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, [showFilters]);

    const handleSearchFocus = useCallback(() => {
        Animated.timing(searchBarHeight, {
            toValue: 50,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, []);

    const handleSearchBlur = useCallback(() => {
        if (!searchQuery) {
            Animated.timing(searchBarHeight, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [searchQuery]);

    const handleCategoryChange = useCallback(async (categoryId) => {
        try {
            setIsLoading(true);
            setSelectedCategory(categoryId);
            
            // Kategori değişiminde animasyon
            Animated.sequence([
                Animated.timing(cardScale, {
                    toValue: 0.95,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.spring(cardScale, {
                    toValue: 1,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();

            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            console.error('Kategori değiştirme hatası:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleExercisePress = useCallback((exercise) => {
        navigation.navigate('ExerciseDetail', { exercise });
    }, [navigation]);

    const renderHeader = useCallback(() => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Antrenman</Text>
            <TouchableOpacity 
                style={styles.filterButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Icon name="filter-variant" size={24} color={colors.text} />
            </TouchableOpacity>
        </View>
    ), [navigation]);

    const renderSearchBar = () => (
        <Animated.View style={[styles.searchContainer, { height: searchBarHeight }]}>
            <View style={styles.searchInputContainer}>
                <Icon name="magnify" size={20} color={colors.textLight} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Egzersiz ara..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Icon name="close" size={20} color={colors.textLight} />
                    </TouchableOpacity>
                ) : null}
            </View>
        </Animated.View>
    );

    const renderFilters = () => (
        <Animated.View 
            style={[
                styles.filtersContainer,
                {
                    opacity: filterOpacity,
                    transform: [{ scale: filterOpacity }],
                }
            ]}
        >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['Kolay', 'Orta', 'Zor'].map((level) => (
                    <TouchableOpacity
                        key={level}
                        style={[
                            styles.filterChip,
                            selectedFilters.level === level && styles.selectedFilterChip,
                        ]}
                        onPress={() => setSelectedFilters(prev => ({
                            ...prev,
                            level: prev.level === level ? null : level,
                        }))}
                    >
                        <Text style={[
                            styles.filterChipText,
                            selectedFilters.level === level && styles.selectedFilterChipText,
                        ]}>
                            {level}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );

    const renderCategories = useCallback(() => (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
        >
            {categories.map((category) => (
                <TouchableOpacity
                    key={category.id}
                    style={[
                        styles.categoryButton,
                        selectedCategory === category.id && styles.selectedCategory,
                    ]}
                    onPress={() => handleCategoryChange(category.id)}
                    activeOpacity={0.7}
                >
                    <Icon 
                        name={category.icon} 
                        size={24} 
                        color={selectedCategory === category.id ? colors.white : colors.primary}
                    />
                    <Text 
                        style={[
                            styles.categoryText,
                            selectedCategory === category.id && styles.selectedCategoryText,
                        ]}
                    >
                        {category.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    ), [categories, selectedCategory, handleCategoryChange]);

    const renderExerciseCard = useCallback((exercise) => (
        <TouchableOpacity 
            key={exercise.id} 
            style={styles.exerciseCard}
            onPress={() => handleExercisePress(exercise)}
            activeOpacity={0.7}
        >
            <View style={styles.exerciseHeader}>
                <View style={styles.exerciseIconContainer}>
                    <Icon name={exercise.icon} size={32} color={colors.primary} />
                </View>
                <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <View style={styles.exerciseStats}>
                        <View style={styles.stat}>
                            <Icon name="fire" size={16} color={colors.primary} />
                            <Text style={styles.statText}>{exercise.calories} kcal</Text>
                        </View>
                        <View style={styles.stat}>
                            <Icon name="clock-outline" size={16} color={colors.primary} />
                            <Text style={styles.statText}>{exercise.duration} dk</Text>
                        </View>
                        <View style={styles.stat}>
                            <Icon name="signal" size={16} color={colors.primary} />
                            <Text style={styles.statText}>{exercise.level}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.benefitsContainer}>
                {exercise.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitTag}>
                        <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    ), [handleExercisePress]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
            {renderHeader()}
            {renderSearchBar()}
            {renderCategories()}
            {showFilters && renderFilters()}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <Animated.ScrollView 
                    style={[styles.exercisesContainer, { transform: [{ scale: cardScale }] }]}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.exercisesContent}
                >
                    {filteredExercises.length > 0 ? (
                        filteredExercises.map(renderExerciseCard)
                    ) : (
                        <Text style={styles.noExercisesText}>
                            {searchQuery 
                                ? 'Arama sonucu bulunamadı'
                                : 'Bu kategoride egzersiz bulunamadı'}
                        </Text>
                    )}
                </Animated.ScrollView>
            )}
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
    },
    backButton: {
        padding: 8,
    },
    filterButton: {
        padding: 8,
    },
    categoriesContainer: {
        backgroundColor: colors.white,
        maxHeight: 70,
    },
    categoriesContent: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: colors.primary + '15',
    },
    selectedCategory: {
        backgroundColor: colors.primary,
    },
    categoryText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
        color: colors.primary,
    },
    selectedCategoryText: {
        color: colors.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exercisesContainer: {
        flex: 1,
    },
    exercisesContent: {
        padding: 16,
        paddingBottom: 32,
    },
    noExercisesText: {
        textAlign: 'center',
        color: colors.textLight,
        marginTop: 24,
        fontSize: 16,
    },
    exerciseCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    exerciseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    exerciseIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    exerciseStats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 4,
    },
    statText: {
        marginLeft: 4,
        fontSize: 14,
        color: colors.text,
    },
    benefitsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    benefitTag: {
        backgroundColor: colors.primary + '15',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    benefitText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500',
    },
    searchContainer: {
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        overflow: 'hidden',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 40,
        marginVertical: 8,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: colors.text,
    },
    filtersContainer: {
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.background,
        marginRight: 8,
    },
    selectedFilterChip: {
        backgroundColor: colors.primary,
    },
    filterChipText: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
    },
    selectedFilterChipText: {
        color: colors.white,
    },
});

export default WorkoutScreen; 