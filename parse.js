// parse.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { routes } = require("./src/routes");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const madge = require("madge");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

console.log(routes[0].path, routes[0].load.toString());

function getPathEntry(routes) {
  const result = {};
  routes.forEach((item) => {
    if (item.load) {
      const loadEntryPathMatched = item.load
        .toString()
        .match(/['"]\.(\/.+?)['"]/);
      const loadEntryPath = loadEntryPathMatched
        ? loadEntryPathMatched[1]
        : null;
      result[loadEntryPath] = item.path;
    }
  });
  return result;
}

async function parse() {
  const routesMap = getPathEntry(routes);

  console.log(routesMap);

  // 页面到文件的映射
  const pageToFileMap = {};

  for (let [entryFilePath, pagePath] of Object.entries(routesMap)) {
    // 拼接入口文件绝对路径
    const realEntryFilePath = path.join(
      __dirname,
      "./src",
      "." + entryFilePath,
      "./index.js"
    );
    // 入口文件所在目录
    const pageIndexDir = path.dirname(realEntryFilePath);
    console.log({ realEntryFilePath, pageIndexDir });
    const res = await madge(realEntryFilePath, {});

    // 相对根目录的位置
    const relativeRootDirPathList = Object.keys(res.obj()).map(
      (relativeFilePath) => {
        // 用入口文件所在文件夹，加文件相对路径，拼成全路径
        const fullPath = path.resolve(pageIndexDir, relativeFilePath);
        // 相对于根目录的路径
        const relativeRootDirPath = path.relative(process.cwd(), fullPath);
        return relativeRootDirPath;
      }
    );

    pageToFileMap[pagePath] = relativeRootDirPathList;
  }

  console.log("页面到文件的映射====>");
  console.log(pageToFileMap);

  const fileToPahMap = {};

  for (let [pagePath, fileList] of Object.entries(pageToFileMap)) {
    fileList.forEach((fileItem) => {
      if (fileToPahMap[fileItem]) {
        fileToPahMap[fileItem].push(pagePath);
      } else {
        fileToPahMap[fileItem] = [pagePath];
      }
    });
  }

  console.log("文件到页面的映射====>");
  console.log(fileToPahMap);
}

parse();
