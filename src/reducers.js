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
            let new_icao_table = {};
            let new_markers = {};
            Object.values(state.ICAO24Table).forEach(item=>{

                if ( ((time_now - Date.parse(item.ts+'Z'))/1000) < state.maxAge){
                    new_icao_table[item.icao24] = item;
                    if (item.lat && item.lon){
                        let current_icao =  {icao:item.icao24, trail:[], current:[]};
                        if (item.icao24 in state.markers){
                            current_icao = state.markers[item.icao24];
                        }
                        const latlon = [item.lat, item.lon]
                        current_icao.current = latlon;
                        if (current_icao.trail.length == 0) {
                            current_icao.trail.push(latlon);
                        }else{
                            const last_lastlon = current_icao.trail[current_icao.trail.length - 1];
                            if (last_lastlon[0] != latlon[0] || last_lastlon[1] != latlon[1]){
                                current_icao.trail.push(latlon);
                            }
                        }
                        new_markers[item.icao24] = current_icao;
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