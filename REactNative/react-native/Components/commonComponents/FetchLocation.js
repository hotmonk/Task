import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';


// export default class App extends Component {

// 	findCoordinates = () => {
// 		// console.log(Geolocation.getCurrentPosition);
// 		Locatio.getCurrentPosition(
// 			position => {
//                 const location = JSON.stringify(position);
//                 this.props.setCoords(location.longitude,location.latitude);
				 
// 			},
// 			error => Alert.alert(error.message),
// 			{ enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
// 		);
// 		if (true) {
// 			Geolocation.getCurrentPosition(
// 				(position) => {
// 					console.log(position);
// 				},
// 			);
// 		}
// 		console.log(Geolocation.getCurrentPosition)
// 		}

// 	render() {
// 		return (
// 			<View>
// 				<TouchableOpacity onPress={this.findCoordinates}>
// 					<Text>Find My Coords?</Text>
// 				</TouchableOpacity>
// 			</View>
// 		);
// 	}
// }



// export default class App extends Component {
// 	state = {
// 	  location: null,
// 	  errorMessage: null,
// 	};
  
// 	constructor(props) {
// 	  super(props);
// 	  if (Platform.OS === 'android' && !Constants.isDevice) {
// 		this.setState({
// 		  errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
// 		});
// 	  } else {
// 		this._getLocationAsync();
// 	  }
// 	}
  
// 	_getLocationAsync = async () => {
// 	  let { status } = await Permissions.askAsync(Permissions.LOCATION);
// 	  if (status !== 'granted') {
// 		this.setState({
// 		  errorMessage: 'Permission to access location was denied',
// 		});
// 	  }
  
// 	  let location = await Location.getCurrentPositionAsync({});
// 	  this.setState({ location });
// 	};
  
// 	render() {
// 	  let text = 'Waiting..';
// 	  if (this.state.errorMessage) {
// 		text = this.state.errorMessage;
// 	  } else if (this.state.location) {
// 		text = JSON.stringify(this.state.location);
// 	  }
  
// 	  return (
// 		<View style={styles.container}>
// 		  <Text style={styles.paragraph}>{text}</Text>
// 		</View>
// 	  );
// 	}
//   }
  
//   const styles = StyleSheet.create({
// 	container: {
// 	  flex: 1,
// 	  alignItems: 'center',
// 	  justifyContent: 'center',
// 	  paddingTop: Constants.statusBarHeight,
// 	  backgroundColor: '#ecf0f1',
// 	},
// 	paragraph: {
// 	  margin: 24,
// 	  fontSize: 18,
// 	  textAlign: 'center',
// 	},
//   });

export default class 	FetchLocation extends Component {
	state ={
		location: null,
		errorMessage: null,
		coords: {
			lat: null,
			long: null
		}

	}

	// componentWillMount(){
	// 	this._getLocation();
	// }


	_getLocation= async () => {
		const {status} =await Permissions.askAsync(Permissions.LOCATION);

		if(status!= 'granted'){
			console.log('PERMISSION NOT GRANTED!');

			this.setState({
				errorMessage: 'PERMISSION NOT GRANTED'
			})
		}

	const userLocation = await Location.getCurrentPositionAsync();

	this.setState({
			location: userLocation,
			lat: userLocation.coords.latitude,
			long: userLocation.coords.longitude
	})
	updatecoords=() =>{
		this.props.setCoords(this.state.long,this.state.lat)
	}
	updatecoords();
	};

	// componentDidUpdate(prevProps)
	// {
	// 	if(this.state.coords!==prevProps.coords){
	// 	this.props.setCoords(this.state.long,this.state.lat)
	// 	}
	// }

	render() {
		return (
			<View>
				<TouchableOpacity onPress={this._getLocation} >

		<Text>Find My Coords? {JSON.stringify(this.state.lat)} {JSON.stringify(this.state.long)}</Text>
				</TouchableOpacity>
			</View>
		);
	}
}