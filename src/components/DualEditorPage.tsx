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
        <>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, maxWidth: '1280px', margin: '0 auto', p: 1, boxSizing: 'border-box', mt: 2, height: '80vh' }}>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                    <Box>
                        <InputLabel>Prefijo</InputLabel>
                        <TextField fullWidth={true}
                            size='small'
                            value={snippetData.prefix}
                            onChange={(e) => {
                                updateSnippetKey('prefix', e.target.value)
                            }}
                        />
                    </Box>
                    <Box>
                        <InputLabel>Descripción</InputLabel>
                        <TextField fullWidth={true}
                            size='small'
                            value={snippetData.description}
                            onChange={(e) => {
                                updateSnippetKey('description', e.target.value)
                            }}
                        />
                    </Box>
                    <Card sx={{ flexGrow: 1 }}>
                        <CardHeader
                            title="Editor"
                            action={(
                                <Select options={languageScopes}
                                    isMulti
                                    value={languageScopes.filter(a => {
                                        var snippetLangs = snippetData.scope.split(',')
                                        return snippetLangs.includes(a.value)
                                    })}
                                    onChange={(c) => {
                                        console.log('react select on change ' + JSON.stringify(c))
                                        updateSnippetKey('scope', c.map((a) => a.value).join(','))
                                    }}
                                />
                            )}
                        />
                        <CardContent sx={{ height: '100%' }}>
                            <Editor
                                height="260px"
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
                            <Box sx={{ padding: 1 }}>
                                <Button
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={(ev) => {
                                        setAnchorEl(ev.currentTarget)
                                    }}
                                >
                                    Reemplazar
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    slotProps={{
                                        list: {
                                            'aria-labelledby': 'basic-button',
                                        },
                                    }}
                                >
                                    <MenuItem onClick={() => {
                                        replaceWithFilenameBase()
                                        handleClose()
                                    }}>Insertar ${"{TM_FILENAME_BASE}"}</MenuItem>
                                </Menu>
                                <Button onClick={() => handlePaste('left')}>Pegar</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Editor
                        height="90%"
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
        </>
    )
}

