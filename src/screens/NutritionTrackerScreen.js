import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Modal,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { SPACING, FONT_SIZE } from '../constants/layout';

// Örnek besin veritabanı
const FOOD_DATABASE = [
    {
        id: '1',
        name: 'Tavuk Göğsü',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        portion: '100g',
    },
    {
        id: '2',
        name: 'Pilav',
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
        portion: '100g',
    },
    {
        id: '3',
        name: 'Yumurta',
        calories: 155,
        protein: 13,
        carbs: 1.1,
        fat: 11,
        portion: '100g',
    },
    {
        id: '4',
        name: 'Muz',
        calories: 89,
        protein: 1.1,
        carbs: 22.8,
        fat: 0.3,
        portion: '100g',
    },
    {
        id: '5',
        name: 'Yoğurt',
        calories: 61,
        protein: 3.5,
        carbs: 4.7,
        fat: 3.3,
        portion: '100g',
    },
    {
        id: '6',
        name: 'Ekmek',
        calories: 265,
        protein: 9,
        carbs: 49,
        fat: 3.2,
        portion: '100g',
    },
    {
        id: '7',
        name: 'Süt',
        calories: 42,
        protein: 3.4,
        carbs: 4.8,
        fat: 1,
        portion: '100g',
    },
    {
        id: '8',
        name: 'Elma',
        calories: 52,
        protein: 0.3,
        carbs: 14,
        fat: 0.2,
        portion: '100g',
    },
];

