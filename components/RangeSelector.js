import React from 'react'
import { View, Text, Modal, ScrollView } from 'react-native'
import Button from './Button'
import ItemPicker from './ItemPicker'

export default class RangeSelector extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showPicker: false
    }
  }

  render() {
    return (
      <View>
        <Button 
          bgColor={this.props.selectedItem ? 'rgb(0, 102, 204)' : 'navy'}
          onPress={() => this.setState({ showPicker: true })}>{
          this.props.selectedItem ? this.props.selectedItem.text : this.props.unselectedLabel
        }</Button>
        <ItemPicker 
          onClearSelection={() => {
            this.props.onClearSelection()
            this.setState({ showPicker: false })
          }}
          onDismiss={() => this.setState({ showPicker: false })}
          onSelect={(val) => {
            this.setState({ showPicker: false })
            this.props.onSelect(val)
          }}
          show={this.state.showPicker}
          onSelectItem={(val) => {
            this.props.onSelectItem(val)
            this.setState({ showPicker: false })
          }}
          items={this.props.items}
        />
      </View>
    )
  }
}