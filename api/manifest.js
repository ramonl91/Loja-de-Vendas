/* Gera o "cartão do aplicativo" de cada loja (nome, cor e endereço próprios).
   Funciona na Vercel: o arquivo precisa ficar na pasta api/ do projeto. */
module.exports = (req, res) => {
  const q = req.query || {};
  const limpa = (t, n) => String(t || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, n);
  const nome = limpa(q.n, 40) || "Minha Loja";
  const slug = /^[a-z0-9-]{1,60}$/.test(String(q.s || "")) ? String(q.s) : "";
  const cor = /^#[0-9a-fA-F]{6}$/.test(String(q.c || "")) ? String(q.c) : "#3b1760";
  const m = {
    name: nome,
    short_name: nome.length > 12 ? nome.slice(0, 12).trim() : nome,
    description: slug ? "Catálogo de " + nome : "Gestão de vendas de " + nome,
    id: slug ? "/?loja=" + slug : "/",
    start_url: slug ? "/?loja=" + slug + "&pwa=1" : "/?pwa=1",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5f0f8",
    theme_color: cor,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
  res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(JSON.stringify(m));
};
