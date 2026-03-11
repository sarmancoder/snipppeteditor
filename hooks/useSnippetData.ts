"use client"

import { useEffect, useMemo, useReducer } from "react"

type StateType = {
    prefix: string
    description: string
    codeText: string
    scope: string
}

type DispatchType = { type: 'update' | 'replace'; key?: string, payload: any }

export default function useSnippetData() {
    const languageScopes = ['vue', 'javascript', 'typescript', 'haskell'].map((c) => ({value: c, label: c}))
    const [snippetData, dispatch] = useReducer<StateType, [DispatchType]>((state, action) => {
        if (action.type == 'update') {
            // console.log('updating', action.key)
            console.log('JSON SNIPPET UPDATING ' + JSON.stringify(action.payload))
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
        } else {
            console.log('No existe flutter_inappwebview')
        }
    }, [jsonSnippet, isEmpty])

    return { languageScopes,
        snippetData, jsonSnippet,
        updateSnippetKey(key: string, value: any) {
            dispatch({ payload: value, type: 'update', key })
        },
        setSnippet(data: any) {
            dispatch({ payload: data.prefix, type: 'update', key: 'prefix' })
            dispatch({ payload: data.body.join('\n'), type: 'update', key: 'codeText' })
            dispatch({ payload: data.description, type: 'update', key: 'description' })
        }
    }
}