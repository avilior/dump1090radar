import React, {Component} from 'react';
import './App.css';
import NavBar from './components/NavBar';
import RadarTable from './components/RadarTable';
import RadarMap from './components/map';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    radar: {
        height:800,
        width:'100%',
    },
    table: {
        height: 800,
        width: '100%',
    }
});


class App extends Component {
  render(){
    const { classes } = this.props;
    return (
        <div className="App">
          <NavBar />
            <Grid container className={classes.root} wrap={'nowrap'}>
                <Grid item className={classes.radar}  md={12}>
                    <RadarMap />
                </Grid>
                <Grid item className={classes.table}  md={12}>
                    <RadarTable />
                </Grid>
            </Grid>
        </div>
    );
  }
}

export default withStyles(styles)(App);
