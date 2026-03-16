/*
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
*/
import useCodeEditor from "@/hooks/useCodeEditor"
import useSnippetData from "@/hooks/useSnippetData"
import Editor from "@monaco-editor/react"
import { Clipboard, FileCode, Replace } from "lucide-react"
import { useEffect, useState } from "react"
import Select from 'react-select'
import { useLocalStorage } from "@uidotdev/usehooks";

const appbarStateKey = "hide-appbar"

const appBarStates = Object.freeze({
    hided: "1",
    showed: "0"
})

export default function DualEditorPage() {
    const [appbarState, setAppbarState] = useLocalStorage(appbarStateKey, appBarStates.showed)
    const { snippetData, updateSnippetKey, languageScopes, jsonSnippet, setSnippet } = useSnippetData()
    const { handleLeftEditorMount, replaceWithFilenameBase, handlePaste } = useCodeEditor({
        setCodeText: (code) => updateSnippetKey('codeText', code),
        setJsonSnippet: (data) => setSnippet(JSON.parse(data as string))
    })

    useEffect(() => {
        if ((window as any).flutter_inappwebview) {
            localStorage.setItem('hide-appbar', appBarStates.hided)
            setAppbarState(appBarStates.hided as any)
        }
    }, [])

    return (
        <div>
            <p>Holaa</p>
        </div>
    )
}
