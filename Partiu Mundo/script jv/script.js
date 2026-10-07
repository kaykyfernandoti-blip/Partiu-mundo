"use strict";


function $(seletor, base = document) {
    return base.querySelector(seletor);
}

function apenasDigitos(texto) {
    return String(texto).replace(/\D/g, "");
}

function escapeHtml(texto) {
    const mapa = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(texto).replace(/[&<>"']/g, caractere => mapa[caractere]);
}

async function buscarJSON(url, tempoLimiteMs = 10000) {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), tempoLimiteMs);

    try {
        const resposta = await fetch(url, { signal: controlador.signal });
        if (!resposta.ok) {
            throw new Error("Erro HTTP " + resposta.status);
        }
        return await resposta.json();
    } finally {
        clearTimeout(temporizador);
    }
}

function dataHojeISO() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function formatarDataBR(iso) {
    if (!iso) return "";
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
}

function alertaHtml(tipo, mensagem) {
    return `<div class="alert alert-${tipo}" role="alert">${mensagem}</div>`;
}



const DESTINOS = {
    "rio": {
        nome: "Rio de Janeiro",
        latitude: -22.9068,
        longitude: -43.1729,
        descricao: "A Cidade Maravilhosa combina praias famosas, montanhas e muita cultura brasileira, do samba à gastronomia carioca.",
        destaques: [
            "Cristo Redentor e Pão de Açúcar",
            "Praias de Copacabana e Ipanema",
            "Trilhas na Floresta da Tijuca",
            "Samba, música e culinária local"
        ],
        epoca: "de maio a setembro, quando o clima costuma ser mais seco e ameno."
    },
    "paris": {
        nome: "Paris",
        latitude: 48.8566,
        longitude: 2.3522,
        descricao: "A Cidade Luz reúne museus, monumentos históricos e uma gastronomia que encanta viajantes do mundo todo.",
        destaques: [
            "Torre Eiffel e Arco do Triunfo",
            "Museu do Louvre",
            "Passeio de barco pelo Rio Sena",
            "Cafés, padarias e bistrôs"
        ],
        epoca: "de abril a junho e de setembro a outubro, com temperaturas agradáveis."
    },
    "buenos-aires": {
        nome: "Buenos Aires",
        latitude: -34.6037,
        longitude: -58.3816,
        descricao: "Uma cidade cheia de cultura, arquitetura europeia, gastronomia marcante e muito tango.",
        destaques: [
            "Bairro de La Boca e Caminito",
            "Shows e aulas de tango",
            "Livraria El Ateneo Grand Splendid",
            "Parrillas, empanadas e alfajores"
        ],
        epoca: "de março a maio e de setembro a novembro (outono e primavera)."
    },
    "toquio": {
        nome: "Tóquio",
        latitude: 35.6762,
        longitude: 139.6503,
        descricao: "Uma mistura fascinante entre tecnologia, tradição e cultura japonesa, com templos antigos ao lado de arranha-céus.",
        destaques: [
            "Templo Senso-ji, em Asakusa",
            "Cruzamento de Shibuya",
            "Parques floridos na época das cerejeiras",
            "Cultura pop em Akihabara"
        ],
        epoca: "de março a maio (cerejeiras) e de outubro a novembro (folhagem de outono)."
    },
    "sao-paulo": {
        nome: "São Paulo",
        latitude: -23.5505,
        longitude: -46.6333
    },
    "curitiba": {
        nome: "Curitiba",
        latitude: -25.4284,
        longitude: -49.2733
    }
};

const UFS = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
    "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];



function mascararCep(valor) {
    const digitos = apenasDigitos(valor).slice(0, 8);
    return digitos.length > 5 ? digitos.slice(0, 5) + "-" + digitos.slice(5) : digitos;
}

function mascararTelefone(valor) {
    const d = apenasDigitos(valor).slice(0, 11);

    if (d.length === 0) return "";
    if (d.length <= 2) return "(" + d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}



