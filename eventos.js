document.addEventListener("DOMContentLoaded", () => {
    loadPageSpecificCommands()
    const menuToggle = document.querySelector(".menu-toggle")
    const navMenu = document.querySelector(".nav-menu")
    const dropdowns = document.querySelectorAll(".dropdown")
    const searchInput = document.getElementById("searchInput")
    const searchButton = document.getElementById("searchButton")
    let recognition
    let isListening = false
    let timer = null
    let lastSpeechTime = 0
  
    searchInput.focus()
  
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
        lastSpeechTime = Date.now()
        clearTimeout(timer)
        startTimer()
  
        setTimeout(() => {
          if (isListening) {
            handleNavigation(result)
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
      isListening = true
      lastSpeechTime = Date.now()
      searchButton.classList.add("listening")
      recognition.start()
      startTimer()
    }
  
    function stopListening() {
      isListening = false
      clearTimeout(timer)
      recognition.stop()
      searchButton.classList.remove("listening")
    }
  
    async function toggleMicrophone() {
      if (isListening) {
        isListening = false
        clearTimeout(timer)
        await speak("Microfone desativado")
        recognition.stop()
        searchButton.classList.remove("listening")
        searchButton.querySelector("i").className = "fas fa-search"
      } else {
        await speak("Microfone ativado")
        isListening = true
        searchButton.classList.add("listening")
        recognition.start()
        startTimer()
        searchButton.querySelector("i").className = "fas fa-microphone"
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
          await speak("Microfone desativado")
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
  
          const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  
          sentences.forEach((sentence, index) => {
            const utterance = new SpeechSynthesisUtterance(sentence.trim())
            utterance.lang = "pt-BR"
            utterance.rate = 0.9
            utterance.pitch = 1.1
  
            if (index === sentences.length - 1) {
              utterance.onend = resolve
            }
  
            if (index < sentences.length - 1) {
              const pause = new SpeechSynthesisUtterance("")
              pause.lang = "pt-BR"
              pause.pause = 0.5
              window.speechSynthesis.speak(pause)
            }
  
            window.speechSynthesis.speak(utterance)
          })
        } else {
          resolve()
        }
      })
    }
  
    function getWelcomeMessage() {
      return "Bem-vindo à página de Eventos do Projeto CIPÓ. Aqui você encontrará informações sobre nossos eventos programados. Digite 'eventos1' para ouvir uma descrição de todos os eventos, ou digite 'e1', 'e2', 'e3' para ouvir sobre cada evento individualmente. Para navegar pelo site, você pode dizer: 'home', 'sobre', 'notícias', 'extensão', 'pesquisas', 'cursos', 'palestras', 'livros' ou 'contatos'."
    }
  
    function getEventDescription(index) {
      const events = {
        1: "Feira de Inovação Amazônica. Data: 5-7 de Novembro, 2024. Local: Centro de Convenções da Amazônia. Uma exposição de projetos inovadores desenvolvidos para a região amazônica, com palestras, workshops e networking.",
        2: "Hackathon Sustentabilidade. Data: 20-22 de Janeiro, 2025. Local: Universidade Federal do Amazonas. Um evento de 48 horas para desenvolver soluções tecnológicas para desafios ambientais da Amazônia.",
        3: "Simpósio de Educação Inclusiva. Data: 15 de Março, 2025. Local: Auditório Municipal de Manaus. Um dia inteiro dedicado a discussões e apresentações sobre práticas de educação inclusiva na região amazônica.",
      }
      return events[index] || "Evento não encontrado."
    }
  
    function getEventsContent() {
      const eventsSection = document.querySelector(".events-grid")
      if (!eventsSection) return "Não foi possível encontrar a seção de eventos."
  
      const eventCards = eventsSection.querySelectorAll(".event-card")
      let content = "Nossos Eventos: "
  
      eventCards.forEach((card, index) => {
        const title = card.querySelector("h2").textContent
        const date = card.querySelector("p:nth-child(2)").textContent
        const location = card.querySelector("p:nth-child(3)").textContent
        const description = card.querySelector("p:last-child").textContent
        content += `Evento ${index + 1}: ${title}. ${date}. ${location}. ${description} `
      })
  
      return content
    }
  
    function handleNavigation(term) {
      const pages = {
        inicio: "index.html",
        começo: "index.html",
        "pagina inicial": "index.html",
        evento: "eventos.html",
        home: "index.html",
        sobre: "sobre-nos.html",
        news: "index.html#cipo-news",
        notícias: "index.html#cipo-news",
        extensão: "extensao.html",
        pesquisas: "pesquisas.html",
        cursos: "cursos.html",
        palestras: "palestras.html",
        eventos: "eventos.html",
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
      console.log("Termo de pesquisa:", searchTerm) // Log para debugging
  
      if (window.pageCommands && window.pageCommands[searchTerm]) {
        console.log("Comando específico encontrado:", window.pageCommands[searchTerm])
        speak(window.pageCommands[searchTerm])
      } else if (searchTerm === "eventos1") {
        const eventsContent = getEventsContent()
        console.log("Conteúdo dos eventos:", eventsContent)
        speak(eventsContent)
      } else if (searchTerm.match(/^e\\d+$/)) {
        const eventNumber = Number.parseInt(searchTerm.substring(1))
        const description = getEventDescription(eventNumber)
        console.log("Descrição do evento:", description)
        speak(description)
      } else {
        console.log("Comando não reconhecido, tentando navegação")
        handleNavigation(searchTerm)
      }
    }
  
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    })
  
    function loadEventsFromLocalStorage() {
      const events = JSON.parse(localStorage.getItem("events") || "[]")
      const eventsGrid = document.querySelector(".events-grid")
  
      if (eventsGrid) {
        eventsGrid.innerHTML = events
          .map(
            (event) => `
                        <div class="event-card">
                            <h2>${event.title}</h2>
                            <p>Data: ${event.date}</p>
                            <p>Local: ${event.location}</p>
                            <p>${event.description}</p>
                        </div>
                    `,
          )
          .join("")
      }
    }
  
    loadEventsFromLocalStorage()
  
    function getEventsContent() {
      const events = JSON.parse(localStorage.getItem("events") || "[]")
      let content = "Nossos Eventos: "
  
      events.forEach((event, index) => {
        content += `Evento ${index + 1}: ${event.title}. Data: ${event.date}. Local: ${event.location}. ${event.description} `
      })
  
      return content
    }
  
    function getEventDescription(index) {
      const events = JSON.parse(localStorage.getItem("events") || "[]")
      const event = events[index - 1]
      if (event) {
        return `${event.title}. Data: ${event.date}. Local: ${event.location}. ${event.description}`
      }
      return "Evento não encontrado."
    }
  
    function loadPageSpecificCommands() {
      const audioDescriptions = JSON.parse(localStorage.getItem("audioDescriptions") || "{}")
      window.pageCommands = audioDescriptions["events.html"] || {}
      console.log("Comandos carregados para a página de Eventos:", window.pageCommands)
    }
  })
  
  