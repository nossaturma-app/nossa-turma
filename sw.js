// NOSSA TURMA · "carteiro" do celular (service worker)
// Fica de plantão no aparelho: recebe a notificação e mostra, mesmo com o app fechado.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = {texto: e.data ? e.data.text() : ''}; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Nossa Turma', {
    body: d.texto || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/badge-96.png',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    data: {url: d.url || './'}
  }));
});

// tocou na notificação: abre o app (ou traz para frente, se já estiver aberto)
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const alvo = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(abertas => {
    for (const c of abertas) if (c.url.startsWith(self.registration.scope) && !c.url.includes('?a=')) return c.focus();
    return self.clients.openWindow(alvo);
  }));
});