function validarNome(valor) {
    const nome = valor.trim();
    if (!nome) return "Informe o seu nome completo.";
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' .-]+$/.test(nome)) return "O nome deve conter apenas letras.";
    if (nome.length < 3) return "O nome deve ter pelo menos 3 letras.";
    if (nome.split(/\s+/).length < 2) return "Informe nome e sobrenome.";
    return "";
}

function validarEmail(valor) {
    const email = valor.trim();
    if (!email) return "Informe o seu e-mail.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Digite um e-mail válido, como nome@exemplo.com.";
    return "";
}

function validarTelefone(valor) {
    const digitos = apenasDigitos(valor);
    if (!digitos) return "Informe o seu telefone com DDD.";
    if (digitos.length < 10) return "Telefone incompleto. Use DDD + número, ex.: (11) 91234-5678.";
    if (Number(digitos.slice(0, 2)) < 11) return "DDD inválido.";
    if (digitos.length === 11 && digitos[2] !== "9") return "Celulares com 11 dígitos começam com 9 depois do DDD.";
    return "";
}

function validarCep(valor) {
    const digitos = apenasDigitos(valor);
    if (!digitos) return "Informe o CEP.";
    if (digitos.length < 8) return "CEP incompleto. Digite os 8 números.";
    if (/^0{8}$/.test(digitos)) return "CEP inválido.";
    return "";
}

function validarTextoObrigatorio(valor, nomeCampo, minimo) {
    const texto = valor.trim();
    if (!texto) return `Informe ${nomeCampo}.`;
    if (texto.length < minimo) return `Informe ${nomeCampo} com pelo menos ${minimo} letras.`;
    return "";
}

function validarNumero(valor) {
    const numero = valor.trim();
    if (!numero) return "Informe o número (ou S/N).";
    if (!/^(\d{1,6}[A-Za-z]?|s\/?n)$/i.test(numero)) return "Use apenas números (ex.: 123, 45B) ou S/N.";
    return "";
}

function validarUf(valor) {
    const uf = valor.trim().toUpperCase();
    if (!uf) return "Informe a UF.";
    if (!UFS.includes(uf)) return "UF inválida. Ex.: SP, RJ, MG.";
    return "";
}

function validarDestino(valor) {
    return valor ? "" : "Escolha um destino de interesse.";
}

function validarDataIda(valor) {
    if (!valor) return "Informe a data de ida.";
    if (valor < dataHojeISO()) return "A data de ida não pode estar no passado.";
    return "";
}

function validarDataVolta(valor) {
    if (!valor) return ""; // opcional
    if (valor < dataHojeISO()) return "A data de volta não pode estar no passado.";

    const ida = $("#dataIda") ? $("#dataIda").value : "";
    if (ida && valor < ida) return "A volta deve ser no mesmo dia ou depois da ida.";
    return "";
}

function validarPessoas(valor) {
    if (!String(valor).trim()) return "Informe a quantidade de pessoas.";
    const quantidade = Number(valor);
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 20) {
        return "Informe um número inteiro entre 1 e 20.";
    }
    return "";
}

const VALIDADORES = {
    nome: validarNome,
    email: validarEmail,
    telefone: validarTelefone,
    cep: validarCep,
    logradouro: valor => validarTextoObrigatorio(valor, "o logradouro", 3),
    numero: validarNumero,
    bairro: valor => validarTextoObrigatorio(valor, "o bairro", 2),
    cidadeCep: valor => validarTextoObrigatorio(valor, "a cidade", 2),
    uf: validarUf,
    destino: validarDestino,
    dataIda: validarDataIda,
    dataVolta: validarDataVolta,
    pessoas: validarPessoas
};

function marcarCampo(campo, mensagem) {
    const feedback = campo.parentElement.querySelector(".invalid-feedback");

    campo.classList.remove("is-valid", "is-invalid");

    if (mensagem) {
        campo.classList.add("is-invalid");
        campo.setAttribute("aria-invalid", "true");
        if (feedback) feedback.textContent = mensagem;
    } else {
        campo.removeAttribute("aria-invalid");
        if (campo.value.trim() !== "") campo.classList.add("is-valid");
    }
}

