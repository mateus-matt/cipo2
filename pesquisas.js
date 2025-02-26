document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle")
    const navMenu = document.querySelector(".nav-menu")
    const dropdowns = document.querySelectorAll(".dropdown")
    const searchInput = document.getElementById("searchInput")
    const searchButton = document.getElementById("searchButton")
  
    console.log("Página de Pesquisas carregada!") // Debugging
  
    // Menu toggle functionality
    if (menuToggle && navMenu) {
      menuToggle.addEventListener("click", function () {
        this.classList.toggle("active")
        navMenu.classList.toggle("active")
      })
  
      dropdowns.forEach((dropdown) => {
        const link = dropdown.querySelector("a")
        link.addEventListener("click", function (e) {
          if (window.innerWidth <= 768) {
            e.preventDefault()
            this.parentNode.classList.toggle("active")
          }
        })
      })
  
      document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          menuToggle.classList.remove("active")
          navMenu.classList.remove("active")
          dropdowns.forEach((dropdown) => dropdown.classList.remove("active"))
        }
      })
    }
  
    loadResearchEntries()
    setupSearch()
  
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    })
  
    // Adiciona evento ao botão de busca (se existir)
    if (searchButton) {
      searchButton.addEventListener("click", handleSearch)
    }
  
    function handleSearch() {
      const searchTerm = searchInput.value.toLowerCase().trim()
      if (searchTerm === "") return
  
      // Check if it's an audio description command
      const audioDescriptions = JSON.parse(localStorage.getItem("audioDescriptions") || "{}")
      const pesquisasDescriptions = audioDescriptions["research.html"] || {}
  
      if (pesquisasDescriptions[searchTerm]) {
        speakText(pesquisasDescriptions[searchTerm])
      } else {
        // If not an audio description, use handleNavigation
        handleNavigation(searchTerm)
      }
    }
  
    function handleNavigation(term) {
      const pages = {
        inicio: "index.html",
        começo: "index.html",
        home: "index.html",
        "página inicial": "index.html",
        "sobre nós": "sobre-nos.html",
        "quem somos": "sobre-nos.html",
        "sobre nos": "sobre-nos.html",
        news: "index.html#cipo-news",
        notícias: "index.html#cipo-news",
        extensão: "extensao.html",
        pesquisas: "pesquisas.html",
        cursos: "cursos.html",
        curso: "cursos.html",
        aula: "cursos.html",
        palestras: "palestras.html",
        palestra: "palestras.html",
        eventos: "eventos.html",
        evento: "eventos.html",
        projetos: "projetos.html",
        projeto: "projetos.html",
        livros: "livros.html",
        contatos: "contato.html",
      }
  
      for (const key in pages) {
        if (term.includes(key)) {
          window.location.href = pages[key]
          return
        }
      }
  
      // If no navigation match, search within research entries
      const searchResults = searchResearch(term)
      if (searchResults) {
        const entries = JSON.parse(localStorage.getItem("researchEntries") || "[]")
        const filteredEntries = entries.filter(
          (entry) =>
            entry.title.toLowerCase().includes(term) ||
            entry.description.toLowerCase().includes(term) ||
            entry.researcher.toLowerCase().includes(term),
        )
        displayResearchEntries(filteredEntries)
      } else {
        displayResearchEntries([]) // Display no results
      }
    }
  
    // 🔊 Função de síntese de voz corrigida
    function speakText(text) {
      console.log("Speaking:", text) // Add this line for debugging
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel() // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "pt-BR"
        utterance.rate = 0.9
        utterance.pitch = 1.1
        window.speechSynthesis.speak(utterance)
      } else {
        console.error("Navegador não suporta síntese de voz")
      }
    }
  
    function loadResearchEntries() {
      console.log("Carregando pesquisas...")
      const entries = JSON.parse(localStorage.getItem("researchEntries") || "[]")
      // Ordena as entradas pelo timestamp, mais recentes primeiro
      const sortedEntries = entries.sort((a, b) => {
        const timeA = a.timestamp || 0
        const timeB = b.timestamp || 0
        return timeB - timeA // Ordem decrescente (mais recente primeiro)
      })
      displayResearchEntries(sortedEntries)
    }
  
    function setupSearch() {
      const searchInput = document.getElementById("searchInput")
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          const searchTerm = e.target.value.toLowerCase().trim()
          if (searchTerm === "") {
            const entries = JSON.parse(localStorage.getItem("researchEntries") || "[]")
            displayResearchEntries(entries)
          }
        })
      }
    }
  
    function displayResearchEntries(entries) {
      const researchList = document.getElementById("researchList")
      if (researchList) {
        if (entries.length === 0) {
          researchList.innerHTML = '<p class="no-results">Nenhuma pesquisa encontrada.</p>'
        } else {
          researchList.innerHTML = entries
            .map(
              (entry) => `
          <div class="research-card" data-id="${entry.id}">
            <div class="research-header">
              <div class="research-icon">
                <i class="fas fa-${entry.icon || "flask"}"></i>
              </div>
              <h2 class="research-title">${entry.title}</h2>
            </div>
            <p class="researcher-name">Pesquisador: ${entry.researcher}</p>
            <p class="research-description">${entry.description}</p>
            <div class="research-meta">
              <div class="timeline">
                <i class="fas fa-calendar"></i>
                <span>${entry.timeline}</span>
              </div>
              <div class="funding">
                <i class="fas fa-search"></i>
                <span>${entry.funding}</span>
              </div>
            </div>
          </div>
        `,
            )
            .join("")
        }
      }
    }
  
    function searchResearch(term) {
      const entries = JSON.parse(localStorage.getItem("researchEntries") || "[]")
      const filteredEntries = entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(term) ||
          entry.description.toLowerCase().includes(term) ||
          entry.researcher.toLowerCase().includes(term),
      )
  
      if (filteredEntries.length > 0) {
        let result = `Encontradas ${filteredEntries.length} pesquisas relacionadas a "${term}". `
        filteredEntries.forEach((entry, index) => {
          result += `Pesquisa ${index + 1}: ${entry.title}. `
        })
        return result
      } else {
        return `Nenhuma pesquisa encontrada para o termo "${term}".`
      }
    }
  })
  
  