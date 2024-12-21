import { createContext, useContext, useState } from 'react';

const DnDContext = createContext([null, (_:any) => {}]);

export const DnDProvider = ({ children } : any) => {
    const [serviceDnD, setServiceDnD] = useState(null);

    return (
        <DnDContext.Provider value={[serviceDnD, setServiceDnD]}>
        {children}
        </DnDContext.Provider>
    );
}

export default DnDContext;

export const useDnD = () => {
    return useContext(DnDContext);
}
