const SelectSidebarReducer = (state = 'dashboard', action) => {
    switch (action.type) {
        case "ChangeItem":
            {
                return action.payload;
            }
        default:
            return state;
    }
}
export default SelectSidebarReducer;