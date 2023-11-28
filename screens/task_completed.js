import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesome5} from "@expo/vector-icons";
import {showMessage} from "react-native-flash-message";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const TaskCompletedScreen = () => {
    const insets = useSafeAreaInsets()
    const [tasks, setTasks] = useState([]);

    // Fungsi untuk mengambil semua data tasks
    const getStorageData = async () => {
        const value = await AsyncStorage.getItem('@task-list');
        if (value !== null) {
            return JSON.parse(value);
        } else {
            return [];
        }
    }

    // Fungsi untuk menghapus data tasks
    const handleDeleteTask = async (item, index) => {
        const allList = await getStorageData();
        const deletedList = allList.filter(
            (list, listIndex) => list.title !== item.title
        );
        try {
            await AsyncStorage.setItem('@task-list', JSON.stringify(deletedList));
            await getTaskList();
        } catch (e) {
            showMessage({
                message: 'Error add task: in task-completed.js',
                type: 'danger',
                style: {paddingTop: insets.top}
            });
            console.error(e.message);
        }
    };

    // Fungsi untuk mengatur status task isCompleted
    const handleStatusChange = async (item, index) => {
        const allList = await getStorageData();
        const tempIndex = allList.findIndex(el => el.title === item.title);
        allList[tempIndex].isCompleted = !allList[tempIndex].isCompleted;
        try {
            await AsyncStorage.setItem('@task-list', JSON.stringify(allList));
            await getTaskList();
        } catch (e) {
            console.log('Error update status task: in task-completed.js');
            console.error(e.message);
        }
    };

    // Fungsi untuk mengambil data tasks dan mengatur state tasks
    const getTaskList = async () => {
        try {
            const allData = await getStorageData();
            if (allData !== 0) {
                const completedData = allData.filter((item) => item.isCompleted);
                setTasks(completedData);
            } else {
                console.log('No tasks');
            }
        } catch (e) {
            console.log('Error get task: in task-completed.js');
            console.error(e);
        }
    };

    // Fungsi ini akan dijalankan ketika pertama kali component mounted
    useEffect(() => {
        getTaskList();
    }, []);

    const renderItem = ({ item, index }) => (
        <View style={styles.task}>
            <Text style={styles.itemList}>{item.title}</Text>
            <View style={{borderTopWidth: 1, borderTopColor: 'gray', width: '100%'}}></View>
            <View style={styles.taskButtons}>
                <TouchableOpacity
                    penjelasanDleayLongPress=
                        {'Menggunakan delayLongPress untuk mengatur longPress dari component TouchableOpacity'}
                    delayLongPress={3000}
                    penjelasanOnPressIn=
                        {"Fungsi dipanggil ketika komponen TouchableOpacity awal-awal ditekan"}
                    onPressIn={() => showMessage({
                        message: 'Tekan dan tahan tiga detik untuk menghapus data task!',
                        type: 'info',
                        style: {paddingTop: insets.top}}
                    )}
                    penjelasanOnLongPress=
                        {"Fungsi dipanggil ketika komponen TouchableOpacity ditekan dan tahan selama waktu yang ditentukan"}
                    onLongPress={() => handleDeleteTask(item, index)}
                >
                    <FontAwesome5
                        name='times'
                        size={20}
                        color='gray'
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    delayLongPress={1000}
                    onPressIn={() => showMessage({
                        message: 'Tekan dan tahan satu detik untuk mengubah status data task menjadi uncompleted!',
                        type: 'info',
                        style: {paddingTop: insets.top}}
                    )}
                    onLongPress={() => handleStatusChange(item, index)}
                >
                    <FontAwesome5
                        name='backspace'
                        size={20}
                        color='gray'
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.itemBorder}></View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        borderWidth: 3,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        fontSize: 18,
    },
    addButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18,
    },
    task: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 5,
        gap: 10
    },
    itemList: {
        fontSize: 19,
    },
    itemBorder: {
        borderWidth: 0.5,
        borderColor: "#cccccc",
    },
    taskButtons: {
        flexDirection: "row",
        gap: 20,
    },
});

export default TaskCompletedScreen;
