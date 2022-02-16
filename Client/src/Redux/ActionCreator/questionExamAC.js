export const AddNewQuestion = () => (
    {
        type: "AddNewQuestion",
    })

export const ChooseQuestion = (key = null) => (
    {
        type: "ChooseQuestion",
        payload: key,
    })

export const ChangeQuestion = (payload) => (
    {
        type: "ChangeQuestion",
        payload: payload,
    })

export const ChangeImage = (payload) => ({
    type: "ChangeImage",
    payload: payload,
})

export const ChangeInfoExam = (payload) => (
    {
        type: "ChangeInfoExam",
        payload: payload,
    })

export const SetListQuestion = (payload) => (
    {
        type: "SetListQuestion",
        payload: payload,
    })
export const ClearExam = () => (
    {
        type: "ClearExam"
    })
export const ChangeStatus = (payload) => (
    {
        type: "ChangeStatus",
        payload: payload,
    })
export const RemoveQuestion = (payload) => (
    {
        type: "RemoveQuestion",
        payload: payload,
    })

