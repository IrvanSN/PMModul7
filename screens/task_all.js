import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from "react-native-flash-message";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {FontAwesome5} from "@expo/vector-icons";

const TaskScreen = () => {
    // Menggunakan hooks useSafeAreaInsets untuk mengatur safe area
    // contoh: ketika smartphone memiliki notch/poni di bagian tersebut adalah bagian tidak safe untuk ditempatkan element/component
    const insets = useSafeAreaInsets()
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);

    // Fungsi untuk mengambil semua data tasks
    const getStorageData = async () => {
        const value = await AsyncStorage.getItem('@task-list');
        if (value !== null) {
            return JSON.parse(value);
        } else {
            return [];
        }
    }

    // Fungsi untuk melakukan operasi Edit Task dan Add Task
    const handleAddTask = async () => {
        if (task === '') {
            return showMessage({
                message: 'Fill Task Please!',
                type: 'warning',
                style: {paddingTop: insets.top}
            });
        }

        // check if any task exist
        const allList = await getStorageData();
        const foundDuplicateTask = allList.some(el => el.title === task);
        if (foundDuplicateTask) {
            return showMessage({
                message: 'Task Already Exist!',
                type: 'warning',
                style: {paddingTop: insets.top}
            });
        }

        try {
            if (editIndex !== -1) {
                // Edit existing task
                // [BUG]
                // Ambil data completedTasks dengan memfilter jika isCompleted true
                const currCompletedTasks = (await getStorageData()).filter(item => item.isCompleted === true)
                // Ambil data di state tasks
                const updatedTasks = [...tasks];
                // Mengupdate title dari task yang diupdate
                updatedTasks[editIndex].title = task;
                // Gabungkan kedua data tsb dan set ke storage
                await AsyncStorage.setItem('@task-list', JSON.stringify([...updatedTasks, ...currCompletedTasks]));
                // Panggil fungsi getTaskList untuk mengatur state task di halaman ini
                await getTaskList()
                // set edit index menjadi -1 yang artinya tidak ada item yang di update
                setEditIndex(-1);
                showMessage({
                    message: 'Berhasil mengubah data task!',
                    type: "success",
                    style: {paddingTop: insets.top}
                });
            } else {
                // Add new task
                // [BUG]
                // Ambil semua data tasks di storage
                const currTasks = await getStorageData()
                // Membuat array temporary untuk menampung data sekarang dan gabungkan data task yang baru
                const tempList = [...currTasks, { title: task, isCompleted: false }];
                // Set data di storage dengan array temporary tadi
                await AsyncStorage.setItem('@task-list', JSON.stringify(tempList));
                // Panggil fungsi getTaskList untuk mengatur state task di halaman ini
                await getTaskList()
                showMessage({
                    message: 'Berhasil menambahkan data task!',
                    type: "success",
                    style: {paddingTop: insets.top}
                });
            }
            setTask("");
        } catch (e) {
            showMessage({
                message: 'Error add task: in task-all.js',
                type: 'danger',
                style: {paddingTop: insets.top}
            });
            console.error(e.message);
        }
    };

    // Fungsi untuk mengambil data tasks dan mengatur state tasks
    const getTaskList = async () => {
        try {
            const allData = await getStorageData();
            if (allData.length !== 0) {
                const uncompletedData = allData.filter((item) => !item.isCompleted)
                setTasks(uncompletedData);
            } else {
                showMessage({
                    message: 'No Tasks',
                    type: 'warning',
                    style: {paddingTop: insets.top}
                });
            }
        } catch (e) {
            showMessage({
                message: 'Error add task: in task-all.js',
                type: 'danger',
                style: {paddingTop: insets.top}
            });
            console.error(e);
        }
    };

    // Fungsi untuk menghapus data tasks
    const handleDeleteTask = async (item, index) => {
        const allList = await getStorageData();
        const deletedList = allList.filter(
            (list, listIndex) => list.title !== item.title
        );
        try {
            await AsyncStorage.setItem('@task-list', JSON.stringify(deletedList));
            // BUG
            // setTasks(deletedList);
            await getTaskList()
            showMessage({
                message: 'Berhasil menghapus data task!',
                type: "success",
                style: {paddingTop: insets.top}
            });
        } catch (e) {
            showMessage({
                message: 'Error add task: in task-all.js',
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
            showMessage({
                message: 'Berhasil mengubah status data task!',
                type: "success",
                style: {paddingTop: insets.top}
            });
        } catch (e) {
            showMessage({
                message: 'Error add task: in task-all.js',
                type: 'danger',
                style: {paddingTop: insets.top}
            });
            console.error(e.message);
        }
    };

    // Fungsi ini akan dijalankan ketika pertama kali component mounted
    useEffect(() => {
        // memanggil fungsi getTaskList untuk mendapatkan dan mengatur data tasks
        getTaskList();
    }, [])

    // Fungsi untuk menangani ketika edit task
    const handleEditTask = (index) => {
        const taskToEdit = tasks[index];
        setTask(taskToEdit.title);
        setEditIndex(index);
    };

    // Component untuk menampilkan data task
    const renderItem = ({ item, index }) => (
        <View style={styles.task}>
            <Text style={styles.itemList}>{item.title}</Text>
            <View style={{borderTopWidth: 1, borderTopColor: 'gray', width: '100%'}}></View>
            <View style={styles.taskButtons}>
                <TouchableOpacity
                    penjelasanDleayLongPress=
                        {'Menggunakan delayLongPress untuk mengatur longPress dari component TouchableOpacity'}
                    delayLongPress={1000}
                    penjelasanOnPressIn=
                        {"Fungsi dipanggil ketika komponen TouchableOpacity awal-awal ditekan"}
                    onPressIn={() => showMessage({
                        message: 'Tekan dan tahan satu detik untuk mengubah data task!',
                        type: 'info',
                        style: {paddingTop: insets.top}}
                    )}
                    penjelasanOnLongPress=
                        {"Fungsi dipanggil ketika komponen TouchableOpacity ditekan dan tahan selama waktu yang ditentukan"}
                    onLongPress={() => handleEditTask(index)}
                >
                    <FontAwesome5
                        name='edit'
                        size={20}
                        color='gray'
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    delayLongPress={3000}
                    onPressIn={() => showMessage({
                        message: 'Tekan dan tahan tiga detik untuk menghapus data task!',
                        type: 'info',
                        style: {paddingTop: insets.top}}
                    )}
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
                        message: 'Tekan dan tahan satu detik untuk mengubah status data task menjadi completed!',
                        type: 'info',
                        style: {paddingTop: insets.top}}
                    )}
                    onLongPress={() => handleStatusChange(item, index)}
                >
                    <FontAwesome5
                        name='check'
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
            <TextInput
                style={styles.input}
                placeholder="Enter task"
                value={task}
                onChangeText={(text) => setTask(text)}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTask}>
                <Text style={styles.addButtonText}>
                    {editIndex !== -1 ? "Update Task" : "Add Task"}
                </Text>
            </TouchableOpacity>
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
        borderWidth: 1,
        borderColor: "gray",
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginBottom: 10,
        borderRadius: 5,
        fontSize: 18,
    },
    addButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        marginBottom: 40,
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

export default TaskScreen;
