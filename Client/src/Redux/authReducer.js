const initialState = {
    user: "",
    isLoading: true,
    isLogged: false,
    isAdmin: false,
}
const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                // isLoading: false,
                isLogged: true
            }
        case "GET_USER":
            return {
                ...state,
                user: action.payload.user,
                isAdmin: action.payload.isAdmin
            }
        case "LOAD_PAGE":
            return {
                ...state,
                isLoading: false
            }
        case "LOG_OUT":
            return initialState;
        default:
            return state;
    }
}
export default AuthReducer;