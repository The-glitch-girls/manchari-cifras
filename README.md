# Manchari — Lo que la historia no borra

Una experiencia web interactiva sobre memoria y violencia contra las mujeres en el Perú. Seis piedras hechas con CSS revelan una cifra, su contexto, la fuente oficial y una pregunta de reflexión.

## Requisitos

- Node.js 18 o superior
- npm

## Desarrollo local

```bash
npm ci
npm run dev
```

Vite mostrará la dirección local para abrir en el navegador.

## Build de producción

```bash
npm run build
npm run preview
```

El sitio compilado queda en `dist/`. La configuración usa rutas relativas para permitir publicarlo bajo una ruta de proyecto, por ejemplo en GitHub Pages.

## Datos y fuentes

Los seis registros viven en `src/data.js`, separados de la interfaz. Cada cifra conserva su año, fuente y tipo de registro para distinguir encuestas poblacionales, denuncias policiales, y casos atendidos por servicios públicos.

Las fuentes incluidas son publicaciones oficiales del INEI, el Ministerio del Interior y el MIMP. Antes de editar una cifra, revisa la fuente asociada y conserva el contexto del registro. No agregues cifras sin verificación.

## Estructura

```text
src/
  data.js       # Cifras, contexto, enlaces y preguntas
  main.jsx      # Componentes React e interacción
  styles.css    # Escenario, piedras y diseño responsive
```

No se ha especificado una licencia para este proyecto.
