/// <reference path="./typings/index.d.ts" />
import {platform} from "os";
import * as NodeSass from "node-sass";
import * as FS from "fs";
import * as Path from "path"

const isWindows: boolean = platform() == "win32";

interface Variables {
  [variableName: string]: string | number;
}

export class CssStyleguideBrunch {
  brunchPlugin: boolean;
  // type: string = "stylesheet";
  extension: string = "json";
  pattern: RegExp = /\.s[ac]ss$/;
  _bin: string = isWindows ? 'sass.bat' : 'sass';
  _compass_bin: string = isWindows ? 'compass.bat' : 'compass'; //eslint-disable-line camelcase
  paths: Array<string>;

  constructor(private config: any) {
    if (this.config.options) { this.config = this.config.options }
    this.paths = this.config.includePaths;
  }

  preCompile(resolver: () => any): Promise<any> {
    const promises: Array<Promise<any>> = [];
    this.paths.forEach((path: string) => {
      const promise: Promise<any> = new Promise((_resolve, _reject): void => {
        FS.readFile(path, (readError: NodeJS.ErrnoException, _data: Buffer): void => {
          if (readError) { throw new Error(`Read error: ${readError.message}`) }
          const fileName: string = Path.basename(path, ".json") + ".scss";
          const writePath: string = Path.join(process.cwd(), 'web/static/css')
          console.log({
            fileName: fileName,
            writePath: writePath,
            cwd: process.cwd()
          })
          const variables: Variables = JSON.parse(_data.toString());
          let scssString: string = '';
          FS.open(`${writePath}/${fileName}`, 'w', (openError: NodeJS.ErrnoException, fd: number) => {
            if (openError) { throw new Error(`Open Error: ${openError.message}`) }
            for (const name in variables) {
              const variable: string | number = variables[name];
              scssString += `${name}: variable;\n`
            }
            FS.write(fd, scssString, (writeError: NodeJS.ErrnoException, written: number, str: string) => {
              console.log({written: str});
              if (writeError) { throw new Error(`Write Error: ${writeError}`) }
              FS.close(fd, (closeError: NodeJS.ErrnoException) => {
                if (closeError) { throw new Error(`Close Error: ${closeError}`) }
                _resolve()
              })
            })
          })
        })
      })
      promises.push(promise);
    })
    return Promise.all(promises).then(() => {
      resolver();
    }).catch((error: any) => {
      throw error
    })
  }

  teardown() {}
}

CssStyleguideBrunch.prototype.brunchPlugin = true;