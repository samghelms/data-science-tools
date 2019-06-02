// require('monaco-editor');
require('monaco-editor-core');
self.MonacoEnvironment = {
    getWorkerUrl: () => '/imarkdown/static/dist/editor.worker.js'
}
require('./index');