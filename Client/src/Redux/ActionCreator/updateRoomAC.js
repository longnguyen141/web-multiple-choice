export const AddNewQuestionUpdate = () => (
  {
    type: "AddNewQuestionUpdate",
  })

export const ChooseQuestionUpdate = (key = null) => (
  {
    type: "ChooseQuestionUpdate",
    payload: key,
  })

export const ChangeQuestionUpdate = (payload) => (
  {
    type: "ChangeQuestionUpdate",
    payload: payload,
  })

export const ChangeImageUpdate = (payload) => ({
  type: "ChangeImageUpdate",
  payload: payload,
})

export const SetListQuestionUpdate = (payload) => (
  {
    type: "SetListQuestionUpdate",
    payload: payload,
  })


export const ChangeInfoRoomUpdate = (payload) => (
  {
    type: "ChangeInfoRoomUpdate",
    payload: payload,
  })

export const SetInfoExamUpdate = (payload) => (
  {
    type: "SetInfoExamUpdate",
    payload: payload,
  })
export const ClearRoomUpdate = () => (
  {
    type: "ClearRoomUpdate"
  })
export const RemoveQuestionUpdate = (payload) => (
  {
    type: "RemoveQuestionUpdate",
    payload: payload,
  })

