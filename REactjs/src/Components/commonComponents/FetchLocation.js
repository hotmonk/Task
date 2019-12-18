import React from "react";
import { geolocated } from "react-geolocated";
 
class Demo extends React.Component {
    componentDidUpdate(prevProps)
    {
        if(this.props.coords!==prevProps.coords){
            this.props.setCoords(this.props.coords.longitude,this.props.coords.latitude)
        }
    }
    render() {
        return !this.props.isGeolocationAvailable ? (
            <div>Your browser does not support Geolocation</div>
        ) : !this.props.isGeolocationEnabled ? (
            <div>Geolocation is not enabled</div>
        ) : this.props.coords ? (
            <div>location Saved</div>
        )
         : (
            <div>Getting the location data & coordinates </div>
        );
    }
}
 
export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 6000,
})(Demo);