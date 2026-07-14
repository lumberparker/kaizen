# KAIZEN® — Concreto Confiable

Sitio web de **4 páginas** para **KAIZEN®**, empresa de producción y suministro
de concreto premezclado. Construido con **HTML, CSS y JavaScript** puros,
siguiendo la metodología **BEM** para el nombrado de clases y la organización
de archivos.

## Páginas

- `index.html` — **Inicio** (landing)
- `nosotros.html` — **Nosotros**
- `productos.html` — **Productos & servicios**
- `contacto.html` — **Contacto**

Las cuatro comparten el mismo `<header>`, `<footer>` y `styles.css`, y se
componen reutilizando los mismos bloques BEM. El link activo del menú se marca
por página con el modificador `nav__link_active`.

## Estructura del proyecto

```
Kaizen/
├── index.html            # Inicio
├── nosotros.html         # Nosotros
├── productos.html        # Productos & servicios
├── contacto.html         # Contacto
├── styles.css            # Único CSS conectado al HTML: importa todos los bloques
├── README.md
├── assets/
│   ├── fonts/            # Archivo (variable font) autoalojada + fonts.css
│   ├── images/           # Logos y placeholders SVG de fotografía
│   ├── jsons/            # Datos en JSON (reservado)
│   └── videos/           # Video del showcase (colocar kaizen.mp4 aquí)
├── blocks/               # Un archivo CSS por bloque BEM / sección
│   ├── page.css          # Variables, reset y utilidades globales
│   ├── loader.css
│   ├── header.css        # Header + nav
│   ├── hero.css
│   ├── intro.css         # "Brindamos soluciones…"
│   ├── marquee.css       # Cinta "Concreto confiable / Resultados sólidos…"
│   ├── video.css
│   ├── cta.css           # Banner azul "Construimos tu futuro…"
│   ├── destaca.css       # "Kaizen® se destaca por ofrecer"
│   ├── plantas.css       # Hexágonos "Nuestras plantas automatizadas"
│   ├── productos.css     # Acordeón de productos y servicios
│   ├── obra.css          # "Una obra no puede detenerse"
│   ├── resistencias.css  # Escala de resistencias f'c
│   ├── pavimentos.css    # Línea de pavimentos MR
│   ├── proyectos.css     # Galería de proyectos
│   ├── showcase.css      # Wordmark KAIZEN con textura + eslóganes (Inicio)
│   ├── compromiso.css    # Banner de compromiso
│   ├── encuentra.css     # CTA final "Ver productos"
│   ├── contacto.css      # Formulario "Hello"
│   └── footer.css
└── scripts/              # Un script por sección interactiva
    ├── loader.js         # Oculta el loader al cargar la página
    ├── header.js         # Menú móvil (hamburguesa)
    ├── video.js          # Play / pause del video
    ├── productos.js      # Acordeón (un panel abierto a la vez)
    ├── resistencias.js   # Escala interactiva con animación al entrar en vista
    ├── contacto.js       # Validación del formulario con mensajes en línea
    └── animations.js     # Reveal de secciones con IntersectionObserver
```

## Características

- **BEM**: bloques, elementos (`__`) y modificadores (`_`) en clases y archivos.
- **Un solo `<link>` CSS**: `styles.css` importa fuentes y todos los bloques
  con `@import`.
- **Tipografía autoalojada** (sin dependencias externas, funciona offline):
  - **Chakra Petch** — titulares y logotipo KAIZEN. Es la tipografía display
    real del diseño (gratuita, Google Fonts). Variable `--font-display`.
  - **Archivo** — texto de UI, párrafos, navegación, formularios y datos.
    Sustituto libre de **Kern**, la grotesca comercial del diseño original.
    Variable `--font-main`.
  - Fuentes comerciales del PDF sin equivalente libre incluido: **Kern**
    (cuerpo), **Circular Std** (acento «KAIZEN®») y **Diagramm** (símbolo ®).
- **Responsive**: layout fluido con `clamp()` y grid; menú hamburguesa < 720 px.
- **Accesibilidad**: HTML semántico, `aria-expanded` en el acordeón y el menú,
  estados de foco y soporte de `prefers-reduced-motion`.
- **Interacciones**: loader, marquee infinito, badge giratorio del hero,
  acordeón, escala de resistencias animada, validación de formulario y
  scroll-reveal.

## Uso

No requiere build ni dependencias. Abre `index.html` directamente o sirve la
carpeta con cualquier servidor estático:

```bash
npx serve .
```

## Notas

- Las fotografías en `assets/images/` (`.jpg`) son las del diseño original;
  sustitúyelas por las definitivas manteniendo los nombres.
- El logotipo (`#kaizen-mark`) es un SVG vectorial inline compartido por las
  cuatro páginas; el `favicon.svg` usa el mismo trazo.
- Para activar el video del showcase, coloca el archivo en
  `assets/videos/kaizen.mp4` (el póster es `assets/images/video.jpg`).
- **Formulario de contacto funcional (Netlify + variable de entorno)**:
  el envío pasa por una función serverless para que la clave nunca llegue al
  navegador ni al repositorio.
  1. Consigue una **Access Key** gratuita en [web3forms.com](https://web3forms.com).
  2. En Netlify: **Site settings → Environment variables** → crea
     `WEB3FORMS_ACCESS_KEY` con esa clave.
  3. Despliega. El navegador hace `POST` a `/api/contact`, que redirige a la
     función `netlify/functions/contact.js`; esta lee la clave del entorno y
     reenvía el mensaje a Web3Forms.
  - Piezas: [`netlify.toml`](netlify.toml) (publish + redirect),
    [`netlify/functions/contact.js`](netlify/functions/contact.js) (la función),
    [`scripts/contacto.js`](scripts/contacto.js) (validación + `fetch`).
  - **En local** el `POST` a `/api/contact` no existe con `python3 serve.py`;
    usa `netlify dev` (Netlify CLI) para probar la función, con la variable
    `WEB3FORMS_ACCESS_KEY` exportada o en un archivo `.env` (git-ignored).
- **Servidor de desarrollo sin caché**: `python3 serve.py` (o el perfil
  `kaizen` de `.claude/launch.json`) sirve el sitio en el puerto 4173 con
  cabeceras no-cache, para que siempre veas tus últimos cambios.
