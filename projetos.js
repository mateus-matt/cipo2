document.addEventListener("DOMContentLoaded", () => {
  loadPageSpecificCommands()
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")
  const dropdowns = document.querySelectorAll(".dropdown")

  try {
    loadProjects()
  } catch (error) {
    console.error("Error loading projects:", error)
  }

  setupSearch()
  setupMenu()

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

  // Audio description functionality
  const searchInput = document.getElementById("searchInput")
  searchInput.focus()
  const searchButton = document.getElementById("searchButton")

  function speak(text) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "pt-BR"
      utterance.rate = 0.9
      utterance.pitch = 1.1
      window.speechSynthesis.speak(utterance)
    }
  }

  function getWelcomeMessage() {
    return "Página de Projetos. Aqui terá todos os projetos já realizados no CIPÓ. separados em categorias. onde terá varios projetos dentro de cada categoria. por exemplo. projeto amazônia sustentável. dentro terá projetos envolvendo o tema. Digite p1. até p6 para ouvir a descrição de cada categoria de projeto, ou digite. 'projetos1' para ouvir todos as categorias de projetos. Digite onde quer ir e será redirecionado."
  }

  function getProjectDescription(index) {
    const projects = {
      1: "Projeto Amazônia Sustentável. Iniciativa focada no desenvolvimento de práticas sustentáveis para a preservação da biodiversidade amazônica, integrando conhecimentos tradicionais com tecnologias modernas. Conta com 5 participantes na pesquisa do projeto, mas envolve toda equipe.",
      2: "Educação Ambiental nas Escolas. Programa educacional que leva conhecimentos sobre sustentabilidade e preservação ambiental para escolas públicas da região amazônica. Conta com 4 participantes do projeto, mas envolve toda equipe",
      3: "Desenvolvimento Comunitário. Projeto de extensão que visa fortalecer comunidades locais através de práticas sustentáveis e geração de renda. Conta com 4 participantes na pesquisa do projeto, mas envolve toda equipe",
      4: "Inclusão e Autismo. Projeto voltado para o desenvolvimento de estratégias de inclusão e apoio a pessoas com autismo, focando em educação e integração social. Conta com 5 participantes na pesquisa do projeto, mas envolve toda equipe",
      5: "Pesquisa e Produção Acadêmica Colaborativa. Projeto que colabora com estudantes no desenvolvimento de artigos e trabalhos acadêmicos, promovendo parcerias estratégicas com o CIPÓ para integrar as pesquisas às demandas reais da comunidade.",
      6: "Tecnologia Assistiva. Projeto focado em estudos envolvendo desenvolvimento e implementação de tecnologias assistivas para obter mais inclusão e acessibilidade na região amazônica. Conta com 3 participantes na pesquisa do projeto, mas envolve toda equipe",
    }
    if (index > Object.keys(projects).length) {
      return "No momento, não temos informações sobre este projeto. Por favor, verifique novamente mais tarde."
    }
    return projects[index] || "Projeto não encontrado."
  }

  function getProjectsContent() {
    const projectsContainer = document.querySelector(".projects-grid")
    if (!projectsContainer) return "Não foi possível encontrar a seção de projetos."

    const projectCards = projectsContainer.querySelectorAll(".project-card")
    let content = "Nossos Projetos: "

    projectCards.forEach((card, index) => {
      const title = card.querySelector("h2").textContent
      const description = card.querySelector(".description").textContent
      content += `Projeto ${index + 1}: ${title}. ${description} `
    })

    return content
  }

  function handleNavigation(term) {
    const pages = {
      inicio: "index.html",
      começo: "index.html",
      home: "index.html",
      sobre: "sobre-nos.html",
      news: "#cipo-news",
      projetos: "projetos.html",
      projeto: "projetos.html",
      pesquisa: "pesquisas.html",
      pesquisas: "pesquisas.html",
      livros: "livros.html",
      livro: "livros.html",
      books: "livros.html",
      book: "livros.html",
      contatos: "contato.html",
      contato: "contato.html",
    }

    for (const key in pages) {
      if (term.includes(key)) {
        window.location.href = pages[key]
        return
      }
    }

    speak("Desculpe, não encontrei a página solicitada. Por favor, tente novamente.")
  }

  function setupSearch() {
    const searchInput = document.getElementById("searchInput")
    if (!searchInput) return

    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")

      const filteredProjects = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm) || project.description.toLowerCase().includes(searchTerm),
      )

      const projectsContainer = document.querySelector(".projects-grid")
      if (!projectsContainer) return

      if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = '<p class="no-results">Nenhum projeto encontrado.</p>'
        return
      }

      projectsContainer.innerHTML = filteredProjects
        .map(
          (project) => `
            <div class="project-card" data-id="${project.id}">
              <div class="project-icon">
                <i class="fas fa-${project.icon || "project-diagram"}"></i>
              </div>
              <div class="project-content">
                <h2>${project.title}</h2>
                <p class="description">${project.description}</p>
                <div class="project-stats">
                  <div class="stat">
                    <i class="fas fa-users"></i>
                    <span>${project.participants} Participantes</span>
                  </div>
                  <div class="stat">
                    <i class="fas fa-clock"></i>
                    <span>${formatStatus(project.status)}</span>
                  </div>
                </div>
              </div>
            </div>
          `,
        )
        .join("")
    })
  }

  function loadProjects() {
    const projectsContainer = document.querySelector(".projects-grid")
    if (!projectsContainer) {
      console.error("Container de projetos não encontrado")
      return
    }

    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    console.log("Projetos carregados:", projects)

    if (projects.length === 0) {
      projectsContainer.innerHTML = "<p>Nenhum projeto cadastrado.</p>"
      return
    }

    projectsContainer.innerHTML = projects
      .map(
        (project) => `
          <div class="project-card" data-id="${project.id}">
            <div class="project-icon">
              <i class="fas fa-${project.icon || "project-diagram"}"></i>
            </div>
            <div class="project-content">
              <h2>${project.title}</h2>
              <p class="description">${project.description}</p>
              <div class="project-stats">
                <div class="stat">
                  <i class="fas fa-users"></i>
                  <span>${project.participants} Participantes</span>
                </div>
                <div class="stat">
                  <i class="fas fa-clock"></i>
                  <span>${formatStatus(project.status)}</span>
                </div>
              </div>
            </div>
          </div>
        `,
      )
      .join("")

    console.log("Projetos renderizados na página")
  }

  function formatStatus(status) {
    switch (status) {
      case "em_andamento":
        return "Em Andamento"
      case "concluido":
        return "Concluído"
      case "planejado":
        return "Planejado"
      default:
        return status
    }
  }

  function setupMenu() {
    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active")
      })
    }

    dropdowns.forEach((dropdown) => {
      const dropdownToggle = dropdown.querySelector(".dropdown-toggle")
      const dropdownContent = dropdown.querySelector(".dropdown-content")

      if (dropdownToggle && dropdownContent) {
        dropdownToggle.addEventListener("click", () => {
          dropdownContent.classList.toggle("active")
        })
      }
    })
  }

  // Reconhecimento de voz para pesquisa
  if ("webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "pt-BR"

    const voiceSearchButton = document.getElementById("voiceSearchButton")
    if (voiceSearchButton) {
      voiceSearchButton.addEventListener("click", () => {
        recognition.start()
      })
    }

    recognition.onresult = (event) => {
      const searchInput = document.getElementById("searchInput")
      if (searchInput) {
        searchInput.value = event.results[0][0].transcript
        searchInput.dispatchEvent(new Event("input"))
      }
    }
  }

  searchButton.addEventListener("click", () => {
    handleSearch()
  })

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    console.log("Termo de pesquisa:", searchTerm) // Log para debugging

    if (window.pageCommands && window.pageCommands[searchTerm]) {
      console.log("Comando específico encontrado:", window.pageCommands[searchTerm])
      speak(window.pageCommands[searchTerm])
    } else if (searchTerm === "projetos1") {
      const projectsContent = getProjectsContent()
      console.log("Conteúdo dos projetos:", projectsContent)
      speak(projectsContent)
    } else if (searchTerm.match(/^p\d+$/)) {
      const projectNumber = Number.parseInt(searchTerm.substring(1))
      const description = getProjectDescription(projectNumber)
      console.log("Descrição do projeto:", description)
      speak(description)
    } else {
      console.log("Comando não reconhecido, tentando navegação")
      handleNavigation(searchTerm)
    }
  }

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchButton.click()
    }
  })

  window.updateProjectDisplay = (projectId) => {
    const projectElement = document.querySelector(`.project-card[data-id="${projectId}"]`)
    if (projectElement) {
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      const project = projects.find((p) => p.id === projectId)
      if (project) {
        projectElement.innerHTML = `
          <div class="project-icon">
              <i class="fas fa-${project.icon || "project-diagram"}"></i>
          </div>
          <div class="project-content">
              <h2>${project.title}</h2>
              <p class="description">${project.description}</p>
              <div class="project-stats">
                  <div class="stat">
                      <i class="fas fa-users"></i>
                      <span>${project.participants} Participantes</span>
                  </div>
                  <div class="stat">
                      <i class="fas fa-clock"></i>
                      <span>${formatStatus(project.status)}</span>
                  </div>
              </div>
          </div>
        `
        console.log(`Projeto ${projectId} atualizado na exibição`)
      } else {
        projectElement.remove()
        console.log(`Projeto ${projectId} removido da exibição`)
      }
    } else {
      loadProjects() // Se o projeto não for encontrado, recarrega todos os projetos
    }
  }

  function loadPageSpecificCommands() {
    const audioDescriptions = JSON.parse(localStorage.getItem("audioDescriptions") || "{}")
    window.pageCommands = audioDescriptions["projetos.html"] || {}
    console.log("Comandos carregados para a página de Projetos:", window.pageCommands)
  }
})

