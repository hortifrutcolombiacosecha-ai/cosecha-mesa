/* Con señal: siempre trae la versión nueva de las páginas. Sin señal: usa la copia guardada. */
const CACHE="cosecha-santana-v3-2026-10-17";
const FILES=["./", "index.html", "sw.js", "tablero.html", "manifest-tablero.json", "icono-tablero-192.png", "icono-tablero-512.png", "cuadrilla.html", "manifest-cuadrilla.json", "icono-cuadrilla-192.png", "icono-cuadrilla-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const req=e.request;const u=new URL(req.url);if(req.method!=="GET"||u.origin!==location.origin)return;
  const isPage=req.mode==="navigate"||u.pathname.endsWith(".html")||u.pathname.endsWith("/")||u.pathname.endsWith(".json");
  if(isPage){e.respondWith(fetch(req,{cache:"no-cache"}).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r})
      .catch(()=>caches.open(CACHE).then(c=>c.match(req,{ignoreSearch:true}))));return}
  e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(req,{ignoreSearch:true});
    const net=fetch(req).then(r=>{if(r&&r.ok)c.put(req,r.clone());return r}).catch(()=>hit);
    return hit||net}))});
