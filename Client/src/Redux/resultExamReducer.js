const initialState = {
    selected: 0,
    infoExam: {
        title: '',
        description: '',
        testTime: '',
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

const ResultExamReducer = (state = initialState, action) => {

    switch (action.type) {
        case "ChooseQuestion":
            return { ...state, selected: action.payload };
        case "ClearExam":
            return { ...initialState };
        case "ChangeInfoExam":
            return { ...state, infoExam: { ...action.payload } };
        case "SetListQuestion":
            return {
                ...state,
                listQuestion: action.payload
            }
        case "ChangeChooseQuestion":
            state.listQuestion[action.payload.index] = {
                ...state.listQuestion[action.payload.index],
                choose: action.payload.value,
            }
            return { ...state };
        default:
            return state;
    }

}
export default ResultExamReducer;