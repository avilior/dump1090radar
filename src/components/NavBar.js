import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const NavBar = () => {
    return(
        <div>
            <AppBar color="primary" position="static">
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        1090dump Radar
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
};

export default NavBar;