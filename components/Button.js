import React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'

export default (props) => (
  <TouchableHighlight 
    onPress={props.onPress}
    underlayColor="#ccc"
    style={{
      borderRadius: 20,
    }}>
    <View style={{
      flex: -1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderRadius: 20,
      backgroundColor: props.bgColor || 'navy',
    }}>
      <Text style={{ color: '#fff', fontWeight: '700' }}>
        {props.children}
      </Text>
    </View>
  </TouchableHighlight>
)