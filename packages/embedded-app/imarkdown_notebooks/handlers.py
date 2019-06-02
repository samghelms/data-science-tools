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

from . import PACKAGE_DIR

import logging
import subprocess
import threading
from pyls_jsonrpc import streams
from tornado import ioloop, process, web, websocket


log = logging.getLogger(__name__)


FILE_LOADER = FileSystemLoader(PACKAGE_DIR)

class NAppHandler(IPythonHandler):
    """Render the nteract view"""
    def initialize(self, config, page):
        # print('initializing')
        self.nteract_config = config
        self.page = page

    @web.authenticated
    def get(self, path="/"):
        # print("handling a get request")
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
        self.write(template)
        

    def get_template(self, name):
        return FILE_LOADER.load(self.settings['jinja2_env'], name)


class LanguageServerWebSocketHandler(websocket.WebSocketHandler):
    """Setup tornado websocket handler to host an external language server."""

    writer = None

    def open(self, *args, **kwargs):
        log.info("Spawning pyls subprocess")

        # Create an instance of the language server
        proc = process.Subprocess(
            ['pyls', '-v'],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE
        )

        # Create a writer that formats json messages with the correct LSP headers
        self.writer = streams.JsonRpcStreamWriter(proc.stdin)

        # Create a reader for consuming stdout of the language server. We need to
        # consume this in another thread
        def consume():
            # Start a tornado IOLoop for reading/writing to the process in this thread
            ioloop.IOLoop()
            reader = streams.JsonRpcStreamReader(proc.stdout)
            reader.listen(lambda msg: self.write_message(json.dumps(msg)))

        thread = threading.Thread(target=consume)
        thread.daemon = True
        thread.start()

    def on_message(self, message):
        """Forward client->server messages to the endpoint."""
        msg = json.loads(message)
        params = msg['params']
        method = msg['method']

        filter_methods = ['textDocument/codeLens', 'textDocument/completion', 'textDocument/signatureHelp', 'textDocument/codeAction']

        print(msg)
        if 'type' in params and params['type'] == 'python' and method in filter_methods:
            self.writer.write(msg)
        elif method not in filter_methods:
            self.writer.write(msg)
        # else:
        # self.writer.write(msg)
        

    def check_origin(self, origin):
        return True

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
        (url + r"/language-server/?", LanguageServerWebSocketHandler, {}),
    ]

    web_app.add_handlers(".*$", handlers)