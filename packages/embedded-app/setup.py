#!/usr/bin/env python
# -*- coding: utf-8 -*-

import setuptools
import json
import os

version = '0.0.2-dev'
name = "imarkdown_notebooks"

here = os.path.realpath(os.path.dirname(__file__))

with open(os.path.join(here, name, "package.json")) as f:
    packageJSON = json.load(f)
    version = packageJSON['version']

config_d_filepath = os.path.join('jupyter-config',
                                 'jupyter_notebook_config.d',
                                 'imarkdown.json')

data_files = [('etc/jupyter/jupyter_notebook_config.d', [config_d_filepath])]

setuptools.setup(
    name=name,
    version=version,
    url="https://github.com/nteract/nteract",
    author="nteract contributors",
    author_email="jupyter@googlegroups.com",
    description="Extension for the jupyter notebook server and nteract",
    packages=setuptools.find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=['notebook', 'python-jsonrpc-server', 'python-language-server'],
    data_files=data_files,
    entry_points={
        'console_scripts': [
            'jupyter-imarkdown = imarkdown_notebooks.imarkdownapp:main'
        ]
    }

)