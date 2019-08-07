import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Chirp from '../components/Chirp/Chirp';
import Profile from '../components/Profile/Profile';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { getChirps } from '../redux/actions/dataActions'

class Home extends Component {

    componentDidMount() {
        this.props.getChirps();
    }

    render() {
        const { chirps, loading } = this.props.data;

        let recentChirpsMarkup = !loading ? (
            chirps.map(chirp => <Chirp key={chirp.chirpId} chirp={chirp} />)
        ) : (<p>Loading...</p>
            )
        return (
            <Grid container spacing={2}>
                <Grid item sm={8} xs={12}>
                    {recentChirpsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile />
                </Grid>
            </Grid>

        )
    }
}
Home.propTypes = {
    getChirps: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, { getChirps })(Home)
