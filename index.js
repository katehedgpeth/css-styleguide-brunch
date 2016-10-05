"use strict";
/// <reference path="./typings/index.d.ts" />
var os_1 = require("os");
var FS = require("fs");
var Path = require("path");
var isWindows = os_1.platform() == "win32";
var CssStyleguideBrunch = (function () {
    function CssStyleguideBrunch(config) {
        this.config = config;
        // type: string = "stylesheet";
        this.extension = "json";
        this.pattern = /\.s[ac]ss$/;
        this._bin = isWindows ? 'sass.bat' : 'sass';
        this._compass_bin = isWindows ? 'compass.bat' : 'compass'; //eslint-disable-line camelcase
        if (this.config.options) {
            this.config = this.config.options;
        }
        this.paths = this.config.includePaths;
    }
    CssStyleguideBrunch.prototype.preCompile = function (resolver) {
        var promises = [];
        this.paths.forEach(function (path) {
            var promise = new Promise(function (_resolve, _reject) {
                FS.readFile(path, function (readError, _data) {
                    if (readError) {
                        throw new Error("Read error: " + readError.message);
                    }
                    var fileName = Path.basename(path, ".json") + ".scss";
                    var writePath = Path.join(process.cwd(), 'web/static/css');
                    console.log({
                        fileName: fileName,
                        writePath: writePath,
                        cwd: process.cwd()
                    });
                    var variables = JSON.parse(_data.toString());
                    var scssString = '';
                    FS.open(writePath + "/" + fileName, 'w', function (openError, fd) {
                        if (openError) {
                            throw new Error("Open Error: " + openError.message);
                        }
                        for (var name_1 in variables) {
                            var variable = variables[name_1];
                            scssString += name_1 + ": variable;\n";
                        }
                        FS.write(fd, scssString, function (writeError, written, str) {
                            console.log({ written: str });
                            if (writeError) {
                                throw new Error("Write Error: " + writeError);
                            }
                            FS.close(fd, function (closeError) {
                                if (closeError) {
                                    throw new Error("Close Error: " + closeError);
                                }
                                _resolve();
                            });
                        });
                    });
                });
            });
            promises.push(promise);
        });
        return Promise.all(promises).then(function () {
            resolver();
        }).catch(function (error) {
            throw error;
        });
    };
    CssStyleguideBrunch.prototype.teardown = function () { };
    return CssStyleguideBrunch;
}());
exports.CssStyleguideBrunch = CssStyleguideBrunch;
CssStyleguideBrunch.prototype.brunchPlugin = true;
