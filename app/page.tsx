"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import Editor, { type OnMount } from "@monaco-editor/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clipboard, FileCode, Replace } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type * as monaco from "monaco-editor"

export default function DualEditorPage() {
  const [prefix, setPrefix] = useState("")
  const [description, setDescription] = useState("")
  const [codeText, setCodeText] = useState("// Escribe tu código aquí\nconsole.log('Hola mundo');")
  const codeSnippetTransformed = useMemo(() => {
    return codeText.split('\n')
  }, [codeText])
  const [jsonData, setJsonData] = useState({
    prefix, description, body: [] as string[]
  })
  const [jsonSnippet, setJsonSnippet] = useState(
    JSON.stringify(
      jsonData,
      null,
      2,
    ),
  )

  useEffect(() => {
    setJsonData({
      ...jsonData,
      body: codeSnippetTransformed
    })
  }, [codeSnippetTransformed])

  useEffect(() => {
    setJsonSnippet(JSON.stringify(jsonData, null, 2))
  }, [jsonData])

  const { toast } = useToast()
  const leftEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  const handleLeftEditorMount: OnMount = (editor) => {
    leftEditorRef.current = editor
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Editores Monaco</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="border-0 flex-1 overflow-hidden flex flex-col">
          <div className="grid gap-4 mb-6">
            <div className="grid gap-2">
              <Label htmlFor="prefix">Prefix</Label>
              <Input
                id="prefix"
                placeholder="Ingrese el prefix"
                value={prefix}
                onChange={(e) => {
                  setPrefix(e.target.value)
                  setJsonData({
                    ...jsonData,
                    prefix: e.target.value
                  })
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Ingrese la descripción"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setJsonData({
                    ...jsonData,
                    description: e.target.value
                  })
                }}
                className="min-h-[100px] resize-y"
              />
            </div>
          </div>
          <div className="p-3 bg-muted font-medium">Editor</div>
          <div className="flex-1 min-h-[60vh]">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={codeText}
              onChange={(value) => {
                setCodeText(value || "")
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
              onMount={handleLeftEditorMount}
            />
          </div>
          <div className="p-3 border-t grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => handlePaste("left")}>
              <Clipboard className="mr-2 h-4 w-4" />
              Pegar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Replace className="mr-2 h-4 w-4" />
                  Reemplazar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={replaceWithFilenameBase}>
                  <FileCode className="mr-2 h-4 w-4" />
                  Insertar ${"{TM_FILENAME_BASE}"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        <Card className="flex-1 overflow-hidden flex flex-col">
          <div className="p-3 bg-muted font-medium">Snippet</div>
          <div className="flex-1 min-h-[60vh]">
            <Editor
              height="100%"
              defaultLanguage="json"
              value={jsonSnippet}
              onChange={(value) => {
                setJsonSnippet(value || "")
                console.log(JSON.parse(value as string))
                const data = JSON.parse(value as string)
                setPrefix(data.prefix)
                setDescription(data.description)
                setCodeText(data.body.join('\n'))
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
          {/* <div className="p-3 border-t">
            <Button variant="outline" onClick={() => handlePaste("right")} className="w-full">
              <Clipboard className="mr-2 h-4 w-4" />
              Pegar
            </Button>
          </div> */}
        </Card>
      </div>
    </div>
  )
}
