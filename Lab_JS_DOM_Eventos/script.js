// ============================================================
// Função auxiliar reutilizada nas etapas 3, 4 e 5:
// valida o formato básico de e-mail (texto@dominio.ext)
// ============================================================
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function emailValido(valor) {
    return regexEmail.test(valor.trim());
}

// Mostra uma mensagem num <p> trocando a classe de cor
function mostrarMensagem(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.classList.remove("erro-texto", "ok-texto", "info-texto");
    if (tipo) elemento.classList.add(tipo + "-texto");
}


// ============================================================
// ETAPA 1 — input: espelho + contador (máx. 50)
// A cada digitação atualiza o espelho e o contador.
// Se passar de 50 caracteres, o campo fica vermelho.
// ============================================================
const nome1 = document.getElementById("nome1");
const espelho1 = document.getElementById("espelho1");
const contador1 = document.getElementById("contador1");
const LIMITE = 50;

nome1.addEventListener("input", (e) => {
    const valor = e.target.value;
    const excedeu = valor.length > LIMITE;

    espelho1.textContent = "Você digitou: " + valor; // textContent evita injeção de HTML
    contador1.textContent = valor.length + "/" + LIMITE;

    nome1.classList.toggle("erro", excedeu);
    contador1.classList.toggle("excedido", excedeu);
});


// ============================================================
// ETAPA 2 — change: select dependente (Estado → Cidade)
// O select de cidade começa desabilitado e é preenchido
// dinamicamente com createElement + append.
// ============================================================
const cidadesPorUF = {
    SP: ["Campinas", "São Paulo", "Santos", "Ribeirão Preto"],
    RJ: ["Rio de Janeiro", "Niterói", "Petrópolis"],
    MG: ["Belo Horizonte", "Uberlândia", "Ouro Preto"]
};

const ufSel = document.getElementById("estado");
const cidSel = document.getElementById("cidade");

ufSel.addEventListener("change", () => {
    const uf = ufSel.value;

    // Limpa as opções anteriores e cria a opção inicial
    cidSel.innerHTML = "";
    const inicial = document.createElement("option");
    inicial.value = "";
    inicial.textContent = uf ? "Selecione uma cidade" : "Escolha o estado primeiro";
    cidSel.append(inicial);

    // Sem estado escolhido, mantém a cidade desabilitada
    cidSel.disabled = !uf;
    if (!uf) return;

    cidadesPorUF[uf].forEach((cidade) => {
        const opt = document.createElement("option");
        opt.value = cidade;
        opt.textContent = cidade;
        cidSel.append(opt);
    });
});


// ============================================================
// ETAPA 3 — focus e blur no e-mail
// focus: campo fica azul e mostra uma dica.
// blur: valida o formato e mostra mensagem abaixo do campo.
// ============================================================
const email3 = document.getElementById("email3");
const msgEmail3 = document.getElementById("msg-email3");

email3.addEventListener("focus", () => {
    email3.classList.remove("erro", "ok");
    email3.classList.add("focado");
    mostrarMensagem(msgEmail3, "Ex.: nome@dominio.com", "info");
});

email3.addEventListener("blur", () => {
    email3.classList.remove("focado");

    if (email3.value.trim() === "") {
        mostrarMensagem(msgEmail3, "", null);
        return;
    }

    const valido = emailValido(email3.value);
    email3.classList.toggle("erro", !valido);
    email3.classList.toggle("ok", valido);

    if (valido) {
        mostrarMensagem(msgEmail3, "E-mail válido!", "ok");
    } else {
        mostrarMensagem(msgEmail3, "Formato inválido. Use algo como nome@dominio.com", "erro");
    }
});


// ============================================================
// ETAPA 4 — submit: valida tudo antes de enviar
// preventDefault impede o reload; cada campo é conferido
// e recebe mensagem de erro própria.
// ============================================================
const form4 = document.getElementById("form4");
const nome4 = document.getElementById("nome4");
const email4 = document.getElementById("email4");
const curso4 = document.getElementById("curso4");
const termos4 = document.getElementById("termos4");
const resultado4 = document.getElementById("resultado4");
const enviar4 = document.getElementById("enviar4");
const avisoTermos4 = document.getElementById("aviso-termos4");

// Botão só habilita depois de aceitar os termos
termos4.addEventListener("change", () => {
    enviar4.disabled = !termos4.checked;
    avisoTermos4.hidden = termos4.checked;
});

// Aplica estilo + mensagem a um campo e devolve se ele é válido
function validarCampo4(campo, valido, idErro, textoErro) {
    const erro = document.getElementById(idErro);
    campo.classList.toggle("erro", !valido);
    campo.setAttribute("aria-invalid", !valido);
    mostrarMensagem(erro, valido ? "" : textoErro, valido ? null : "erro");
    return valido;
}

form4.addEventListener("submit", (e) => {
    e.preventDefault();

    // Valida todos (sem parar no primeiro erro) para mostrar todas as mensagens
    const resultados = [
        validarCampo4(nome4, nome4.value.trim().length >= 3, "erro-nome4", "O nome precisa ter pelo menos 3 caracteres."),
        validarCampo4(email4, emailValido(email4.value), "erro-email4", "Informe um e-mail válido (com @)."),
        validarCampo4(curso4, curso4.value !== "", "erro-curso4", "Selecione um curso."),
        validarCampo4(termos4, termos4.checked, "erro-termos4", "Você precisa aceitar os termos.")
    ];

    if (resultados.every((ok) => ok)) {
        mostrarMensagem(resultado4, "Formulário enviado com sucesso!", "ok");
    } else {
        mostrarMensagem(resultado4, "Existem campos inválidos. Verifique as mensagens acima.", "erro");
    }
});


