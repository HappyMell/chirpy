import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Chirp from '../components/Chirp/Chirp';
import ChirpSkeleton from '../util/ChirpSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';
import Grid from '@material-ui/core/Grid';
import StaticProfile from '../components/Profile/StaticProfile';

//Redux
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class User extends Component {
    state = {
        profile: null,
        chirpIdParam: null
    }
    componentDidMount() {
        const handle = this.props.match.params.handle;
        const chirpId = this.props.match.params.chirpId;
        if (chirpId) {
            this.setState({
                chirpIdParam: chirpId
            })
        }

        this.props.getUserData(handle);
        axios
            .get(`/user/${handle}`)
            .then((res) => {
                this.setState({

                    profile: res.data.user
                });
            })
            .catch((err) => console.log(err));
    }

    render() {
        const { chirps, loading } = this.props.data;
        const { chirpIdParam } = this.state;

        const chirpsMarkup = loading ? (
            <ChirpSkeleton />
        ) : chirps === null ? (
            <p>No chirps from this user.</p>
        ) : !chirpIdParam ? (
            chirps.map(chirp => <Chirp key={chirp.chirpId} chirp={chirp} />)
        ) : (
                        chirps.map(chirp => {
                            if (chirp.chirpId !== chirpIdParam) {
                                return <Chirp key={chirp.chirpId} chirp={chirp} />
                            } else {
                                return <Chirp key={chirp.chirpId} chirp={chirp} openDialog />
                            }
                        })
                    )

        return (
            <Grid container spacing={2}>
                <Grid item sm={8} xs={12}>
                    {chirpsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.profile === null ? (
                        <ProfileSkeleton />
                    ) : (<StaticProfile profile={this.state.profile} />)}
                </Grid>
            </Grid>

        )
    }
}

User.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, { getUserData })(User)
