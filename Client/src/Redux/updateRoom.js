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
    case "AddNewQuestionUpdate":
      return {
        ...state,
        // selected: state.infoExamRoom.listQuestion.length,
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
        }
      }
    case "ChooseQuestionUpdate":
      return { ...state, selected: action.payload };

    case "ClearRoomUpdate":
      // console.log(initialState, "initialState")
      return initialState;
    case "ChangeQuestionUpdate":
      state.infoExamRoom.listQuestion?.splice(state.selected, 1, action.payload)
      return state;

    case "ChangeInfoRoomUpdate":
      state = { ...state, infoRoom: { ...action.payload } };
      console.log(state)
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

    case "SetInfoExamUpdate":
      return {
        ...state,
        infoExamRoom: { ...action.payload }
      }

    case "ChangeChooseQuestionUpdate":
      state.room.listQuestion[action.payload.index] = {
        ...state.room.listQuestion[action.payload.index],
        choose: action.payload.value,
      }
      return { ...state };

    case "RemoveQuestionUpdate":
      state.infoExamRoom.listQuestion.splice(action.payload, 1);
      return state;
    default:
      return state;
  }

}
export default RoomReducer;