let graficoTemperatura = null;
let graficoActualT = null; 

let graficoFlujo = null;
let graficoActualF = null; 

function setHigh(){
    for(let i = 1; i <= 3; i++){
        tanque = document.getElementById('level' + i);
        document.getElementById('liquid'+i).style.height = tanque.textContent;
    }
}

function generarEtiquetas(rangoMin){
    let intervalo = 3;
    if(rangoMin === 60) intervalo = 5;
    if(rangoMin === 180) intervalo = 15;

    const puntos = Math.floor(rangoMin / intervalo) + 1;
    const etiquetas = [];
    const ahora = new Date();

    for(let i = puntos - 1; i >= 0; i--){
        const t = new Date(ahora.getTime() - i * intervalo * 60000);
        const hh = String(t.getHours()).padStart(2, '0');
        const mm = String(t.getMinutes()).padStart(2, '0');
        etiquetas.push(`${hh}:${mm}`);
    }
    return etiquetas;
}

function generarSerie(puntos, base, amplitud, ruido){
    const datos = [];
    let valor = base;
    for(let i = 0; i < puntos; i++){
        valor += (Math.random() - 0.5) * ruido;
        valor += Math.sin(i / 4) * (amplitud / 6);
        datos.push(Math.max(0, Math.round(valor * 10) / 10));
    }
    return datos;
}

function construirDatasetsTemperatura(puntos){
    return [
        { label: 'Olla de agua', data: generarSerie(puntos, 60, 8, 3), borderColor: '#0d6efd', backgroundColor: '#0d6efd', borderWidth: 2, tension: 0.3, fill: false },
        { label: 'Olla de mosto', data: generarSerie(puntos, 26, 6, 2), borderColor: '#fd7e14', backgroundColor: '#fd7e14', borderWidth: 2, tension: 0.3, fill: false },
        { label: 'Olla de cocción', data: generarSerie(puntos, 95, 10, 4), borderColor: '#dc3545', backgroundColor: '#dc3545', borderWidth: 2, tension: 0.3, fill: false }
    ];
}

function construirDatasetsFlujo(puntos){
    return [
        { label: 'Olla de agua', data: generarSerie(puntos, 10, 4, 2), borderColor: '#0d6efd', backgroundColor: '#0d6efd', borderWidth: 2, tension: 0.3, fill: false },
        { label: 'Olla de mosto', data: generarSerie(puntos, 5, 3, 1.5), borderColor: '#fd7e14', backgroundColor: '#fd7e14', borderWidth: 2, tension: 0.3, fill: false }
    ];
}

