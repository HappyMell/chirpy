import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import DeleteChirp from './DeleteChirp';
import ChirpDialog from './ChirpDialog';


//MUI Cards
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

//Redux
import { connect } from 'react-redux';
import LikeButton from './LikeButton';


const styles = theme => ({
    ...theme.otherPages,
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20,
    },
    image: {
        minWidth: 151,
    },
    content: {
        padding: 17,
        objectFit: 'cover'
    }
})

class Chirp extends Component {


    render() {
        dayjs.extend(relativeTime);

        const { classes, chirp: { body, createdAt, userImage, userHandle, chirpId, likeCount, commentCount }, user: { authenticated, credentials: { handle } } } = this.props


        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteChirp chirpId={chirpId} />
        ) : null


        return (
            <Card className={classes.card}>
                <CardMedia
                    maxWidth="sm"
                    image={userImage}
                    title='Profile Image'
                    className={classes.image} />
                <CardContent className={classes.content}>
                    <Typography variant='h5' color='primary' component={Link} to={`/users/${userHandle}`}>{userHandle}</Typography>
                    {deleteButton}
                    <Typography variant='body2' color='textSecondary'>{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant='body1'>{body}</Typography>
                    <LikeButton chirpId={chirpId} />
                    <span>{likeCount}  <Hidden only="xs"> Likes</Hidden></span>

                    <ChirpDialog chirpId={chirpId} userHandle={userHandle} openDialog={this.props.openDialog} />

                    <span >{commentCount}<Hidden only="xs"> Comments</Hidden></span>

                </CardContent>
            </Card>
        )
    }
}

Chirp.propTypes = {
    user: PropTypes.object.isRequired,
    chirp: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
}

const mapStateToProps = state => ({
    user: state.user
})


export default connect(mapStateToProps)(withStyles(styles)(Chirp))
