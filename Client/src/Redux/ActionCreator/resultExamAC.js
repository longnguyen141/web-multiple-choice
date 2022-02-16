export const ChooseQuestion = (key = null) => (
    {
        type: "ChooseQuestion",
        payload: key,
    })

export const ClearExam = () => (
    {
        type: "ClearExam"
    })

export const SetListQuestion = (payload) => (
    {
        type: "SetListQuestion",
        payload: payload,
    })
export const ChangeInfoExam = (payload) => (
    {
        type: "ChangeInfoExam",
        payload: payload,
    })
export const ChangeChooseQuestion = (payload) => (
    {
        type: "ChangeChooseQuestion",
        payload: payload,
    })
