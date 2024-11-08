// src/components/Profile.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/api';

function Profile() {
    const [profile, setProfile] = useState({
        username: '',
        displayName: '',
        email: '',
        phone: '',
        avatar: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await api.get('/user/profile');
                setProfile(response.data);
            } catch (error) {
                console.error("获取用户信息失败", error);
                Alert.alert("错误", "无法加载用户信息");
            }
        }
        fetchProfile();
    }, []);

    const handleInputChange = (field, value) => {
        setProfile((prevProfile) => ({ ...prevProfile, [field]: value }));
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            handleAvatarUpload(uri);
        }
    };

    const handleAvatarUpload = async (uri) => {
        try {
            const formData = new FormData();
            formData.append('avatar', {
                uri,
                name: 'avatar.jpg',
                type: 'image/jpeg'
            });
            const response = await api.post('/user/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile((prevProfile) => ({ ...prevProfile, avatar: response.data.avatar }));
            Alert.alert("成功", "头像上传成功！");
        } catch (error) {
            console.error("头像上传失败", error);
            Alert.alert("错误", "头像上传失败");
        }
    };

    const toggleEditMode = () => {
        setEditMode((prev) => !prev); 
        setPassword('');
        setConfirmPassword('');
        setPasswordError('');
    };

    const handleSave = async () => {
        if (password && password !== confirmPassword) {
            setPasswordError('密码不一致，请重新输入');
            return;
        }
        try {
            await api.put('/user/profile', {
                displayName: profile.displayName,
                email: profile.email,
                phone: profile.phone,
                password: password || undefined,
            });
            setEditMode(false);
            Alert.alert("成功", "个人信息已更新");
        } catch (error) {
            console.error("保存用户信息失败", error);
            Alert.alert("错误", "保存用户信息失败");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>个人信息</Text>
                <Image
                    source={{ uri: profile.avatar ? `${api.defaults.baseURL}${profile.avatar}` : '默认头像路径' }}
                    style={styles.avatar}
                />
                {editMode && (
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        <Text style={styles.imagePickerText}>选择头像</Text>
                    </TouchableOpacity>
                )}
                <TextInput
                    style={[styles.input, { backgroundColor: editMode ? '#f2f2f2' : '#e9e9e9' }]}
                    placeholder="用户名"
                    value={profile.username}
                    editable={false}
                />
                <TextInput
                    style={styles.input}
                    placeholder="显示名"
                    value={profile.displayName}
                    editable={false}
                    //onChangeText={(value) => handleInputChange('displayName', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="邮箱"
                    value={profile.email}
                    editable={editMode}
                    onChangeText={(value) => handleInputChange('email', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="电话"
                    value={profile.phone}
                    editable={editMode}
                    onChangeText={(value) => handleInputChange('phone', value)}
                />
                {editMode && (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="新密码"
                            secureTextEntry
                            value={password}
                            onChangeText={(value) => setPassword(value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="确认新密码"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={(value) => setConfirmPassword(value)}
                        />
                        {!!passwordError && <Text style={styles.error}>{passwordError}</Text>}
                    </>
                )}
                <View style={styles.buttonContainer}>
                    {editMode ? (
                        <>
                            <Button title="保存修改" onPress={handleSave} color="#6200ea" />
                            <Button title="取消" color="red" onPress={toggleEditMode} />
                        </>
                    ) : (
                        <Button title="修改个人信息" onPress={toggleEditMode} color="#6200ea" />
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 16,
    },
    imagePicker: {
        alignSelf: 'center',
        marginBottom: 16,
        padding: 10,
        backgroundColor: '#6200ea',
        borderRadius: 5,
    },
    imagePickerText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 16,
        backgroundColor: '#ffffff',
    },
    error: {
        color: 'red',
        marginBottom: 16,
        alignSelf: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
});

export default Profile;
