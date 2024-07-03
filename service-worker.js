var name = 'simple nodexperts cache v2',
    filesToCache = [
        './index.html',
        'https://pyscript.net/alpha/pyscript.js',
        'https://pyscript.net/alpha/pyscript.css',
        'https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide_py.tar',
        'https://cdn.jsdelivr.net/pyodide/v0.20.0/full/packages.json',
        'https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js',
        'https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.asm.js',
        'https://cdn.jsdelivr.net/pyodide/v0.20.0/full/micropip-0.1-py3-none-any.whl',
        'https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyparsing-3.0.7-py3-none-any.whl',
        'https://cdn.jsdelivr.net/pyodide/v0.20.0/full/packaging-21.3-py3-none-any.whl',
        'https://cdn.jsdelivr.net/pyodide/v0.20.0/full/distutils.tar',
        './index.js',
        './service-worker.js',
        // './public/icon512_maskable.png.png',
        // './public/icon512_rounded.png',
        // './public/manifest.json',
    ];

// event.waitUntil will stop the flow till the Promise is resolved

self.addEventListener('install', function (event) {
    console.log("installing");
    event.waitUntil(
        // opens cache
        // cache is an object which is available inside service-worker
        caches.open(name).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (event) {
    console.log("activating");
    event.waitUntil(
        caches.keys().then(function (cachedFiles) {
            return Promise.all(cachedFiles.map(function (cacheFile) {
                // everytime a cache version changes, old files are removed from cache
                if (cacheFile !== name) {
                    console.log('Removing Cached Files from Cache - ', cacheFile);
                    return caches.delete(cacheFile);
                }
            }));
        })
    );
});


self.addEventListener('fetch', function (event) {
    console.log("fetching");
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request);
        })
    );
});