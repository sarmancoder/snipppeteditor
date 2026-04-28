import { Editor } from "@monaco-editor/react";
import { Box, Card, CardActions, CardContent, CardHeader, TextField } from "@mui/material";
import { useAppContext } from "../hooks/useAppContext";
import Select from "react-select";
import { languageScopes } from "../constants";

export default function DualEditorPage() {
  const { setValue, codeEditorRef, onPasteExistingSnippet, snippetData, snippetResult, resultSnippetEditor } = useAppContext()
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2 }}>
        <TextField label="Prefijo" fullWidth value={snippetData.prefix} onChange={(e) => setValue('prefix', e.target.value)} />
        <TextField label="Codigo" fullWidth value={snippetData.description} onChange={(e) => setValue('description', e.target.value)} />
        <Card>
          <CardHeader title="Contenido del snippet"
            action={(
              <Box sx={{ width: 300 }}>
                <Select
                  options={languageScopes}
                  isMulti
                  value={languageScopes.filter(a => snippetData.scope.split(',').includes(a.value))}
                  onChange={(c) => setValue('scope', c.map((a: any) => a.value).join(','))}
                />
              </Box>
            )}
          />
          <CardContent>
            <Editor
              onMount={(ed) => {
                codeEditorRef.current = ed
              }}
              language={snippetData.scope.split(',')[0]}
              height={'500px'} theme="vs-dark"
              // value={codigo}
              onChange={(e) => {
                if (!e) return
                setValue('codeText', e)
              }}
            />
          </CardContent>
          <CardActions>

          </CardActions>
        </Card>
      </Box>
      <Box sx={{ flexGrow: 3 }}>
        <Editor theme="vs-dark" height={'100%'}
          value={snippetResult}
          language="json"
          onMount={(ed) => {
            console.log('configurando editor')
            resultSnippetEditor.current = ed
            ed.onDidPaste(() => {
              onPasteExistingSnippet()
            })
          }}
        />
      </Box>
    </Box>
  )
}
