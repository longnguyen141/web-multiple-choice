export const ChooseQuestion = (key = null) => (
    {
        type: "ChooseQuestion",
        payload: key,
    })

export const ClearRoom = () => (
    {
        type: "ClearRoom"
    })

export const SetListQuestion = (payload) => (
    {
        type: "SetListQuestion",
        payload: payload,
    })
export const ChangeInfoRoom = (payload) => (
    {
        type: "ChangeInfoRoom",
        payload: payload,
    })
export const ChangeChooseQuestionRoom = (payload) => (
    {
        type: "ChangeChooseQuestionRoom",
        payload: payload,
    })
