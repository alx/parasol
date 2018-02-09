import dynamic from 'next/dynamic'
import React from "react"
import AppState from "../src/AppState"

import Meta from "../nextjs/components/meta"

const ParasolBundle = dynamic({
  modules: props => {
    const components = {
      Parasol: import('../src/App')
    }
    return components
  },
  render: (props, { Parasol }) => {
    const appState = new AppState();
    appState.initSettings(props.settings);
    return <Parasol appState={appState} />
  },
  ssr: false
})

export default () => {
  return <div>
    <Meta />
    <ParasolBundle settings={{
      "networks": [
        {
          "url": "/static/les-miserables.json",
          "name": "Les Miserables",
          "options": {
            "layout": "forcelink",
            "loader": {
              "name": "json",
              "options": {
              "limitEdgeCount": 500
              }
            }
          }
        }
      ]
    }}/>
  </div>
}
