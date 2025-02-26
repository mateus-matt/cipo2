document.addEventListener("DOMContentLoaded", () => {
    loadPageSpecificCommands()
    const menuToggle = document.querySelector(".menu-toggle")
    const navMenu = document.querySelector(".nav-menu")
    const dropdowns = document.querySelectorAll(".dropdown")
    const searchInput = document.getElementById("searchInput")
    searchInput.focus()
    const searchButton = document.getElementById("searchButton")
    let recognition
    let isListening = false
    let timer = null
    let lastSpeechTime = 0
  
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
      return "Você está na página de Livros do CIPÓ. Aqui você encontrará nossa biblioteca. Descubra histórias que educam e inspiram. Digite 'livros1' para saber mais informações dos livros que foram lançados em convênio com o cipó. Navegue pelos livros disponíveis e descubra novas aventuras. lembrando que o menu contém: Home, Sobre Nós, CIPÓ News, Extensão (com submenus Projetos e Pesquisas), Livros e Contatos. Digite onde quer navegar e será redirecionado."
    }
  
    function getBookDescription(index) {
      const descriptions = {
        0: "As Aventuras de Superlimpo & Crespinha: Um livro infantil escrito por Samuel Ferreira e Ynis Ferreira, com ilustrações de Fabrício Ferreira. Lançado em 2023, este livro apresenta uma aventura emocionante que combina diversão e aprendizado, apresentando os super-heróis Superlimpo e Crespinha em suas missões para tornar o mundo um lugar melhor.",
        1: "O Mistério da Floresta Desaparecida: Um livro infantil escrito por Rafaela Ferreira e Ynis Ferreira, lançado em 2024. Esta história envolvente aborda temas importantes sobre preservação ambiental e sustentabilidade, através de uma narrativa misteriosa e cativante.",
      }
      if (index >= Object.keys(descriptions).length) {
        return "No momento, não temos informações sobre este livro. Por favor, verifique novamente mais tarde."
      }
      return descriptions[index] || "Descrição do livro não encontrada"
    }
  
    function getBooksContent() {
      const booksSection = document.querySelector(".books-container")
      if (!booksSection) return "Não foi possível encontrar a seção de livros."
  
      const bookCards = booksSection.querySelectorAll(".book-card")
      let content = "Nossa Biblioteca: "
  
      bookCards.forEach((card, index) => {
        const title = card.querySelector("h2").textContent
        content += `Livro ${index + 1}: ${title}. ${getBookDescription(index)}. `
      })
  
      return content
    }
  
    function handleNavigation(term) {
      const pages = {
        inicio: "index.html",
        começo: "index.html",
        home: "index.html",
        sobre: "sobre-nos.html",
        news: "index.html#cipo-news",
        notícias: "index.html#cipo-news",
        "cipo news": "index.html#cipo-news",
        "cipó news": "index.html#cipo-news",
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
  
      alert("Página não encontrada. Por favor, tente novamente.")
    }
  
    searchButton.addEventListener("click", handleSearch)
  
    function handleSearch() {
      const searchTerm = searchInput.value.toLowerCase().trim()
      console.log("Termo de pesquisa:", searchTerm) // Log para debugging
  
      if (window.pageCommands && window.pageCommands[searchTerm]) {
        console.log("Comando específico encontrado:", window.pageCommands[searchTerm])
        speak(window.pageCommands[searchTerm])
      } else if (searchTerm === "livros1") {
        const booksContent = getBooksContent()
        console.log("Conteúdo dos livros:", booksContent)
        speak(booksContent)
      } else if (searchTerm.match(/^l\d+$/)) {
        const bookNumber = Number.parseInt(searchTerm.substring(1))
        const description = getBookDescription(bookNumber - 1)
        console.log("Descrição do livro:", description)
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
  
    function loadBooksFromLocalStorage() {
      const books = JSON.parse(localStorage.getItem("books") || "[]")
      const booksGrid = document.querySelector(".books-grid")
  
      if (booksGrid) {
        booksGrid.innerHTML = books
          .map(
            (book) => `
                    <div class="book-card">
                        <div class="book-cover">
                            <img src="${book.cover}" alt="${book.title}">
                            <div class="book-type">${book.type.charAt(0).toUpperCase() + book.type.slice(1)}</div>
                        </div>
                        <div class="book-info">
                            <h2>${book.title}</h2>
                            <div class="book-meta">
                                <span><i class="fas fa-users"></i> ${book.author}</span>
                                <span><i class="fas fa-paint-brush"></i> Ilustrador: ${book.illustrator}</span>
                                <span><i class="fas fa-calendar"></i> ${book.releaseDate}</span>
                            </div>
                            <p class="book-description">${book.description}</p>
                        </div>
                    </div>
                `,
          )
          .join("")
      }
    }
  
    loadBooksFromLocalStorage()
  })
  
  function loadPageSpecificCommands() {
    const audioDescriptions = JSON.parse(localStorage.getItem("audioDescriptions") || "{}")
    window.pageCommands = audioDescriptions["books.html"] || {}
    console.log("Comandos carregados para a página de Livros:", window.pageCommands)
  }
  
  