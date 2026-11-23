import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingInputUserName } from '../components/OnboardingInputUserName';


export interface OnboardingInputUserNameScreenProps {
    onNext: () => void;
}

export const OnboardingInputUserNameScreen: React.FC<OnboardingInputUserNameScreenProps> = ({
    onNext,
}) => {
    return (
        <SafeAreaView >
            <OnboardingInputUserName onNext={onNext} />
        </SafeAreaView>
    );
};

