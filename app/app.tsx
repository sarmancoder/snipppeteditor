import Select from 'react-select'
import useCodeEditor from "@/hooks/useCodeEditor"
import useSnippetData from "@/hooks/useSnippetData"
import { Editor } from "@monaco-editor/react"
import { Box, Button, Card, CardActions, CardContent, CardHeader, FormControl, FormControlLabel, InputLabel, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { useLocalStorage } from "@uidotdev/usehooks"
import { useEffect, useState } from "react"
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { localStorageDarkModeKey, uiStates, useMyThemeProviderContext } from '@/components/ThemeProvider'

const appbarStateKey = "hide-appbar"

const appBarStates = Object.freeze({
    hided: "1",
    showed: "0"
})

export default function DualEditorPage() {
    const {setDark} = useMyThemeProviderContext()
    const [appbarState, setAppbarState] = useLocalStorage(appbarStateKey, appBarStates.showed)
    const { snippetData, updateSnippetKey, languageScopes, jsonSnippet, setSnippet } = useSnippetData()
    const { handleLeftEditorMount, replaceWithFilenameBase, handlePaste } = useCodeEditor({
        setCodeText: (code) => updateSnippetKey('codeText', code),
        setJsonSnippet: (data) => setSnippet(JSON.parse(data as string))
    })

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if ((window as any).flutter_inappwebview) {
            localStorage.setItem('hide-appbar', appBarStates.hided)
            setAppbarState(appBarStates.hided as any)

            window.addEventListener('toggleDark', (event: any) => {
                const isDark = event.detail.dark == uiStates.dark
                setDark(isDark)
                localStorage.setItem(localStorageDarkModeKey, isDark ? uiStates.dark : uiStates.light)
            })
        }
    }, [])

    return (
        <>
            {appbarState === appBarStates.showed && <MyAppBar />}
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
                                height="280px"
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

function MyAppBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Snippet editor
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
