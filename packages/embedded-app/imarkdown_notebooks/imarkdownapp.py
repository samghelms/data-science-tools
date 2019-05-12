from subprocess import Popen
from notebook.notebookapp import NotebookApp, flags
from traitlets import Unicode, Bool
import time
from . import EXT_NAME, PACKAGE_DIR
from .config import IMarkdownConfig
from .extension import load_jupyter_server_extension
# from .utils import cmd_in_new_dir

import os
from contextlib import contextmanager

@contextmanager
def cmd_in_new_dir(newdir):
    cur_dir = os.getcwd()
    os.chdir(newdir)
    yield
    os.chdir(cur_dir)

webpack_port = 8357

webpack_hot = {"address": 'http://localhost:{webpack_port}/'.format(webpack_port=webpack_port),
               "command": ["yarn", "start", "--port", str(webpack_port)]}
imarkdown_flags = dict(flags)
imarkdown_flags['dev'] = (
    {
        # 'IMarkdownConfig': {'asset_url': 'dist'},
     'IMarkdownApp': {'dev_mode': True}
     },
    "\n".join([
        "Start imarkdown in dev mode, serving assets built from your source code.",
        "This is a hot reloading server that watches for changes to your source,",
        "rebuilds the js files, and serves the new assets on:",
        "    {address}",
        "To access this server run:",
        "    `{command}`"]).format(address=webpack_hot["address"],
                                   command=" ".join(webpack_hot["command"])
                                   )
)


class IMarkdownApp(NotebookApp):
    """Application for runing nteract on a jupyter notebook server.
    """
    default_url = Unicode('/imarkdown/edit',
                          help="nteract's default starting location")

    classes = [*NotebookApp.classes, IMarkdownConfig]
    flags = imarkdown_flags

    dev_mode = Bool(True, config=True,
                    help="""Whether to start the app in dev mode. Expects resources to be loaded
    from webpack's hot reloading server at {address}. Run
    `{command}`
    To serve your assets.
    This is only useful if NteractApp is installed editably e.g., using `pip install -e .`.
    """.format(address=webpack_hot["address"],
               command=" ".join(webpack_hot["command"])))

    def init_server_extensions(self):
        super(IMarkdownApp, self).init_server_extensions()
        if self.dev_mode:
            msg = 'IMarkdown server extension not enabled, loading in dev mode...'
            if not self.nbserver_extensions.get(EXT_NAME, False):
                self.log.warn(msg)
                load_jupyter_server_extension(self)


main = launch_new_instance = IMarkdownApp.launch_instance

if __name__ == '__main__':
    main()