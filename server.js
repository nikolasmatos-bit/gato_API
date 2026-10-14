
/* =========================================
   SERVER.JS - API DE FOTOS DE COMIDAS
   ========================================= */

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());

// CARREGAR O CATÁLOGO DE FOTOS
const caminhoDados = path.join(
    __dirname,
    "data",
    "comidas.json"
);

let data;

try {
    data = JSON.parse(
        fs.readFileSync(caminhoDados, "utf8")
    );

    console.log("Catálogo de comidas carregado!");
} catch (erro) {
    console.error("Erro ao carregar comidas.json:", erro.message);
    process.exit(1);
}

// FUNÇÃO PARA SORTEAR UMA FOTO
function sortearFoto(fotos) {
    if (!Array.isArray(fotos) || fotos.length === 0) {
        return null;
    }

    const indice = Math.floor(Math.random() * fotos.length);

    return fotos[indice];
}

// ROTA PRINCIPAL
app.get("/api/comidas", (req, res) => {
    res.json({
        mensagem: "API de comidas funcionando!"
    });
});

// ROTA: COMIDA ALEATÓRIA
app.get("/api/comidas/aleatorio", (req, res) => {
    const categorias = Object.keys(data).filter(
        categoria =>
            Array.isArray(data[categoria]) &&
            data[categoria].length > 0
    );

    if (categorias.length === 0) {
        return res.status(500).json({
            error: "Nenhuma foto cadastrada."
        });
    }

    const cat = categorias[
        Math.floor(Math.random() * categorias.length)
    ];

    const foto = sortearFoto(data[cat]);

    res.json({
        categoria: cat,
        foto: foto
    });
});

// ROTA: BUSCAR POR CATEGORIA
app.get("/api/comidas/:categoria", (req, res) => {
    const cat = req.params.categoria.toLowerCase();

    if (!Array.isArray(data[cat]) || data[cat].length === 0) {
        return res.status(404).json({
            error: `Categoria "${cat}" não encontrada ou sem fotos.`
        });
    }

    const foto = sortearFoto(data[cat]);

    res.json({
        categoria: cat,
        foto: foto
    });
});

// DISPONIBILIZAR AS IMAGENS
app.use(
    "/fotos",
    express.static(
        path.join(__dirname, "data", "fotos")
    )
);

// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("==================================");
    console.log("🍕 API DE COMIDAS INICIADA");
    console.log(`🚀 Servidor: http://localhost:${PORT}`);
    console.log(`📷 Fotos: http://localhost:${PORT}/fotos/`);
    console.log("==================================");
});
