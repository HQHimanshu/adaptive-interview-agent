const cache = new Map();

async function getCachedData(cacheKey, loader) {
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    const value = await loader();
    cache.set(cacheKey, value);
    return value;
}

function clearCache(cacheKey) {
    if (cacheKey) {
        cache.delete(cacheKey);
        return;
    }

    cache.clear();
}

function getCacheKeys() {
    return Array.from(cache.keys());
}

module.exports = {
    cache,
    getCachedData,
    clearCache,
    getCacheKeys
};
