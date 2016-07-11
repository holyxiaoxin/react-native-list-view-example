import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  Dimensions,
} from 'react-native';
import mockResponse from './mockResponse';
import loadingIcon from './img/ring.gif';

const { width, height } = Dimensions.get('window');

const ROWS_PER_REQUEST = 8;

const Row = ({ imgUri, desc, isLoader, rowId }) => {
  return (
    isLoader ?
      <View style={styles.loadingWrapper}>
        <Image source={loadingIcon} style={styles.loading}/>
      </View>
    :
      <View style={styles.mediaWrapper}>
        <Image source={imgUri} style={styles.image}/>
        <View style={styles.textWrapper}>
          <Text numberOfLines={5}>{`${rowId}: ${desc}`}</Text>
        </View>
      </View>
  )
};

export default class ReactNativeListView extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.data = [{ isLoader: true }];
    this.state =  {
      dataSource: ds.cloneWithRows(this.data),
    };
    this.currentRowIndex = 0;
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = () => {
    setTimeout(() => {
      this.data = this.data.slice(0, this.data.length-1).concat(mockResponse.slice(this.currentRowIndex, this.currentRowIndex + ROWS_PER_REQUEST)).concat(this.data.slice(this.data.length-1));
      console.log(this.data);
      this.currentRowIndex += ROWS_PER_REQUEST;
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(this.data) });
    }, 2000)
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionId, rowId) => <Row {...rowData} rowId={rowId}/>}
          onEndReached={this.fetchData}
          enableEmptySections
        />
      <View style={styles.sticky}><Text style={styles.counter}>{this.data.length - 1}</Text></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 30
  },
  mediaWrapper: {
    flexDirection: 'row',
    width: width,
    paddingHorizontal: 50,
    marginVertical: 15,
  },
  loadingWrapper: {
    alignItems: 'center',
    width
  },
  loading: {
    height: 50,
    width: 50
  },
  textWrapper: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 20
  },
  sticky: {
    position: 'absolute',
    backgroundColor: 'rgba(235, 249, 255, 0.7)',
    top: 20,
    width
  },
  counter: {
    textAlign: 'center',
    fontSize: 20
  }
});

AppRegistry.registerComponent('ReactNativeListView', () => ReactNativeListView);
