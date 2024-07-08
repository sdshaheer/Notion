import { useState, createContext, useContext } from "react";
import { Notion } from "../models/Todo";
import { Todo } from "../models/Todo";

interface NotionContextType {
    notion: Notion
    setNotion: React.Dispatch<React.SetStateAction<Notion>>
    selectedTodo: Todo | null
    setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | null>>

}

const NotionContext = createContext<NotionContextType | undefined>(undefined);


export const NotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [notion, setNotion] = useState<Notion>({})
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