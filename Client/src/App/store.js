import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducers from "../Redux";


//MiddleWare
// const middleWareRemoveTagHtml = store => next => action => {

//     if (action.type === "ChangeQuestion" && store.getState().questionExam) {
//         let regex = /(<([^>]+)>)/ig

//         console.log(action.payload)
//         // action.payload = 0;
//     }
//     return next(action)
// }

const store = createStore(
    reducers, /* preloadedState, */{},
    applyMiddleware(thunk)
    // + window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;