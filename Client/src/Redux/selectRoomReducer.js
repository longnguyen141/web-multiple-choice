const initialState = {
    title: '',
    info: '',
    type: '',
    user: ''
}
const SelectRoomReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ChangeRoom":
            return {
                title: action.payload.title,
                info: action.payload.info,
                type: action.payload.type,
                user: action.payload.user,
            }
        default:
            return state;
    }
}
export default SelectRoomReducer;