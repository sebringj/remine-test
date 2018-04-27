import React from 'react'
import { View } from 'react-native'

export default (props) => (
  <View style={{
    flex: -1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
  }}>
    {props.children}
  </View>
)