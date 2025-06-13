(function () {
  const vscode = acquireVsCodeApi();
  let timeChart, langChart, projectChart;

  // Pedir datos al cargar el panel
  vscode.postMessage({ command: "getData" });

  // Escuchar mensajes desde la extensión
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.command === "updateData") {
      renderCharts(message.data);
      renderTable(message.data);
    }
  });

  function formatTime(seconds) {
    if (!seconds) {
      return "0m";
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
  }

  function renderCharts(data) {
    const today = new Date().toISOString().slice(0, 10);
    const todayData = data[today] || { projects: {}, languages: {} };

    // Datos para el gráfico de tiempo
    const timeLabels = Object.keys(data).sort();
    const timeData = timeLabels.map(
      (label) => (data[label].totalSeconds || 0) / 3600
    ); // en horas

    // Datos para los gráficos de tarta
    const langData = todayData.languages;
    const projectData = todayData.projects;

    // Renderizar gráfico de tiempo
    const timeCtx = document.getElementById("timeChart").getContext("2d");
    if (timeChart) {
      timeChart.destroy();
    }
    timeChart = new Chart(timeCtx, {
      type: "bar",
      data: {
        labels: timeLabels.map((l) =>
          new Date(l).toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
          })
        ),
        datasets: [
          {
            label: "Horas de codificación",
            data: timeData,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Horas" } },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Renderizar gráfico de lenguajes
    const langCtx = document.getElementById("langChart").getContext("2d");
    if (langChart) {
      langChart.destroy();
    }
    langChart = new Chart(langCtx, {
      type: "pie",
      data: {
        labels: Object.keys(langData),
        datasets: [
          {
            data: Object.values(langData),
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    // Renderizar gráfico de proyectos
    const projectCtx = document.getElementById("projectChart").getContext("2d");
    if (projectChart) {
      projectChart.destroy();
    }
    projectChart = new Chart(projectCtx, {
      type: "doughnut",
      data: {
        labels: Object.keys(projectData),
        datasets: [
          {
            data: Object.values(projectData),
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  function renderTable(data) {
    const tableBody = document.querySelector("#summaryTable tbody");
    tableBody.innerHTML = "";
    const sortedDates = Object.keys(data).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    for (const date of sortedDates) {
      const dayData = data[date];
      const row = document.createElement("tr");

      const dateCell = document.createElement("td");
      dateCell.textContent = new Date(date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      row.appendChild(dateCell);

      const timeCell = document.createElement("td");
      timeCell.textContent = formatTime(dayData.totalSeconds);
      row.appendChild(timeCell);

      const projectsCell = document.createElement("td");
      projectsCell.textContent = Object.entries(dayData.projects || {})
        .map(([name, sec]) => `${name} (${formatTime(sec)})`)
        .join(", ");
      row.appendChild(projectsCell);

      const languagesCell = document.createElement("td");
      languagesCell.textContent = Object.entries(dayData.languages || {})
        .map(([name, sec]) => `${name} (${formatTime(sec)})`)
        .join(", ");
      row.appendChild(languagesCell);

      tableBody.appendChild(row);
    }
  }
})();
