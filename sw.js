var appCacheName = 'restaurants-cache';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(appCacheName).then(cache => {
      return cache.addAll([
        "/",
        "index.html",
        "restaurant.html",
        "css/styles.css",
        "data/restaurants.json",
        "js/dbhelper.js",
        "js/main.js",
        "js/restaurant_info.js",
        "img/1.jpg",
        "img/2.jpg",
        "img/3.jpg",
        "img/4.jpg",
        "img/5.jpg",
        "img/6.jpg",
        "img/7.jpg",
        "img/8.jpg",
        "img/9.jpg",
        "img/10.jpg"
      ]);
    })
  );
});

self.addEventListener('activate', event =>{
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurants-') &&
                 cacheName != appCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event =>{
  console.log('fetch');
  event.respondWith(
    caches.match(event.request).then(response => {
        if (response) return response;
        return fetch(event.request.clone()).then(
            function (response) {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                var responseToCache = response.clone();
                caches.open(appCacheName)
                    .then(function (cache) {
                        cache.put(event.request, responseToCache);
                    });
                return response;
            }
        );
    }).catch((error) => {
        console.log(error);}
    )
  );
});

