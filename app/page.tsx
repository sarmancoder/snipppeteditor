"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import useCodeEditor from "@/hooks/useCodeEditor"
import useSnippetData from "@/hooks/useSnippetData"
import Editor from "@monaco-editor/react"
import { Clipboard, FileCode, Replace } from "lucide-react"
import Select from 'react-select'

export default function DualEditorPage() {
    const { snippetData, updateSnippetKey, languageScopes, jsonSnippet, setSnippet } = useSnippetData()
    const { handleLeftEditorMount, replaceWithFilenameBase, handlePaste } = useCodeEditor({
        setCodeText: (code) => updateSnippetKey('codeText', code),
        setJsonSnippet: (data) => setSnippet(JSON.parse(data as string))
    })

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Editor */}
                <Card className="border-0 flex-1 overflow-hidden flex flex-col">
                    <div className="grid gap-4 mb-6">
                        <div className="grid gap-2">
                            <Label htmlFor="prefix">Prefix</Label>
                            <Input
                                id="prefix"
                                placeholder="Ingrese el prefix"
                                value={snippetData.prefix}
                                onChange={(e) => {
                                    updateSnippetKey('prefix', e.target.value)
                                }}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Ingrese la descripción"
                                value={snippetData.description}
                                onChange={(e) => {
                                    updateSnippetKey('description', e.target.value)
                                }}
                                className="min-h-[100px] resize-y"
                            />
                        </div>
                    </div>
                    <div className="p-3 bg-muted font-medium flex justify-between">
                        <span>Editor</span>
                        <Select options={languageScopes}
                            isMulti
                            value={languageScopes.filter(a => snippetData.scope.split(',').includes(a.label))}
                            onChange={(c) => {
                                console.log('react select on change ' + JSON.stringify(c))
                                updateSnippetKey('scope', c.map((a) => a.value).join(','))
                            }}
                        />
                    </div>  
                    <div className="flex-1 min-h-[60vh]">
                        <Editor
                            height="100%"
                            language={snippetData.scope.split(',')[0]}
                            value={snippetData.codeText}
                            onChange={(value) => {
                                updateSnippetKey('codeText', value)
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
                        <Button variant="outline" onClick={() => {
                            handlePaste("left")
                        }}>
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

                {/* Preview */}
                <Card className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-3 bg-muted font-medium">Snippet</div>
                    <div className="flex-1 min-h-[60vh]">
                        <Editor
                            height="100%"
                            defaultLanguage="json"
                            value={jsonSnippet}
                            onChange={(value) => setSnippet(JSON.parse(value as string))}
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
                </Card>
            </div>
        </div>
    )
}
