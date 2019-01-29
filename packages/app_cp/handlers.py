import json
import os
from tornado import web

HTTPError = web.HTTPError

import notebook

from notebook.base.handlers import (
    IPythonHandler,
    FileFindHandler,
    FilesRedirectHandler,
    path_regex,
)

from notebook.utils import url_escape

from jinja2 import FileSystemLoader
from notebook.utils import url_path_join as ujoin
from traitlets import HasTraits, Unicode, Bool

# from . import PACKAGE_DIR

PACKAGE_DIR = os.path.realpath(os.path.dirname(__file__))

FILE_LOADER = FileSystemLoader(PACKAGE_DIR)

class NAppHandler(IPythonHandler):
    """Render the nteract view"""
    def initialize(self, config, page):
        print('initializing')
        self.nteract_config = config
        self.page = page

    @web.authenticated
    def get(self, path="/"):
        print("handling a get request")
        config = self.nteract_config
        settings_dir = config.settings_dir
        assets_dir = config.assets_dir
        
        base_url = self.settings['base_url']
        url = ujoin(base_url, config.page_url, '/static/')

        # Handle page config data.
        page_config = dict()
        page_config.update(self.settings.get('page_config_data', {}))
        page_config.setdefault('appName', config.name)
        page_config.setdefault('appVersion', config.version)

        asset_url = config.asset_url

        if asset_url is "":
            asset_url = base_url

        # Ensure there's a trailing slash
        if not asset_url.endswith('/'):
            asset_url = asset_url + '/'

        filename = path.split("/")[-1]
        if filename:
            page_title = '{filename} - IMarkdown'.format(filename=filename)
        else:
            page_title = 'IMarkdown'

        config = dict(
            asset_url=asset_url,
            page_title=page_title,
            page_config=page_config,
            public_url=url,
            contents_path=path,
            page=self.page,
        )

        template = self.render_template('index.html', **config)
        print(template)
        self.write(template)

    def get_template(self, name):
        return FILE_LOADER.load(self.settings['jinja2_env'], name)


def add_handlers(web_app, config):
    """Add the appropriate handlers to the web app.
    """
    print("adding handlers")
    base_url = web_app.settings['base_url']
    url = ujoin(base_url, config.page_url)
    assets_dir = config.assets_dir
    print("assets dir")
    print(assets_dir)

    package_file = os.path.join(assets_dir, 'package.json')
    with open(package_file) as fid:
        data = json.load(fid)

    config.version = (config.version or
                      data['version'])
    config.name = config.name or data['name']


    handlers = [
        # TODO Redirect to /tree
        (url + r'/?', NAppHandler, {
            'config': config,
            'page': 'edit'
        }),
        # (url + r"/tree%s" % path_regex, NAppHandler, {
        #     'config': config,
        #     'page': 'tree',
        # }),
        (url + r"/edit%s" % path_regex, NAppHandler, {
            'config': config,
            'page': 'edit',
        }),
        # (url + r"/view%s" % path_regex, NAppHandler, {
        #     'config': config,
        #     'page': 'view'
        # }),
        (url + r"/static/(.*)", FileFindHandler, {
            'path': assets_dir
        }),
    ]

    web_app.add_handlers(".*$", handlers)