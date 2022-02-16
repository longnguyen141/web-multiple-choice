
const token = null
const TokenReducer = (state = token, action) => {
    switch (action.type) {
        case "GET_TOKEN":
            {
                return action.payload;
            }
        default:
            return state;
    }
}
export default TokenReducer;