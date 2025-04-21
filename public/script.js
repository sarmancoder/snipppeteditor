console.log('Hola desde el script<')

window.addEventListener("beforeinstallprompt", (event) => {
    console.log('before install')
    event.preventDefault();
    window.installPrompt = event
});