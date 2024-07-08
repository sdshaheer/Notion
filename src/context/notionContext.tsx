import { useState, createContext, useContext } from "react";
import { NotionInterface } from "../models/Todo";
import { Todo } from "../models/Todo";

interface NotionContextType {
    notion: NotionInterface
    setNotion: React.Dispatch<React.SetStateAction<NotionInterface>>
    selectedTodo: Todo | null
    setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | null>>

}

const NotionContext = createContext<NotionContextType | undefined>(undefined);


export const NotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [notion, setNotion] = useState<NotionInterface>({})
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)


    const value = {
        notion,
        setNotion,
        selectedTodo,
        setSelectedTodo
    }

    return (
        <NotionContext.Provider value={value}>
            {children}
        </NotionContext.Provider>
    )
}

export const useNotion = (): NotionContextType => {
    const context = useContext(NotionContext);
    if (!context) {
        throw new Error("useNotion must be used within a NotionProvider");
    }
    return context;
};