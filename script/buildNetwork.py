import requests
from bs4 import BeautifulSoup
import pprint
import json

import networkx as nx
from networkx.readwrite import json_graph

JSON_FILE="data.json"
ROOT_URL="https://blog.wfmu.org/freeform/page/"

NUMBER_PAGE=20

G = nx.Graph()

def save_json(filename, graph):
    g = graph
    g_json = json_graph.node_link_data(
        g,
        {'link': 'edges'}
    )
    json.dump(
        g_json,
        open(filename,'w+'),
        indent=2
    )

def entries_to_graph(graph, entries):

    for entry in entries:

        entry_id = len(graph.nodes)
        title = entry.select(".entry-header a")[0]

        graph.add_node(entry_id,
                   label=title.get_text(),
                   metadata={
                       "category": "entry",
                       "url": title["href"]
                   }
        )

        for class_name in entry["class"]:

            if "entry-category" in class_name:

                node_label = class_name.replace("entry-category-", "")

                exists = False
                for existing_node in graph.nodes(data=True):
                    if existing_node[1]['label'] == node_label:
                        node_id = existing_node[0]
                        test_node[1]["size"] += 1

                if not node_id:
                    node_id = len(graph.nodes)
                    graph.add_node(node_id,
                                   label=node_label,
                                   metadata={
                                       "category": "tag"
                                   },
                                   size=1
                    )

                graph.add_edge(
                    entry_id,
                    node_id,
                    id="{}".format(len(graph.edges))
                )

    return G

def scrape_page_entries(url):
    """Scrape target URL for metadata."""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
    }
    r = requests.get(url, headers=headers)
    html = BeautifulSoup(r.content, 'html.parser')
    return html.select(".entry")

def get_title(html):
    """Scrape page title."""
    title = None
    if html.title.string:
        title = html.title.string
    elif html.find("meta", property="og:title"):
        title = html.find("meta", property="og:title").get('content')
    elif html.find("meta", property="twitter:title"):
        title = html.find("meta", property="twitter:title").get('content')
    elif html.find("h1"):
        title = html.find("h1").string
    return title


def get_description(html):
    """Scrape page description."""
    description = None
    if html.find("meta", property="description"):
        description = html.find("meta", property="description").get('content')
    elif html.find("meta", property="og:description"):
        description = html.find("meta", property="og:description").get('content')
    elif html.find("meta", property="twitter:description"):
        description = html.find("meta", property="twitter:description").get('content')
    elif html.find("p"):
        description = html.find("p").contents
    return description


def get_image(html):
    """Scrape share image."""
    image = None
    if html.find("meta", property="image"):
        image = html.find("meta", property="image").get('content')
    elif html.find("meta", property="og:image"):
        image = html.find("meta", property="og:image").get('content')
    elif html.find("meta", property="twitter:image"):
        image = html.find("meta", property="twitter:image").get('content')
    elif html.find("img", src=True):
        image = html.find_all("img").get('src')
    return image


def get_site_name(html, url):
    """Scrape site name."""
    site_name= None
    if html.find("meta", property="og:site_name"):
        site_name = html.find("meta", property="og:site_name").get('content')
    elif html.find("meta", property='twitter:title'):
        site_name = html.find("meta", property="twitter:title").get('content')
    else:
        site_name = url.split('//')[1]
        return site_name.split('/')[0].rsplit('.')[1].capitalize()
    return site_name


def get_favicon(html, url):
    """Scrape favicon."""
    favicon = None
    if html.find("link", attrs={"rel": "icon"}):
        favicon = html.find("link", attrs={"rel": "icon"}).get('href')
    elif html.find("link", attrs={"rel": "shortcut icon"}):
        favicon = html.find("link", attrs={"rel": "shortcut icon"}).get('href')
    else:
        favicon = f'{url.rstrip("/")}/favicon.ico'
    return favicon


def get_theme_color(html):
    """Scrape brand color."""
    if html.find("meta", property="theme-color"):
        color = html.find("meta", property="theme-color").get('content')
        return color
    return None


#for i in [1, 2, 3, 4, 5]:
for i in range(NUMBER_PAGE):
    print("parse parge {}".format(i))
    entries = scrape_page_entries("{}{}".format(ROOT_URL, i))
    graph = entries_to_graph(G, entries)

save_json(JSON_FILE, graph)