function limparMarcacao(campo) {
    campo.classList.remove("is-valid", "is-invalid");
    campo.removeAttribute("aria-invalid");
}

function validarCampo(id) {
    const campo = document.getElementById(id);
    const validador = VALIDADORES[id];
    if (!campo || !validador) return true;

    const mensagem = validador(campo.value);
    marcarCampo(campo, mensagem);
    return mensagem === "";
}

function validarFormulario() {
    let primeiroInvalido = null;

    Object.keys(VALIDADORES).forEach(id => {
        if (!validarCampo(id) && primeiroInvalido === null) {
            primeiroInvalido = id;
        }
    });

    return primeiroInvalido;
}

function mostrarAlertaForm(tipo, mensagemHtml) {
    const area = $("#alertaForm");
    if (!area) return;

    area.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensagemHtml}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        </div>`;
}

function mostrarStatusCep(mensagem, classe = "text-muted", carregando = false) {
    const status = $("#cepStatus");
    if (!status) return;

    status.className = "form-text " + classe;
    status.textContent = "";

    if (carregando) {
        const spinner = document.createElement("span");
        spinner.className = "spinner-border spinner-border-sm me-2";
        spinner.setAttribute("role", "status");
        spinner.setAttribute("aria-hidden", "true");
        status.appendChild(spinner);
    }

    status.appendChild(document.createTextNode(mensagem));
}

function limparFormulario() {
    const formulario = $("#formCadastro");
    if (!formulario) return;

    formulario.reset();
    Object.keys(VALIDADORES).forEach(id => {
        const campo = document.getElementById(id);
        if (campo) limparMarcacao(campo);
    });

    ultimoCepConsultado = "";
    enderecoAutomatico = false;
    mostrarStatusCep("");

    const area = $("#alertaForm");
    if (area) area.innerHTML = "";
}

function coletarDadosCadastro() {
    const selectDestino = $("#destino");

    return {
        nome: $("#nome").value.trim(),
        email: $("#email").value.trim(),
        telefone: $("#telefone").value.trim(),
        cep: $("#cep").value.trim(),
        logradouro: $("#logradouro").value.trim(),
        numero: $("#numero").value.trim(),
        bairro: $("#bairro").value.trim(),
        cidade: $("#cidadeCep").value.trim(),
        uf: $("#uf").value.trim().toUpperCase(),
        destino: selectDestino.options[selectDestino.selectedIndex].text,
        dataIda: $("#dataIda").value,
        dataVolta: $("#dataVolta").value,
        pessoas: $("#pessoas").value,
        observacoes: $("#mensagem").value.trim()
    };
}

function mostrarConfirmacao(dados) {
    const modalEl = $("#modalConfirmacao");
    if (!modalEl) return;

    $("#confirmacaoNome").textContent = dados.nome.split(/\s+/)[0];

    const periodo = dados.dataVolta
        ? `${formatarDataBR(dados.dataIda)} a ${formatarDataBR(dados.dataVolta)}`
        : `Ida em ${formatarDataBR(dados.dataIda)}`;

    const linhas = [
        ["Destino", dados.destino],
        ["Período", periodo],
        ["Pessoas", dados.pessoas],
        ["E-mail", dados.email],
        ["Telefone", dados.telefone],
        ["Endereço", `${dados.logradouro}, ${dados.numero} - ${dados.bairro}, ${dados.cidade}/${dados.uf} (CEP ${dados.cep})`]
    ];

    const lista = $("#confirmacaoResumo");
    lista.textContent = "";

    linhas.forEach(([rotulo, valor]) => {
        const item = document.createElement("li");
        item.className = "list-group-item d-flex flex-column flex-sm-row justify-content-between gap-1";

        const titulo = document.createElement("strong");
        titulo.textContent = rotulo;

        const texto = document.createElement("span");
        texto.className = "text-sm-end";
        texto.textContent = valor;

        item.append(titulo, texto);
        lista.appendChild(item);
    });

    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

function enviarCadastro(evento) {
    evento.preventDefault();

    const primeiroInvalido = validarFormulario();

    if (primeiroInvalido) {
        mostrarAlertaForm("danger", "<strong>Ops!</strong> Corrija os campos destacados em vermelho e tente novamente.");
        document.getElementById(primeiroInvalido).focus();
        return;
    }

    const dados = coletarDadosCadastro();

    limparFormulario();
    mostrarAlertaForm("success", "<strong>Cadastro realizado com sucesso!</strong> Nossa equipe entrará em contato em breve.");
    mostrarConfirmacao(dados);
}

function selecionarDestinoCadastro(chave) {
    const select = $("#destino");
    if (!select || !chave) return;

    const existe = Array.from(select.options).some(opcao => opcao.value === chave);
    if (existe) {
        select.value = chave;
        marcarCampo(select, "");
    }
}

function configurarFormulario() {
    const formulario = $("#formCadastro");
    if (!formulario) return;

    const hoje = dataHojeISO();
    $("#dataIda").min = hoje;
    $("#dataVolta").min = hoje;

    formulario.addEventListener("submit", enviarCadastro);
    $("#btnLimpar").addEventListener("click", limparFormulario);

    Object.keys(VALIDADORES).forEach(id => {
        const campo = document.getElementById(id);
        if (!campo) return;

        const evento = campo.tagName === "SELECT" ? "change" : "blur";
        campo.addEventListener(evento, () => {
            if (id !== "cep") validarCampo(id);
        });

        campo.addEventListener("input", () => {
            if (id !== "cep" && (campo.classList.contains("is-invalid") || campo.classList.contains("is-valid"))) {
                validarCampo(id);
            }
        });
    });

    $("#dataIda").addEventListener("change", () => {
        if ($("#dataVolta").value) validarCampo("dataVolta");
    });

    $("#telefone").addEventListener("input", evento => {
        evento.target.value = mascararTelefone(evento.target.value);
    });

    $("#uf").addEventListener("input", evento => {
        evento.target.value = evento.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
    });

    configurarCep();

    // Vindo de serviços.html?destino=...
    const destinoUrl = new URLSearchParams(window.location.search).get("destino");
    selecionarDestinoCadastro(destinoUrl);
}


let ultimoCepConsultado = "";
let enderecoAutomatico = false;

const CAMPOS_ENDERECO = ["logradouro", "bairro", "cidadeCep", "uf"];

function limparEnderecoAutomatico() {
    if (!enderecoAutomatico) return;

    CAMPOS_ENDERECO.forEach(id => {
        const campo = document.getElementById(id);
        campo.value = "";
        limparMarcacao(campo);
    });
    enderecoAutomatico = false;
}

async function consultarCep() {
    const campoCep = $("#cep");
    const digitos = apenasDigitos(campoCep.value);

    const erro = validarCep(campoCep.value);
    if (erro) {
        marcarCampo(campoCep, erro);
        mostrarStatusCep("");
        return;
    }

    if (digitos === ultimoCepConsultado) return; 
    ultimoCepConsultado = digitos;

    marcarCampo(campoCep, "");
    mostrarStatusCep("Buscando endereço...", "text-muted", true);

    try {
        const dados = await buscarJSON(`https://viacep.com.br/ws/${digitos}/json/`);

        if (apenasDigitos(campoCep.value) !== digitos) return;

        if (dados.erro) {
            limparEnderecoAutomatico();
            marcarCampo(campoCep, "CEP não encontrado. Confira os números ou preencha o endereço manualmente.");
            mostrarStatusCep("");
            return;
        }

        $("#logradouro").value = dados.logradouro || "";
        $("#bairro").value = dados.bairro || "";
        $("#cidadeCep").value = dados.localidade || "";
        $("#uf").value = (dados.uf || "").toUpperCase();
        enderecoAutomatico = true;

        CAMPOS_ENDERECO.forEach(id => {
            const campo = document.getElementById(id);
            if (campo.value.trim() !== "") {
                validarCampo(id);
            } else {
                limparMarcacao(campo);
            }
        });

        marcarCampo(campoCep, "");

        if (!dados.logradouro) {
            mostrarStatusCep("CEP encontrado, mas sem rua específica. Preencha o logradouro e o número.", "text-warning-emphasis");
            $("#logradouro").focus();
        } else {
            mostrarStatusCep("Endereço encontrado! Agora informe o número.", "text-success");
            $("#numero").focus();
        }

    } catch (erroConsulta) {
        ultimoCepConsultado = "";
        marcarCampo(campoCep, "Não foi possível consultar o CEP agora. Verifique sua conexão ou preencha o endereço manualmente.");
        mostrarStatusCep("");
    }
}

