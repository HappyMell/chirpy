import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER, LIKE_CHIRP, UNLIKE_CHIRP } from '../types';

const initialState = {
    authenticated: false,
    credentials: {},
    likes: [],
    loading: false,
    notifications: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case LIKE_CHIRP:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userhandle: state.credentials.handle,
                        chirpId: action.payload.chirpId
                    }
                ]
            }
        case UNLIKE_CHIRP:
            return {
                ...state,
                likes: state.likes.filter(like => like.chirpId !== action.payload.chirpId)
            }
        default:
            return state;
    }
}