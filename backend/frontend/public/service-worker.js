/**
 * service-worker.js - zicodo PWA Service Worker
 * 提供离线缓存、后台同步、推送通知支持
 */

const CACHE_NAME = 'ziling-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// 安装：缓存核心静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.error('[SW] Install failed:', err))
  );
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
      .catch((err) => console.error('[SW] Activate failed:', err))
  );
});

// 拦截请求：优先网络，失败回退缓存（Network First 策略）
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 跳过非 GET 请求和 API 请求
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // 缓存成功的响应
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败时从缓存读取
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // 缓存也没有，返回离线页面
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// 后台同步（用于离线时提交的数据）
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncPendingTasks());
  }
});

async function syncPendingTasks() {
  // 从 IndexedDB 读取待同步的任务数据并提交
  // 实际实现由前端调用
  console.log('[SW] Background sync triggered');
}

// 推送通知
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'zicodo提醒';
  const options = {
    body: data.body || '你有新的消息～',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: data.tag || 'default',
    requireInteraction: false,
    data: data.data || {}
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
