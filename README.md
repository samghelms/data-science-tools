# Data science tools

A monorepo for applications and tools useful for data scientists. The applications designed within this repo are intentionally split into components to encourage flexibility and multiple use cases -- for example, using the file finder in the notebook application as a standalone finder application for use with hadoop file systems.

The applications are minimally viable products, designed to showcase ideas about the future of notebook and interactive computing tools in the era of cloud computing and big data.

Below is a list of applications, under development and planned:

## Interactive markdown (imarkdown) notebooks

### Installation

`pip install --upgrade jupyter imarkdown_notebooks jupyter_contrib_nbextensions`

Then run `jupyter imarkdown` to launch the imarkdown notebook.

#### Debugging install

Note that the version 0.0.1 release is buggy. Make sure you have 0.0.2^ (running pip install --upgrade should ensure this). 

I have verified that this works in the `jupyter/scipy-notebook`

To run inside of it:

```bash
docker run -it -p 8888:8888 jupyter/scipy-notebook bash
pip install --upgrade jupyter imarkdown_notebooks jupyter_contrib_nbextensions
jupyter imarkdown
```

Also note that the language server seems to run a bit slowly inside of the docker container.

### Overview

Imarkdown notebooks generalize rmarkdown notebooks to multiple languages (although at this point in time only python is supported), and leverage Microsoft's open source Monaco editor and Language Server Protocol to provide a modern code editing experience in the notebook.

![](./imarkdown_demo.gif)

This app is currently implemented as a Jupyter extension and is in a beta stage. Future plans include a visual studio code extension, although this depends on a few updates to the vscode API.

Here are some of the advantages imarkdown notebooks could have over Jupyter notebooks:

- version control: imarkdown documents are stored as plain markdown files, and outputs are stored on a single line, whereas Jupyter stores notebooks as JSON files. Impossible to read merge conflicts between notebooks should be a thing of the past using imarkdown.
- language server protocol integration: By building on top of the monaco editor, the application can leverage state of the art code completion via the language server protocol.


## Interplanetary finder (planned)

A finder application that can span multiple computers and filesystems, from remote systems over ssh to hadoop clusters. Attempts to bring the ease of finding files on a mac to cloud computing.

# Development

This projects uses [lerna]() to manage its monorepo. Once you have cloned the repo and installed lerna, run the following commands from some location in the repository to get started with development:

`lerna bootstrap --hoist`

**WARNING**: 

You MUST use `--hoist`, otherwise you will get `Uncaught Error: Language Client services has not been installed` when the client tries to connect to the language server. This is because of the way that the Language Client has been implemented, and is an issue here because we have seperate packages accessing the Language Client that will each try to install and use their own language services if the bootstrap command is used without `--hoist`


then run `lerna run build --stream` to build the components for the application.

TODO: finish dev insstructions, missing a few steps here (the hoist warning is the most important thing).

# Credits

Tom Augspurger - his library, (stitch)[https://github.com/pystitch/stitch] helped inspire imarkdown notebooks.

Jupyter team - the backend of many of these applications are built off of their project.

(Nteract)[https://nteract.io/] - They were the original team to rethink the look and feel of jupyter notebooks, and their work made bundling imarkdown notebooks as a jupyter notebook extension thousands of times easier.

vscode and Monaco - For building the text editor and language server that these applications build off of

# Deployment instructions

TODO

# TODOS:

- Add licenses (MIT)
- Documentation website
- Clean up outputs
- electron app
- open up the file explorer so that it is expanded to current folder (or last state)
- icons not showing up for jupyter notebooks
- add a built in terminal (this is really useful if there are file system operations not implemented with the gui)
- Create a terminal that can display rich outputs
- add some sort of file search to the finder
- rename and save functionality
- distribute as a jupyter extension
- allow adding folders
- make text input in kernel headers interactive - highlight the text when it matches the name of a kernel, give autocomplete options, provide decorators to show the kernel status.
- start kernels on execute if they aren't already running
- add new kernel option
- persist kernel info / app state
- Build an example that can run fully in the browser via iodide
- Build documentation using docz
- Look into integration with the theia ide
- R kernel
- SQL kernel (ODBC support - language server will have to come later)