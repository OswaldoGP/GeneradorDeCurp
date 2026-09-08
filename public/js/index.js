document.addEventListener("DOMContentLoaded", () => {

    const btnGenerar = document.getElementById("btn-generar");
    const btnLimpiar = document.getElementById("btn-limpiar");
    const formCurp = document.getElementById("form-curp");

    if (btnGenerar) {
        btnGenerar.addEventListener("click", generarCURP);
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", limpiarFormulario);
    }

    if (formCurp) {
        formCurp.addEventListener("submit", (e) => {
            e.preventDefault();
            generarCURP();
        });
    }

});


/* ============================================================
   PALABRAS INCONVENIENTES
   ============================================================ */

const PALABRAS_INCONVENIENTES = [
    "BACA", "BAKA", "BUEI", "BUEY",
    "CACA", "CACO", "CAGA", "CAGO", "CAKA", "CAKO",
    "COGE", "COGI", "COJA", "COJE", "COJI", "COJO",
    "COLA", "CULO",
    "FALO", "FETO",
    "GETA", "GUEI", "GUEY",
    "JETA", "JOTO",
    "KACA", "KACO", "KAGA", "KAGO", "KAKA", "KAKO",
    "KOGE", "KOGI", "KOJA", "KOJE", "KOJI", "KOJO",
    "KOLA", "KULO",
    "LILO", "LOCA", "LOCO", "LOKA", "LOKO",
    "MAME", "MAMO", "MEAR", "MEAS", "MEON", "MIAR",
    "MION", "MOCO", "MOKO", "MULA", "MULO",
    "NACA", "NACO",
    "PEDA", "PEDO", "PENE", "PIPI", "PITO", "POPO",
    "PUTA", "PUTO",
    "QULO",
    "RATA", "ROBA", "ROBE", "ROBO", "RUIN",
    "SENO",
    "TETA",
    "VACA", "VAGA", "VAGO", "VAKA",
    "VUEI", "VUEY",
    "WUEI", "WUEY"
];


/* ============================================================
   PARTICULAS QUE NO SE CONSIDERAN
   ============================================================ */

const PARTICULAS = [
    "DE",
    "DEL",
    "LA",
    "LAS",
    "LOS",
    "Y",
    "MC",
    "MAC",
    "VON",
    "VAN",
    "SAN",
    "SANTA",
    "DA",
    "DAS",
    "DER",
    "DI",
    "DIE",
    "DD",
    "EL",
    "LE",
    "LES"
];


/* ============================================================
   ENTIDADES FEDERATIVAS
   ============================================================ */

const ENTIDADES = {
    AS: "AGUASCALIENTES",
    BC: "BAJA CALIFORNIA",
    BS: "BAJA CALIFORNIA SUR",
    CC: "CAMPECHE",
    CS: "CHIAPAS",
    CH: "CHIHUAHUA",
    CL: "COAHUILA",
    CM: "COLIMA",
    DF: "CIUDAD DE MEXICO",
    DG: "DURANGO",
    GT: "GUANAJUATO",
    GR: "GUERRERO",
    HG: "HIDALGO",
    JC: "JALISCO",
    MC: "MEXICO",
    MN: "MICHOACAN",
    MS: "MORELOS",
    NT: "NAYARIT",
    NL: "NUEVO LEON",
    OC: "OAXACA",
    PL: "PUEBLA",
    QT: "QUERETARO",
    QR: "QUINTANA ROO",
    SP: "SAN LUIS POTOSI",
    SL: "SINALOA",
    SR: "SONORA",
    TC: "TABASCO",
    TL: "TLAXCALA",
    VZ: "VERACRUZ",
    YN: "YUCATAN",
    ZS: "ZACATECAS",
    NE: "NACIDO EN EL EXTRANJERO"
};


/* ============================================================
   GENERAR CURP
   ============================================================ */

