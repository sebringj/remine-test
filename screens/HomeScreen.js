import React from 'react'
import {
  SafeAreaView,
  Image, Platform, ScrollView, StyleSheet,
  Text, TouchableOpacity, TouchableHighlight, View, ListView,
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
import { advancedSearch, simpleSearch } from '../utils/surch'

const LIMIT = 20

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
      scrollY: new Animated.Value(0),
      offsetSearchControls: new Animated.Value(1)
    }
 
    // google distinguises private data as "data_"
    // and private methods as "_member"
    // but whatever you guys do, i'll swim with your current
    this.originalData_ = []
    this.searchResults_ = []
    this.offset_ = 0

    this.currentScrollY_ = 0
    this.lastScrollY_ = 0
    this.scrollDown_ = false
    this.hiddenControls_ = false
  }

  componentDidMount() {
    this.state.scrollY.addListener(this._onScroll)

    return API.getLocations()
      .then((response) => {
        // add lowered so it matches easier
        this.originalData_ = response.data.map(item => {
          item.freeText = item.address && item.address.toLowerCase()
          return item
        })
        this.searchResults_ = this.originalData_
        this.setState({ isLoading: false, data: this.searchResults_.slice(0, LIMIT) })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillUnmount() {
    this.state.scrollY.removeListener(this._onScroll)
  }

  _animateSearchControls = (val) => {
    Animated.timing(this.state.offsetSearchControls).stop()
    Animated.timing(
      this.state.offsetSearchControls, {
        toValue: val,
        duration: 1000,
        useNativeDriver: true
      }
    ).start()
  }

  _showSearchControls = () => {
    this.hiddenControls_ = false
    this._animateSearchControls(1)
  }

  _hideSearchControls = () => {
    this.hiddenControls_ = true
    this._animateSearchControls(0)
  }

  _onScroll = ({value}) => {
    this.lastScrollY_ = this.currentScrollY_
    this.currentScrollY_ = value
    
    if (this.currentScrollY_ > 50 && this.currentScrollY_ > this.lastScrollY_ && !this.scrollingDown_) {
      this.scrollingDown_ = true
      this._hideSearchControls()
    } else if (this.currentScrollY_ > 50 && this.currentScrollY_ < this.lastScrollY_ && this.scrollingDown_) {
      this.scrollingDown_ = false
      this._showSearchControls()
    } else if (this.currentScrollY_ <= 50 && this.hiddenControls_) {
      this._showSearchControls()
    }
  }

  _surch = async () => {
    this.searchResults_ = simpleSearch(this.originalData_, this.state) 
    this.offset_ = 0
    this.setState({ data: this.searchResults_.slice(0, LIMIT) }, () => {
      if (this.refs && this.refs.flatList)
        this.refs.flatList.scrollToOffset({ offset: 0, animated: false})
    })
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

  _onSelectionChange = async (key, val) => {
    wait(250)
    this.setState({ [key]: val }, () => {
      this._surch()
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

  _onEndReached = () => {
    if (this.searchResults_.length <= this.offset_)
      return
    if (!this.onEndReachedCalledDuringMomentum_) {
      this.offset_ += LIMIT
      const appendData = this.searchResults_.slice(this.offset_, this.offset_ + LIMIT)
      this.setState({ data: this.state.data.concat(appendData) })
      this.onEndReachedCalledDuringMomentum_ = false
    }
  }

  _onRangeSelectorOpen = () => {
    this.refs.search.focus()
    this.refs.search.blur()
    Keyboard.dismiss()
    this.setState({})
  }

  render() {
    if (this.state.isLoading)
      return (
        <SafeAreaView style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </SafeAreaView>
      )

    const translateY = this.state.offsetSearchControls.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 0]
    })

    return (
      <SafeAreaView style={[styles.container, {overflow: 'hidden'}]}>
        <View style={{ zIndex: 1 }}>
          <View style={styles.coverSafeAreaTop}></View>
          <TouchableHighlight 
            style={[styles.welcomeContainer,
              { width: Dimensions.get('window').width}
            ]}
            onPress={() => {
              Keyboard.dismiss()
            }}
            underlayColor="#fff"
          >
            <Image
              source={require('../assets/images/remine.png')}
              style={styles.welcomeImage}
            />
          </TouchableHighlight>
          <Animated.View
            style={[styles.searchControls, 
              {
                transform: [{ translateY }],
                width: Dimensions.get('window').width
              }
            ]}
          >
            <Search
              ref="search"
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
                onOpen={this._onRangeSelectorOpen}
                unselectedLabel="Beds ?"
                selectedItem={this.state.beds}
                items={getRangeList('Bed', 'Beds', 5)} 
                onSelectItem={(item) => this._onSelectionChange('beds', item)}
                onClearSelection={() => this._onSelectionChange('beds', undefined)}
                />
              <RangeSelector 
                onOpen={this._onRangeSelectorOpen}
                unselectedLabel="Baths ?"
                selectedItem={this.state.baths}
                items={getRangeList('Bath', 'Baths', 5)} 
                onSelectItem={(item) => this._onSelectionChange('baths', item)}
                onClearSelection={() => this._onSelectionChange('baths', undefined)}
              />
              <RangeSelector 
                onOpen={this._onRangeSelectorOpen}
                unselectedLabel="Building Type ?"
                selectedItem={this.state.buildingType}
                items={this.state.buildingTypes} 
                onSelectItem={(item) => this._onSelectionChange('buildingType', item)}
                onClearSelection={() => this._onSelectionChange('buildingType', undefined)}
                />
            </FlexRow>
          </Animated.View>
        </View>
        <FlatList
          ref="flatList"
          data={this.state.data}
          keyExtractor={this._keyExtractor}
          ListEmptyComponent={this._renderEmptyComponent}
          contentContainerStyle={styles.flatList}
          renderItem={SearchResult}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum_ = false; }}
          onEndReached={this._onEndReached}
          removeClippedSubviews={true}
          scrollEventThrottle={16}
          keyboardDismissMode='on-drag'
          onStartShouldSetResponderCapture={() => Keyboard.dismiss()}
          onResponderReject={() => Keyboard.dismiss()}
          onScroll={Animated.event([
            { nativeEvent: {contentOffset: {y: this.state.scrollY}} }
          ])}
        />
      </SafeAreaView>
    );
  }
}

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const SearchResult = ({item}) => (
  <View style={styles.searchResultContainer}>
    <Ionicons name="md-home" color="#ccc" size={20} style={{ marginRight: 20 }} />
    <Text style={styles.searchResultText}>
      <Text style={styles.searchResultTextHighlight}>{item.address}</Text> - beds: {item.beds} - baths: {item.baths}
    </Text>
  </View>
)

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
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    height: 50,
    zIndex: 11,
  },
  welcomeImage: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  coverSafeAreaTop: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: '#fff',
    top: -45,
    height: 45,
    width: '100%'
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  navigationFilename: {
    marginTop: 5,
  },
  flatList: {
    paddingTop: 130
  },
  searchControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    zIndex: 9,
    backgroundColor: '#fff',
    height: 100
  },
  searchResultContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    flex: -1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 20
  },
  searchResultText: {
    fontSize: 14,
    width: Dimensions.get('window').width - 80
  },
  searchResultTextHighlight: {
    fontWeight: '700'
  }
});
