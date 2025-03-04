import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate, NetworkOnly, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { precacheAndRoute } from 'workbox-precaching';
import {BackgroundSyncPlugin} from 'workbox-background-sync';
import {ExpirationPlugin} from 'workbox-expiration';
import { CLOUD_HOSTNAME, LOCAL_HOSTNAME, CACHE_NAME } from './config';

declare let self: ServiceWorkerGlobalScope

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

const bgSyncPlugin = new BackgroundSyncPlugin('syncQueue', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
  ({url}) => { return url.hostname.startsWith(`${CLOUD_HOSTNAME}`) || url.hostname.startsWith(`${LOCAL_HOSTNAME}`) },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);

registerRoute(
  ({url}) => { return url.pathname.startsWith(`/api/users`) },
  new NetworkFirst({
    cacheName: CACHE_NAME,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 60 * 60 // Data evicted from cache after one hour
      })
    ]
  })
)

registerRoute(
  ({url}) => { 
    return url.pathname.startsWith(`/api/images`)
    || url.pathname.startsWith(`/api/object-types`)
    || url.pathname.startsWith(`/api/scans`)
    || url.pathname.startsWith(`/api/studies`)
    // || url.pathname.startsWith(`/api/objects`) // Disabled because we don't want to cache object data, but fetch the latest version after verification
  },
  new NetworkFirst({
    cacheName: CACHE_NAME,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 // Data evicted from cache after one hour
      })
    ]
  })
)

// Catch-all route disabled because we don't want to cache object data, but fetch the latest version after verification
/* registerRoute(
  ({url}) => { return url.hostname.startsWith(`${CLOUD_HOSTNAME}`) || url.hostname.startsWith(`${LOCAL_HOSTNAME}`) },
  new CacheFirst({
    cacheName: CACHE_NAME,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60,
      })
    ]
  })
) */


// Cache static assets with CacheFirst strategy
registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache other static assets with StaleWhileRevalidate strategy
registerRoute(
  /\.(?:js|css|html)$/,
  new StaleWhileRevalidate({
    cacheName: 'static-assets-cache',
  })
);