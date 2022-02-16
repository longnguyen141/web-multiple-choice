import { combineReducers } from 'redux';
import AuthReducer from './authReducer';
import SelectRoomReducer from './selectRoomReducer';
import SelectSidebarReducer from './selectSideBarReduce';
import TokenReducer from './tokenReducer';
import QuestionExamReducer from './questionExamReducer';
import CreateQuestionExamReducer from './createQuestion';
import SelectFieldReducer from './selectFieldReducer';
import SelectUpdateTagsReducer from './selectUpdateTags';
import TakeExamReducer from './takeExamReducer';
import TakeRoomReducer from './takeRoomReducer';
import ResultExamReducer from './resultExamReducer';
import RoomReducer from './roomReducer';
import RoomUpdate from './updateRoom';

//Kết nối các reducer bằng các cặp key, value
const reducers = combineReducers({
    selectRoom: SelectRoomReducer,
    selectSidebar: SelectSidebarReducer,
    auth: AuthReducer,
    token: TokenReducer,
    questionExam: QuestionExamReducer,
    selectField: SelectFieldReducer,
    selectUpdateTags: SelectUpdateTagsReducer,
    takeExam: TakeExamReducer,
    takeRoom: TakeRoomReducer,
    resultExam: ResultExamReducer,
    room: RoomReducer,
    updateRoom: RoomUpdate,
    createExam: CreateQuestionExamReducer,
})
export default reducers;