function configurarCep() {
    const campoCep = $("#cep");

    campoCep.addEventListener("input", evento => {
        evento.target.value = mascararCep(evento.target.value);

        const digitos = apenasDigitos(evento.target.value);

        if (digitos.length === 8) {
            consultarCep();               
            return;
        }

        ultimoCepConsultado = "";
        mostrarStatusCep("");
        if (campoCep.classList.contains("is-invalid") || campoCep.classList.contains("is-valid")) {
            marcarCampo(campoCep, validarCep(campoCep.value));
        }
    });

    campoCep.addEventListener("blur", consultarCep);
}

const CODIGOS_CLIMA = {
    0: ["Céu limpo", "☀️"],
    1: ["Predominantemente limpo", "🌤️"],
    2: ["Parcialmente nublado", "⛅"],
    3: ["Nublado", "☁️"],
    45: ["Neblina", "🌫️"],
    48: ["Neblina com geada", "🌫️"],
    51: ["Garoa fraca", "🌦️"],
    53: ["Garoa moderada", "🌦️"],
    55: ["Garoa intensa", "🌦️"],
    56: ["Garoa congelante", "🌧️"],
    57: ["Garoa congelante intensa", "🌧️"],
    61: ["Chuva fraca", "🌧️"],
    63: ["Chuva moderada", "🌧️"],
    65: ["Chuva forte", "🌧️"],
    66: ["Chuva congelante", "🌧️"],
    67: ["Chuva congelante forte", "🌧️"],
    71: ["Neve fraca", "🌨️"],
    73: ["Neve moderada", "🌨️"],
    75: ["Neve forte", "❄️"],
    77: ["Grãos de neve", "🌨️"],
    80: ["Pancadas de chuva fracas", "🌦️"],
    81: ["Pancadas de chuva", "🌧️"],
    82: ["Pancadas de chuva fortes", "⛈️"],
    85: ["Pancadas de neve", "🌨️"],
    86: ["Pancadas de neve fortes", "❄️"],
    95: ["Trovoada", "⛈️"],
    96: ["Trovoada com granizo", "⛈️"],
    99: ["Trovoada com granizo forte", "⛈️"]
};

