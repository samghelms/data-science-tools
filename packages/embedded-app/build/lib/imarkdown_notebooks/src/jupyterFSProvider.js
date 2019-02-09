import { ContentsManager, ServerConnection, Contents } from '@jupyterlab/services';
  
export default class JupyterFSProvider {
    constructor(settings) {
        this.contentsManager = new ContentsManager({serverSettings: settings, defaultDrive: undefined});
        this.get = this.get.bind(this);
    }

    async get(parent, cfg, callback) {
        const path = (parent && parent.path) || '/'
        const data = await this.contentsManager.get(path);
        callback(data.content)
    }

    async save(path, content) {
        return await this.contentsManager.save(path, {content, type: 'file', format: 'text'});
    }

    async rename(oldPath, newPath) {
        return await this.contentsManager.rename(oldPath, newPath);
    }

    async getContent(path) {
        return await this.contentsManager.get(path);
    }

}