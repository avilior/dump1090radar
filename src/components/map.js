import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import {connect} from "react-redux";

/*
var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});
 */
const yow_lat = 45.320165386;
const yow_lon = -75.668163994;
const home_lat = 45.25056;
const home_lon = -75.89996;

const tiles_URL = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png';
const tiles_Attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

class RadarMap extends Component {
    constructor(props) {
        super(props);
    }
/*
    addMarker = (e) => {
        const {markers} = this.state;
        markers.push(e.latlng);
        this.setState({markers})
    };

 */   render() {
        //http://a.tile.stamen.com/toner/${z}/${x}/${y}.png
        //http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        //<Polyline key={`polyline-${idx}`} color="red" positions={p.trail}/>
        return (
            <Map
                center={[yow_lat, yow_lon]}
                //onClick={this.addMarker}
                zoom={13}
            >

                <TileLayer
                    attribution={tiles_Attribution}
                    url = {tiles_URL}
                />
                {this.props.markers.map((p, idx) =>
                    <Marker key={`marker-${idx}`} position={p.current}>
                        <Popup>
                            <span>{p.icao} <br/> Callsign: {p.callsign} Altitude: {p.altitude} </span>
                        </Popup>
                    </Marker>
                )}

                {this.props.markers.map((p, idx) =>
                    <Polyline color="red" positions={p.trail}/>
                )}

            </Map>
        );
    }
}
const mapStateToProps = (state, ownProps = {} ) => {
    return {
        markers: Object.values(state.markers),
    }
};

export default connect(mapStateToProps)(RadarMap);