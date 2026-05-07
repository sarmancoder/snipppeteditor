export default function useFS() {
    async function leerDirectorio() {
        try {
            // 1. Abrir el selector de carpetas
            // @ts-ignore
            const directorioHandle = await window.showDirectoryPicker();

            // 2. Iterar sobre los archivos y carpetas
            for await (const [nombre, handle] of directorioHandle.entries()) {
                if (handle.kind === 'file') {
                    console.log(`Archivo encontrado: ${nombre}`);

                    // Si quieres leer el contenido de un archivo específico:
                    const file = await handle.getFile();
                    const contenido = await file.text();
                    console.log(`Contenido de ${nombre}:`, contenido.substring(0, 100));
                } else if (handle.kind === 'directory') {
                    console.log(`Carpeta encontrada: ${nombre}`);
                }
            }
        } catch (err) {
            console.error('El usuario canceló o hubo un error:', err);
        }
    }
    return { leerDirectorio }
}