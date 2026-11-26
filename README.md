# NumLab

Proyecto de Métodos Numéricos I · FES Acatlán, UNAM.

Aplicación desarrollada con React, TypeScript, Vite y Sass para consultar la teoría y utilizar calculadoras de métodos numéricos.

## Desarrollo

Requiere Node.js 22 o superior.

```bash
npm ci
npm run dev
```

Para comprobar el proyecto antes de publicarlo:

```bash
npm run build
npm run preview
```

## Imágenes necesarias

Los archivos gráficos **no se incluyen en este ZIP** para reducir su tamaño. Antes de compilar, copia desde el proyecto original los siguientes archivos dentro de `src/assets/`, conservando exactamente los nombres y extensiones:

- `biseccion.svg`, `newton.svg`, `secante.svg`, `nolineal.svg`
- `sistemas.jpg`
- `jordan.png`, `jacobi.png`, `seidel.jpg`, `doolittle.png`, `crout.png`

La sección de ecuaciones no lineales utiliza exclusivamente las gráficas SVG. Los retratos de personajes se mantienen en sistemas lineales.

## Navegación

- `/problems`: selección de temas.
- `/nolineal`, `/lineal`, `/eigenvalues`: listas de métodos.
- `/<tema>/<metodo>`: introducción, explicación, historia e ilustración.
- `/<tema>/<metodo>/calcular`: calculadora existente.

El sitio utiliza `HashRouter` para admitir enlaces directos en GitHub Pages sin configurar redirecciones del servidor. Ejemplo: `https://ivanespmar.github.io/NumLab/#/nolineal/newton`.

## Publicación en GitHub Pages

1. Copia las imágenes a `src/assets/` y confirma que se compila con `npm run build`.
2. Haz commit de las imágenes y del código; `dist/` y `node_modules/` permanecen ignorados.
3. Sube los cambios a `main`.
4. En el repositorio de GitHub, abre **Settings → Pages → Build and deployment → Source → GitHub Actions**.
5. El workflow `.github/workflows/deploy.yml` instalará dependencias, compilará y desplegará `dist` automáticamente.

Vite utiliza `base: '/NumLab/'`. Si cambias el nombre del repositorio, actualiza `base` en `vite.config.ts`.

## Organización

- `src/routes/problems/` contiene los catálogos y las pantallas de cada método, agrupados en `nolineal/`, `sistemas/` y `eigenvalues/`.
- La carpeta `compartido/` de cada familia reúne sus componentes, auxiliares y estilos reutilizables. `nolineal/calculo/` reúne los algoritmos de raíces, la evaluación de funciones, los ejemplos y sus pruebas.
- `src/components/` contiene las piezas que usan varias familias, como la cabecera de calculadora, el editor de matrices y la plantilla de las introducciones.
- `src/styles/` reúne los tokens de diseño y los mixins Sass para botones y paneles.
