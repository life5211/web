import data from "./data.json"
import "./index.css"

function fn1(){
    console.log(111);
}

fn1();
console.log(data);

// webpack .\src\index.js -o ./dist/bundle_prod.js --mode=production
// webpack .\src\index.js -o ./dist/bundle.js --mode=development