function descreverClima(codigo) {
    return CODIGOS_CLIMA[codigo] || ["Condição não identificada", "🌡️"];
}

async function buscarCoordenadas(nomeCidade) {
    const url = "https://geocoding-api.open-meteo.com/v1/search"
        + `?name=${encodeURIComponent(nomeCidade)}&count=1&language=pt&format=json`;

    const dados = await buscarJSON(url);
    if (!dados.results || dados.results.length === 0) return null;

    const local = dados.results[0];
    let nome = local.name;
    if (local.admin1 && local.admin1 !== local.name) nome += ", " + local.admin1;
    if (local.country) nome += " - " + local.country;

    return { nome, latitude: local.latitude, longitude: local.longitude };
}

async function buscarPrevisao(latitude, longitude) {
    const url = "https://api.open-meteo.com/v1/forecast"
        + `?latitude=${latitude}&longitude=${longitude}`
        + "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m"
        + "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
        + "&timezone=auto&forecast_days=5";

    const dados = await buscarJSON(url);
    if (!dados.current || !dados.daily) {
        throw new Error("Resposta inesperada da API de clima");
    }
    return dados;
}

function montarDiaHtml(dados, indice) {
    const diario = dados.daily;
    const [ano, mes, dia] = diario.time[indice].split("-").map(Number);
    const data = new Date(ano, mes - 1, dia); 

    const nomeDia = indice === 0
        ? "Hoje"
        : data.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
    const dataCurta = `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}`;

    const [descricao, icone] = descreverClima(diario.weather_code[indice]);
    const maxima = Math.round(diario.temperature_2m_max[indice]);
    const minima = Math.round(diario.temperature_2m_min[indice]);
    const chuva = diario.precipitation_probability_max
        ? diario.precipitation_probability_max[indice]
        : null;
    const textoChuva = chuva === null || chuva === undefined ? "—" : chuva + "%";

    return `
        <div class="col-4 col-md">
            <div class="clima-dia" title="${escapeHtml(descricao)}">
                <span class="dia-nome">${escapeHtml(nomeDia)}</span>
                <span class="dia-data">${dataCurta}</span>
                <span class="dia-icone" aria-hidden="true">${icone}</span>
                <strong>${maxima}°</strong> <span class="text-white-50">${minima}°</span>
                <span class="dia-chuva">💧 ${textoChuva}</span>
            </div>
        </div>`;
}

