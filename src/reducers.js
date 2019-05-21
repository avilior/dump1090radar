/*
import {
    joinRequested,
    messageAdded,
    userJoined,
    userLeft,
    usersRequested,
    userStartedTyping,
    userStoppedTyping,
} from "../../common/message-types";
*/

import { radarUpdate } from "./actions/actionTypes";

import LatLon from 'geodesy/latlon-spherical';

const yow_lat = 45.320165386;
const yow_lon = -75.668163994;
const home_lat = 45.25056;
const home_lon = -75.89996;

const YOW = new LatLon(yow_lat, yow_lon);
const POI = new LatLon(home_lat, home_lon);
const distance_home_yow = POI.distanceTo(YOW);
console.log(`Distance home to yow ${distance_home_yow} meters`);
console.log(`Initial Bearing home to yow ${POI.initialBearingTo(YOW)}`);
console.log(`Final Bearing home to yow ${POI.finalBearingTo(YOW)}`);


const handlers = {

    /*
    [joinRequested]: ({ state, payload: currentUser }) => ({
        ...state,
        currentUser,
    }),
    // Note: currentUser is already in users
    [userJoined]: ({ state, payload: user }) => ({
        ...state,
        users: state.users.concat([user]),
    }),
    [typingStarted]: ({ state }) => ({
        ...state,
        currentUserIsTyping: true,
    }),
    [typingStopped]: ({ state }) => ({
        ...state,
        currentUserIsTyping: false,
    }),
    [messageAdded]: ({ state, payload: message, metadata: { createdAt } }) => ({
        ...state,
        messages: state.messages.concat([{ ...message, createdAt }]),
    }),
    [usersRequested]: ({ state, payload: users }) => ({
        ...state,
        users,
    }),
    [userLeft]: ({ state, payload: { userId } }) => ({
        ...state,
        users: state.users.filter(({ id }) => id !== userId),
    }),
    [userStartedTyping]: ({ state, payload: { userId } }) => ({
        ...state,
        userIdsTyping: {
            ...state.userIdsTyping,
            [userId]: true,
        },
    }),
    [userStoppedTyping]: ({ state, payload: { userId } }) => ({
        ...state,
        userIdsTyping: Object.keys(state.userIdsTyping)
            .filter((key) => key !== userId.toString())
            .reduce((accum, key) => ({ ...accum, [key]: true }), {}),
    }),

*/
};

export default (state = {}, { type, payload, metadata }) => {
    //console.log("Received message with type:",type);

    if (type === radarUpdate){

        if (payload.icao24) {

            // add the item to the table
            state.ICAO24Table[payload.icao24] = payload;

            // filter the table
            const time_now = Date.now();
            let new_icao_table = {};  // to display the table
            let new_markers = {};     // to display the map
            Object.values(state.ICAO24Table).forEach(row  =>{

                const age = (time_now - Date.parse(row.ts+'Z'))/1000.0;
                row.age = age | 0; // truncate to int

                if ( age < state.maxAge){
                    if (state.showLatLon) {
                        new_icao_table[row.icao24] = row;
                    }else{
                        // if we dont show lat lon in the table then dont include rows that dont have lat lon in the table
                        if (row.lat && row.lon) {
                            new_icao_table[row.icao24] = row
                        }
                    }
                    if (row.lat && row.lon){

                        const planeLatLon = new LatLon(row.lat, row.lon);
                        const distance = (POI.distanceTo(planeLatLon)/1000.0) | 0;
                        const bearing  = POI.initialBearingTo(planeLatLon) | 0;

                        row.poi_distance = distance;
                        row.poi_bearing  = bearing;

                        let current_icao =  {icao:row.icao24, callsign: row.callsign, altitude: row.altitude, trail:[], current:[]};
                        if (row.icao24 in state.markers){
                            current_icao = state.markers[row.icao24];
                        }
                        const latlon = [row.lat, row.lon];
                        current_icao.current = latlon;
                        if (current_icao.trail.length === 0) {
                            current_icao.trail.push(latlon);
                        }else{
                            const last_lastlon = current_icao.trail[current_icao.trail.length - 1];
                            if (last_lastlon[0] !== latlon[0] || last_lastlon[1] !== latlon[1]){
                                current_icao.trail.push(latlon);
                            }
                        }
                        new_markers[row.icao24] = current_icao;
                    }
                }
            });

            state.ICAO24Table = new_icao_table;
            state.markers = new_markers;
            return Object.assign({},state);
        }
    }else{
        const handler = handlers[type];
        if (handler) {
            const result = handler({ state, payload, metadata });
            console.log(JSON.stringify(state.ICAO24Table, null, 2));
            return result;
        }
    }

    return state;
};