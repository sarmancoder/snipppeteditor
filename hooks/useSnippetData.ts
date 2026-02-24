"use client"

import { useEffect, useMemo, useReducer } from "react"

type StateType = {
    prefix: string
    description: string
    codeText: string
}

type DispatchType = { type: 'update' | 'replace'; key?: string, payload: any }

export default function useSnippetData() {
    const [snippetData, dispatch] = useReducer<StateType, [DispatchType]>((state, action) => {
        if (action.type == 'update') {
            console.log('updating', action.key)
            return {
                ...state,
                [action.key as string]: action.payload
            }
        }
        if (action.type == 'replace') {
            console.log('reemplazando snippet', JSON.stringify(state))
            return action.payload
        }

        return state
    }, { prefix: '', description: 'ssss', codeText: "// Escribe tu código aquí\nconsole.log('Hola mundo');" })

    const jsonSnippet = useMemo(() => {
        const { codeText, ...rest } = snippetData
        return JSON.stringify({
            ...rest,
            body: codeText.split('\n')
        }, null, 2)
    }, [snippetData])

    useEffect(() => {
        window.addEventListener('insertSnippet', (event: any) => {
            console.log('Evento recibido desde Flutter: ' + JSON.stringify(event.detail));
            dispatch({
                type: 'replace',
                payload: {
                    prefix: event.detail.prefix,
                    description: event.detail.description,
                    codeText: event.detail.body.join("\n")
                }
            })
        });
    }, [])

    useEffect(() => {
        if ((window as any).flutter_inappwebview) {
            (window as any).flutter_inappwebview.callHandler('updateSnippet', jsonSnippet);
        } else {
            console.log('No existe flutter_inappwebview')
        }
    }, [jsonSnippet])

    return {
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