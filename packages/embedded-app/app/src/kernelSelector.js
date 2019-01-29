
import * as React from 'react';

export default class KernelSelector extends React.Component {

    render() {
        return <div>select a kernel</div>
    }

    // Kernel.getSpecs(settings).then(kernelSpecs => {
    //     console.log(kernelSpecs.default)
    //     return Kernel.startNew({
    //         name: kernelSpecs.default,
    //         serverSettings: settings
    //       });
    // }).then(kernel => {
    //     this2.setState({kernel: kernel, kernelLoaded: true})
    // });

}