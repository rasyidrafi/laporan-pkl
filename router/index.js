const fs = require('fs');
const routerFiles = fs.readdirSync(__dirname);
const path = require('path');
let exportObj = [];
routerFiles.forEach(fileName => {
    if (fileName !== "index.js" && fileName !== "input.docx" && fileName !== "output.docx") {
        const name = fileName == "root.js" ? "/" : `/${fileName.split('.')[0]}`;
        exportObj.push({name, path: path.join(__dirname, `/${fileName}`)});
    }
});

module.exports = exportObj;