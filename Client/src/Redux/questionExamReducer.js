const initialState = {
    selected: 0,
    infoExam: {
        title: '',
        description: '',
        testTime: '',
        tags: [],
        avatar: '',
        authorName: '',
        status: '',
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
        }
    ],
    update: false,
}

const QuestionExamReducer = (state = initialState, action) => {
    switch (action.type) {
        case "AddNewQuestion":
            return {
                ...state,
                listQuestion: [
                    ...state.listQuestion,
                    {
                        question: '',
                        answer1: '',
                        answer2: '',
                        answer3: '',
                        answer4: '',
                        correct: 'A',
                        explain: '',
                    }
                ],
                // selected: state.listQuestion.length,
            }
        case "ChooseQuestion":
            return { ...state, selected: action.payload };
        case "ChangeQuestion":
            state.listQuestion.splice(state.selected, 1, action.payload)
            return state;
        case "ChangeInfoExam":
            return { ...state, infoExam: { ...action.payload } };
        case "ChangeImage":
            return {
                ...state, infoExam: {
                    ...state.infoExam,
                    avatar: action.payload,
                }
            }
        case "ClearExam":
            return initialState;
        case "SetListQuestion":
            return {
                ...state,
                listQuestion: action.payload
            }
        case "ChangeStatus":
            return {
                ...state,
                update: action.payload
            }
        case "RemoveQuestion":
            state.listQuestion.splice(action.payload, 1);
            return state;
        default:
            return state;
    }

}
export default QuestionExamReducer;