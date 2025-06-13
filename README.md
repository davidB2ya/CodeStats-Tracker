# CodeStats Tracker

**CodeStats Tracker** es una extensión para Visual Studio Code que te permite rastrear tu tiempo de codificación, visualizar estadísticas avanzadas de productividad y exportar tus datos para análisis o respaldo.

---

## Características

- **Contador de tiempo de codificación** en la barra de estado.
- **Panel de estadísticas** con:
  - Tendencias semanales y mensuales (gráficas de línea).
  - Comparación entre proyectos y lenguajes (gráficas de barras y dona).
  - Ranking de días más productivos.
  - Porcentaje de tiempo activo vs. inactivo.
  - Resumen diario detallado.
- **Exportación de datos** a archivo `.json` para respaldo o análisis externo.
- **Interfaz moderna y responsiva**.

---

## Instalación

1. Clona este repositorio o descarga los archivos.
2. Abre la carpeta en VS Code.
3. Ejecuta en la terminal:
   ```sh
   yarn install
   yarn run compile
   ```
4. Empaqueta la extensión:
   ```sh
   vsce package
   ```
5. Instala el archivo `.vsix` generado desde la paleta de comandos de VS Code (`Extensiones: Instalar desde VSIX...`).

---

## Uso

- El contador aparece en la barra de estado inferior.
- Haz clic en el contador o ejecuta el comando `CodeStats: Ver Panel de Estadísticas` para abrir el panel.
- Explora las gráficas y tablas para ver tus estadísticas.
- Usa el botón **Exportar datos (.json)** para descargar tu historial de actividad.

---

## Exportar datos

Haz clic en el botón **Exportar datos (.json)** en el panel para descargar todos tus datos de uso en formato JSON.

---

## Contribuir

¡Las contribuciones son bienvenidas! Puedes abrir issues o pull requests para sugerir mejoras o reportar errores.

---

## Autor

David Bedoya

---

¡Gracias por usar CodeStats Tracker!
