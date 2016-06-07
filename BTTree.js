module.exports = require('Base').extend({
    constructor: function(title, root) {
        this.title = title;
        this.root = root;
        root.generateUniqueIdsRecursive();
        this.hashCode = _.isUndefined(root) ? 0 : root.hashCode();
    },

    hashCode: 0,
    title: '',
    root: undefined,
});