const BesinTakipEkrani = () => {
    const [selectedFood, setSelectedFood] = useState(null);
    const [portion, setPortion] = useState('100');
    const [showModal, setShowModal] = useState(false);
    const [dailyFoods, setDailyFoods] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const addFood = () => {
        if (selectedFood && portion) {
            const portionMultiplier = parseFloat(portion) / 100;
            const newFood = {
                ...selectedFood,
                id: Date.now().toString(),
                portion: `${portion}g`,
                calories: Math.round(selectedFood.calories * portionMultiplier),
                protein: Math.round(selectedFood.protein * portionMultiplier * 10) / 10,
                carbs: Math.round(selectedFood.carbs * portionMultiplier * 10) / 10,
                fat: Math.round(selectedFood.fat * portionMultiplier * 10) / 10,
            };
            setDailyFoods([...dailyFoods, newFood]);
            setShowModal(false);
            setSelectedFood(null);
            setPortion('100');
        }
    };

    const removeFood = (id) => {
        setDailyFoods(dailyFoods.filter(food => food.id !== id));
    };

    const getTotalNutrition = () => {
        return dailyFoods.reduce((acc, food) => ({
            calories: acc.calories + food.calories,
            protein: acc.protein + food.protein,
            carbs: acc.carbs + food.carbs,
            fat: acc.fat + food.fat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    };

    const filteredFoods = FOOD_DATABASE.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totals = getTotalNutrition();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Besin Takibi</Text>
            </View>

            <View style={styles.searchContainer}>
                <Icon name="magnify" size={24} color={colors.primary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Besin ara..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Toplam Kalori</Text>
                    <Text style={styles.summaryValue}>{totals.calories} kcal</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Protein</Text>
                    <Text style={styles.summaryValue}>{totals.protein}g</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Karbonhidrat</Text>
                    <Text style={styles.summaryValue}>{totals.carbs}g</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Yağ</Text>
                    <Text style={styles.summaryValue}>{totals.fat}g</Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.sectionTitle}>Günlük Besinler</Text>
                <FlatList
                    data={dailyFoods}
                    renderItem={({ item, index }) => (
                        <View style={styles.dailyFoodItem}>
                            <View style={styles.dailyFoodContent}>
                                <Text style={styles.dailyFoodName}>{item.name}</Text>
                                <Text style={styles.dailyFoodPortion}>{item.portion}</Text>
                                <View style={styles.nutritionInfo}>
                                    <Text style={styles.nutritionText}>{item.calories} kcal</Text>
                                    <Text style={styles.nutritionText}>P: {item.protein}g</Text>
                                    <Text style={styles.nutritionText}>K: {item.carbs}g</Text>
                                    <Text style={styles.nutritionText}>Y: {item.fat}g</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => removeFood(item.id)}>
                                <Icon name="delete" size={24} color={colors.error} />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={item => item.id}
                    style={styles.dailyFoodList}
                />

                <Text style={styles.sectionTitle}>Besin Veritabanı</Text>
                <FlatList
                    data={filteredFoods}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.foodItem}
                            onPress={() => {
                                setSelectedFood(item);
                                setShowModal(true);
                            }}
                        >
                            <View style={styles.foodItemContent}>
                                <Text style={styles.foodName}>{item.name}</Text>
                                <View style={styles.nutritionInfo}>
                                    <Text style={styles.nutritionText}>{item.calories} kcal</Text>
                                    <Text style={styles.nutritionText}>P: {item.protein}g</Text>
                                    <Text style={styles.nutritionText}>K: {item.carbs}g</Text>
                                    <Text style={styles.nutritionText}>Y: {item.fat}g</Text>
                                </View>
                            </View>
                            <Icon name="plus-circle" size={24} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                    style={styles.foodList}
                />
            </View>

            <Modal
                visible={showModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedFood?.name}</Text>
                        <View style={styles.modalNutritionInfo}>
                            <Text style={styles.modalNutritionText}>Kalori: {selectedFood?.calories} kcal</Text>
                            <Text style={styles.modalNutritionText}>Protein: {selectedFood?.protein}g</Text>
                            <Text style={styles.modalNutritionText}>Karbonhidrat: {selectedFood?.carbs}g</Text>
                            <Text style={styles.modalNutritionText}>Yağ: {selectedFood?.fat}g</Text>
                        </View>
                        <View style={styles.portionContainer}>
                            <Text style={styles.portionLabel}>Porsiyon (g):</Text>
                            <TextInput
                                style={styles.portionInput}
                                value={portion}
                                onChangeText={setPortion}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowModal(false)}
                            >
                                <Text style={styles.modalButtonText}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.addButton]}
                                onPress={addFood}
                            >
                                <Text style={[styles.modalButtonText, styles.addButtonText]}>Ekle</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: SPACING.md,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
        color: colors.text,
        marginLeft: SPACING.sm,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        margin: SPACING.sm,
        paddingHorizontal: SPACING.sm,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        marginRight: SPACING.xs,
        color: colors.primary,
    },
    searchInput: {
        flex: 1,
        padding: SPACING.sm,
        fontSize: FONT_SIZE.md,
        color: colors.text,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SPACING.md,
        backgroundColor: colors.white,
        margin: SPACING.sm,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    summaryItem: {
        alignItems: 'center',
        backgroundColor: colors.primary + '10',
        padding: SPACING.sm,
        borderRadius: 8,
        minWidth: 80,
    },
    summaryLabel: {
        fontSize: FONT_SIZE.xs,
        color: colors.textLight,
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.primary,
    },
    contentContainer: {
        flex: 1,
        padding: SPACING.sm,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
        marginVertical: SPACING.sm,
        marginLeft: SPACING.xs,
    },
    foodList: {
        flex: 1,
    },
    dailyFoodList: {
        maxHeight: 200,
    },
    foodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: SPACING.sm,
        marginBottom: SPACING.xs,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    foodItemContent: {
        flex: 1,
    },
    foodName: {
        fontSize: FONT_SIZE.md,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    nutritionInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.primary + '05',
        padding: SPACING.xs,
        borderRadius: 6,
    },
    nutritionText: {
        fontSize: FONT_SIZE.sm,
        color: colors.primary,
        fontWeight: '500',
    },
    dailyFoodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: SPACING.sm,
        marginBottom: SPACING.xs,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    dailyFoodContent: {
        flex: 1,
    },
    dailyFoodName: {
        fontSize: FONT_SIZE.md,
        fontWeight: '500',
        color: colors.text,
    },
    dailyFoodPortion: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        marginBottom: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: SPACING.lg,
    },
    modalTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
        color: colors.text,
        marginBottom: SPACING.md,
    },
    modalNutritionInfo: {
        marginBottom: SPACING.md,
        backgroundColor: colors.primary + '05',
        padding: SPACING.md,
        borderRadius: 12,
    },
    modalNutritionText: {
        fontSize: FONT_SIZE.md,
        color: colors.primary,
        marginBottom: SPACING.xs,
        fontWeight: '500',
    },
    portionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    portionLabel: {
        fontSize: FONT_SIZE.md,
        color: colors.text,
        marginRight: SPACING.sm,
    },
    portionInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: SPACING.sm,
        fontSize: FONT_SIZE.md,
        color: colors.text,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: SPACING.xs,
    },
    cancelButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
    },
    addButton: {
        backgroundColor: colors.primary,
    },
    modalButtonText: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
    },
    addButtonText: {
        color: colors.white,
    },
});

export default BesinTakipEkrani; 