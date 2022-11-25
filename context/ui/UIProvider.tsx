import { FC, useReducer } from 'react';
import { UIContext, uiReducer } from './';

export interface UIState {
    isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UIState = {
    isMenuOpen: false
}

export const UIProvider: FC<React.PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

    const toggleSideMenu = () => {
        dispatch('[UI] - ToogleMenu');
    }

    return (
        <UIContext.Provider value={{
          ...state,

            // Methods
            toggleSideMenu
        }}>
            {children}
        </UIContext.Provider>
    )
};