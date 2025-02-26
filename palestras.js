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
    function loadLecturesFromLocalStorage() {
      const lectures = JSON.parse(localStorage.getItem("lectures") || "[]")
      const lecturesGrid = document.querySelector(".lectures-grid")
  
      if (lecturesGrid) {
        lecturesGrid.innerHTML = lectures
          .map(
            (lecture) => `
                      <div class="lecture-card">
                          <h2>${lecture.title}</h2>
                          <p>Data: ${lecture.date}</p>
                          <p>Palestrante: ${lecture.speaker}</p>
                          <p>${lecture.description}</p>
                      </div>
                  `,
          )
          .join("")
      }
    }
  
    loadLecturesFromLocalStorage()
  
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
      return "Bem-vindo à página de Palestras do Projeto CIPÓ. Aqui você encontrará informações sobre nossas palestras programadas. Digite 'palestras1' para ouvir uma descrição de todas as palestras, ou digite 'p1', 'p2', 'p3' para ouvir sobre cada palestra individualmente. Para navegar pelo site, você pode dizer: 'home', 'sobre', 'notícias', 'extensão', 'pesquisas', 'cursos', 'eventos', 'livros' ou 'contatos'."
    }
  
    function getLectureDescription(index) {
      const lectures = {
        1: "Inovação Social na Amazônia. Data: 15 de Agosto, 2024. Palestrante: Dra. Maria Silva. Explore as mais recentes inovações sociais que estão transformando comunidades na Amazônia.",
        2: "Tecnologias Sustentáveis para o Futuro. Data: 22 de Setembro, 2024. Palestrante: Dr. João Santos. Descubra como as tecnologias sustentáveis estão moldando o futuro da região amazônica.",
        3: "Educação Inclusiva: Desafios e Oportunidades. Data: 10 de Outubro, 2024. Palestrante: Profa. Ana Rodrigues. Uma análise profunda dos desafios e oportunidades na implementação de educação inclusiva na Amazônia.",
      }
      return lectures[index] || "Palestra não encontrada."
    }
  
    function getLecturesContent() {
      const lecturesSection = document.querySelector(".lectures-grid")
      if (!lecturesSection) return "Não foi possível encontrar a seção de palestras."
  
      const lectureCards = lecturesSection.querySelectorAll(".lecture-card")
      let content = "Nossas Palestras: "
  
      lectureCards.forEach((card, index) => {
        const title = card.querySelector("h2").textContent
        const date = card.querySelector("p:nth-child(2)").textContent
        const speaker = card.querySelector("p:nth-child(3)").textContent
        const description = card.querySelector("p:last-child").textContent
        content += `Palestra ${index + 1}: ${title}. ${date}. ${speaker}. ${description} `
      })
  
      return content
    }
  
    function handleNavigation(term) {
      const pages = {
        inicio: "index.html",
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
      } else if (searchTerm === "palestras1") {
        const lecturesContent = getLecturesContent()
        console.log("Conteúdo das palestras:", lecturesContent)
        speak(lecturesContent)
      } else if (searchTerm.match(/^p\d+$/)) {
        const lectureNumber = Number.parseInt(searchTerm.substring(1))
        const description = getLectureDescription(lectureNumber)
        console.log("Descrição da palestra:", description)
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
  })
  
  function loadPageSpecificCommands() {
    const audioDescriptions = JSON.parse(localStorage.getItem("audioDescriptions") || "{}")
    window.pageCommands = audioDescriptions["lectures.html"] || {}
    console.log("Comandos carregados para a página de Palestras:", window.pageCommands)
  }
  
  