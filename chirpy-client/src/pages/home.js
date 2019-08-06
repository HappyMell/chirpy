import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Chirp from '../components/Chirp';

class Home extends Component {
    state = {
        chirps: null
    }

    componentDidMount() {
        axios
            .get('/chirps')
            .then(res => {
                this.setState({
                    chirps: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        let recentChirpsMarkup = this.state.chirps ? (
            this.state.chirps.map(chirp => <Chirp key={chirp.chirpId} chirp={chirp} />)
        ) : <p>Loading...</p>
        return (
            <Grid container spacing={2}>
                <Grid item sm={8} xs={12}>
                    {recentChirpsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>Profile...</p>
                </Grid>
            </Grid>

        )
    }
}

export default Home