// Histórico de incidentes (datos de ejemplo)
function setIncidentes(){
    const incidentes = [
        { fecha: '24/09/2026', hora: '08:12', tanque: 'Olla de cocción', descripcion: 'Temperatura excedida por sobre el límite de seguridad', severidad: 'Alta', estado: 'Resuelto' },
        { fecha: '23/09/2026', hora: '14:35', tanque: 'Olla de mosto', descripcion: 'Nivel de líquido por debajo del mínimo operativo', severidad: 'Media', estado: 'Resuelto' },
        { fecha: '22/09/2026', hora: '19:02', tanque: 'Válvula V2', descripcion: 'Fallo en la apertura remota de la válvula', severidad: 'Baja', estado: 'Resuelto' },
        { fecha: '20/09/2026', hora: '11:47', tanque: 'Olla de agua', descripcion: 'Sensor de temperatura reportó lectura inconsistente', severidad: 'Baja', estado: 'En revisión' },
        { fecha: '18/09/2026', hora: '06:20', tanque: 'Olla de cocción', descripcion: 'Corte de energía provocó parada de emergencia', severidad: 'Alta', estado: 'Resuelto' },
        { fecha: '15/09/2026', hora: '21:58', tanque: 'Válvula V1', descripcion: 'Fuga menor detectada en la unión de la tubería', severidad: 'Media', estado: 'Resuelto' },
        { fecha: '12/09/2026', hora: '09:30', tanque: 'Olla de mosto', descripcion: 'Sobrepresión momentánea durante el trasvase', severidad: 'Media', estado: 'Resuelto' },
        { fecha: '09/09/2026', hora: '17:15', tanque: 'Olla de cocción', descripcion: 'Tiempo de cocción excedido respecto al plan de lote', severidad: 'Baja', estado: 'Cerrado' },
        { fecha: '07/09/2026', hora: '13:05', tanque: 'Olla de agua', descripcion: 'Bomba de recirculación se detuvo inesperadamente', severidad: 'Media', estado: 'Resuelto' },
        { fecha: '05/09/2026', hora: '22:41', tanque: 'Válvula V1', descripcion: 'Válvula quedó trabada en posición intermedia', severidad: 'Alta', estado: 'Resuelto' },
        { fecha: '02/09/2026', hora: '10:18', tanque: 'Olla de mosto', descripcion: 'Diferencia de calibración entre sensores de temperatura redundantes', severidad: 'Baja', estado: 'En revisión' },
        { fecha: '30/08/2026', hora: '04:52', tanque: 'Olla de cocción', descripcion: 'Alarma de nivel bajo activada durante trasvase nocturno', severidad: 'Media', estado: 'Cerrado' },
        { fecha: '27/08/2026', hora: '16:30', tanque: 'Válvula V2', descripcion: 'Actuador de la válvula reportó consumo eléctrico anómalo', severidad: 'Media', estado: 'Resuelto' },
        { fecha: '24/08/2026', hora: '08:47', tanque: 'Olla de agua', descripcion: 'Pérdida de comunicación con PLC', severidad: 'Baja', estado: 'Cerrado' },
        { fecha: '20/08/2026', hora: '15:22', tanque: 'Olla de cocción', descripcion: 'Sobrecalentamiento por falla en la resistencia principal', severidad: 'Alta', estado: 'Resuelto' },
        { fecha: '25/09/2026', hora: '07:00', tanque: 'Olla de agua', descripcion: 'Fin de vida útil del sensor de temperatura en dos meses', severidad: 'Media', estado: 'Pendiente' },
        { fecha: '25/09/2026', hora: '07:05', tanque: 'Olla de agua', descripcion: 'Fin de vida útil del sensor de temperatura en dos semanas', severidad: 'Alta', estado: 'Pendiente' }
    ];

    const colores = { Alta: 'text-bg-danger', Media: 'text-bg-warning', Baja: 'text-bg-secondary' };
    const coloresEstado = { 'Resuelto': 'text-bg-success', 'En revisión': 'text-bg-info', 'Cerrado': 'text-bg-secondary', 'Pendiente': 'text-bg-warning' };

    const tbody = document.getElementById('tablaIncidentes');
    tbody.innerHTML = incidentes.map(inc => `
        <tr>
            <td>${inc.fecha}</td>
            <td>${inc.hora}</td>
            <td>${inc.tanque}</td>
            <td>${inc.descripcion}</td>
            <td><span class="badge ${colores[inc.severidad]}">${inc.severidad}</span></td>
            <td><span class="badge ${coloresEstado[inc.estado]}">${inc.estado}</span></td>
        </tr>
    `).join('');
}

// Datos de producción (ejemplo)
function setProduccion(){
    const litrosHoy = 1240;
    const metaDiaria = 2000;
    const porcentaje = Math.round((litrosHoy / metaDiaria) * 100);

    document.getElementById('litrosHoy').textContent = litrosHoy.toLocaleString('es-AR') + ' L';
    document.getElementById('metaDiaria').textContent = metaDiaria.toLocaleString('es-AR') + ' L';

    const barra = document.getElementById('barraProduccion');
    barra.style.width = porcentaje + '%';
    barra.textContent = porcentaje + '%';
}

function stop(){
    
    document.getElementById("v1").setAttribute("class", "valve closed")
    document.getElementById("v2").setAttribute("class", "valve closed")
    document.getElementById("v1status").innerHTML = "CERRADA"
    document.getElementById("v2status").innerHTML = "CERRADA"
    document.getElementById("v1L").innerHTML = "0 l/s"
    document.getElementById("v2L").innerHTML = "0 l/s"
}

function updateGraficoTemperatura(){
    mostrarGraficoTemperatura(graficoActualT)
}

function mostrarGraficoTemperatura(tanque){
    
    graficoActualT = tanque;
    
    const modal = document.getElementById("graficoFlotante");
    const overlay = document.getElementById("graficoOverlay");
    const titulo = document.getElementById("tituloGrafico");
    
    modal.style.display = "block";
    overlay.style.display = "block";
    
    const nombres = {
        0: "Tanque de agua",
        1: "Tanque de mosto",
        2: "Tanque de cocción"
    };
    
    titulo.textContent = "Temperatura - " + nombres[tanque];
    
    const ctx = document.getElementById("grafico").getContext("2d");
    
    const rangoInicialT = parseInt(document.getElementById('rangoTiempoT').value, 10);

    document.getElementById("rangoTiempoT").onchange = updateGraficoTemperatura;
    
    if (graficoTemperatura) {
        graficoTemperatura.destroy();
    }
    
    const etiquetasT = generarEtiquetas(rangoInicialT);
    
    graficoTemperatura = new Chart(ctx, {
        type: "line",
        
        data: {
            labels: etiquetasT,
            
            datasets: [{
                label: "Temperatura °C",
                data: construirDatasetsTemperatura(etiquetasT.length)[tanque]["data"],
                borderWidth: 2,
                tension: 0.3,
                fill: false
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: "Temperatura (°C)"
                    }
                },
                
                x: {
                    title: {
                        display: true,
                        text: "Tiempo"
                    }
                }
            }
        }
    });
}

