"use client"

import { useEffect, useMemo, useReducer } from "react"

type StateType = {
    prefix: string
    description: string
    codeText: string
    scope: string
}

type DispatchType = { type: 'update' | 'replace'; key?: string, payload: any }

const languageScopes = [
    // Web Core
    { value: 'javascriptreact', label: 'React JS (JSX)' },
    { value: 'typescriptreact', label: 'React TS (TSX)' },
    { value: 'vue', label: 'Vue SFC' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'scss', label: 'SCSS' },

    // Backend
    { value: 'php', label: 'PHP' },
    { value: 'python', label: 'Python' },
    { value: 'go', label: 'Go' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'rust', label: 'Rust' },
    { value: 'ruby', label: 'Ruby' },

    // Config & Data
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'sql', label: 'SQL' },
    { value: 'shell', label: 'Shell / Bash' },
    { value: 'dockerfile', label: 'Dockerfile' },

    // Otros populares
    { value: 'xml', label: 'XML' },
    { value: 'lua', label: 'Lua' },
    { value: 'cpp', label: 'C++' }
];

export default function useSnippetData() {
    const [snippetData, dispatch] = useReducer<StateType, [DispatchType]>((state, action) => {
        if (action.type == 'update') {
            return {
                ...state,
                [action.key as string]: action.payload
            }
        }
        if (action.type == 'replace') {
            // console.log('reemplazando snippet', JSON.stringify(state))
            return action.payload
        }

        return state
    }, { prefix: '', description: '', codeText: "", scope: '' })

    const isEmpty = useMemo(() => {
        return snippetData.codeText.length == 0 && snippetData.description.length == 0 && snippetData.prefix.length == 0;
    }, [snippetData])

    const jsonSnippet = useMemo(() => {
        const { codeText, ...rest } = snippetData
        return JSON.stringify({
            ...rest,
            body: codeText.split('\n')
        }, null, 2)
    }, [snippetData])

    useEffect(() => {
        window.addEventListener('insertSnippet', (event: any) => {
            // console.log('Evento recibido desde Flutter: ' + JSON.stringify(event.detail));
            console.log('JSON SNIPPET UPDATING insert snippet ' + JSON.stringify(event.detail, null, 4));
            dispatch({
                type: 'replace',
                payload: {
                    prefix: event.detail.prefix,
                    description: event.detail.description,
                    scope: event.detail.scope,
                    codeText: event.detail.body.join("\n")
                }
            })
        });
    }, [])

    useEffect(() => {
        if (isEmpty) return
        if ((window as any).flutter_inappwebview) {
            console.log('JSON SNIPPET UPDATING ' + jsonSnippet);
            (window as any).flutter_inappwebview.callHandler?.('updateSnippet', jsonSnippet);
        }
    }, [jsonSnippet, isEmpty])

    function updateSnippetKey(key: string, value: any) {
        dispatch({ payload: value, type: 'update', key })
    }

    return {
        languageScopes,
        snippetData, jsonSnippet,
        updateSnippetKey,
        setSnippet(jsonSnippet: any) {
            const body = Array.isArray(jsonSnippet.body) ? jsonSnippet.body.join('\n') : jsonSnippet.body
            updateSnippetKey('codeText',  body)
            updateSnippetKey('prefix', jsonSnippet.prefix)
            updateSnippetKey('description', jsonSnippet.description)
            updateSnippetKey('scope', jsonSnippet.scope ?? '')
        }
    }
}