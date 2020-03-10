import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import GetLocation from 'react-native-get-location';
import Geolocation from '@react-native-community/geolocation';

export default class App extends Component {
	findCoordinates = () => {
		// GetLocation.getCurrentPosition({
		// 	enableHighAccuracy: true,
		// 	timeout: 15000,
		// })
		// .then(position => {
		// 	console.log(position);
		//     const loc = JSON.stringify(position);
        //     this.props.setCoords(loc.longitude,loc.latitude);
		// })
		// .catch(error => {
		// 	const { code, message } = error;
		// 	console.warn(code, message);
		// })
		Geolocation.getCurrentPosition(info => console.log(info));
	}; 

	render() {
		return (
			<View>
				<TouchableOpacity onPress={this.findCoordinates}>
					<Text>Find My Coords?</Text>
				</TouchableOpacity>
			</View>
		);
	}
}
