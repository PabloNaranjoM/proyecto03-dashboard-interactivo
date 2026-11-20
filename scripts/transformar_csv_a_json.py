"""
Transforma el CSV del Steam Games Dataset a JSON para cargarlo en Firebase.

Uso:
    python scripts/transformar_csv_a_json.py [entrada.csv] [salida.json]

Por defecto lee datos/games[original].csv y escribe datos/games.json.
"""

import csv
import json
import sys
from datetime import datetime

# Algunas columnas (descripciones, capturas) tienen textos muy largos
csv.field_size_limit(10**9)

ENTRADA = sys.argv[1] if len(sys.argv) > 1 else "datos/games[original].csv"
SALIDA = sys.argv[2] if len(sys.argv) > 2 else "datos/games.json"

# Columnas del CSV que se usan en el dashboard -> nombre del campo en el JSON
TEMPORALES = {"Release date": "releaseDate"}

CATEGORICAS = {
    "Name": "name",
    "Estimated owners": "owners",
}

# Vienen separadas por comas ("Action,Indie") y se guardan como lista de textos
LISTAS = {
    "Genres": "genres",
    "Categories": "categories",
    "Developers": "developers",
    "Publishers": "publishers",
}

BOOLEANAS = {"Windows": "windows", "Mac": "mac", "Linux": "linux"}

ENTERAS = {
    "Peak CCU": "ccu",
    "Positive": "positive",
    "Negative": "negative",
    "Metacritic score": "metacriticScore",
    "Average playtime forever": "averagePlaytime",
    "Median playtime forever": "medianPlaytime",
    "Achievements": "achievements",
    "Recommendations": "recommendations",
}

DECIMALES = {"Price": "price"}


def limpiar_texto(valor):
    """Quita espacios al inicio, al final y los repetidos. Si queda vacío -> None."""
    if valor is None:
        return None
    valor = " ".join(valor.split())
    return valor if valor else None


def a_lista(valor):
    texto = limpiar_texto(valor)
    if texto is None:
        return []
    return [parte.strip() for parte in texto.split(",") if parte.strip()]


def a_booleano(valor):
    texto = limpiar_texto(valor)
    if texto is None:
        return None
    return texto.lower() == "true"


def a_entero(valor):
    texto = limpiar_texto(valor)
    if texto is None:
        return None
    try:
        return int(float(texto))
    except ValueError:
        return None


def a_decimal(valor):
    texto = limpiar_texto(valor)
    if texto is None:
        return None
    try:
        return round(float(texto), 2)
    except ValueError:
        return None


def a_fecha(valor):
    """'Aug 1, 2023' -> '2023-08-01'. Si no se puede leer, devuelve None."""
    texto = limpiar_texto(valor)
    if texto is None:
        return None
    try:
        return datetime.strptime(texto, "%b %d, %Y").strftime("%Y-%m-%d")
    except ValueError:
        return None


def leer_csv(ruta):
    with open(ruta, encoding="utf-8", newline="") as archivo:
        lector = csv.reader(archivo)
        encabezado = next(lector)
        # En el CSV original la cabecera junta "Discount" y "DLC count" en una
        # sola columna, por eso cada fila trae un valor más que la cabecera.
        if "DiscountDLC count" in encabezado:
            i = encabezado.index("DiscountDLC count")
            encabezado[i:i + 1] = ["Discount", "DLC count"]
        for fila in lector:
            yield dict(zip(encabezado, fila)), len(fila) == len(encabezado)


def main():
    juegos = []
    ids_vistos = set()
    resumen = {
        "filas leídas": 0,
        "filas con columnas de más o de menos": 0,
        "AppID repetido o vacío": 0,
        "nombres con espacios corregidos": 0,
        "juegos sin nombre": 0,
        "fechas no reconocidas": 0,
        "Metacritic 0 -> null": 0,
    }

    for fila, completa in leer_csv(ENTRADA):
        resumen["filas leídas"] += 1
        if not completa:
            resumen["filas con columnas de más o de menos"] += 1
            continue

        app_id = a_entero(fila["AppID"])
        if app_id is None or app_id in ids_vistos:
            resumen["AppID repetido o vacío"] += 1
            continue
        ids_vistos.add(app_id)

        juego = {"appId": app_id}
        for columna, campo in CATEGORICAS.items():
            juego[campo] = limpiar_texto(fila[columna])
        for columna, campo in TEMPORALES.items():
            juego[campo] = a_fecha(fila[columna])
        for columna, campo in DECIMALES.items():
            juego[campo] = a_decimal(fila[columna])
        for columna, campo in ENTERAS.items():
            juego[campo] = a_entero(fila[columna])
        for columna, campo in BOOLEANAS.items():
            juego[campo] = a_booleano(fila[columna])
        for columna, campo in LISTAS.items():
            juego[campo] = a_lista(fila[columna])

        if juego["name"] is not None and juego["name"] != fila["Name"]:
            resumen["nombres con espacios corregidos"] += 1
        if juego["name"] is None:
            resumen["juegos sin nombre"] += 1
        if juego["releaseDate"] is None:
            resumen["fechas no reconocidas"] += 1
        # En el dataset, Metacritic 0 significa que el juego no tiene calificación
        if juego["metacriticScore"] == 0:
            juego["metacriticScore"] = None
            resumen["Metacritic 0 -> null"] += 1

        juegos.append(juego)

    with open(SALIDA, "w", encoding="utf-8") as archivo:
        json.dump({"games": juegos}, archivo, ensure_ascii=False)

    resumen["registros en el JSON"] = len(juegos)
    for clave, valor in resumen.items():
        print(f"{clave}: {valor}")
    print(f"Archivo generado: {SALIDA}")


if __name__ == "__main__":
    main()
