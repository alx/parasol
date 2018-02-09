import LoaderJson from "../../src/Loaders/Json";

test("constructor", () => {
  const network = {};
  const muiTheme = {};
  const options = {};
  const loader = new LoaderJson(network, muiTheme, options);
  expect(loader.network).toBe(network);
});
