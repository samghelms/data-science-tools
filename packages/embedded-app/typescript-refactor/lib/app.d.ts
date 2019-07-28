import './App.css';
import React, { Component } from 'react';
import KernelManager from './kernelManager';
import JupyterKernel from './kernels/jupyterKernel';
export interface AppProps {
    token: string;
    path: string;
}
export interface AppState {
    name: string;
    path: string | null;
    showFS: boolean;
    fsProvider: any;
    needsRename: boolean;
    width: number;
}
declare class App extends Component<AppProps, AppState> {
    notificationSystem: React.RefObject<HTMLDivElement>;
    _kernelManager: KernelManager;
    constructor(props: AppProps);
    updateWidth(): void;
    componentDidMount(): void;
    registerKernel(kernel: JupyterKernel): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default App;
//# sourceMappingURL=app.d.ts.map