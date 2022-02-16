import { SelectSidebarActionCreator } from "../Redux/ActionCreator"

export const handleMovePageAdmin = (url, key, dispath, history) => {
    dispath(SelectSidebarActionCreator.ChangeItem(key));
    history.push(url)
}