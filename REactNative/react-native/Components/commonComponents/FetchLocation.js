import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export default class App extends Component {

	findCoordinates = () => {
		// console.log(Geolocation.getCurrentPosition);
		// Geolocation.getCurrentPosition(
		// 	position => {
        //         const location = JSON.stringify(position);
        //         this.props.setCoords(location.longitude,location.latitude);
				
		// 	},
		// 	error => Alert.alert(error.message),
		// 	{ enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
		// );
		if (true) {
			Geolocation.getCurrentPosition(
				(position) => {
					console.log(position);
				},
			);
		}
		console.log(Geolocation.getCurrentPosition)
		}

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
