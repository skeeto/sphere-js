/**
 * A location parameter parser with default values.
 * @param {Object} [defaults]
 * @param {Location} [location]
 * @constructor
 */
function Params(defaults, location) {
    location = location || window.location;
    defaults = defaults || {};
    if (!(this instanceof Params)) {
        return new Params(defaults, location);
    } else {
        this.defaults = defaults;
        this.values = {};
        location.search.slice(1).split(/&/).forEach(function(pair) {
            var split = pair.split('=').map(decodeURIComponent);
            this.values[split[0]] = JSON.parse(split[1]);
        }.bind(this));
        return this;
    }
}

/**
 * @param {string} name
 * @returns the value for the parameter name, falling back to the defaults
 */
Params.prototype.get = function(name) {
    var value = this.values[name];
    return value != null ? value : this.defaults[name];
};
