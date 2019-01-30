self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open("v1").then(function(cache) {
      return cache.addAll(cacheFiles);
    })
  );
});
self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        console.log("Found", e.request, "in cache");
        return response;
      } else {
        console.log("could not find", e.request, "in cache Fetching!");
        return fetch(e.request)
          .then(function(response) {
            const clonedResponse = response.clone();
            caches.open("v1").then(function(cache) {
              cache.put(e.request, clonedResponse);
            });
            return response;
          })
          .catch(function(err) {
            console.error(err);
          });
      }
    })
  );
});
