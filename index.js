"use strict";
var os_1 = require("os");
var FS = require("fs");
var isWindows = os_1.platform() == "win32";
var CssStyleguideBrunch = (function () {
    function CssStyleguideBrunch(config) {
        this.config = config;
        this.brunchPlugin = true;
        this.type = "stylesheet";
        this.extension = "scss";
        this.pattern = /\.s[ac]ss$/;
        this._bin = isWindows ? 'sass.bat' : 'sass';
        this._compass_bin = isWindows ? 'compass.bat' : 'compass';
        this.path = this.config.cssVariableJSON;
    }
    CssStyleguideBrunch.prototype.preCompile = function (resolver) {
        var _this = this;
        return new Promise(function (_resolve, _reject) {
            FS.readFile(_this.path, function (err, _data) {
                var variables = JSON.parse(_data.toString());
                console.log(variables);
            });
        });
    };
    return CssStyleguideBrunch;
}());
exports.CssStyleguideBrunch = CssStyleguideBrunch;
//# sourceMappingURL=index.js.map