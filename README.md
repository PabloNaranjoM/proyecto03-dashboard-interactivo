# proyecto03-dashboard-interactivo
Dashboard web interactivo (**Steam Nexus**) desarrollado con React, TypeScript, Material UI (`@mui/material` y `@mui/x-charts`) y Firebase Realtime Database para explorar métricas y tendencias del catálogo de videojuegos de Steam.

## Cómo ejecutar el dashboard

Se necesita Node.js 20.19 o superior y conexión a internet para consultar los datos almacenados en Firebase Realtime Database.

```bash
cd dashboard
npm install
npm run dev
```

Luego abrir en el navegador la dirección que aparece en la terminal (normalmente `http://localhost:5173`).

### Comandos útiles (dentro de `dashboard/`)

- `npm run dev`: inicia el servidor local de desarrollo con Vite.
- `npm run lint`: analiza el código con `oxlint` para detectar posibles errores, malas prácticas o problemas con hooks de React.
- `npm run build`: valida tipos con TypeScript (`tsc -b`) y genera el bundle de producción en `dist/`.
- `npm run preview`: levanta una vista previa local del build de producción.
- `npm run deploy`: genera el build y lo publica en GitHub Pages (rama `gh-pages`).

Sitio publicado: https://pablonaranjom.github.io/proyecto03-dashboard-interactivo/

## Arquitectura del dashboard

```text
dashboard/src/
├── firebase/     # Inicialización del SDK web de Firebase y instancia de Realtime Database
├── services/     # Consultas asíncronas a /games y normalización de registros
├── hooks/        # Hook personalizado (useSteamGames) con useEffect y useState (datos, carga y error)
├── components/   # Interfaz modular y responsiva (layout, filtros, KPIs, gráficos y tabla)
├── utils/        # Cálculo de KPIs, series temporales, dispersión, ranking por género y exportación CSV
├── constants/    # Constantes de configuración y etiquetas de géneros
├── theme/        # Tema global de Material UI (tipografía Inter y paleta Steam Nexus)
└── types/        # Interfaces TypeScript alineadas a datos/games.json
```

## Conexión con Firebase Realtime Database

El dashboard consume los registros reales almacenados bajo el nodo `/games` del proyecto `data-repository-p03` en Firebase Realtime Database mediante la API modular (`firebase/app` y `firebase/database`):

- **Inicialización:** `dashboard/src/firebase/firebase.ts` configura `initializeApp` y exporta `database = getDatabase(app)` con `databaseURL` explícito.
- **Acceso a datos:** `dashboard/src/services/gamesService.ts` consulta `/games` con `ref`, `query`, `limitToFirst` y `get`, normalizando los campos `null` y listas vacías que Firebase omite al serializar. Por defecto recupera **5 000 registros** (`DEFAULT_GAMES_LIMIT = 5000`) para mantener tiempos de carga rápidos y cuidar la cuota gratuita; cambiar ese valor a `null` permite consultar los 125 855 registros completos.
- **Estado y ciclo de vida:** `dashboard/src/hooks/useSteamGames.ts` ejecuta la lectura al montar la vista mediante `useEffect` (con cancelación al desmontar) y administra con `useState` los estados de datos (`games`), carga (`loading`) y error (`error`).

## Transformación de datos CSV a JSON

El conjunto de datos es el [Steam Games Dataset](https://www.kaggle.com/datasets/fronkongames/steam-games-dataset).
El CSV completo está comprimido en `datos/games[original].rar` porque pesa unos 400 MB.

| Archivo | Descripción |
| --- | --- |
| `datos/games[original].rar` | CSV original completo (125 855 juegos) |
| `datos/games - muestra.csv` | Muestra pequeña del CSV |
| `datos/games.json` | JSON generado y cargado en Firebase Realtime Database |
| `scripts/transformar_csv_a_json.py` | Lee el CSV, limpia los datos y genera el JSON |
| `scripts/validar_json.py` | Revisa la estructura, los tipos y la cantidad de registros del JSON |

### Requisitos

- Python 3 (solo usa librerías estándar, no hay que instalar nada).

### Pasos

1. Descomprimir `datos/games[original].rar` dentro de la carpeta `datos/` (con WinRAR o 7-Zip). Debe quedar el archivo `datos/games[original].csv`.
2. Desde la raíz del repositorio, ejecutar la transformación:

   ```bash
   python scripts/transformar_csv_a_json.py
   ```

3. Validar el JSON generado:

   ```bash
   python scripts/validar_json.py
   ```

En Windows, si la consola muestra mal las tildes, se puede usar `python -X utf8 ...`.

### Qué hace la transformación

- Solo conserva las variables que usa el dashboard.
- **Numéricas** (`price`, `ccu`, `positive`, `negative`, `metacriticScore`, `averagePlaytime`, `medianPlaytime`, `achievements`, `recommendations`): se guardan como números. `price` es decimal y el resto son enteros.
- **Categóricas** (`name`, `owners`): se guardan como texto, sin espacios al inicio ni al final ni espacios repetidos.
- **Listas categóricas** (`genres`, `categories`, `developers`, `publishers`): el texto separado por comas se convierte en una lista de textos.
- **Booleanas** (`windows`, `mac`, `linux`): `True`/`False` pasan a `true`/`false`.
- **Temporal** (`releaseDate`): de `Aug 1, 2023` a formato ISO `2023-08-01`.
- **Valores faltantes**: un texto vacío queda como `null` y una lista vacía como `[]`. En `metacriticScore` el valor 0 significa "sin calificación", por eso se guarda como `null`.
- Se descartan filas con AppID repetido o con un número de columnas distinto al de la cabecera.
- La cabecera original junta `Discount` y `DLC count` en una sola columna (`DiscountDLC count`); el script la separa para que cada valor quede en su columna correcta.

### Estructura del JSON

```json
{
  "games": [
    {
      "appId": 496350,
      "name": "Supipara - Chapter 1 Spring Has Come!",
      "owners": "0 - 20000",
      "releaseDate": "2016-07-29",
      "price": 5.24,
      "ccu": 0,
      "positive": 252,
      "negative": 3,
      "metacriticScore": null,
      "averagePlaytime": 8,
      "medianPlaytime": 8,
      "achievements": 0,
      "recommendations": 231,
      "windows": true,
      "mac": false,
      "linux": false,
      "genres": ["Adventure"],
      "categories": ["Single-player", "Steam Trading Cards", "Steam Cloud", "Family Sharing"],
      "developers": ["minori"],
      "publishers": ["MangaGamer"]
    }
  ]
}
```