// ============================================================
// ETAPA 5 — Desafio final: formulário inteligente
// - indicador de força da senha (fraca / média / forte)
// - botão desabilitado até aceitar os termos
// - sumário de erros acessível (role="alert" + aria-invalid)
// - reset do formulário após envio com sucesso
// ============================================================
const form5 = document.getElementById("form5");
const nome5 = document.getElementById("nome5");
const email5 = document.getElementById("email5");
const senha5 = document.getElementById("senha5");
const curso5 = document.getElementById("curso5");
const termos5 = document.getElementById("termos5");
const enviar5 = document.getElementById("enviar5");
const avisoTermos5 = document.getElementById("aviso-termos5");
const barra = document.getElementById("barra");
const textoForca = document.getElementById("texto-forca");
const sumario = document.getElementById("sumario");
const listaErros = document.getElementById("lista-erros");
const resultado5 = document.getElementById("resultado5");

// Campos que o usuário já mexeu: só mostramos erro deles,
// para não encher a tela de avisos antes de começar a digitar
const tocados = new Set();

// --- Funções pequenas de validação (lógica separada da interface) ---

// Pontua a senha: tamanho, maiúscula+minúscula, número e símbolo
function calcularForca(senha) {
    if (senha.length === 0) return "";
    let pontos = 0;
    if (senha.length >= 8) pontos++;
    if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) pontos++;
    if (/\d/.test(senha)) pontos++;
    if (/[^A-Za-z0-9]/.test(senha)) pontos++;

    if (pontos <= 1) return "fraca";
    if (pontos <= 3) return "media";
    return "forte";
}

// Devolve uma lista de { campo, mensagem } com todos os erros atuais
function listarErros() {
    const erros = [];
    if (nome5.value.trim().length < 3) {
        erros.push({ campo: nome5, mensagem: "Nome: mínimo de 3 caracteres." });
    }
    if (!emailValido(email5.value)) {
        erros.push({ campo: email5, mensagem: "E-mail: formato inválido." });
    }
    const forca = calcularForca(senha5.value);
    if (forca === "" || forca === "fraca") {
        erros.push({ campo: senha5, mensagem: "Senha: precisa ser pelo menos média (use 8+ caracteres, maiúsculas, números ou símbolos)." });
    }
    if (curso5.value === "") {
        erros.push({ campo: curso5, mensagem: "Curso: selecione uma opção." });
    }
    if (!termos5.checked) {
        erros.push({ campo: termos5, mensagem: "Termos: é preciso aceitar." });
    }
    return erros;
}

// --- Atualização da interface ---

function atualizarForca() {
    const forca = calcularForca(senha5.value);
    const nomes = { fraca: "Fraca", media: "Média", forte: "Forte" };

    barra.className = forca; // "", "fraca", "media" ou "forte"
    textoForca.textContent = "Força da senha: " + (nomes[forca] || "—");
}

function atualizarFormulario() {
    const erros = listarErros();
    const camposComErro = erros.map((erro) => erro.campo);

    // Marca visualmente (e para leitores de tela) cada campo tocado
    [nome5, email5, senha5, curso5, termos5].forEach((campo) => {
        const invalido = camposComErro.includes(campo);
        const mostrar = tocados.has(campo.id);
        campo.classList.toggle("erro", mostrar && invalido);
        campo.classList.toggle("ok", mostrar && !invalido);
        campo.setAttribute("aria-invalid", mostrar && invalido);
    });

    // Monta o sumário só com erros dos campos já tocados
    const visiveis = erros.filter((erro) => tocados.has(erro.campo.id));
    listaErros.innerHTML = "";
    visiveis.forEach((erro) => {
        const li = document.createElement("li");
        li.textContent = erro.mensagem;
        listaErros.append(li);
    });
    sumario.hidden = visiveis.length === 0;

    // Botão só habilita depois de aceitar os termos
    // (os demais campos são conferidos no submit)
    enviar5.disabled = !termos5.checked;
    avisoTermos5.hidden = termos5.checked;
}

// --- Eventos ---

// Delegação de eventos: um único ouvinte no form para todos os campos
form5.addEventListener("input", (e) => {
    tocados.add(e.target.id);
    if (e.target === senha5) atualizarForca();
    resultado5.textContent = "";
    atualizarFormulario();
});

// change cobre o select e o checkbox
form5.addEventListener("change", (e) => {
    tocados.add(e.target.id);
    atualizarFormulario();
});

form5.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validação final (o botão pode ser reabilitado pelo DevTools, então confere de novo)
    if (listarErros().length > 0) {
        [nome5, email5, senha5, curso5, termos5].forEach((campo) => tocados.add(campo.id));
        atualizarFormulario();
        return;
    }

    mostrarMensagem(resultado5, "Cadastro de " + nome5.value.trim() + " enviado com sucesso!", "ok");

    // Reset do formulário e do estado visual
    form5.reset();
    tocados.clear();
    atualizarForca();
    atualizarFormulario();
});
