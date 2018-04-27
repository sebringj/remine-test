import React from 'react'
import { View, Modal, Text, ScrollView, TouchableHighlight, Dimensions } from 'react-native'

export default (props) => (
  <Modal visible={props.show}
    transparent={true}
    animationType="none"
  >
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    }}>
      <ScrollView contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <TouchableHighlight 
          underlayColor="rgba(100, 100, 100, 0.1)"
          onPress={() => props.onClearSelection()}>
          <Text style={{ padding: 15, color: '#333', fontSize: 20 }}>CLEAR SELECTION</Text>
        </TouchableHighlight>
        {props.items.map(item => (
          <TouchableHighlight 
            underlayColor="rgba(100, 100, 100, 0.5)"
            key={item.value} onPress={() => props.onSelectItem(item)}>
            <Text style={{ padding: 15, color: '#333', fontSize: 20, fontWeight: '700' }}>{item.text}</Text>
          </TouchableHighlight>
        ))}
      </ScrollView>
    </View>
  </Modal>

)