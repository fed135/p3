function compose(scope, fn) {
    if (typeof scope === 'function') {
        fn = scope;
        scope = {};
    }
    let localScope = {};
    const model = fn(localScope);
    localScope = Object.assign(localScope, scope, model[0] || {}, model[1] || {});
    if (process.env.IV_MODE !== 'testing') Object.keys(model[1] || {}).forEach(key => Object.defineProperty(localScope, key, { enumerable: false }));
    return localScope;
}

module.exports = { compose };
