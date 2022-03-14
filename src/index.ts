import fs from 'fs';
import path from 'path';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import util from 'util';
import childproc from 'child_process';
const exec = util.promisify(childproc.exec);
import axios from "axios";
import cheerio from 'cheerio';

const RUNNPM = false;

(async () => {
    const dir = path.join(process.cwd(), 'proj')
    await git.clone({ fs, http, dir, url: 'https://github.com/jy1263/TapeMobile' })
    process.chdir(dir)

    if(RUNNPM) {
        try {
            await exec("npm i")
            if (!fs.existsSync(path.join(dir, "app", "app.html"))) {await exec("npm run extract")}
            await exec("npm run build && npm run sync");
            
            console.log("installed packages")
        }
        catch(e:any) {
            console.error(e)
        }
    }
    const $ = cheerio.load(await axios.get("https://dl-ssl.google.com/android/repository/repository.xml"), {
        xmlMode: true
    });
    console.log($("sdk\\:archives"))
})()
