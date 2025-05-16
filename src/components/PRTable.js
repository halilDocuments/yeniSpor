import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRTable = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRecords, setEditingRecords] = useState([]);
    const [records, setRecords] = useState([
        { name: 'Bench Press', weight: 120, color: colors.benchPress },
        { name: 'Squat', weight: 120, color: colors.squat },
        { name: 'Deadlift', weight: 120, color: colors.deadlift },
        { name: 'Leg Press', weight: 120, color: colors.legPress },
    ]);

    const handleEditAll = () => {
        setEditingRecords([...records]);
        setModalVisible(true);
    };

    const handleUpdateWeight = (index, value) => {
        const newRecords = [...editingRecords];
        newRecords[index] = { ...newRecords[index], weight: parseInt(value) || 0 };
        setEditingRecords(newRecords);
    };

    const handleSave = () => {
        setRecords([...editingRecords]);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>PR Tablosu</Text>
                <TouchableOpacity 
                    style={styles.editButton}
                    onPress={handleEditAll}
                >
                    <Icon name="pencil" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View style={styles.tableContainer}>
                    {records.map((record, index) => (
                        <View key={index} style={styles.row}>
                            <View style={styles.recordInfo}>
                                <View style={[styles.indicator, { backgroundColor: record.color }]} />
                                <Text style={styles.exerciseName}>{record.name}</Text>
                            </View>
                            <Text style={styles.weight}>{record.weight}kg</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.caloryCard}>
                    <Icon name="fire" size={24} color={colors.white} />
                    <Text style={styles.caloryValue}>1,350</Text>
                    <Text style={styles.caloryLabel}>Kalori</Text>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>PR'ları Düzenle</Text>
                        <ScrollView style={styles.modalScroll}>
                            {editingRecords.map((record, index) => (
                                <View key={index} style={styles.inputContainer}>
                                    <View style={styles.recordNameContainer}>
                                        <View style={[styles.modalIndicator, { backgroundColor: record.color }]} />
                                        <Text style={styles.inputLabel}>{record.name}</Text>
                                    </View>
                                    <View style={styles.weightInputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={String(record.weight)}
                                            onChangeText={(text) => handleUpdateWeight(index, text)}
                                        />
                                        <Text style={styles.inputUnit}>kg</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSave}
                            >
                                <Text style={[styles.buttonText, styles.saveButtonText]}>Kaydet</Text>
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
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 5,
        marginVertical: 5,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    editButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.primary + '15',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tableContainer: {
        flex: 1,
        marginRight: 16,
        backgroundColor: colors.lightGray,
        borderRadius: 16,
        padding: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingVertical: 4,
    },
    recordInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    indicator: {
        width: 3,
        height: 16,
        borderRadius: 2,
        marginRight: 8,
    },
    modalIndicator: {
        width: 3,
        height: 24,
        borderRadius: 2,
        marginRight: 8,
    },
    exerciseName: {
        fontSize: 14,
        color: colors.text,
    },
    weight: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
    },
    caloryCard: {
        backgroundColor: colors.caloryCard,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
    },
    caloryValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        marginVertical: 4,
    },
    caloryLabel: {
        fontSize: 12,
        color: colors.white,
        opacity: 0.9,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalScroll: {
        maxHeight: 400,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 12,
    },
    recordNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    weightInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    inputLabel: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    input: {
        width: 80,
        height: 40,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10,
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: colors.white,
    },
    inputUnit: {
        fontSize: 16,
        color: colors.text,
        width: 30,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: colors.lightGray,
    },
    saveButton: {
        backgroundColor: colors.primary,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    saveButtonText: {
        color: colors.white,
    },
});

export default PRTable; 