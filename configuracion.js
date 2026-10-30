const recetas = {

    ipa: {
        nombre: "IPA",
        descripcion: "India Pale Ale",

        agua: {
            tempMin: 55,
            tempMax: 65,
            nivelMin: 30
        },

        mosto: {
            tempMin: 62,
            tempMax: 68,
            nivelMin: 25
        },

        coccion: {
            tempMin: 95,
            tempMax: 102,
            nivelMin: 20
        },

        flujo: {
            min: 5,
            max: 15
        }
    },


    lager: {
        nombre: "Lager",
        descripcion: "Lager tradicional",

        agua: {
            tempMin: 50,
            tempMax: 60,
            nivelMin: 30
        },

        mosto: {
            tempMin: 60,
            tempMax: 65,
            nivelMin: 25
        },

        coccion: {
            tempMin: 95,
            tempMax: 100,
            nivelMin: 20
        },

        flujo: {
            min: 4,
            max: 12
        }
    },


    stout: {
        nombre: "Stout",
        descripcion: "Stout oscura",

        agua: {
            tempMin: 55,
            tempMax: 65,
            nivelMin: 35
        },

        mosto: {
            tempMin: 64,
            tempMax: 70,
            nivelMin: 30
        },

        coccion: {
            tempMin: 96,
            tempMax: 102,
            nivelMin: 20
        },

        flujo: {
            min: 5,
            max: 14
        }
    },


    paleale: {
        nombre: "Pale Ale",
        descripcion: "Pale Ale",

        agua: {
            tempMin: 55,
            tempMax: 63,
            nivelMin: 30
        },

        mosto: {
            tempMin: 63,
            tempMax: 68,
            nivelMin: 25
        },

        coccion: {
            tempMin: 95,
            tempMax: 101,
            nivelMin: 20
        },

        flujo: {
            min: 5,
            max: 15
        }
    }

};

function cargarReceta() {

    const tipo =
        document.getElementById("tipoCerveza").value;

    if (tipo === "custom") {

        limpiarFormulario();

        return;
    }

    const receta = recetas[tipo];

    if (!receta) {
        return;
    }


    document.getElementById("nombreReceta").value =
        receta.nombre;

    document.getElementById("descripcionReceta").value =
        receta.descripcion;


    /*
     * Agua
     */

    document.getElementById("aguaTempMin").value =
        receta.agua.tempMin;

    document.getElementById("aguaTempMax").value =
        receta.agua.tempMax;

    document.getElementById("aguaNivelMin").value =
        receta.agua.nivelMin;


    /*
     * Mosto
     */

    document.getElementById("mostoTempMin").value =
        receta.mosto.tempMin;

    document.getElementById("mostoTempMax").value =
        receta.mosto.tempMax;

    document.getElementById("mostoNivelMin").value =
        receta.mosto.nivelMin;


    /*
     * Cocción
     */

    document.getElementById("coccionTempMin").value =
        receta.coccion.tempMin;

    document.getElementById("coccionTempMax").value =
        receta.coccion.tempMax;

    document.getElementById("coccionNivelMin").value =
        receta.coccion.nivelMin;


    /*
     * Flujo
     */

    document.getElementById("flujoMin").value =
        receta.flujo.min;

    document.getElementById("flujoMax").value =
        receta.flujo.max;
}

function nuevaReceta() {

    document.getElementById("tipoCerveza").value =
        "custom";

    limpiarFormulario();

    document.getElementById("nombreReceta").focus();
}

function limpiarFormulario() {

    document.getElementById("nombreReceta").value = "";

    document.getElementById("descripcionReceta").value = "";


    document.getElementById("aguaTempMin").value = "";
    document.getElementById("aguaTempMax").value = "";
    document.getElementById("aguaNivelMin").value = "";


    document.getElementById("mostoTempMin").value = "";
    document.getElementById("mostoTempMax").value = "";
    document.getElementById("mostoNivelMin").value = "";


    document.getElementById("coccionTempMin").value = "";
    document.getElementById("coccionTempMax").value = "";
    document.getElementById("coccionNivelMin").value = "";


    document.getElementById("flujoMin").value = "";
    document.getElementById("flujoMax").value = "";
}

