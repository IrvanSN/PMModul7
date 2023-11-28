import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    Linking, TouchableOpacity
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from "react-native-flash-message";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const About = () => {
    const insets = useSafeAreaInsets()

    // Fungsi untuk menghapus semua data
    const handleClearData = async () => {
        try {
            // menggunakan method clear() dari AsyncStorage untuk menghapus semua storage data yang tersimpan
            await AsyncStorage.clear();
            showMessage({
                message: 'All Data Cleared!',
                type: 'success',
                style: {paddingTop: insets.top}
            });
        } catch (e) {
            showMessage({
                message: 'Error add task: in about.js',
                type: 'danger',
                style: {paddingTop: insets.top}
            });
            console.error(e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>About This Application</Text>
            <Text style={styles.content}>Aplikasi ini dirancang sebagai studi kasus untuk pembelajaran mata kuliah Pemrograman Mobile Program Studi Informatika Institut Teknologi Telkom Surabaya</Text>
            <Text style={{ marginBottom: 5 }} onPress={() =>
                Linking.openURL("https://www.freepik.com/icon/task-list_9329651#fromView=search&term=todo+list&page=1&position=1&track=ais").catch((err) => console.error("Error", err))
            }>Icon by Azland Studio (Freepik)</Text>
            <Text style={{ marginBottom: 15 }} onPress={() =>
                Linking.openURL("https://github.com/IrvanSN").catch((err) => console.error("Error", err))
            }>Developed by Irvan Surya Nugraha (1203210007)</Text>

            <TouchableOpacity
                style={styles.clearButton}
                delayLongPress={3000}
                onPressIn={() => showMessage({
                    message: 'Tekan dan tahan tiga detik untuk menghapus semua data yang tersimpan!',
                    type: 'info',
                    style: {paddingTop: insets.top}}
                )}
                onLongPress={() => handleClearData()}
            >
                <Text style={styles.clearButtonText}>Clear Data</Text>
            </TouchableOpacity>
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
    content: {
        fontSize: 18,
        marginBottom: 20,
    },
    clearButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
    },
    clearButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18,
    },
});

export default About;
