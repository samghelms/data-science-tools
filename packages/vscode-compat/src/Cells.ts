
export namespace Cells {
    const global = window as any;
    const symbol = Symbol('Cells');
    export function installCellsManager(cm: any) {
        if (global[symbol]) {
            console.error(new Error('Cells manager has been overridden'));
        }
        global[symbol] = cm
    }
    
    export function getCellsManager(): string {
        if (!global[symbol]) {
            console.error(new Error('Cells manager has not been installed'));
        }
        return global[symbol]
    }
    
}