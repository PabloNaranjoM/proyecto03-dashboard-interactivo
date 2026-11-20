"""
Valida el JSON generado: estructura, tipos de datos, cantidad de registros
y valores faltantes.

Uso:
    python scripts/validar_json.py [archivo.json] [archivo.csv]

Por defecto revisa datos/games.json contra datos/games[original].csv.
"""

import csv
import json
import re
import sys

csv.field_size_limit(10**9)

ARCHIVO_JSON = sys.argv[1] if len(sys.argv) > 1 else "datos/games.json"
ARCHIVO_CSV = sys.argv[2] if len(sys.argv) > 2 else "datos/games[original].csv"

# Tipo esperado de cada campo. "null" indica que se acepta valor faltante.
ESQUEMA = {
    "appId": (int,),
    "name": (str, "null"),
    "owners": (str, "null"),
    "releaseDate": (str, "null"),
    "price": (float, "null"),
    "ccu": (int, "null"),
    "positive": (int, "null"),
    "negative": (int, "null"),
    "metacriticScore": (int, "null"),
    "averagePlaytime": (int, "null"),
    "medianPlaytime": (int, "null"),
    "achievements": (int, "null"),
    "recommendations": (int, "null"),
    "windows": (bool, "null"),
    "mac": (bool, "null"),
    "linux": (bool, "null"),
    "genres": (list,),
    "categories": (list,),
    "developers": (list,),
    "publishers": (list,),
}

FORMATO_FECHA = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def tipo_correcto(valor, permitidos):
    if valor is None:
        return "null" in permitidos
    # En Python bool es subclase de int, así que se revisa aparte
    if isinstance(valor, bool):
        return bool in permitidos
    if float in permitidos and isinstance(valor, int):
        return True  # un precio 0 también es válido
    return any(isinstance(valor, t) for t in permitidos if t != "null")


def main():
    with open(ARCHIVO_JSON, encoding="utf-8") as archivo:
        datos = json.load(archivo)  # si el JSON está mal formado, falla aquí

    errores = []
    if not isinstance(datos, dict) or not isinstance(datos.get("games"), list):
        sys.exit('ERROR: se esperaba un objeto con la clave "games" (lista).')
    juegos = datos["games"]

    with open(ARCHIVO_CSV, encoding="utf-8", newline="") as archivo:
        filas_csv = sum(1 for _ in csv.reader(archivo)) - 1  # sin la cabecera

    faltantes = {campo: 0 for campo in ESQUEMA}
    ids = set()

    for i, juego in enumerate(juegos):
        if set(juego) != set(ESQUEMA):
            errores.append(f"Registro {i}: campos distintos a los esperados")
            continue
        for campo, permitidos in ESQUEMA.items():
            valor = juego[campo]
            if valor is None or valor == []:
                faltantes[campo] += 1
            if not tipo_correcto(valor, permitidos):
                errores.append(f"Registro {i}: '{campo}' tiene tipo {type(valor).__name__}")
            if isinstance(valor, str) and valor != valor.strip():
                errores.append(f"Registro {i}: '{campo}' tiene espacios sobrantes")
            if isinstance(valor, list) and not all(isinstance(x, str) for x in valor):
                errores.append(f"Registro {i}: '{campo}' debe ser lista de textos")
        fecha = juego["releaseDate"]
        if fecha is not None and not FORMATO_FECHA.match(fecha):
            errores.append(f"Registro {i}: fecha '{fecha}' fuera de formato")
        if juego["appId"] in ids:
            errores.append(f"Registro {i}: appId {juego['appId']} repetido")
        ids.add(juego["appId"])

    print(f"Registros en el CSV:  {filas_csv}")
    print(f"Registros en el JSON: {len(juegos)}")
    print("¿Coinciden?", "Sí" if filas_csv == len(juegos) else "No")
    print("\nValores faltantes (null o lista vacía) por campo:")
    for campo, cantidad in faltantes.items():
        print(f"  {campo:<16} {cantidad}")
    print(f"\nErrores de estructura o tipo: {len(errores)}")
    for error in errores[:20]:
        print("  -", error)


if __name__ == "__main__":
    main()
