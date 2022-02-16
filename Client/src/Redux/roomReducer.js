const initialState = {
    selected: 0,
    infoRoom: {
        nameRoom: '',
        authorName: '',
        testTimeRoom: '',
        activeTime: '',
        listUser: [],
    },
    infoExamRoom: {
        title: '',
        description: '',
        testTime: '',
        field: '',
        tags: [],
        avatar: '',
        authorName: '',
        status: '',
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
        ]
    },
    point: 0,
}

const RoomReducer = (state = initialState, action) => {

    switch (action.type) {
        case "AddNewQuestion":
            return {
                ...state,
                infoExamRoom: {
                    ...state.infoExamRoom,
                    listQuestion: [
                        ...state.infoExamRoom.listQuestion,
                        {
                            question: '',
                            answer1: '',
                            answer2: '',
                            answer3: '',
                            answer4: '',
                            correct: 'A',
                            explain: '',
                        }
                    ]
                },
                // selected: state.infoExamRoom.listQuestion.length,
            }
        case "ChooseQuestion":
            return { ...state, selected: action.payload };

        case "ClearRoom":
            return initialState;
        case "ChangeQuestion":
            state.infoExamRoom.listQuestion?.splice(state.selected, 1, action.payload)
            return state;

        case "SetListQuestion":
            return {
                ...state,
                infoExamRoom: {
                    ...state.infoExamRoom,
                    listQuestion: action.payload
                },
                // selected: state.infoExamRoom.listQuestion.length,
            }
        case "ChangeInfoRoom":
            return { ...state, infoRoom: { ...action.payload } };

        case "SetInfoExam":
            return {
                ...state,
                infoExamRoom: { ...action.payload }
            }

        case "ChangeChooseQuestion":
            state.infoExamRoom.listQuestion[action.payload.index] = {
                ...state.infoExamRoom.listQuestion[action.payload.index],
                choose: action.payload.value,
            }
            return { ...state };
        case "RemoveQuestion":
            state.infoExamRoom.listQuestion.splice(action.payload, 1);
            return state;
        default:
            return state;
    }

}
export default RoomReducer;