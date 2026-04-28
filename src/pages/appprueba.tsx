import { Editor } from "@monaco-editor/react"
import { useState } from "react"

export default function App() {
  const [codigo, setCodigo] = useState('')
  return (
    /* Usamos vh (viewport height) para asegurar que el contenedor 
       padre ocupe el alto total de la ventana */
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <p style={{ margin: "10px" }}>appprueba</p>
      
      <div style={{ flexGrow: 1 }}> 
        <Editor
          theme="vs-dark"
          height="100%" // Ahora el 100% se basa en el div de arriba
          defaultLanguage="javascript"
          defaultValue="// Escribe tu código aquí"
          value={codigo}
          onChange={(a) =>{
            console.log(a)
            setCodigo(a as any)
          }}
        />
      </div>
    </div>
  )
}