function montarClimaHtml(local, dados) {
    const atual = dados.current;
    const [descricao, icone] = descreverClima(atual.weather_code);

    const dias = dados.daily.time
        .map((_, indice) => montarDiaHtml(dados, indice))
        .join("");

    return `
        <div class="resultado-tempo">
            <div class="row align-items-center g-3">

                <div class="col-12 col-md-5 text-center text-md-start">
                    <p class="clima-local mb-1">📍 ${escapeHtml(local.nome)}</p>
                    <div class="clima-temp">${icone} ${Math.round(atual.temperature_2m)}°C</div>
                    <p class="clima-desc mb-0">${escapeHtml(descricao)}</p>
                </div>

                <div class="col-12 col-md-7">
                    <div class="row g-2 text-center">
                        <div class="col-4">
                            <div class="clima-info"><span>Sensação</span><strong>${Math.round(atual.apparent_temperature)}°C</strong></div>
                        </div>
                        <div class="col-4">
                            <div class="clima-info"><span>Umidade</span><strong>${Math.round(atual.relative_humidity_2m)}%</strong></div>
                        </div>
                        <div class="col-4">
                            <div class="clima-info"><span>Vento</span><strong>${Math.round(atual.wind_speed_10m)} km/h</strong></div>
                        </div>
                    </div>
                </div>

            </div>

            <hr class="clima-linha">

            <p class="clima-subtitulo">Previsão para os próximos dias</p>
            <div class="row g-2">${dias}</div>

            <p class="clima-fonte">Dados: Open-Meteo.com</p>
        </div>`;
}

async function consultarClima() {
    const select = $("#selectDestinoClima");
    const campoCidade = $("#inputOutraCidade");
    const resultado = $("#resultadoClima");
    const botao = $("#btnClima");
    if (!select || !campoCidade || !resultado || !botao) return;

    const textoBusca = campoCidade.value.trim();

    if (!textoBusca && !select.value) {
        resultado.innerHTML = alertaHtml("warning", "Selecione um destino ou digite o nome de uma cidade.");
        return;
    }

    botao.disabled = true;
    resultado.innerHTML = `
        <div class="resultado-tempo text-center">
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Consultando previsão...
        </div>`;

    try {
        let local;

        if (textoBusca) {
            local = await buscarCoordenadas(textoBusca);
            if (!local) {
                resultado.innerHTML = alertaHtml("warning",
                    `Não encontramos a cidade "${escapeHtml(textoBusca)}". Confira o nome e tente novamente.`);
                return;
            }
        } else {
            local = DESTINOS[select.value];
        }

        const dados = await buscarPrevisao(local.latitude, local.longitude);
        resultado.innerHTML = montarClimaHtml(local, dados);

    } catch (erro) {
        resultado.innerHTML = alertaHtml("danger",
            "Não foi possível consultar a previsão agora. Verifique sua conexão e tente novamente.");
    } finally {
        botao.disabled = false;
    }
}

