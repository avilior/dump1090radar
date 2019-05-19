import React from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';

const styles =  theme => ({
    root:{
        width: '100%',
        marginTop: theme.spacing.unit*3,
        overflowX: 'auto',
    },
    table:{
        minWidth: 700,
    },
});

/*
function createData(icao24, callsign, squawk,altitude,track,lat,lon,groundSpeed,verticalRate,ts){

    return {icao24,callsign,squawk,altitude,track,lat,lon,groundSpeed,verticalRate,ts};
}

const values = [
    createData("C076E8",null,4207,7300, null, null, null, null, null,"2019-05-12 12:24:12.317000" ),
];
*/


function RadarTable(props) {
    const { classes, showLatLon } = props;

    return <Paper className={classes.root}>
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>ICAO</TableCell>
                    <TableCell align="right">CALL</TableCell>
                    <TableCell align="right">SQWK</TableCell>
                    <TableCell align="right">ALT</TableCell>
                    <TableCell align="right">VRT</TableCell>
                    <TableCell align="right">GSPD</TableCell>
                    <TableCell align="right">HDG</TableCell>
                    {showLatLon && <TableCell align="right">LAT</TableCell>}
                    {showLatLon && <TableCell align="right">LON</TableCell>}
                    <TableCell align="right">TS</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.data.map(row => (
                    <TableRow key={row.icao24}>
                        <TableCell component="th" scope="row">{row.icao24}</TableCell>
                        <TableCell align="right">{row.callsign}</TableCell>
                        <TableCell align="right">{row.squawk}</TableCell>
                        <TableCell align="right">{row.altitude}</TableCell>
                        <TableCell align="right">{row.verticalRate}</TableCell>
                        <TableCell align="right">{row.groundSpeed}</TableCell>
                        <TableCell align="right">{row.track}</TableCell>
                        {showLatLon && <TableCell align="right">{row.lat}</TableCell>}
                        {showLatLon && <TableCell align="right">{row.lon}</TableCell>}
                        <TableCell align="right">{row.ts}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </Paper>;
}

RadarTable.propTypes = {
    classes: PropTypes.object.isRequired,
    showLatLon: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps = {} ) => {
    return {
        data : Object.values(state.ICAO24Table),
        showLatLon: state.showLatLon
    }
};

connect(mapStateToProps)(RadarTable);

export default withStyles(styles)(connect(mapStateToProps)(RadarTable));