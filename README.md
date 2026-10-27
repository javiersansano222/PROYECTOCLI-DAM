# Atelier Roble

Sitio web estático de una tienda de muebles clásicos y restauración artesanal. Incluye catálogo filtrable, carrito persistente, formulario de contacto, testimonios, páginas legales y recursos de SEO.

## Estructura

```
.
├── index.html            Página principal
├── 404.html              Página de error
├── aviso-legal.html      Aviso legal
├── privacidad.html       Política de privacidad
├── cookies.html          Política de cookies
├── css/styles.css        Estilos globales y responsive
├── js/script.js          Carrito, filtros, modal, formulario y UI
├── js/consent.js         Banner de consentimiento de cookies
├── icons/                Iconos del manifest
├── favicon.svg/.ico      Favicon
├── apple-touch-icon.png  Icono para iOS
├── site.webmanifest      Manifest PWA
├── robots.txt            Directrices para buscadores
└── sitemap.xml           Mapa del sitio
```

## Uso local

No requiere build. Abre `index.html` en el navegador o sirve la carpeta con un servidor estático:

```bash
python3 -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Funcionalidad

- Catálogo con filtros por categoría y estado sin resultados.
- Modal de detalle de producto con foco accesible.
- Carrito con cantidades, subtotal y persistencia en `localStorage`.
- Menú móvil, carrusel de testimonios y animaciones con `IntersectionObserver`.
- Validación del formulario de contacto en cliente.
- Banner de cookies con decisión persistente.

## Accesibilidad y SEO

- HTML semántico, skip link, `aria-*` y foco atrapado en carrito y modal.
- Soporte de `prefers-reduced-motion`.
- Metadatos Open Graph/Twitter, JSON-LD `FurnitureStore`, canonical, favicon, manifest, `robots.txt` y `sitemap.xml`.

## Pendiente

- Sustituir el dominio de ejemplo `atelierroble.es` en canonical, Open Graph y sitemap.
- Enlazar redes sociales reales.
- Conectar el formulario y el checkout a un backend o servicio real.
- Alojar las imágenes localmente y servirlas con `srcset`.
- Revisar las páginas legales con un profesional y completar los datos fiscales del titular.
