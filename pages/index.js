import dynamic from "next/dynamic";
import React from "react";
import AppState from "../src/AppState";

import Meta from "../nextjs/components/meta";

const ParasolBundle = dynamic({
  modules: props => {
    const components = {
      Parasol: import("../src/App")
    };
    return components;
  },
  render: (props, { Parasol }) => {
    const appState = new AppState();
    appState.initSettings(props.settings);
    return <Parasol appState={appState} />;
  },
  ssr: false
});

const Index = props => {
  return (
    <div>
      <Meta />
      <ParasolBundle settings={props.settings} />
    </div>
  );
};

Index.componentDidMount = async function() {
  const res = await fetch("/static/settings/json");
  const data = await res.json();

  console.log(`settings.json fetched`);

  return {
    settings: data
  };
};

export default Index;
