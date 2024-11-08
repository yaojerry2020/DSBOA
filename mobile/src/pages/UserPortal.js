// src/pages/UserPortal.js
import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import Profile from '../components/Profile';
import { useAuth } from '../contexts/AuthContext';

function UserPortal() {
    const [tabIndex, setTabIndex] = useState(0);
    const { logout } = useAuth();

    const handleTabChange = (index) => {
        setTabIndex(index);
    };

    return (
        <View style={styles.container}>
            {/* 顶部导航栏 */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>DSBOA</Text>
                <TouchableOpacity 
                    onPress={logout} 
                    style={styles.logoutButton}
                >
                    <Text style={styles.logoutButtonText}>退出</Text>
                </TouchableOpacity>
            </View>

            {/* 标签栏 */}
            <View style={styles.tabs}>
                <TouchableOpacity onPress={() => handleTabChange(0)} style={styles.tabButton}>
                    <Text style={styles.tabText}>工作台</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTabChange(1)} style={styles.tabButton}>
                    <Text style={styles.tabText}>聊天窗口</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTabChange(2)} style={styles.tabButton}>
                    <Text style={styles.tabText}>通讯录</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTabChange(3)} style={styles.tabButton}>
                    <Text style={styles.tabText}>我</Text>
                </TouchableOpacity>
            </View>

            {/* 内容 */}
            <View style={styles.content}>
                {tabIndex === 0 && <Text>工作台 - 开发中</Text>}
                {tabIndex === 1 && <Text>聊天窗口 - 开发中</Text>}
                {tabIndex === 2 && <Text>通讯录 - 开发中</Text>}
                {tabIndex === 3 && <Profile />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f7f7f7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#6200ea',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    logoutButton: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    tabText: {
        fontSize: 16,
        color: '#6200ea',
    },
    content: {
        flex: 1,
        marginTop: 20,
    },
});

export default UserPortal;
