require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public")); // Serve os arquivos da pasta public (HTML/CSS)

// Rota principal da API
app.get("/receitas", async (req, res) => {
  const ingredientes = req.query.ingredientes; // Pega o que o usuário digitou

  if (!ingredientes) {
    return res.status(400).json({ error: "Por favor, forneça ingredientes." });
  }

  try {
    // A Mágica: Consulta a API externa
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByIngredients",
      {
        params: {
          ingredients: ingredientes,
          number: 5, // Retorna 5 receitas
          apiKey: process.env.SPOONACULAR_API_KEY,
          ranking: 1, // Prioriza receitas que usem mais os ingredientes que você tem
        },
      }
    );

    res.json(response.data); // Manda os dados para o Front-end
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar receitas." });
  }
});

// O segredo é esse "process.env.PORT"
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
// ... código anterior ...

// Rota Nova: Busca detalhes de UMA receita específica pelo ID
app.get("/detalhes/:id", async (req, res) => {
  const { id } = req.params; // Pega o ID que veio na URL

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${fd37e46c55bb46869106dc320b8dfff0}/information`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    // Retorna só o link da receita original para ser mais rápido
    res.json({ sourceUrl: response.data.sourceUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar detalhes." });
  }
});

// app.listen(...) vem aqui em baixo
