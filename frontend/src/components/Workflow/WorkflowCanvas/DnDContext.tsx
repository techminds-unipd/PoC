import { createContext, useContext, useState } from 'react';

const DnDContext = createContext([null, (_) => {}]);

export const DnDProvider = ({ children }) => {
    const [typeDnD, setTypeDnD] = useState(null);

    return (
        <DnDContext.Provider value={[typeDnD, setTypeDnD]}>
        {children}
        </DnDContext.Provider>
    );
}

export default DnDContext;

export const useDnD = () => {
    return useContext(DnDContext);
}
