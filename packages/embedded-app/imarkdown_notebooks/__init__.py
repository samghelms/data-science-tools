import os

PACKAGE_DIR = os.path.realpath(os.path.dirname(__file__))

from ._version import __version__
from .extension import load_jupyter_server_extension

EXT_NAME = "imarkdown_notebooks"

def _jupyter_server_extension_paths():
    return [{
        "module": EXT_NAME
}]