function generarCURP() {

    const nombresInput =
        document.getElementById("nombre")?.value || "";

    const apellidoPaternoInput =
        document.getElementById("primer-apellido")?.value || "";

    const apellidoMaternoInput =
        document.getElementById("segundo-apellido")?.value || "";

    const fechaNacimiento =
        document.getElementById("fecha-nacimiento")?.value || "";

    const sexo =
        document.getElementById("sexo")?.value || "";

    const estado =
        document.getElementById("estado")?.value || "";


    /* --------------------------------------------------------
       VALIDACIÓN DE CAMPOS
       -------------------------------------------------------- */

    if (
        !nombresInput.trim() ||
        !apellidoPaternoInput.trim() ||
        !fechaNacimiento ||
        !sexo ||
        !estado
    ) {
        mostrarError("Completa todos los campos obligatorios.");
        return;
    }


    /* --------------------------------------------------------
       NORMALIZAR INFORMACIÓN
       -------------------------------------------------------- */

    const nombreLimpio = filtrarNombre(nombresInput);

    const paternoLimpio =
        limpiarApellido(apellidoPaternoInput);

    const maternoLimpio =
        apellidoMaternoInput.trim()
            ? limpiarApellido(apellidoMaternoInput)
            : "";


    if (!nombreLimpio) {
        mostrarError("El nombre no es válido.");
        return;
    }

    if (!paternoLimpio) {
        mostrarError("El primer apellido no es válido.");
        return;
    }


    /* --------------------------------------------------------
       VALIDAR FECHA
       -------------------------------------------------------- */

    const fecha = obtenerFechaValida(fechaNacimiento);

    if (!fecha) {
        mostrarError("La fecha de nacimiento no es válida.");
        return;
    }


    /* --------------------------------------------------------
       VALIDAR SEXO
       -------------------------------------------------------- */

    const sexoChar = sexo.toUpperCase();

    if (!["H", "M"].includes(sexoChar)) {
        mostrarError("El sexo debe ser H o M.");
        return;
    }


    /* --------------------------------------------------------
       VALIDAR ENTIDAD
       -------------------------------------------------------- */

    const estadoChar = estado.toUpperCase();

    if (!ENTIDADES[estadoChar]) {
        mostrarError("La entidad federativa seleccionada no es válida.");
        return;
    }


    /* ========================================================
       POSICIONES 1 - 4
       ======================================================== */

    // Primera letra del apellido paterno
    const c1 = obtenerPrimeraLetra(paternoLimpio);

    // Primera vocal interna del apellido paterno
    const c2 = primeraVocalInterna(paternoLimpio);

    // Primera letra del apellido materno
    const c3 = maternoLimpio
        ? obtenerPrimeraLetra(maternoLimpio)
        : "X";

    // Primera letra del nombre
    const c4 = obtenerPrimeraLetra(nombreLimpio);


    let primerasCuatro = `${c1}${c2}${c3}${c4}`;


    /* --------------------------------------------------------
       PALABRAS INCONVENIENTES
       -------------------------------------------------------- */

    if (PALABRAS_INCONVENIENTES.includes(primerasCuatro)) {

        primerasCuatro =
            `${c1}X${c3}${c4}`;
    }


    /* ========================================================
       POSICIONES 5 - 10
       ======================================================== */

    const anio = fecha.anio;
    const mes = fecha.mes;
    const dia = fecha.dia;

    const fechaCURP =
        `${anio.substring(2, 4)}${mes}${dia}`;


    /* ========================================================
       POSICIONES 11 - 16
       ======================================================== */

    const consonantePaterno =
        primeraConsonanteInterna(paternoLimpio);

    const consonanteMaterno =
        maternoLimpio
            ? primeraConsonanteInterna(maternoLimpio)
            : "X";

    const consonanteNombre =
        primeraConsonanteInterna(nombreLimpio);


    /* ========================================================
       POSICIÓN 17
       DIFERENCIADOR DE SIGLO
       ======================================================== */

    const anioNumero = Number(anio);

    let diferenciadorSiglo;

    if (anioNumero >= 2000) {
        diferenciadorSiglo = "A";
    } else {
        diferenciadorSiglo = "0";
    }


    /* ========================================================
       CONSTRUIR CURP DE 17 CARACTERES
       ======================================================== */

    const curp17 =
        `${primerasCuatro}` +
        `${fechaCURP}` +
        `${sexoChar}` +
        `${estadoChar}` +
        `${consonantePaterno}` +
        `${consonanteMaterno}` +
        `${consonanteNombre}` +
        `${diferenciadorSiglo}`;


    /* ========================================================
       POSICIÓN 18
       DÍGITO VERIFICADOR
       ======================================================== */

    const digitoVerificador =
        calcularDigitoVerificador(curp17);


    /* ========================================================
       CURP FINAL
       ======================================================== */

    const curpFinal =
        `${curp17}${digitoVerificador}`;


    /* --------------------------------------------------------
       MOSTRAR RESULTADO
       -------------------------------------------------------- */

    mostrarResultado(curpFinal);
}


