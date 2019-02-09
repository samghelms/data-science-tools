require('monaco-editor');
self.MonacoEnvironment = {
    getWorkerUrl: () => '/imarkdown/static/dist/editor.worker.js'
}
require('./index');