function configurarClima() {
    const botao = $("#btnClima");
    const select = $("#selectDestinoClima");
    const campoCidade = $("#inputOutraCidade");
    if (!botao || !select || !campoCidade) return;

    botao.addEventListener("click", consultarClima);

    select.addEventListener("change", () => {
        if (select.value) campoCidade.value = "";
    });

    campoCidade.addEventListener("input", () => {
        if (campoCidade.value.trim()) select.value = "";
    });

    campoCidade.addEventListener("keydown", evento => {
        if (evento.key === "Enter") {
            evento.preventDefault();
            consultarClima();
        }
    });

    const destinoUrl = new URLSearchParams(window.location.search).get("destino");
    if (destinoUrl && DESTINOS[destinoUrl]) {
        select.value = destinoUrl;
        consultarClima();
    }
}


function preencherLista(lista, itens) {
    lista.textContent = "";
    itens.forEach(texto => {
        const item = document.createElement("li");
        item.textContent = texto;
        lista.appendChild(item);
    });
}

function configurarModalDestino() {
    const modalEl = $("#modalDestino");
    if (!modalEl) return;

    let chaveAtual = null;

    modalEl.addEventListener("show.bs.modal", evento => {
        const botao = evento.relatedTarget;
        if (!botao || !botao.dataset.destino) return;

        chaveAtual = botao.dataset.destino;
        const info = DESTINOS[chaveAtual];
        if (!info) return;

        const cartao = botao.closest(".card");
        const imagem = cartao ? cartao.querySelector("img") : null;

        $("#modalDestinoTitulo").textContent = info.nome;
        $("#modalDestinoDescricao").textContent = info.descricao;
        $("#modalDestinoEpoca").textContent = info.epoca;
        preencherLista($("#modalDestinoLista"), info.destaques);

        const img = $("#modalDestinoImg");
        if (imagem) {
            img.src = imagem.src;
            img.alt = imagem.alt;
        }
    });

    $("#modalDestinoCadastro").addEventListener("click", () => {
        if (chaveAtual) window.location.href = "cadastro.html?destino=" + encodeURIComponent(chaveAtual);
    });

    $("#modalDestinoClima").addEventListener("click", () => {
        if (chaveAtual) window.location.href = "clima.html?destino=" + encodeURIComponent(chaveAtual);
    });
}

function configurarModalServico() {
    const modalEl = $("#modalServico");
    if (!modalEl) return;

    modalEl.addEventListener("show.bs.modal", evento => {
        const botao = evento.relatedTarget;
        if (!botao) return;

        $("#modalServicoIcone").textContent = botao.dataset.icone || "";
        $("#modalServicoTitulo").textContent = botao.dataset.titulo || "Serviço";
        $("#modalServicoTexto").textContent = botao.dataset.texto || "";
        preencherLista($("#modalServicoLista"), (botao.dataset.itens || "").split("|").filter(Boolean));
    });
}

function configurarNavbar() {
    const menu = $("#menu");
    if (!menu) return;

    document.querySelectorAll("#menu .nav-link").forEach(link => {
        link.addEventListener("click", () => {
            if (menu.classList.contains("show")) {
                bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
            }
        });
    });
}

function atualizarAno() {
    const ano = $("#anoAtual");
    if (ano) ano.textContent = new Date().getFullYear();
}


document.addEventListener("DOMContentLoaded", () => {
    atualizarAno();
    configurarNavbar();
    configurarFormulario();
    configurarClima();
    configurarModalDestino();
    configurarModalServico();
});