/* ============================================================
   NORMALIZAR TEXTO
   ============================================================ */

function normalizar(texto) {

    if (!texto) {
        return "";
    }

    return texto
        .trim()
        .toUpperCase()

        // Preservar Ñ
        .replace(/Ñ/g, "__ENIE__")

        // Eliminar acentos
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

        // Restaurar Ñ
        .replace(/__ENIE__/g, "Ñ")

        // Eliminar caracteres no necesarios
        .replace(/[.'´']/g, "")

        // Cualquier cosa que no sea letra o espacio
        .replace(/[^A-ZÑ\s]/g, " ")

        // Evitar espacios dobles
        .replace(/\s+/g, " ")

        .trim();
}


/* ============================================================
   LIMPIAR APELLIDO
   ============================================================ */

function limpiarApellido(apellido) {

    const texto = normalizar(apellido);

    if (!texto) {
        return "";
    }

    const palabras =
        texto
            .split(/\s+/)
            .filter(Boolean);

    /*
     * Buscamos el primer elemento que NO sea una
     * partícula.
     *
     * Ejemplo:
     *
     * DE LA ROSA
     *
     * se convierte en:
     *
     * ROSA
     */

    const palabraPrincipal =
        palabras.find(
            palabra => !PARTICULAS.includes(palabra)
        );

    return palabraPrincipal || "";
}


/* ============================================================
   FILTRAR NOMBRE
   ============================================================ */

function filtrarNombre(nombreCompleto) {

    const texto = normalizar(nombreCompleto);

    if (!texto) {
        return "";
    }

    const palabras =
        texto
            .split(/\s+/)
            .filter(Boolean)
            .filter(
                palabra => !PARTICULAS.includes(palabra)
            );


    if (palabras.length === 0) {
        return "";
    }


    /*
     * REGLA ESPECIAL
     *
     * Si el primer nombre es:
     *
     * MARIA
     * MARÍA
     * JOSE
     * JOSÉ
     *
     * y existe otro nombre,
     * se utiliza el segundo.
     */

    const primerNombre = palabras[0];

    if (
        palabras.length > 1 &&
        ["MARIA", "MA", "JOSE", "J"]
            .includes(primerNombre)
    ) {
        return palabras[1];
    }


    return primerNombre;
}


/* ============================================================
   PRIMERA LETRA
   ============================================================ */

function obtenerPrimeraLetra(palabra) {

    if (!palabra) {
        return "X";
    }

    const letra = palabra.charAt(0);

    // Ñ se sustituye por X
    if (letra === "Ñ") {
        return "X";
    }

    return /^[A-Z]$/.test(letra)
        ? letra
        : "X";
}


/* ============================================================
   PRIMERA VOCAL INTERNA
   ============================================================ */

