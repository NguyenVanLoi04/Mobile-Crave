import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../../../theme';
import { AppText } from '../../../components/ui';

const imgLogo = require('../../../../assets/images/logo.png');

export const SplashScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.boxContent}>
                {/* Linear gradient theo thông số từ Figma */}
                <LinearGradient
                    colors={[
                        'rgba(255, 255, 255, 0.90)', // 0%: #FFFFFF 90%
                        'rgba(255, 255, 255, 0.50)', // 50%: #FFFFFF 50%
                        'rgba(255, 255, 255, 0.20)', // 100%: #FFFFFF 20%
                    ]}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.imageFrame}
                >
                    <Image source={imgLogo} style={styles.image} resizeMode='contain' />
                </LinearGradient>
                <View>
                    <AppText style={styles.titleName} variant='h4' align='center'>Crave</AppText>
                </View>
                <View>
                    <AppText style={styles.subTitle} variant='h4' align='center'>Food discovery, refined.</AppText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: colors.primary,
        width: '100%',
        height: '100%',
    },
    boxContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageFrame: {
        width: 120,
        height: 120,
        borderRadius: radius.xl,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 90,
        height: 90,
    },
    titleName: {
        marginTop: 15,
        color: colors.bgWhite,
        fontSize: 34,
        fontWeight: 'bold',
        letterSpacing: -0.85,
    },
    subTitle: {
        color: colors.bgWhite90,
        fontSize: 15,
        fontWeight: 'medium',
    },
});
