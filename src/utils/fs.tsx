import { fileExtension } from "../constants";

declare global {
    interface Window {
        showDirectoryPicker(options?: any): Promise<FileSystemDirectoryHandle>;
    }
}

class FileManager {
    private rootHandle: FileSystemDirectoryHandle | null = null;

    /**
     * 1. Abre el selector y configura la carpeta raíz
     */
    async selectDirectory(): Promise<string> {
        this.rootHandle = await window.showDirectoryPicker({
            mode: 'readwrite' // Solicita permisos de escritura desde el inicio
        });
        return this.rootHandle.name;
    }

    /**
     * 2. Lee todos los archivos de un directorio (opcionalmente recursivo)
     */
    async listFiles(): Promise<{ name: string; kind: string }[]> {
        if (!this.rootHandle) throw new Error("No hay un directorio seleccionado");

        const files: { name: string; kind: string }[] = [];

        // Iteramos directamente sobre el rootHandle
        for await (const [name, handle] of this.rootHandle.entries()) {
            if (handle.kind === 'file' && handle.name.endsWith(fileExtension)) {
                files.push({ name, kind: 'file' });
            }
        }

        return files;
    }

    /**
     * 3. Lee el contenido de un archivo específico por su ruta (array de carpetas)
     */
    async readFile(filePath: string[]): Promise<string> {
        const fileName = filePath.pop();
        const dirHandle = await this.getDirectoryHandle(filePath);
        if (!fileName) throw new Error("Nombre de archivo no válido");

        const fileHandle = await dirHandle.getFileHandle(fileName);
        const file = await fileHandle.getFile();
        return await file.text();
    }

    /**
     * 4. Escribe contenido en un archivo (lo crea si no existe)
     */
    async writeFile(filePath: string[], content: string): Promise<void> {
        const fileName = filePath.pop();
        const dirHandle = await this.getDirectoryHandle(filePath, true);
        if (!fileName) throw new Error("Nombre de archivo no válido");

        // create: true permite crear el archivo si no existe
        const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });

        // Crear un stream de escritura
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
    }

    /**
     * Método auxiliar para navegar por la estructura de carpetas
     */
    private async getDirectoryHandle(path: string[], create = false): Promise<FileSystemDirectoryHandle> {
        if (!this.rootHandle) throw new Error("No hay directorio raíz");

        let current = this.rootHandle;
        for (const part of path) {
            current = await current.getDirectoryHandle(part, { create });
        }
        return current;
    }
}

export const fileManager = new FileManager()

export default fileManager