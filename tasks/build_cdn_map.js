let fs = require("fs");
let path = require("path");

//build the import map for use in index.html

let pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../client/package.json"))
);
let dependencies = pkg.dependencies;

let result = {
  imports: {},
};

for ([name, version] of Object.entries(dependencies)) {
  result.imports[name] = `https://unpkg.com/${name}?module`;
}

fs.writeFileSync(
  path.join(__dirname, "../client/import_map.json"),
  JSON.stringify(result, null, 2)
);
