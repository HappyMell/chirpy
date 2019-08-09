import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';

//MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
//Icons
//import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';




//Redux
import { connect } from 'react-redux';
import { postChirp, clearErrors } from '../../redux/actions/dataActions';

const styles = (theme) => ({
    ...theme.otherPages,
})




class PostChirp extends Component {
    state = {
        open: false,
        body: '',
        errors: {}
    };



    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        };
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({
                body: '',
                open: false,
                errors: {}
            })
        }
    }

    handleOpen = () => {
        this.setState({
            open: true
        })
    }

    handleClose = () => {
        this.props.clearErrors()
        this.setState({
            open: false,
            errors: {}
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.postChirp({ body: this.state.body })
    }

    render() {
        const { errors } = this.state;
        const { classes, UI: { loading } } = this.props;


        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Post a Chirp!">
                    <AddIcon />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="xs">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogTitle>Post a new Chirp</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name="body"
                                type="text"
                                label="Chirp!"
                                multiline
                                rows="1"
                                placeholder="Send a Chirp!"
                                error={errors.body ? true : false}
                                helperText={errors.body}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth />
                            <Button type="submit" variant="contained" color="primary" className={classes.submitButton} disabled={loading}>
                                Submit
                                {loading && (
                                    <CircularProgress size={30} className={classes.progressSpinner} />
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostChirp.propTypes = {
    postChirp: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    UI: state.UI
})

export default connect(mapStateToProps, { postChirp, clearErrors })(withStyles(styles)(PostChirp));