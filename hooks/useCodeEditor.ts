import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast"
import type * as monaco from "monaco-editor"
import { OnMount } from "@monaco-editor/react";
import { registerVueLanguage } from "@/app/registersLanguages";

export default function useCodeEditor({setCodeText, setJsonSnippet}) {
    const { toast } = useToast()
    const leftEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

    const handleLeftEditorMount: OnMount = (editor, monaco) => {
        leftEditorRef.current = editor
        registerVueLanguage(monaco)
    }

    const handlePaste = async (editor: "left" | "right") => {
        try {
            const text = await navigator.clipboard.readText()
            if (editor === "left") {
                setCodeText(text)
            } else {
                setJsonSnippet(text)
            }
            toast({
                title: "Contenido pegado",
                description: `Se ha pegado el contenido en el editor ${editor === "left" ? "izquierdo" : "derecho"}`,
                duration: 2000,
            })
        } catch (error) {
            toast({
                title: "Error al pegar",
                description: "No se pudo acceder al portapapeles. Verifica los permisos del navegador.",
                variant: "destructive",
                duration: 3000,
            })
            console.error("Error al pegar:", error)
        }
    }

    const replaceWithFilenameBase = () => {
        if (!leftEditorRef.current) {
            toast({
                title: "Error",
                description: "El editor no está inicializado correctamente.",
                variant: "destructive",
                duration: 3000,
            })
            return
        }

        const selection = leftEditorRef.current.getSelection()
        const model = leftEditorRef.current.getModel()

        if (!selection || !model) {
            toast({
                title: "Sin selección",
                description: "Por favor, selecciona texto en el editor para reemplazar.",
                variant: "destructive",
                duration: 3000,
            })
            return
        }

        // Si la selección está vacía (solo cursor), no hacer nada
        if (selection.isEmpty()) {
            toast({
                title: "Sin selección",
                description: "Por favor, selecciona texto en el editor para reemplazar.",
                variant: "destructive",
                duration: 3000,
            })
            return
        }

        // Reemplazar el texto seleccionado con ${TM_FILENAME_BASE}
        leftEditorRef.current.executeEdits("replace-selection", [
            {
                range: selection,
                text: "${TM_FILENAME_BASE}",
                forceMoveMarkers: true,
            },
        ])

        toast({
            title: "Texto reemplazado",
            description: "El texto seleccionado ha sido reemplazado por ${TM_FILENAME_BASE}",
            duration: 2000,
        })
    }
    return {
        leftEditorRef,
        handleLeftEditorMount,
        handlePaste,
        replaceWithFilenameBase
    }
}