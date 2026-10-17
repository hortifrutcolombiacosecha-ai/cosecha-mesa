/* Funciona sin señal: muestra la copia guardada y busca la versión nueva en segundo plano. */
const CACHE="cosecha-santana-v1-2026-10-17";
const FILES=["./", "index.html", "sw.js", "tablero.html", "manifest-tablero.json", "icono-tablero-192.png", "icono-tablero-512.png", "cuadrilla.html", "manifest-cuadrilla.json", "icono-cuadrilla-192.png", "icono-cuadrilla-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET"||u.origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);
    return hit||net}))});
