
/* =====================================
   SCRIPT.JS - COMUNICAÇÃO COM A API
   ===================================== */

// ENDEREÇO DA API
const API_BASE = "http://localhost:3000/api/comidas";

// ELEMENTOS DO HTML
const imgEl = document.getElementById("photo");
const catEl = document.getElementById("category");
const msgEl = document.getElementById("msg");
const searchInput = document.getElementById("searchInput");
const randomBtn = document.getElementById("randomBtn");
const searchBtn = document.getElementById("searchBtn");

// BUSCAR COMIDA ALEATÓRIA
randomBtn.addEventListener("click", () => {
    fetch(`${API_BASE}/aleatorio`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Não foi possível buscar uma comida.");
            }

            return response.json();
        })
        .then(showResult)
        .catch(handleError);
});

// BUSCAR COMIDA POR CATEGORIA
function buscarPorCategoria() {
    const cat = searchInput.value.trim().toLowerCase();

    if (!cat) {
        msgEl.textContent = "Digite uma categoria.";
        return;
    }

    fetch(`${API_BASE}/${encodeURIComponent(cat)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Categoria inexistente.");
            }

            return response.json();
        })
        .then(showResult)
        .catch(handleError);
}

// EVENTO DO BOTÃO DE BUSCA
searchBtn.addEventListener("click", buscarPorCategoria);

// PERMITIR BUSCA COM A TECLA ENTER
searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        buscarPorCategoria();
    }
});

// MOSTRAR O RESULTADO NA TELA
function showResult({ categoria, foto }) {
    if (!categoria || !foto) {
        handleError(new Error("A API retornou dados inválidos."));
        return;
    }

    const servidor = API_BASE.replace("/api/comidas", "");

    imgEl.src = `${servidor}/fotos/${encodeURIComponent(categoria)}/${foto
        .split("/")
        .map(parte => encodeURIComponent(parte))
        .join("/")}`;

    imgEl.alt = `Foto de comida da categoria ${categoria}`;

    catEl.textContent = `Categoria: ${categoria}`;
    msgEl.textContent = "";
}

// TRATAR ERROS
function handleError(err) {
    imgEl.removeAttribute("src");
    imgEl.alt = "Imagem indisponível";

    catEl.textContent = "";
    msgEl.textContent = err.message || "Servidor offline.";

    console.error("Erro na API:", err);
}
