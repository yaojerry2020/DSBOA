// App.js - 移动端入口文件
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/contexts/AuthContext';  // 确保路径正确
import Login from './src/pages/Login';
import UserPortal from './src/pages/UserPortal';

const Stack = createStackNavigator();

function AppContent() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="UserPortal" component={UserPortal} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </NavigationContainer>
    );
}