function cerrarGraficoTemperatura() {
    document.getElementById("graficoFlotante").style.display = "none";
    document.getElementById("graficoOverlay").style.display = "none";
}

function updateGraficoFlujo(){
    mostrarGraficoFlujo(graficoActualF)
}

function mostrarGraficoFlujo(tanque){

    graficoActualF = tanque;

    const modal = document.getElementById("graficoFlotante");
    const overlay = document.getElementById("graficoOverlay");
    const titulo = document.getElementById("tituloGrafico");
    
    modal.style.display = "block";
    overlay.style.display = "block";
    
    const nombres = {
        0: "Tanque de agua => Tanque de mosto",
        1: "Tanque de mosto => Tanque de cocción",
    };
    
    titulo.textContent = "Flujo - " + nombres[tanque];
    
    const ctx = document.getElementById("grafico").getContext("2d");
    
    const rangoInicialT = parseInt(document.getElementById('rangoTiempoT').value, 10);

    document.getElementById("rangoTiempoT").onchange = updateGraficoFlujo;

    if (graficoFlujo) {
        graficoFlujo.destroy();
    }

    const etiquetasF = generarEtiquetas(rangoInicialT);

    console.log(construirDatasetsFlujo(etiquetasF.length))

    graficoFlujo = new Chart(ctx, {
        type: "line",

        data: {
            labels: etiquetasF,

            datasets: [{
                label: "Flujo",
                data: construirDatasetsFlujo(etiquetasF.length)[tanque]["data"],
                borderWidth: 2,
                tension: 0.3,
                fill: false
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: "Flujo (l/s)"
                    }
                },

                x: {
                    title: {
                        display: true,
                        text: "Tiempo"
                    }
                }
            }
        }
    });
}

function cerrarGraficoFlujo() {
    document.getElementById("graficoFlotante").style.display = "none";
    document.getElementById("graficoOverlay").style.display = "none";
}

function main(){
    setHigh();
    setIncidentes();
    setProduccion();

    Swal.fire({
        title: "Temperatura exedida",
        text: "Olla de cocción con poco liquido y mucha temperatura",
        icon: "error",
        confirmButtonText: "Aceptar"
    });
}

document.addEventListener('DOMContentLoaded', main);








