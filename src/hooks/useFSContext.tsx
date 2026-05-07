import { createContext, useContext, useEffect, useState } from "react";
import fileManager from "../utils/fs";
import { useAppContext } from "./useAppContext";

const FSContext = createContext<any>(null)

type Snippet = {
    key: string
    codeText: string[]
    body: string[]
    prefix: string
    description: string
}

function useFs() {
    const {replaceEditorContent} = useAppContext()
    const [dirName, setDirName] = useState('')
    const [files, setFiles] = useState<Awaited<ReturnType<typeof fileManager['listFiles']>>>([])
    const [activeFile, setActiveFile] = useState('')
    const [snippets, setSnippets] = useState<Snippet[]>([])
    const [activeSnippet, setActiveSnippet] = useState('')

    useEffect(() => {
        const snippetToSee = snippets.find(a => a.key == activeSnippet)
        if (!snippetToSee) {
            console.log('No encontrado')
            return
        }
        replaceEditorContent(JSON.stringify({
            ...snippetToSee,
            codeText: snippetToSee.body
        }))
    }, [activeSnippet])

    useEffect(() => {
        fileManager.readFile([activeFile]).then((c: string) =>
            setSnippets(getSnippetsArray(c))
        )
    }, [activeFile])

    return {
        dirName, files, snippets,
        activeFile, setActiveFile,
        activeSnippet, setActiveSnippet,
        async pickDirectory() {
            const name = await fileManager.selectDirectory()
            if (!name) return
            setDirName(name)
            const files = await fileManager.listFiles()
            setFiles(files)
        },
    }
}

export default function FSProvider({ children }: any) {
    const appData = useFs()
    return (
        <FSContext.Provider value={appData}>
            {children}
        </FSContext.Provider>
    )
}

export function useFSContext() {
    return useContext<ReturnType<typeof useFs>>(FSContext);
}

function getSnippetsArray(c: string) {
    const snippetsObj: Record<string, Omit<Snippet, 'key'>> = JSON.parse(c)
    console.log(snippetsObj)
    const snippetsArr: Snippet[] = []

    Object.keys(snippetsObj).forEach((key) => {
        const currentSnippet = snippetsObj[key]
        snippetsArr.push({ key: key, ...currentSnippet })
    })

    return snippetsArr
}
