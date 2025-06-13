window.addEventListener("message", (event) => {
  const message = event.data;
  if (message.command === "updateData") {
    renderDashboard(message.data);
  }
  if (message.command === "downloadData") {
    // Descarga el archivo JSON
    const blob = new Blob([JSON.stringify(message.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codestats-data.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
});

window.onload = () => {
  vscode = acquireVsCodeApi();
  vscode.postMessage({ command: "getData" });
};

function renderDashboard(data) {
  // --- Resumen ---
  const days = Object.keys(data).sort();
  let total = 0,
    max = 0,
    topDay = "",
    langCount = {},
    projCount = {};
  days.forEach((day) => {
    const d = data[day];
    total += d.totalSeconds || 0;
    if ((d.totalSeconds || 0) > max) {
      max = d.totalSeconds;
      topDay = day;
    }
    for (const l in d.languages) {
      langCount[l] = (langCount[l] || 0) + d.languages[l];
    }
    for (const p in d.projects) {
      projCount[p] = (projCount[p] || 0) + d.projects[p];
    }
  });
  const avg = days.length ? total / days.length : 0;
  const topLang =
    Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  const topProj =
    Object.entries(projCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  document.getElementById(
    "avgTimeCard"
  ).innerHTML = `<b>Promedio Diario</b><br>${formatTime(avg)}`;
  document.getElementById(
    "topDayCard"
  ).innerHTML = `<b>Día más productivo</b><br>${topDay || "-"}`;
  document.getElementById(
    "topLangCard"
  ).innerHTML = `<b>Lenguaje más usado</b><br>${topLang}`;
  document.getElementById(
    "topProjectCard"
  ).innerHTML = `<b>Proyecto más trabajado</b><br>${topProj}`;

  // --- Gráficos ---
  // Tiempo por día
  const timeChart = document.getElementById("timeChart").getContext("2d");
  new Chart(timeChart, {
    type: "bar",
    data: {
      labels: days,
      datasets: [
        {
          label: "Minutos",
          data: days.map((d) => Math.round((data[d].totalSeconds || 0) / 60)),
          backgroundColor: "#4fc3f7",
        },
      ],
    },
    options: { plugins: { legend: { display: false } } },
  });

  // Lenguajes hoy
  const today = days[days.length - 1];
  const langs = data[today]?.languages || {};
  const langChart = document.getElementById("langChart").getContext("2d");
  new Chart(langChart, {
    type: "doughnut",
    data: {
      labels: Object.keys(langs),
      datasets: [
        {
          data: Object.values(langs),
          backgroundColor: [
            "#4fc3f7",
            "#81c784",
            "#ffb74d",
            "#e57373",
            "#ba68c8",
            "#ffd54f",
          ],
        },
      ],
    },
  });

  // Proyectos hoy
  const projs = data[today]?.projects || {};
  const projectChart = document.getElementById("projectChart").getContext("2d");
  new Chart(projectChart, {
    type: "doughnut",
    data: {
      labels: Object.keys(projs),
      datasets: [
        {
          data: Object.values(projs),
          backgroundColor: [
            "#4fc3f7",
            "#81c784",
            "#ffb74d",
            "#e57373",
            "#ba68c8",
            "#ffd54f",
          ],
        },
      ],
    },
  });

  // --- Tabla resumen ---
  const tbody = document.getElementById("summaryTable").querySelector("tbody");
  tbody.innerHTML = "";
  days.reverse().forEach((day) => {
    const d = data[day];
    tbody.innerHTML += `<tr>
      <td>${day}</td>
      <td>${formatTime(d.totalSeconds)}</td>
      <td>${Object.entries(d.projects)
        .map(([p, t]) => `${p}: ${formatTime(t)}`)
        .join("<br>")}</td>
      <td>${Object.entries(d.languages)
        .map(([l, t]) => `${l}: ${formatTime(t)}`)
        .join("<br>")}</td>
    </tr>`;
  });
}

function formatTime(sec) {
  sec = Math.round(sec || 0);
  const h = Math.floor(sec / 3600),
    m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m}m`;
}

document.getElementById("exportBtn").onclick = function () {
  vscode.postMessage({ command: "exportData" });
};
