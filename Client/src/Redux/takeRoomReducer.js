const initialState = {
    selected: 0,
    infoRoom: {
        nameRoom: '',
        activeTime: '',
        testTimeRoom: '',
    },
    listQuestion: [
        {
            question: '',
            answer1: '',
            answer2: '',
            answer3: '',
            answer4: '',
            correct: '',
            explain: '',
            choose: '',
        }
    ],
    point: 0,
}

const TakeRoomReducer = (state = initialState, action) => {

    switch (action.type) {
        case "ChooseQuestion":
            return { ...state, selected: action.payload };
        case "ClearRoom":
            return { ...initialState };
        case "ChangeInfoRoom":
            return { ...state, infoExam: { ...action.payload } };
        case "SetListQuestion":
            return {
                ...state,
                listQuestion: action.payload
            }
        case "ChangeChooseQuestionRoom":
            state.listQuestion[action.payload.index] = {
                ...state.listQuestion[action.payload.index],
                choose: action.payload.value,
            }
            return { ...state };
        default:
            return state;
    }

}
export default TakeRoomReducer;