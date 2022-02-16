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

export const ChangeInfoRoom = (payload) => (
    {
        type: "ChangeInfoRoom",
        payload: payload,
    })

export const SetInfoExam = (payload) => (
    {
        type: "SetInfoExam",
        payload: payload,
    })
export const SetListQuestion = (payload) => (
    {
        type: "SetListQuestion",
        payload: payload,
    })

export const ClearRoom = () => (
    {
        type: "ClearRoom"
    })
export const RemoveQuestion = (payload) => (
    {
        type: "RemoveQuestion",
        payload: payload,
    })