function primeraVocalInterna(palabra) {

    if (!palabra) {
        return "X";
    }

    for (let i = 1; i < palabra.length; i++) {

        const letra = palabra.charAt(i);

        if ("AEIOU".includes(letra)) {
            return letra;
        }
    }

    return "X";
}


/* ============================================================
   PRIMERA CONSONANTE INTERNA
   ============================================================ */

function primeraConsonanteInterna(palabra) {

    if (!palabra) {
        return "X";
    }

    for (let i = 1; i < palabra.length; i++) {

        const letra = palabra.charAt(i);

        // Ñ no se utiliza como consonante interna
        if (letra === "Ñ") {
            return "X";
        }

        if (/^[B-DF-HJ-NP-TV-Z]$/.test(letra)) {
            return letra;
        }
    }

    return "X";
}


/* ============================================================
   VALIDAR FECHA
   ============================================================ */

function obtenerFechaValida(fechaString) {

    /*
     * El input type="date" entrega:
     *
     * YYYY-MM-DD
     */

    const partes = fechaString.split("-");

    if (partes.length !== 3) {
        return null;
    }

    const [anio, mes, dia] = partes;

    const anioNumero = Number(anio);
    const mesNumero = Number(mes);
    const diaNumero = Number(dia);


    if (
        !/^\d{4}$/.test(anio) ||
        !/^\d{2}$/.test(mes) ||
        !/^\d{2}$/.test(dia)
    ) {
        return null;
    }


    /*
     * Comprobar que la fecha realmente exista.
     */

    const fecha = new Date(
        anioNumero,
        mesNumero - 1,
        diaNumero
    );


    if (
        fecha.getFullYear() !== anioNumero ||
        fecha.getMonth() !== mesNumero - 1 ||
        fecha.getDate() !== diaNumero
    ) {
        return null;
    }


    /*
     * No permitir fechas futuras.
     */

    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    if (fecha > hoy) {
        return null;
    }


    return {
        anio,
        mes,
        dia
    };
}


/* ============================================================
   DÍGITO VERIFICADOR
   ============================================================ */

function calcularDigitoVerificador(curp17) {

    /*
     * Tabla oficial de valores:
     *
     * 0-9 = 0-9
     * A-Z = 10-36
     *
     * incluyendo Ñ
     */

    const diccionario =
        "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";


    let suma = 0;


    for (let i = 0; i < 17; i++) {

        const caracter = curp17.charAt(i);

        const valor =
            diccionario.indexOf(caracter);


        if (valor === -1) {
            throw new Error(
                `Carácter inválido en CURP: ${caracter}`
            );
        }


        /*
         * Factor:
         *
         * posición 1  -> 18
         * posición 2  -> 17
         * ...
         * posición 17 -> 2
         */

        const factor = 18 - i;

        suma += valor * factor;
    }


    const residuo = suma % 10;

    const digito =
        (10 - residuo) % 10;


    return digito.toString();
}


/* ============================================================
   MOSTRAR RESULTADO
   ============================================================ */

function mostrarResultado(curp) {

    const contenedorResultado =
        document.getElementById("resultado");

    const spanCurp =
        document.getElementById("curp-calculada");


    if (contenedorResultado && spanCurp) {

        spanCurp.textContent = curp;

        contenedorResultado.classList.remove("d-none");
    }
}


/* ============================================================
   MOSTRAR ERROR
   ============================================================ */

function mostrarError(mensaje) {

    alert(mensaje);
}


/* ============================================================
   LIMPIAR FORMULARIO
   ============================================================ */

function limpiarFormulario() {

    const form =
        document.getElementById("form-curp");

    if (form) {
        form.reset();
    }


    const contenedorResultado =
        document.getElementById("resultado");

    const spanCurp =
        document.getElementById("curp-calculada");


    if (contenedorResultado) {
        contenedorResultado.classList.add("d-none");
    }

    if (spanCurp) {
        spanCurp.textContent = "";
    }
}