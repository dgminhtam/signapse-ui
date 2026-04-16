const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:/Github/signapse-ui/signapse-ui/docs/api_mapping.json', 'utf8'));
const paths = data.paths;
for (const path in paths) {
    for (const method in paths[path]) {
        console.log(`${method.toUpperCase()} ${path} ${paths[path][method].operationId || ''}`);
    }
}
