**Warning**: this documentation is mostly out of date, you should go to the official website to fetch latest information: http://parasol.alexgirard.com


parasol
=======

A network graph exploration tool

## Run

```
npm install
npm start
open http://localhost:8095
```

## Boilerplate quickstart

1. Download and extract Parasol boilerplate</li>
2. Serve its *index.html* with your favorite webserver, or: `python -m SimpleHTTPServer 8095`
3. Open your web browser to display Parasol interface: [http://127.0.0.1:8095](http://127.0.0.1:8095)

You can then modify the <i>data.json</i> file to modify the displayed network.

[boilerplate_v1.zip](https://github.com/alx/parasol/archive/boilerplate_v1.zip)

## settings.json - global app config

When opening the project webpage, it loads `settings.json` file that contains
specific settings for network to pre-load and general user interface.

```
{
  "networks": [
    {
      "url": "json/tsne.json",
      "name": "TSNE",
      "options": {
        "layout": "none",
        "loader": {
          "name": "json"
        }
      }
    },
    ...
  ],
  "network_loader": {"path": "/networks.json"},
  "ui": {
    "muiTheme": "dark"
  }
}
```

* `networks` array : list of networks to pre-load inside parasol
* `network` object :
  * `url` : url of the file containing the network graph
  * `name` : name of the network to display in parasol UI
  * `options` object : various plugins to load for this specific network
    * `layout` : layout used to modify this graph, can be `forceatlas2`, `forcelink` or `none`
    * `relativeSize`: `true` or `false` depending if you need to use [relativeSize](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.plugins.relativeSize) sigmajs plugin
* `network_loader` object :
  * `path` : path to the `networks.json` file that contains additional network to be loaded in this instance of parasol
* `ui` object :
  * `muiTheme` : general theme setting, can be `light` or `dark`

## networks.json - list of available networks

This file will be fetched, and its networks will be available in the **Add Network** modal.

This feature can help you if you don't want to load in the left drawer this list of secondary networks.

## Deploy on a webserver

### Build and deploy

```
yarn install
yarn build
scp -r build/* webserver:/var/www/parasol/
```

Don't forget to set your default settings in `build/settings.json`, move your data in `build/data/` folder, and set available networks inside `build/networks.json`.

### nginx configuration

You need an `api` location to use deepdetect loader.

Configuration example for http://parasol.deepdetect.com :

```
server {
  listen 80;
  listen [::]:80;

  root /var/www/parasol;
  index index.html index.htm;

  server_name parasol.deepdetect.com;

  location / {
    try_files $uri $uri/ =404;
    autoindex on;
  }

  location /api {
    rewrite ^/api(.*)$  $1  break;
    # DeepDetect server
    proxy_pass         http://server_ip:server_port;
    proxy_set_header   Host                   $http_host;
    # If you have http basic auth in place on your deepdetect server
    # Get base_64_from terminal: echo -n 'login:pass' | base64
    # proxy_set_header Authorization "Basic base_64_string";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_redirect off;
  }
}
```


## Credits

* [sigma](http://sigmajs.org/) for the visualisation tool
* [react-sigma](https://dunnock.github.io/react-sigma/) for connecting sigma to react
* [mobx-react-boilerplate](https://github.com/il-tmfv/mobx-react-boilerplate) for providing a boilerplate
* [deepdetect](https://deepdetect.com) for machine learning integration
* [deepdetect-js](https://github.com/alx/deepdetect/tree/client-js-242/clients/js) client library to connect to deepdetect server