/*
 * Simulador didáctico del proceso de cocción de cerveza.
 * Integración: guardar como script.js junto a index(3).html.
 * Todos los valores son simulados; no controla equipos físicos.
 */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const clamp = (n, min, max) =>
    Math.max(min, Math.min(max, n));
  const rand = (min, max) =>
    min + Math.random() * (max - min);

  const tanques = [
    {
      nombre: "Tanque de agua",
      nivel: 0,
      temp: 22,
      objetivo: 78,
      capacidad: 1000
    },
    {
      nombre: "Tanque de mosto",
      nivel: 0,
      temp: 22,
      objetivo: 66,
      capacidad: 900
    },
    {
      nombre: "Tanque de cocción",
      nivel: 0,
      temp: 22,
      objetivo: 100,
      capacidad: 900
    }
  ];

  const estado = {
    ejecutando: false,
    pausa: false,
    etapa: 0,
    tiempoEtapa: 0,
    tiempoTotal: 0,
    flujo1: 0,
    flujo2: 0,
    valvula1: false,
    valvula2: false,
    bomba: false,
    calentador: false,
    alarmas: [],
    historicoTemp: [[], [], []],
    historicoFlujo: [[], []],
    ultimoRegistro: 0,
    lote: 245,
    litrosHoy: 1240,
    meta: 2000,
    velocidad: 1
  };

  const etapas = [
    {
      titulo: "Llenado del tanque de agua",
      accion: "Abriendo entrada de agua",
      duracion: 22
    },
    {
      titulo: "Calentamiento del agua",
      accion: "Calentando hasta 78 °C",
      duracion: 35
    },
    {
      titulo: "Llenado del tanque de mosto",
      accion: "Transfiriendo agua al tanque de mosto",
      duracion: 24
    },
    {
      titulo: "Maceración",
      accion: "Manteniendo la mezcla cerca de 66 °C",
      duracion: 35
    },
    {
      titulo: "Transferencia al tanque de cocción",
      accion: "Bombeando mosto al tanque de cocción",
      duracion: 24
    },
    {
      titulo: "Lavado",
      accion: "Agregando agua para el lavado",
      duracion: 20
    },
    {
      titulo: "Cocción",
      accion: "Calentando el mosto hasta ebullición",
      duracion: 45
    },
    {
      titulo: "Vaciado y finalización",
      accion: "Vaciando el tanque de cocción",
      duracion: 25
    }
  ];

  let timer = null;
  let graficoTemp = null;
  let graficoFlujo = null;

  function ponerTexto(id, texto) {
    const el = $(id);

    if (el) {
      el.textContent = texto;
    }
  }

  // Actualiza el nivel, la temperatura y el estado del tanque.
  function pintarTanque(i) {
    const t = tanques[i];
    const n = i + 1;

    const liquido = $("liquid" + n);

    if (liquido) {
      liquido.style.height = t.nivel + "%";
    }

    ponerTexto("level" + n, Math.round(t.nivel) + "%");
    ponerTexto("levelText" + n, Math.round(t.nivel) + "%");
    ponerTexto("temp" + n, t.temp.toFixed(1) + " °C");

    const bloque = liquido?.closest(".col-12");
    const badge = bloque?.querySelector(".badge");

    if (badge) {
      if (t.temp > 102 || t.nivel > 98) {
        badge.className = "badge text-bg-danger";
        badge.textContent = "PELIGRO";
      } else if (t.temp > 95 || t.nivel < 10) {
        badge.className = "badge text-bg-warning";
        badge.textContent = "ATENCIÓN";
      } else {
        badge.className = "badge text-bg-success";
        badge.textContent = "NORMAL";
      }
    }

    const tempEl = $("temp" + n);

    if (tempEl) {
      tempEl.style.color =
        t.temp >= 95
          ? "red"
          : t.temp >= 60
            ? "sandybrown"
            : "green";
    }
  }

  function pintarValvula(id, abierta, statusId) {
    const el = $(id);

    if (el) {
      el.classList.toggle("open", abierta);
      el.classList.toggle("closed", !abierta);
    }

    ponerTexto(
      statusId,
      abierta ? "ABIERTA" : "CERRADA"
    );
  }

  // Registra los eventos en el histórico de incidentes.
  function incidente(
    tanque,
    descripcion,
    severidad = "INFO"
  ) {
    const tabla = $("tablaIncidentes");

    if (!tabla) return;

    const ahora = new Date();
    const tr = document.createElement("tr");

    const fecha = ahora.toLocaleDateString("es-AR");
    const hora = ahora.toLocaleTimeString("es-AR");

    const datos = [
      fecha,
      hora,
      tanque,
      descripcion,
      severidad,
      "Registrado"
    ];

    datos.forEach((valor) => {
      const td = document.createElement("td");
      td.textContent = valor;
      tr.appendChild(td);
    });

    tabla.prepend(tr);

    while (tabla.children.length > 30) {
      tabla.lastElementChild.remove();
    }
  }

  // Actualiza la etapa que se muestra en la interfaz.
  function actualizarEtapa() {
    const e = etapas[estado.etapa];

    ponerTexto(
      "processStage",
      e ? e.titulo : "Proceso finalizado"
    );

    ponerTexto(
      "processAction",
      e ? e.accion : "Lote completado"
    );

    const indicadores = document.querySelectorAll(
      ".d-flex.align-items-start .text-center.flex-fill"
    );

    indicadores.forEach((nodo, i) => {
      const circulo = nodo.querySelector(".rounded-circle");
      const label = nodo.querySelector(".small");

      if (!circulo || !label) return;

      const activa = i === estado.etapa;
      const terminada = i < estado.etapa;

      circulo.style.background = activa
        ? "#2563eb"
        : terminada
          ? "#198754"
          : "#e9ecef";

      circulo.style.color =
        activa || terminada ? "#fff" : "#6c757d";

      label.classList.toggle("fw-bold", activa);
      label.classList.toggle("text-primary", activa);

      const estadoEl = nodo.querySelectorAll("div")[2];

      if (estadoEl) {
        estadoEl.textContent = activa
          ? "En curso"
          : terminada
            ? "Completada"
            : "Pendiente";

        estadoEl.className =
          "small " +
          (activa
            ? "text-primary"
            : terminada
              ? "text-success"
              : "text-muted");

        estadoEl.style.fontSize = "12px";
      }
    });

    const progreso = $("processStage")
      ?.parentElement
      ?.parentElement
      ?.querySelector(".small.text-muted");

    if (progreso) {
      progreso.textContent =
        `Etapa ${Math.min(
          estado.etapa + 1,
          etapas.length
        )} de ${etapas.length}`;
    }
  }

  // Actualiza los datos de producción.
  function actualizarProduccion() {
    const avance = Math.round(
      estado.litrosHoy / estado.meta * 100
    );

    const barra = $("barraProduccion");

    if (barra) {
      barra.style.width =
        clamp(avance, 0, 100) + "%";

      barra.textContent =
        clamp(avance, 0, 100) + "%";
    }

    ponerTexto(
      "litrosHoy",
      estado.litrosHoy.toLocaleString("es-AR") + " L"
    );

    ponerTexto(
      "metaDiaria",
      estado.meta.toLocaleString("es-AR") + " L"
    );

    ponerTexto(
      "rendimiento",
      Math.round(rand(90, 96)) + "%"
    );

    ponerTexto(
      "loteActual",
      "#" + String(estado.lote).padStart(4, "0")
    );

    const restantes = Math.max(
      0,
      Math.ceil(
        (
          etapas
            .slice(estado.etapa)
            .reduce((s, e) => s + e.duracion, 0)
          - estado.tiempoEtapa
        ) / 60
      )
    );

    ponerTexto(
      "tiempoRestante",
      estado.etapa >= etapas.length
        ? "Completado"
        : restantes + " min aprox."
    );
  }

  // Guarda lecturas para los gráficos.
  function guardarLecturas() {
    const etiqueta =
      new Date().toLocaleTimeString("es-AR");

    tanques.forEach((t, i) => {
      estado.historicoTemp[i].push({
        x: etiqueta,
        y: Number(t.temp.toFixed(1))
      });

      if (estado.historicoTemp[i].length > 120) {
        estado.historicoTemp[i].shift();
      }
    });

    [estado.flujo1, estado.flujo2].forEach((f, i) => {
      estado.historicoFlujo[i].push({
        x: etiqueta,
        y: Number(f.toFixed(1))
      });

      if (estado.historicoFlujo[i].length > 120) {
        estado.historicoFlujo[i].shift();
      }
    });
  }

  // Ejecuta un paso de la simulación.
  function paso() {
    if (!estado.ejecutando || estado.pausa) return;

    const dt = 0.25 * estado.velocidad;

    estado.tiempoTotal += dt;
    estado.tiempoEtapa += dt;

    const agua = tanques[0];
    const mosto = tanques[1];
    const coccion = tanques[2];

    estado.valvula1 = false;
    estado.valvula2 = false;
    estado.bomba = false;
    estado.calentador = false;

    estado.flujo1 = 0;
    estado.flujo2 = 0;

    switch (estado.etapa) {
      // 1. Llenar el tanque de agua.
      case 0:
        agua.nivel = clamp(
          agua.nivel + 1.4 * dt,
          0,
          65
        );

        if (agua.nivel >= 65) {
          avanzarEtapa("Tanque de agua lleno");
        }

        break;

      // 2. Calentar el agua.
      case 1:
        estado.calentador = true;

        agua.temp = clamp(
          agua.temp + 0.85 * dt,
          20,
          75
        );

        if (agua.temp >= 75) {
          avanzarEtapa("Agua a temperatura objetivo");
        }

        break;

      // 3. Transferir agua al tanque de mosto.
      case 2:
        estado.valvula1 = true;
        estado.bomba = true;

        estado.flujo1 = 7 + rand(-0.4, 0.4);

        agua.nivel = clamp(
          agua.nivel - 1.7 * dt,
          0,
          100
        );

        agua.temp = clamp(
          agua.temp - 0.85 * dt,
          20,
          75
        );

        mosto.nivel = clamp(
          mosto.nivel + 1.7 * dt,
          0,
          100
        );

        mosto.temp +=
          (agua.temp - mosto.temp) * 0.035;

        if (
          mosto.nivel >= 100 ||
          agua.nivel <= 0
        ) {
          avanzarEtapa(
            "Transferencia al tanque de mosto terminada"
          );
        }

        break;

      // 4. Maceración.
      case 3:
        estado.calentador = true;

        agua.nivel = clamp(
          agua.nivel + 1.7 * dt,
          0,
          20
        );

        mosto.temp +=
          (66 - mosto.temp) * 0.06 * dt;

        if (Math.abs(mosto.temp - 66) < 0.7) {
          mosto.temp = 66 + rand(-0.3, 0.3);
        }

        if (estado.tiempoEtapa >= etapas[3].duracion) {
          avanzarEtapa("Maceración terminada");
        }

        break;

      // 5. Transferir el mosto al tanque de cocción.
      case 4:
        estado.valvula2 = true;
        estado.bomba = true;

        estado.flujo2 = 7 + rand(-0.4, 0.4);

        agua.nivel = clamp(
          agua.nivel - 1.8 * dt,
          0,
          20
        );

         mosto.nivel = clamp(
          mosto.nivel + 1.7 * dt,
          0,
          20
        );

        coccion.nivel = clamp(
          coccion.nivel + 1.8 * dt,
          0,
          100
        );

        coccion.temp += (mosto.temp - coccion.temp) * 0.04;

        if (
          coccion.nivel >= 100 ||
          mosto.nivel <= 0
        ) {
          avanzarEtapa(
            "Mosto transferido a cocción"
          );
        }

        break;

      // 6. Lavado.
      case 5:
        estado.valvula1 = true;

        estado.flujo1 = 4 + rand(-0.3, 0.3);

        mosto.nivel = clamp(
          mosto.nivel - 0.6 * dt,
          0,
          20
        );

        coccion.nivel = clamp(
          coccion.nivel + 0.6 * dt,
          0,
          80
        );

        if (estado.tiempoEtapa >= etapas[5].duracion) {
          avanzarEtapa("Lavado terminado");
        }

        break;

      // 7. Cocción.
      case 6:
        estado.calentador = true;


        coccion.temp = clamp(
          coccion.temp + 0.55 * dt,
          20,
          100
        );

        if (coccion.temp >= 99.5) {
          coccion.temp = 100;

          if (estado.tiempoEtapa >= etapas[6].duracion) {
            avanzarEtapa("Cocción completada");
          }
        }

        break;

      // 8. Vaciar el tanque de cocción.
      case 7:
        estado.valvula2 = true;
        estado.bomba = true;

        estado.flujo2 = 6 + rand(-0.3, 0.3);

        coccion.nivel = clamp(
          coccion.nivel - 1.8 * dt,
          0,
          100
        );

        if (coccion.nivel <= 0) {
          estado.etapa = etapas.length;
          estado.ejecutando = false;

          estado.valvula1 = false;
          estado.valvula2 = false;
          estado.bomba = false;
          estado.calentador = false;

          estado.litrosHoy += 500;

          incidente(
            "Sistema",
            "Lote completado correctamente",
            "INFO"
          );

          actualizarEtapa();
        }

        break;
    }

    // Simular pequeñas variaciones de temperatura.
    tanques.forEach((t, i) => {
      if (
        !estado.calentador &&
        estado.etapa !== 1 &&
        estado.etapa !== 3 &&
        estado.etapa !== 6
      ) {
        t.temp +=
          (22 - t.temp) * 0.0008 * dt;
      } else {
        t.temp += rand(-0.08, 0.08);
      }

      t.temp = clamp(t.temp, 18, 100);

      pintarTanque(i);
    });

    // Actualizar el estado visual de las válvulas.
    pintarValvula(
      "v4",
      estado.valvula1,
      "v1status"
    );

    // El HTML original repite id="v4" en ambas válvulas.
    const valvulas = document.querySelectorAll(
      ".valve-container"
    );

    if (valvulas[0]) {
      valvulas[0].classList.toggle(
        "open",
        estado.valvula1
      );

      valvulas[0].classList.toggle(
        "closed",
        !estado.valvula1
      );
    }

    if (valvulas[1]) {
      valvulas[1].classList.toggle(
        "open",
        estado.valvula2
      );

      valvulas[1].classList.toggle(
        "closed",
        !estado.valvula2
      );
    }

    ponerTexto(
      "v1L",
      estado.flujo1.toFixed(1) + " l/s"
    );

    const textoFlujo2 =
      document.querySelector("#v2status")
        ?.previousElementSibling;

    if (textoFlujo2) {
      textoFlujo2.textContent =
        estado.flujo2.toFixed(1) + " l/s";
    }

    ponerTexto(
      "v2status",
      estado.valvula2 ? "ABIERTA" : "CERRADA"
    );

    // Guardar lecturas periódicamente.
    if (
      estado.tiempoTotal - estado.ultimoRegistro >= 1
    ) {
      guardarLecturas();
      estado.ultimoRegistro = estado.tiempoTotal;
    }

    actualizarProduccion();

    if (
      estado.ejecutando &&
      estado.etapa < etapas.length
    ) {
      actualizarEtapa();
    }
  }

  // Avanzar a la siguiente etapa.
  function avanzarEtapa(mensaje) {
    incidente("Sistema", mensaje, "INFO");

    estado.etapa++;
    estado.tiempoEtapa = 0;

    if (estado.etapa >= etapas.length) {
      estado.ejecutando = false;
      estado.litrosHoy += 500;
    }

    actualizarEtapa();
  }

  // Iniciar la simulación.
  function iniciar() {
    if (estado.ejecutando) return;

    if (estado.etapa >= etapas.length) {
      reiniciar(false);
    }

    estado.ejecutando = true;
    estado.pausa = false;

    ponerTexto(
      "processAction",
      "Simulación en marcha"
    );

    if (!timer) {
      timer = setInterval(paso, 250);
    }

    incidente(
      "Sistema",
      "Simulación iniciada",
      "INFO"
    );

    actualizarBotones();
  }

  // Pausar o reanudar.
  function pausar() {
    if (!estado.ejecutando) return;

    estado.pausa = !estado.pausa;

    ponerTexto(
      "processAction",
      estado.pausa
        ? "Simulación pausada"
        : etapas[estado.etapa]?.accion ||
          "Proceso finalizado"
    );

    actualizarBotones();
  }

  // Reiniciar todos los valores.
  function reiniciar(registrar = true) {
    estado.ejecutando = false;
    estado.pausa = false;
    estado.etapa = 0;

    estado.tiempoEtapa = 0;
    estado.tiempoTotal = 0;

    estado.flujo1 = 0;
    estado.flujo2 = 0;

    estado.valvula1 = false;
    estado.valvula2 = false;
    estado.bomba = false;
    estado.calentador = false;

    estado.ultimoRegistro = 0;

    tanques.forEach((t, i) => {
      t.nivel = [0, 0, 0][i];
      t.temp = 22;
    });

    estado.historicoTemp = [[], [], []];
    estado.historicoFlujo = [[], []];

    tanques.forEach((_, i) => pintarTanque(i));

    actualizarEtapa();
    actualizarProduccion();
    actualizarBotones();

    if (registrar) {
      incidente(
        "Sistema",
        "Simulación reiniciada",
        "INFO"
      );
    }
  }

  // Crear los controles de simulación.
  function actualizarBotones() {
    let panel = $("controlesSimulacion");

    if (!panel) {
      panel = document.createElement("div");

      panel.id = "controlesSimulacion";

      panel.className =
        "d-flex flex-wrap gap-2 align-items-center mb-3";

      const destino = document.querySelector(
        ".container-fluid.py-4"
      );

      destino?.prepend(panel);
    }

    panel.innerHTML = `
      <strong class="me-2">
        Simulación (datos ficticios):
      </strong>

      <button
        type="button"
        class="btn btn-success btn-sm"
        id="btnIniciar">
        ▶ Iniciar
      </button>

      <button
        type="button"
        class="btn btn-warning btn-sm"
        id="btnPausar">
        Ⅱ Pausar
      </button>

      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        id="btnReiniciar">
        ↻ Reiniciar
      </button>

      <label class="small ms-2" for="velocidadSim">
        Velocidad
      </label>

      <select
        class="form-select form-select-sm"
        id="velocidadSim"
        style="width:auto">

        <option value="0.5">0,5×</option>
        <option value="1" selected>1×</option>
        <option value="2">2×</option>
        <option value="4">4×</option>
      </select>

      <span class="small text-muted" id="estadoSim">
        Detenida
      </span>
    `;

    $("btnIniciar").addEventListener(
      "click",
      iniciar
    );

    $("btnPausar").addEventListener(
      "click",
      pausar
    );

    $("btnReiniciar").addEventListener(
      "click",
      () => reiniciar()
    );

    $("velocidadSim").addEventListener(
      "change",
      (e) => {
        estado.velocidad = Number(e.target.value);
      }
    );

    ponerTexto(
      "estadoSim",
      estado.ejecutando
        ? estado.pausa
          ? "Pausada"
          : "En marcha"
        : "Detenida"
    );
  }

  // API pública para consultar o controlar la simulación.
  window.simuladorCerveceria = {
    iniciar,
    pausar,
    reiniciar: () => reiniciar(),

    obtenerEstado: () =>
      JSON.parse(
        JSON.stringify({
          estado,
          tanques,
          etapas
        })
      )
  };

  // Mantener actualizado el indicador de estado.
  function cicloEstado() {
    ponerTexto(
      "estadoSim",
      estado.ejecutando
        ? estado.pausa
          ? "Pausada"
          : "En marcha"
        : estado.etapa >= etapas.length
          ? "Completada"
          : "Detenida"
    );
  }

  setInterval(cicloEstado, 500);

  // Inicializar los elementos y el gráfico.
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      actualizarBotones();

      tanques.forEach((_, i) => {
        pintarTanque(i);
      });

      actualizarEtapa();
      actualizarProduccion();
      guardarLecturas();

      if (
        typeof Chart !== "undefined" &&
        $("grafico")
      ) {
        graficoTemp = new Chart(
          $("grafico"),
          {
            type: "line",

            data: {
              labels: [],

              datasets: [
                {
                  label: "Agua (°C)",
                  data: [],
                  borderColor: "#2563eb",
                  tension: 0.25
                },
                {
                  label: "Mosto (°C)",
                  data: [],
                  borderColor: "#d97706",
                  tension: 0.25
                },
                {
                  label: "Cocción (°C)",
                  data: [],
                  borderColor: "#dc2626",
                  tension: 0.25
                }
              ]
            },

            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: false,

              scales: {
                y: {
                  title: {
                    display: true,
                    text: "Temperatura °C"
                  }
                }
              }
            }
          }
        );
      }
    }
  );

  // Mostrar el gráfico de temperatura.
  window.mostrarGraficoTemperatura = function (
    indice = 0
  ) {
    const overlay = $("graficoOverlay");
    const flotante = $("graficoFlotante");

    if (overlay) {
      overlay.style.display = "block";
    }

    if (flotante) {
      flotante.style.display = "block";
    }

    ponerTexto(
      "tituloGrafico",
      "Sensores de temperatura"
    );

    if (graficoTemp) {
      graficoTemp.data.labels =
        estado.historicoTemp[0].map((p) => p.x);

      graficoTemp.data.datasets.forEach(
        (ds, i) => {
          ds.data =
            estado.historicoTemp[i].map((p) => p.y);
        }
      );

      graficoTemp.update();
    }
  };

  // Cerrar el gráfico.
  window.cerrarGraficoTemperatura = function () {
    if ($("graficoOverlay")) {
      $("graficoOverlay").style.display = "none";
    }

    if ($("graficoFlotante")) {
      $("graficoFlotante").style.display = "none";
    }
  };

  window.updateGraficoTemperatura = function () {
    if (graficoTemp) {
      graficoTemp.update();
    }
  };

  // Mostrar el gráfico de caudal.
  window.mostrarGraficoFlujo = function (
    indice = 0
  ) {
    const overlay = $("graficoOverlay");
    const flotante = $("graficoFlotante");

    if (overlay) {
      overlay.style.display = "block";
    }

    if (flotante) {
      flotante.style.display = "block";
    }

    ponerTexto(
      "tituloGrafico",
      "Sensores de caudal"
    );

    if (graficoTemp) {
      graficoTemp.data.datasets = [
        {
          label: "Válvula 1 (l/s)",
          data: estado.historicoFlujo[0].map(
            (p) => p.y
          ),
          borderColor: "#2563eb",
          tension: 0.25
        },
        {
          label: "Válvula 2 (l/s)",
          data: estado.historicoFlujo[1].map(
            (p) => p.y
          ),
          borderColor: "#16a34a",
          tension: 0.25
        }
      ];

      graficoTemp.data.labels =
        estado.historicoFlujo[0].map((p) => p.x);

      graficoTemp.options.scales.y.title.text =
        "Caudal (l/s)";

      graficoTemp.update();
    }
  };

  // Compatibilidad con el selector de rango temporal.
  window.updateGraficoTemperatura = function () {
    if (!graficoTemp) return;

    const minutos = Number(
      $("rangoTiempoT")?.value || 30
    );

    const cantidad = Math.max(
      5,
      Math.round(minutos / 0.25)
    );

    graficoTemp.data.labels =
      estado.historicoTemp[0]
        .slice(-cantidad)
        .map((p) => p.x);

    graficoTemp.data.datasets.forEach(
      (ds, i) => {
        const serie = estado.historicoTemp[i] || [];

        ds.data = serie
          .slice(-cantidad)
          .map((p) => p.y);
      }
    );

    graficoTemp.update();
  };

})();
