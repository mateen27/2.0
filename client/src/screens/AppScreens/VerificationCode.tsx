import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';

const VerificationCode = () => {
    // Access user data from the Redux store
    const userData = useSelector((state: RootState) => state.user.data);
    console.log('userData of the user', userData);
    
    
  return (
    <View style = {{ flex: 1 , justifyContent : 'center' , alignItems : 'center', backgroundColor : 'black ' }}>
      <Text style = {{}}>VerificationCode</Text>
    </View>
  )
}

export default VerificationCode

const styles = StyleSheet.create({})