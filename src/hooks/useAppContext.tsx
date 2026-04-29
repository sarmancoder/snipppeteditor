import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react"
import type { editor } from "monaco-editor";

const AppContext = createContext<any>(null)

type StateType = {
    prefix: string
    description: string
    codeText: string
    scope: string
}

type DispatchType = { type: 'update' | 'replace'; key?: string, payload: any }

type keySnippetTypes = 'codeText' | 'prefix' | 'description' | 'scope'

function useApp() {
    const codeEditorRef = useRef<editor.IStandaloneCodeEditor>(null)
    const resultSnippetEditor = useRef<editor.IStandaloneCodeEditor>(null)

    const [snippetData, dispatch] = useReducer<StateType, [DispatchType]>((state, action) => {
        if (action.type == 'update') {
            return {
                ...state,
                [action.key as string]: action.payload
            }
        }
        if (action.type == 'replace') {
            // console.log('reemplazando snippet', JSON.stringify(state))
            console.log(action.payload)
            const { body: codeText, ...payload } = action.payload
            codeEditorRef.current?.setValue(codeText.join('\n'))
            return {
                ...payload,
                codeText: codeText.join('\n')
            }
        }

        return state
    }, { prefix: '', description: '', codeText: "", scope: '' })

    function updateSnippetKey(key: string, value: any) {
        dispatch({ payload: value, type: 'update', key })
    }

    const snippetResult = useMemo(() => {
        const { codeText, ...rest } = snippetData
        return JSON.stringify({
            ...rest,
            body: codeText.split('\n')
        }, null, 2)
    }, [snippetData])

    function setValue(key: keySnippetTypes, value: string) {
        updateSnippetKey(key, value)
    }

    function replaceEditorContent (text: string) {
        try {
            const snippetJSON = JSON.parse(text)
            dispatch({ payload: snippetJSON, type: 'replace' })
        } catch (error: any) {
            if (error.message.includes('Unexpected toke')) {
                console.log(error)
                console.log('JSON no válido')
            } else {
                console.log('error desconocido')
            }
        }
    }

    async function replaceEditorContentFromClipboard() {
        const text = await navigator.clipboard.readText()
        replaceEditorContent(text)
    }

    const isEmpty = useMemo(() => {
        return snippetData.codeText.length == 0 && snippetData.description.length == 0 && snippetData.prefix.length == 0;
    }, [snippetData])

    useEffect(() => {
        if (isEmpty) return
        if ((window as any).flutter_inappwebview) {
            // console.log('JSON SNIPPET UPDATING ' + jsonSnippet);
            (window as any).flutter_inappwebview.callHandler?.('updateSnippet', snippetResult);
        }
    }, [snippetResult, isEmpty])

    useEffect(() => {
        window.addEventListener('insertSnippet', (event: any) => {
            replaceEditorContent(JSON.stringify(event.detail))
        });
    }, [])

    return {
        codeEditorRef,
        resultSnippetEditor,
        codigo: snippetData.codeText,
        snippetData,
        snippetResult,
        setValue,
        async onPasteExistingSnippet() {
            replaceEditorContentFromClipboard()
        }
    }
}

export default function AppEditorProvider({ children }: any) {
    const appData = useApp()
    return (
        <AppContext.Provider value={appData}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext<ReturnType<typeof useApp>>(AppContext);
}
