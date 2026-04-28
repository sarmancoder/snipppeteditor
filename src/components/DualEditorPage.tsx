import { Editor } from "@monaco-editor/react"
import { Box, Button, Card, CardContent, CardHeader, InputLabel, Menu, MenuItem, TextField } from '@mui/material'
import { useState } from "react"
import Select from 'react-select'
import useCodeEditor from "../hooks/useCodeEditor"
import useSnippetData from "../hooks/useSnippetData"

export default function DualEditorPage() {
    const { snippetData, updateSnippetKey, languageScopes, jsonSnippet, setSnippet } = useSnippetData()
    const { handleLeftEditorMount, replaceWithFilenameBase, handlePaste } = useCodeEditor({
        setCodeText: (code: any) => updateSnippetKey('codeText', code),
        setJsonSnippet: (data: any) => setSnippet(JSON.parse(data as string))
    })

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        /* 1. Usamos 100vh para que ocupe toda la pantalla y eliminamos el height: 80vh */
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: 3, 
            maxWidth: '1280px', 
            margin: '0 auto', 
            p: 2, 
            boxSizing: 'border-box', 
            height: '100vh', // Ocupa el alto total
            overflow: 'hidden' // Evita scrolls dobles
        }}>
            
            {/* COLUMNA IZQUIERDA */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                <Box>
                    <InputLabel>Prefijo</InputLabel>
                    <TextField fullWidth size='small' value={snippetData.prefix} onChange={(e) => updateSnippetKey('prefix', e.target.value)} />
                </Box>
                <Box>
                    <InputLabel>Descripción</InputLabel>
                    <TextField fullWidth size='small' value={snippetData.description} onChange={(e) => updateSnippetKey('description', e.target.value)} />
                </Box>
                
                {/* 2. El Card debe crecer para ocupar el resto del espacio */}
                <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <CardHeader
                        title="Editor"
                        sx={{ pb: 0 }} // Menos espacio abajo
                        action={(
                            <Box sx={{ width: 300 }}>
                                <Select 
                                    options={languageScopes}
                                    isMulti
                                    value={languageScopes.filter(a => snippetData.scope.split(',').includes(a.value))}
                                    onChange={(c) => updateSnippetKey('scope', c.map((a) => a.value).join(','))}
                                />
                            </Box>
                        )}
                    />
                    {/* 3. CardContent necesita flex: 1 para estirarse */}
                    <CardContent sx={{ 
                        flexGrow: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 1,
                        '&:last-child': { pb: 2 } // Fix para el padding extra de MUI
                    }}>
                        <Box sx={{ flexGrow: 1, minHeight: 0 }}> {/* minHeight: 0 es clave para flex hijos */}
                            <Editor
                                height="100%" // Ahora sí puede ser 100%
                                language={snippetData.scope.split(',')[0]}
                                value={snippetData.codeText}
                                onChange={(value) => updateSnippetKey('codeText', value)}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 14,
                                }}
                                onMount={handleLeftEditorMount}
                            />
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="outlined" size="small" onClick={(ev) => setAnchorEl(ev.currentTarget)}>
                                Reemplazar
                            </Button>
                            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                <MenuItem onClick={() => { replaceWithFilenameBase(); handleClose(); }}>
                                    Insertar {"${TM_FILENAME_BASE}"}
                                </MenuItem>
                            </Menu>
                            <Button variant="outlined" size="small" onClick={() => handlePaste('left')}>Pegar</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* COLUMNA DERECHA */}
            <Box sx={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <InputLabel sx={{ mb: 1 }}>JSON Resultante</InputLabel>
                <Box sx={{ flexGrow: 1, border: '1px solid #444', borderRadius: 1, overflow: 'hidden' }}>
                    <Editor
                        height="100%"
                        width='100%'
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
                </Box>
            </Box>
        </Box>
    )
}