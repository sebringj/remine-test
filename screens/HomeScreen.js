import React from 'react'
import {
  SafeAreaView,
  Image, Platform, ScrollView, StyleSheet,
  Text, TouchableOpacity, View, ListView,
  TextInput, ActivityIndicator, Alert, FlatList,
  Dimensions, Keyboard, Animated
} from 'react-native'
import { WebBrowser } from 'expo'
import { MonoText } from '../components/StyledText'
import API from '../API'
import _ from 'lodash'
import { Ionicons } from '@expo/vector-icons'
import getRangeList from '../utils/getRangeList'
import { FlexRow, RangeSelector, Search } from '../components'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
 
    this.state = {
      isLoading: true,
      search: '',
      buildingTypes: API.getBuildingTypes(),
      buildingType: undefined,
      beds: undefined,
      baths: undefined,
      data: [],
      scrollY: new Animated.Value(0)
    }
 
    this.originalData = []
  }

  componentDidMount() {
    return API.getLocations()
      .then((response) => {
        this.originalData = response.data
        const data = this.originalData.slice(0, 100)
        this.setState({ isLoading: false, data })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // allows "searching" match-any style based on ranking and in any order case insensitive
  _surch () {

    try {
      let { baths, beds, buildingType, search } = this.state

      let skipSort = true
      let re
      if (search) {
        // allow arbitrary order and remove stopwords
        const cleaned = search.split(/\b/g).map(w => w.toLowerCase().trim().replace(/[|&;$%@"<>()+,]/g, ''))
        for (let i = 0; i < cleaned.length; i++) {
          if (cleaned[i].trim() === '' || STOP_WORDS.indexOf(cleaned[i]) > -1) {
            cleaned.splice(i, 1)
            i--
          }
        }
  
        if (cleaned.length)
          re = new RegExp(`\\b(${cleaned.join('|')})\\b`, 'ig')
      }
  
      const data = []
  
      const MAX = 50
      let counter = 1
  
      // put at most 50 items in list
      for (let i = 0; i < this.originalData.length; i++) {
        if (counter > MAX) break
    
        let cloned = {...this.originalData[i]}
  
        if (baths && baths.value !== cloned.baths)
          continue
        if (beds && beds.value !== cloned.beds)
          continue
        if (buildingType && _.get(buildingType, 'value') !== cloned.buildingType.name)
          continue
  
        cloned.rank = 0
        if (re) {
          skipSort = false
          const phrase = `${_.get(cloned, 'buildingType.name', '')} ${cloned.address}`
          const match = phrase.match(re)
          if (!match || !match.length)
            continue
          cloned.rank = match.length
        }
  
        data.push(cloned)
        counter++
      }
  
      if (!skipSort) {
        const compare = (a, b) => {
          if (a.rank > b.rank) return -1
          if (a.rank < b.rank) return 1
          return 0
        }
        data.sort(compare)
      } 
  
      this.setState({ data })
    } catch (err) {
      console.log(err)
    }
  }

  ListViewItemSeparator = () => {
    return (
      <View
        style={{
          height: .5,
          width: "100%",
          backgroundColor: "#000",
        }}
      />
    );
  }

  _onSelectionChange = (key, val) => {
    this.setState({ [key]: val }, () => {
      this._surch()
      if (this.refs && this.refs.flatList)
        this.refs.flatList.scrollToOffset(0)
    })
  }

  _keyExtractor = (item, index) => item.id + ''

  _renderEmptyComponent = () => {
    if (this.state.isLoading)
      return null
    return (
      <View style={{
        flex: -1,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text>No Results</Text>
      </View>
    )
  }

  render() {
    if (this.state.isLoading)
      return (
        <SafeAreaView style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </SafeAreaView>
      )

    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })

    const translateY = this.state.scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -100],
      extrapolate: 'clamp'
    })

    return (
      <SafeAreaView style={[styles.container, {overflow: 'hidden'}]}>
        <View style={{
          zIndex: 1,
        }}>
          <TouchableOpacity style={[styles.welcomeContainer, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: Dimensions.get('window').width,
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: '#fff',
            height: 50,
            zIndex: 11,
          }]}
            onPress={() => {
              Keyboard.dismiss()
            }}
            underlayColor="transparent"
          >
            <Image
              source={require('../assets/images/remine.png')}
              style={styles.welcomeImage}
            />
          </TouchableOpacity>
          <Animated.View
            style={{
              position: 'absolute',
              top: 50,
              left: 0,
              zIndex: 10,
              width: Dimensions.get('window').width,
              backgroundColor: '#fff',
              height: 100,
              opacity: opacity,
              transform: [
                {
                  translateY: translateY
                }
              ]
            }}
          >
            <Search
              value={this.state.search}
              onChangeText={text => {
                this.setState({ search: text }, () => {
                  this._surch()
                })
              }}
              onClear={() => this.setState({ search: '' }, () => {
                this._surch()
              })}
            />
            <FlexRow>
              <RangeSelector 
                unselectedLabel="Baths ?"
                selectedItem={this.state.baths}
                items={getRangeList('Bath', 'Baths', 5)} 
                onSelectItem={(item) => this._onSelectionChange('baths', item)}
                onClearSelection={() => this._onSelectionChange('baths', undefined)}
              />
              <RangeSelector 
                unselectedLabel="Beds ?"
                selectedItem={this.state.beds}
                items={getRangeList('Bed', 'Beds', 5)} 
                onSelectItem={(item) => this._onSelectionChange('beds', item)}
                onClearSelection={() => this._onSelectionChange('beds', undefined)}
                />
              <RangeSelector 
                unselectedLabel="Building Types ?"
                selectedItem={this.state.buildingType}
                items={this.state.buildingTypes} 
                onSelectItem={(item) => this._onSelectionChange('buildingType', item)}
                onClearSelection={() => this._onSelectionChange('buildingType', undefined)}
                />
            </FlexRow>
          </Animated.View>
        </View>
        <ScrollView 
          scrollEventThrottle={16}
          onScroll={Animated.event([
            { nativeEvent: {contentOffset: {y: this.state.scrollY}} }
          ])}
          style={styles.container} 
          contentContainerStyle={styles.contentContainer}>
          
          <FlatList
            ref="flatList"
            data={this.state.data}
            keyExtractor={this._keyExtractor}
            ListEmptyComponent={this._renderEmptyComponent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 130
            }}
            renderItem={({item}) => (
              <View style={{
                borderBottomWidth: 1,
                borderBottomColor: '#f2f2f2',
                flex: -1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row',
                padding: 20
              }}>
                <Ionicons name="md-home" color="#ccc" size={20} style={{ marginRight: 20 }} />
                <Text style={{
                  fontSize: 14,
                  width: Dimensions.get('window').width - 80
                }}>
                  <Text style={{ fontWeight: '600' }}>{item.address}</Text> - beds: {item.beds} - baths: {item.baths}
                </Text>
              </View>
            )}
          />

        </ScrollView>
      </SafeAreaView>
    );
  }
}

const STOP_WORDS = [
  'a', 'also', 'an', 'and', 'are', 'as', 'at', 'be', 'because', 'been',
  'but', 'by', 'for', 'from', 'has', 'have', 'however', 'if', 'in', 'is',
  'not', 'of', 'on', 'or', 'p', 'so', 'than', 'that', 'the', 'their', 'there',
  'these', 'this', 'to', 'was', 'were', 'whatever', 'whether', 'which', 'with', 'would'
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  rowView: {
    fontSize: 12,
    padding: 10,
    color: 'rgb(77,77,77)'
  },
  contentContainer: {
    
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  navigationFilename: {
    marginTop: 5,
  },
});
