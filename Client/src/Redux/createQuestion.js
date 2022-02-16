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
      correct: 'A',
      explain: '',
    }
  ],
  update: false,
}

const CreateQuestionExamReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CreatExamAddNewQuestion":
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
        ]
      }
    case "CreatExamChooseQuestion":
      return { ...state, selected: action.payload };
    case "CreatExamChangeQuestion":
      state.listQuestion.splice(state.selected, 1, action.payload)
      return state;
    case "CreatExamChangeInfoExam":
      return { ...state, infoExam: { ...action.payload } };
    case "CreatExamChangeImage":
      return {
        ...state, infoExam: {
          ...state.infoExam,
          avatar: action.payload,
        }
      }
    case "CreatExamClearExam":
      return initialState;
    case "CreatExamSetListQuestion":
      return {
        ...state,
        listQuestion: action.payload
      }
    case "CreatExamChangeStatus":
      return {
        ...state,
        update: action.payload
      }
    case "CreateExamRemoveQuestion":
      state.listQuestion.splice(action.payload, 1);
      // if (state.listQuestion.length - 1 === action.payload) {
      //   state.listQuestion.pop();
      //   return {
      //     ...state,
      //     selected: action.payload - 1,
      //   }
      // } else {
      //   state.listQuestion.splice(action.payload, 1);
      //   return {
      //     ...state
      //   }
      // }

      return state;
    default:
      return state;
  }

}
export default CreateQuestionExamReducer;