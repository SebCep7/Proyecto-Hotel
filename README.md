# Loitel Hoteles — Sass + Bootstrap

El sitio ahora se estiliza con **Sass** (partials modulares) y usa **Bootstrap 5**
como base, pero *themeado* con la paleta e identidad de Loitel (no se ve "a
Bootstrap" — los colores, tipografías y radios de borde de Bootstrap fueron
reemplazados por las variables de la marca antes de compilar).

El archivo que cargan las páginas (`styles/styles.css`) **ya viene compilado**,
así que el sitio funciona tal cual, sin instalar nada. Instalá las
dependencias solo si vas a modificar los estilos.

## Instalación

```bash
npm install
```

Esto descarga Bootstrap (`node_modules/bootstrap`) y el compilador `sass`.
Ninguno de los dos se sube al sitio en producción; solo se usan para generar
`styles/styles.css`.

## Comandos

```bash
npm run sass:build      # compila scss/main.scss -> styles/styles.css una vez
npm run sass:watch      # recompila automáticamente cada vez que guardás un .scss
npm run sass:build:min  # versión minificada, styles/styles.min.css (para producción)
```

Si usás la versión minificada, actualizá el `<link>` en los HTML de
`styles/styles.css` a `styles/styles.min.css`.

## Estructura de `scss/`

```
scss/
  _variables.scss   Paleta, sombras, radios, transición + overrides de Bootstrap
  _root.scss        Genera las custom properties CSS (--color-primary, etc.)
  _base.scss        Reset, accesibilidad, tipografía, selección, scrollbar
  _header.scss      Header, nav, menú, logo y menú hamburguesa
  _hero.scss        Sección "Bienvenidos a Loitel"
  _reserva.scss     Barra de check-in/check-out
  _destacados.scss  Tarjetas de la home (habitaciones, desayuno, spa)
  _contacto.scss    Mapa, datos de contacto, formulario
  _galeria.scss     Grilla de atracciones de Buenos Aires
  _nosotros.scss    Misión, visión, valores, estadísticas
  _servicios.scss   Grilla de servicios del hotel
  _footer.scss      Footer, WhatsApp flotante, botón "volver arriba"
  _widgets.scss     Toast, barra de progreso, reveal, ripple, preloader
  _responsive.scss  Todos los @media juntos, al final (para que ganen la cascada)
  main.scss         Punto de entrada: importa Bootstrap ya themeado + todo lo de arriba
```

## Cómo está integrado Bootstrap

En `_variables.scss` se pisan las variables de Bootstrap (`$primary`,
`$secondary`, `$font-family-base`, `$border-radius`, etc.) con los tokens de
Loitel **antes** de importar `bootstrap/scss/variables`. Por eso, si en algún
momento usás una clase de Bootstrap en el HTML (`btn btn-primary`, `row`,
`col-md-6`, `form-control`, utilidades como `d-flex` o `mt-4`), va a salir
con los colores y la tipografía del hotel automáticamente.

Solo se importan las piezas de Bootstrap que hacen falta (reboot, grid,
botones, formularios, utilidades) para no arrastrar peso muerto de
componentes que el sitio no usa (modales, carruseles, etc.). Se pueden sumar
más importando el módulo correspondiente en `main.scss`, por ejemplo:

```scss
@import "bootstrap/scss/card";
@import "bootstrap/scss/navbar";
```

## Notas

- Vas a ver *warnings* de deprecación de Sass al compilar (`@import` está
  deprecado en favor de `@use`/`@forward`). Es un aviso del propio Bootstrap
  5.3, no rompe nada — cuando Bootstrap termine su migración a `@use` se
  puede actualizar `main.scss` de la misma forma.
- El resto del sitio (HTML, `scripts/main.js`) no cambió: solo cambió cómo
  se genera `styles/styles.css`.
