export const CreatExamAddNewQuestion = () => (
  {
    type: "CreatExamAddNewQuestion",
  })

export const CreatExamChooseQuestion = (key = null) => (
  {
    type: "CreatExamChooseQuestion",
    payload: key,
  })

export const CreatExamChangeQuestion = (payload) => (
  {
    type: "CreatExamChangeQuestion",
    payload: payload,
  })

export const CreatExamChangeImage = () => ({
  type: "CreatExamChangeImage",
})

export const CreatExamChangeInfoExam = (payload) => (
  {
    type: "CreatExamChangeInfoExam",
    payload: payload,
  })

export const CreatExamSetListQuestion = (payload) => (
  {
    type: "CreatExamSetListQuestion",
    payload: payload,
  })
export const CreatExamClearExam = () => (
  {
    type: "CreatExamClearExam"
  })
export const CreatExamChangeStatus = (payload) => (
  {
    type: "CreatExamChangeStatus",
    payload: payload,
  })
export const CreateExamRemoveQuestion = (payload) => (
  {
    type: "CreateExamRemoveQuestion",
    payload: payload,
  })
