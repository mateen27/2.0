import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';
import axios from 'axios';
import { clearUser } from '../../redux/store/slices/UserSlice';

const VerificationCode = ({ navigation }: any) => {
    // Access user data from the Redux store
    const userID = useSelector((state: RootState) => state.user.data);
    console.log('userData of the user', userID);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const refs = useRef<Array<TextInput | null>>([null, null, null, null, null, null]);

    // Redux dispatch function
    const dispatch = useDispatch();

    const handleChangeText = (index: number, value: string) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 5) {
            const nextIndex = index + 1;
            const nextRef = refs.current[nextIndex];
            if (nextRef) {
                nextRef.focus();
            }
    }
};

const handleOTPVerification = async (userData: string, otp: any) => {
    try {
        // Combining the OTP array into a single string
        const combinedOTP: string = otp.join('');
        // console.log('otp', combinedOTP);

        // sending the data to the server
        const response = await axios.post(`http://192.168.29.181:3001/api/user/verify/${userID}`, { otp: combinedOTP });

        if ( response ) {
            console.log('response', response);
            Alert.alert('Success', 'OTP Verified Successfully');
            // Dispatch clearUser action to clear Redux store data
            dispatch(clearUser());
            navigation.navigate('Login');
        }

    } catch (error) {
        console.log('error handling the verification of the otp', error);
        throw error;
    }
}
    
    
  return (
    <View style = { styles.container }>
      <Text style = { styles.textStyle }>Enter Verification Code</Text>
      <Text style = {{ color: '#fff', marginTop: 10, fontWeight: '400', textAlign: 'center', fontSize: 14 }}>Enter the 6-digit confirmation code we sent to your Mail.</Text>
      <Pressable><Text style = {{ color : 'gray', marginTop: 12, textAlign: 'center', fontSize: 12, fontWeight: '500' }}>Request New One</Text></Pressable>
      <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (refs.current[index] = ref)}
                        style={styles.otpBox}
                        value={value}
                        onChangeText={(text) => handleChangeText(index, text)}
                        keyboardType="numeric"
                        maxLength={1}
                        autoFocus={index === 0} // Auto-focus on the first input box
                    />
                ))}
            </View>

            <View style={styles.loginButtonContainer}>
            <TouchableOpacity onPress={() => handleOTPVerification(userID, otp)}>
              <Text style={styles.loginButton}>Verify</Text>
            </TouchableOpacity>
          </View>
    </View>
  )
}

export default VerificationCode

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        color : '#fff',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '700'
    },
    otpContainer: {
        flexDirection: 'row',
        marginTop: 50,
        alignSelf: 'center',
    },
    otpBox: {
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        color: '#fff',
        width: 40,
        height: 40,
        marginHorizontal: 5,
        fontSize: 20,
        textAlign: 'center',
    },
    loginButtonContainer: {
        alignItems: "center",
        marginTop: "15%",
      },
      loginButton: {
        color: "white",
        backgroundColor: "#333",
        padding: "4%",
        borderRadius: 30,
        width: responsiveScreenWidth(40),
        textAlign: "center",
        fontWeight: "700",
      },
})