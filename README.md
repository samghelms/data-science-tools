# Data science tools

A monorepo for data science tools. .. thinking about how to reuse components from the very beginning ... Jupyter and vscode much more mature projects ... unsure if I want this to be a project to develop serious software, or to rapidly prototype and test cutting edge ideas ... Call for developers: the more the merrier ...

## Interactive markdown (imarkdown) notebooks

Imarkdown notebooks generalize rmarkdown notebooks to multiple languages (although at this point in time only python is supported), and leverage Microsoft's open source Monaco editor and Language Server Protocol to provide .

![](./imarkdown_demo.gif)

This app is currently implemented as a Jupyter extension and is in a beta stage. 

Here are some of the advantages imarkdown notebooks have over Jupyter notebooks:

- version control: imarkdown documents are stored as plain markdown files, and outputs are stored on a single line, whereas Jupyter stores notebooks as JSON files. Impossible to read merge conflicts between notebooks should be a thing of the past using imarkdown.
- language server protocol integration: By building on top of the monaco editor, the application can leverage state of the art code completion via the language server protocol.


## Interplanetary explorer (planned)

A finder application that can span multiple computers and filesystems, from remote systems over ssh to hadoop clusters. Attempts to bring the ease of finding files on a mac to cloud computing.

# TODOS:

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