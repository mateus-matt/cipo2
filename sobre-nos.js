document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")
  const dropdowns = document.querySelectorAll(".dropdown")
  const searchInput = document.getElementById("searchInput")
  const searchButton = document.getElementById("searchButton")
  let recognition
  let isListening = false
  let timer = null

  searchInput.focus()

  // Carregar o conteúdo "Sobre Nós"
  const aboutText = localStorage.getItem("aboutText")
  if (aboutText) {
    document.querySelector(".about-text p").textContent = aboutText
  }

  // Carregar os membros da equipe
  loadTeamMembers()

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

  // Speech recognition setup
  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition()
    recognition.continuous = false
    recognition.lang = "pt-BR"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript.toLowerCase()
      console.log("Resultado do reconhecimento de voz:", result)
      clearTimeout(timer)
      startTimer()

      setTimeout(() => {
        if (isListening) {
          handleVoiceCommand(result)
        }
      }, 2000)
    }

    recognition.onend = () => {
      if (isListening) {
        recognition.start()
        startTimer()
      } else {
        searchButton.classList.remove("listening")
        searchButton.querySelector("i").className = "fas fa-search"
      }
    }

    recognition.onstart = () => {
      isListening = true
      searchButton.classList.add("listening")
      searchButton.querySelector("i").className = "fas fa-microphone"
    }
  }

  function startListening() {
    if (recognition) {
      isListening = true
      recognition.start()
      searchButton.classList.add("listening")
      searchButton.querySelector("i").className = "fas fa-microphone"
      startTimer()
    }
  }

  function stopListening() {
    isListening = false
    clearTimeout(timer)
    recognition.stop()
    searchButton.classList.remove("listening")
    searchButton.querySelector("i").className = "fas fa-search"
  }

  async function toggleMicrophone() {
    if (isListening) {
      await speak("Microfone desativado")
      stopListening()
    } else {
      await speak("Microfone ativado")
      startListening()
    }
  }

  function startTimer() {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      if (isListening) {
        isListening = false
        recognition.stop()
        searchButton.classList.remove("listening")
        searchButton.querySelector("i").className = "fas fa-search"
        await speak("Microfone desativado por inatividade")
      }
    }, 8000) // 8 seconds wait
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "F4") {
      event.preventDefault()
      toggleMicrophone()
    }
  })

  function speak(text) {
    return new Promise((resolve) => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "pt-BR"
        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.onend = resolve

        window.speechSynthesis.speak(utterance)
      } else {
        resolve()
      }
    })
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

    speak("Desculpe, não encontrei a página solicitada. Por favor, tente novamente.")
  }

  searchButton.addEventListener("click", handleSearch)

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    handleVoiceCommand(searchTerm)
  }

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  })

  function handleVoiceCommand(command) {
    const audioDescriptions = JSON.parse(localStorage.getItem("audioDescriptions") || "{}")
    const sobreNosDescriptions = audioDescriptions["about.html"] || {}

    if (sobreNosDescriptions[command]) {
      speak(sobreNosDescriptions[command])
    } else {
      handleNavigation(command)
    }
  }

  function getRolePriority(role) {
    const roleLower = role.toLowerCase().trim()
    if (roleLower.includes("coordenador") || roleLower.includes("coordenadora")) {
      return 4 // Highest priority
    } else if (roleLower.includes("comissão técnica") || roleLower.includes("comissao tecnica")) {
      return 3
    } else if (roleLower.includes("comissão científica") || roleLower.includes("comissao cientifica")) {
      return 2
    } else if (
      roleLower.includes("voluntário") ||
      roleLower.includes("voluntaria") ||
      roleLower.includes("voluntario")
    ) {
      return 0 // Lowest priority
    }
    return 1 // Default priority for other roles
  }

  // Função para carregar membros da equipe
  function loadTeamMembers() {
    const teamGrid = document.querySelector(".team-grid")
    const members = JSON.parse(localStorage.getItem("teamMembers") || "[]")

    if (members.length > 0 && teamGrid) {
      // Aplicar prioridade antes de renderizar
      members.sort((a, b) => getRolePriority(b.role) - getRolePriority(a.role))

      teamGrid.innerHTML = members
        .map(
          (member) => `
            <div class="member-card">
              <div class="member-image">
                <img src="${member.imageUrl}" alt="${member.name}">
              </div>
              <div class="member-info">
                <h3>${member.name}</h3>
                <p>${member.role}</p>
                <div class="member-social">
                  ${member.linkedin ? `<a href="${member.linkedin}" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ""}
                  ${member.instagram ? `<a href="${member.instagram}" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>` : ""}
                </div>
              </div>
            </div>
          `,
        )
        .join("")
    }
  }
})

