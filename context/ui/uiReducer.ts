import { UIState } from './';

type UIAction =
    | '[UI] - ToogleMenu'

export const uiReducer = (state: UIState, action: UIAction): UIState => {
    switch (action) {
        case '[UI] - ToogleMenu':
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen
            }

        default:
            return state;
    }
};