function obtenerConfiguracion() {

    return {

        nombre:
            document.getElementById("nombreReceta").value,

        descripcion:
            document.getElementById("descripcionReceta").value,


        agua: {

            tempMin:
                Number(document.getElementById("aguaTempMin").value),

            tempMax:
                Number(document.getElementById("aguaTempMax").value),

            nivelMin:
                Number(document.getElementById("aguaNivelMin").value)
        },


        mosto: {

            tempMin:
                Number(document.getElementById("mostoTempMin").value),

            tempMax:
                Number(document.getElementById("mostoTempMax").value),

            nivelMin:
                Number(document.getElementById("mostoNivelMin").value)
        },


        coccion: {

            tempMin:
                Number(document.getElementById("coccionTempMin").value),

            tempMax:
                Number(document.getElementById("coccionTempMax").value),

            nivelMin:
                Number(document.getElementById("coccionNivelMin").value)
        },


        flujo: {

            min:
                Number(document.getElementById("flujoMin").value),

            max:
                Number(document.getElementById("flujoMax").value)
        }

    };
}

function validarConfiguracion(config) {

    if (!config.nombre.trim()) {

        Swal.fire(
            "Falta información",
            "Ingresá un nombre para la cerveza.",
            "warning"
        );

        return false;
    }


    if (config.agua.tempMin >= config.agua.tempMax) {

        Swal.fire(
            "Rango incorrecto",
            "La temperatura mínima del tanque de agua debe ser menor que la máxima.",
            "warning"
        );

        return false;
    }


    if (config.mosto.tempMin >= config.mosto.tempMax) {

        Swal.fire(
            "Rango incorrecto",
            "La temperatura mínima del tanque de mosto debe ser menor que la máxima.",
            "warning"
        );

        return false;
    }


    if (config.coccion.tempMin >= config.coccion.tempMax) {

        Swal.fire(
            "Rango incorrecto",
            "La temperatura mínima del tanque de cocción debe ser menor que la máxima.",
            "warning"
        );

        return false;
    }


    if (config.flujo.min >= config.flujo.max) {

        Swal.fire(
            "Rango incorrecto",
            "El flujo mínimo debe ser menor que el máximo.",
            "warning"
        );

        return false;
    }


    return true;
}

function guardarConfiguracion() {

    const config = obtenerConfiguracion();

    if (!validarConfiguracion(config)) {
        return;
    }

    localStorage.setItem(
        "configuracionCerveza",
        JSON.stringify(config)
    );


    Swal.fire({

        icon: "success",

        title: "Configuración guardada",

        text: "Los parámetros de producción fueron guardados.",

        confirmButtonText: "Aceptar"

    });
}

function eliminarReceta() {

    const tipo =
        document.getElementById("tipoCerveza").value;

    if (tipo === "custom") {
        return;
    }


    Swal.fire({

        title: "¿Eliminar receta?",

        text: "Esta acción no se puede deshacer.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Eliminar",

        cancelButtonText: "Cancelar",

        confirmButtonColor: "#dc3545"

    }).then((resultado) => {

        if (resultado.isConfirmed) {

            delete recetas[tipo];

            document
                .querySelector(`#tipoCerveza option[value="${tipo}"]`)
                ?.remove();

            limpiarFormulario();


            Swal.fire(
                "Eliminada",
                "La receta fue eliminada.",
                "success"
            );
        }

    });
}

function cancelarCambios() {

    Swal.fire({

        title: "¿Descartar cambios?",

        text: "Los valores modificados no serán guardados.",

        icon: "question",

        showCancelButton: true,

        confirmButtonText: "Descartar",

        cancelButtonText: "Continuar editando"

    }).then((resultado) => {

        if (resultado.isConfirmed) {

            cargarReceta();

        }

    });
}

document.addEventListener(
    "DOMContentLoaded",
    cargarReceta
);

