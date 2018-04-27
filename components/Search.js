import React from 'react'
import { View, TouchableHighlight, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default (props) => (
  <View>
      <Ionicons name="ios-search" color="#777" size={20} style={{
        position: 'absolute', left: 25, top: 10
      }} />
      <TextInput 
        style={{
          padding: 10,
          fontSize: 16,
          marginLeft: 10,
          marginRight: 10,
          borderWidth: 1,
          borderRadius: 10,
          paddingLeft: 40
        }}
        placeholder="Search"
        value={props.value}
        onChangeText={text => props.onChangeText(text)}
      />
      {/* should make touchable icons at least 32x32 hit area (not actual visual size) */}
      {props.value ? <TouchableHighlight 
        onPress={props.onClear}
        style={{
          width: 32,
          height: 32,
          flex: -1,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          right: 15,
          top: 5 
        }}
      >
        <Ionicons name="ios-close-circle-outline" color="#777" size={20} />
      </TouchableHighlight> : null}
  </View>
)
