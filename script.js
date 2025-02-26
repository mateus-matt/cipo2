document.addEventListener("DOMContentLoaded", () => {
  // Carousel functionality
  const carousel = document.querySelector("#heroCarousel")
  const items = carousel.querySelectorAll(".carousel-item")
  const indicators = carousel.querySelectorAll(".carousel-indicators li")
  const totalItems = items.length
  let currentIndex = 0
  let isAnimating = false

   // Carousel functionality
   initializeCarousel()

   // Mobile Menu Functionality
   initializeMobileMenu()
 
   // Audio description functionality
   initializeAudioDescription()
 
   // Load stored content
   loadStoredContent()

    // Chame esta função no início do carregamento da página
   loadPageSpecificCommands()

   setupSmoothScroll()

  function showSlide(index) {
    if (isAnimating) return
    isAnimating = true

    const currentItem = carousel.querySelector(".carousel-item.active")
    const currentIndicator = carousel.querySelector(".carousel-indicators .active")

    currentItem.classList.remove("active")
    currentIndicator.classList.remove("active")

    items[index].classList.add("active")
    indicators[index].classList.add("active")

    setTimeout(() => {
      isAnimating = false
    }, 600)
  }

  carousel.querySelector(".carousel-control-prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems
    showSlide(currentIndex)
  })

  carousel.querySelector(".carousel-control-next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % totalItems
    showSlide(currentIndex)
  })

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      if (currentIndex !== index) {
        currentIndex = index
        showSlide(currentIndex)
      }
    })
  })

  let intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalItems
    showSlide(currentIndex)
  }, 5000)

  carousel.addEventListener("mouseenter", () => {
    clearInterval(intervalId)
  })

  carousel.addEventListener("mouseleave", () => {
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalItems
      showSlide(currentIndex)
    }, 5000)
  })

  // Mobile Menu Functionality
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")
  const dropdowns = document.querySelectorAll(".dropdown")

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
  let recognition
  let isListening = false
  let timer = null
  let lastSpeechTime = 0

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
    return "Bem-vindos ao CIPÓ. Laboratório interdisciplinar de empreendedorismo, inovação e inclusão das Amazônias. Neste site contém um menu onde tem o home, sobre-nós, CIPÓ news, em extensões: projetos, pesquisa, livros e contatos. Para navegar pelo site, você pode dizer: 'home' para a página inicial, 'notícias' ou 'cipo news' para as notícias do CIPÓ, 'livros' para nossa biblioteca, 'pesquisas' para nossas pesquisas, 'projetos' para nossos projetos, ou 'contatos' para mais informações. Digite ou fale o que deseja para navegar."
  }

  function getNewsDescription(index) {
    const news = {
      0: "Notícia 1: Lançamento do livro 'As Aventuras de Superlimpo & Crespinha'. O autor realizou uma sessão de autógrafos, vestindo uma camiseta do CIPÓ. O livro apresenta uma aventura que combina diversão e aprendizado sobre higiene e diversidade.",
      1: "Notícia 2: Seminário sobre Sustentabilidade na Amazônia. Participantes se reuniram para discutir práticas sustentáveis e preservação ambiental na região amazônica.",
      2: "Notícia 3: Arte educativa sobre cultura indígena. Uma ilustração destacando elementos da cultura indígena, com foco na educação e preservação das tradições.",
      3: "Notícia 4: Dia da Árvore. Uma campanha de conscientização com o slogan 'Proteger a natureza é cuidar do futuro', incentivando a preservação ambiental.",
      4: "Notícia 5: Conscientização sobre o Autismo. Uma campanha para aumentar a conscientização sobre o autismo, promovendo respeito, empatia e valorização das pessoas autistas.",
    }
    if (index >= Object.keys(news).length) {
      return `Notícia ${index + 1}: No momento, não temos informações sobre esta notícia. Por favor, verifique novamente mais tarde.`
    }
    return news[index] || `Notícia ${index + 1}: Notícia não encontrada`
  }

  function getCipoNewsContent() {
    const cipoNewsSection = document.getElementById("cipo-news")
    if (!cipoNewsSection) return "Não foi possível encontrar a seção CIPÓ News."

    const newsCards = cipoNewsSection.querySelectorAll(".news-card")
    let content = "CIPÓ News: "

    newsCards.forEach((card, index) => {
      content += getNewsDescription(index) + " "
    })

    return content
  }

  function getCurrentPage() {
    return window.location.pathname.split("/").pop(); // Retorna o nome do arquivo HTML
  }

  function handleNavigation(term) {
    const audioDescriptions = JSON.parse(localStorage.getItem("audioDescriptions") || "{}");
    const currentPage = getCurrentPage();

    // Verifica audiodescrições em todas as páginas
    for (const page in audioDescriptions) {
      if (audioDescriptions[page][term]) {
        speak(audioDescriptions[page][term])
        return // Retorna se encontrar uma audiodescrição
      }
    }

    // Comandos especiais que não requerem navegação
    if (audioDescriptions[currentPage] && audioDescriptions[currentPage][term]) {
      speak(audioDescriptions[currentPage][term]); // Executa apenas se o comando pertence à página atual
      return;
    }

    // Se não encontrar audiodescrição, tenta navegação
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
      "cipo news": "index.html#cipo-news",
      "cipó news": "index.html#cipo-news",
      extensão: "extensao.html",
      pesquisas: "pesquisas.html",
      pesquisa: "pesquisas.html",
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
      livro: "livros.html",
      books: "livros.html",
      book: "livros.html",
      contatos: "contato.html",
      contato: "contato.html",
    }

    // Normaliza o termo de busca removendo acentos e convertendo para minúsculas
    const normalizedTerm = term
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    // Tenta encontrar uma correspondência nas páginas
    for (const key in pages) {
      const normalizedKey = key
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
      if (normalizedTerm.includes(normalizedKey)) {
        window.location.href = pages[key]
        return
      }
    }

    // Se não encontrar nenhuma correspondência, fornece feedback por voz
    speak("Comando não reconhecido. Por favor, tente novamente.")
  }

  if ("webkitSpeechRecognition" in window) {
    const webkitSpeechRecognition = window.webkitSpeechRecognition
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
          handleNavigation(result)
        }
      }, 2000)
    }

    recognition.onend = () => {
      if (isListening) {
        recognition.start()
        startTimer()
      }
    }

    recognition.onstart = () => {
      isListening = true
      searchButton.classList.add("listening")
      searchButton.querySelector("i").className = "fas fa-microphone"
    }
  }
  
  async function startListening() {
    await speak("Microfone ativado")
    isListening = true
    searchButton.classList.add("listening")
    searchButton.querySelector("i").className = "fas fa-microphone"
    recognition.start()
    startTimer()
  }

  async function stopListening() {
    isListening = false
    clearTimeout(timer)
    await speak("Microfone desativado")
    recognition.stop()
    searchButton.classList.remove("listening")
    searchButton.querySelector("i").className = "fas fa-search"
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
        await stopListening()
        await speak("Microfone desativado por inatividade")
      }
    }, 8000)
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "F4") {
      event.preventDefault()
      toggleMicrophone()
    }
  })

  searchButton.addEventListener("click", handleSearch)

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    if (searchTerm) {
      handleNavigation(searchTerm)
    }
  }

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  })

  function loadLocalContent() {
    // Carregar texto de boas-vindas
    const storedWelcomeText = localStorage.getItem("welcomeText")
    if (storedWelcomeText) {
      document.querySelector(".hero-content p").textContent = storedWelcomeText
    }

    // Carregar imagens do carrossel
    const carouselItems = document.querySelectorAll("#heroCarousel .carousel-item img")
    carouselItems.forEach((item, index) => {
      const storedImage = localStorage.getItem(`carouselImage${index + 1}`)
      if (storedImage) {
        item.src = storedImage
      }
    })

    // Carregar notícias
    const storedNews = JSON.parse(localStorage.getItem("cipoNews") || "[]")
    updateNewsGrid(storedNews)
  }

  function loadCoursesFromLocalStorage() {
    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    const coursesGrid = document.querySelector(".courses-grid")

    if (coursesGrid) {
      coursesGrid.innerHTML = courses
        .map(
          (course) => `
                <div class="course-card">
                    <h2>${course.title}</h2>
                    <p>Duração: ${course.duration} horas</p>
                    <p>${course.description}</p>
                </div>
            `,
        )
        .join("")
    }
  }

  loadCoursesFromLocalStorage()

  function playAudioDescription(index) {
    const newsItems = JSON.parse(localStorage.getItem("cipoNews") || "[]")
    const item = newsItems[index]
    if (item && item.audioDescription) {
      speak(item.audioDescription)
    } else {
      speak("Desculpe, não há audiodescrição disponível para esta notícia.")
    }
  }

  // Call the function to load stored content
  document.addEventListener("DOMContentLoaded", loadStoredContent)

  //rest of the code remains the same

  function initializeCarousel() {
    const carousel = document.querySelector("#heroCarousel")
    const items = carousel.querySelectorAll(".carousel-item")
    const indicators = carousel.querySelectorAll(".carousel-indicators li")
    const totalItems = items.length
    let currentIndex = 0
    let isAnimating = false
  
    function showSlide(index) {
      if (isAnimating) return
      isAnimating = true
  
      const currentItem = carousel.querySelector(".carousel-item.active")
      const currentIndicator = carousel.querySelector(".carousel-indicators .active")
  
      currentItem.classList.remove("active")
      currentIndicator.classList.remove("active")
  
      items[index].classList.add("active")
      indicators[index].classList.add("active")
  
      setTimeout(() => {
        isAnimating = false
      }, 600)
    }
  
    carousel.querySelector(".carousel-control-prev").addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems
      showSlide(currentIndex)
    })
  
    carousel.querySelector(".carousel-control-next").addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalItems
      showSlide(currentIndex)
    })
  
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        if (currentIndex !== index) {
          currentIndex = index
          showSlide(currentIndex)
        }
      })
    })
  
    let intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalItems
      showSlide(currentIndex)
    }, 5000)
  
    carousel.addEventListener("mouseenter", () => {
      clearInterval(intervalId)
    })
  
    carousel.addEventListener("mouseleave", () => {
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems
        showSlide(currentIndex)
      }, 5000)
    })
  }
  
  function initializeMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle")
    const navMenu = document.querySelector(".nav-menu")
    const dropdowns = document.querySelectorAll(".dropdown")

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
  }
  
  function initializeAudioDescription() {
    const searchInput = document.getElementById("searchInput")
    const searchButton = document.getElementById("searchButton")
    let recognition
    let isListening = false
    const timer = null
  
    searchInput.focus()
  
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
          console.error("Navegador não suporta síntese de voz")
          resolve()
        }
      })
    }
  
    function getWelcomeMessage() {
      const homeData = JSON.parse(localStorage.getItem("homeData") || "{}")
      return homeData.welcomeText || "Bem-vindo ao Projeto CIPÓ"
    }
  
    function handleCommand(command) {
      const normalizedCommand = command.toLowerCase().trim()
  
      // Verifica se há um comando específico para a página atual
      if (window.pageCommands && window.pageCommands[normalizedCommand]) {
        speak(window.pageCommands[normalizedCommand])
        return
      }
  
      // Navegação entre páginas
      const pages = {
        inicio: "index.html",
        home: "index.html",
        sobre: "sobre-nos.html",
        noticias: "index.html#cipo-news",
        pesquisas: "pesquisas.html",
        cursos: "cursos.html",
        palestras: "palestras.html",
        eventos: "eventos.html",
        projetos: "projetos.html",
        livros: "livros.html",
        contato: "contato.html",
      }
  
      for (const [key, url] of Object.entries(pages)) {
        if (normalizedCommand.includes(key)) {
          window.location.href = url
          return
        }
      }
  
      speak("Comando não reconhecido. Por favor, tente novamente.")
    }
  
    if (typeof webkitSpeechRecognition !== "undefined") {
      recognition = new webkitSpeechRecognition()
      recognition.continuous = false
      recognition.lang = "pt-BR"
      recognition.interimResults = false
      recognition.maxAlternatives = 1
  
      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript
        console.log("Comando de voz reconhecido:", result)
        handleCommand(result)
      }
  
      recognition.onend = () => {
        if (isListening) {
          recognition.start()
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
  
    async function toggleMicrophone() {
      if (isListening) {
        await stopListening()
      } else {
        await startListening()
      }
    }
  
    async function startListening() {
      await speak("Microfone ativado")
      isListening = true
      recognition.start()
    }
  
    async function stopListening() {
      isListening = false
      await speak("Microfone desativado")
      recognition.stop()
    }
  
    searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim()
      if (searchTerm) {
        handleCommand(searchTerm)
      } else {
        toggleMicrophone()
      }
    })
  
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const searchTerm = searchInput.value.trim()
        if (searchTerm) {
          handleCommand(searchTerm)
        }
      }
    })
  
    document.addEventListener("keydown", (event) => {
      if (event.key === "F4") {
        event.preventDefault()
        toggleMicrophone()
      }
    })
  }
  
  function loadStoredContent() {
    // Carregar texto de boas-vindas
    const homeData = JSON.parse(localStorage.getItem("homeData") || "{}")
    if (homeData.welcomeText) {
      const welcomeTextElement = document.querySelector(".hero-content p")
      if (welcomeTextElement) {
        welcomeTextElement.textContent = homeData.welcomeText
      }
    }
  
    // Carregar imagens do carrossel
    if (homeData.carouselImages) {
      const carouselItems = document.querySelectorAll("#heroCarousel .carousel-item img")
      carouselItems.forEach((item, index) => {
        if (homeData.carouselImages[index]) {
          item.src = homeData.carouselImages[index]
        }
      })
    }
  
    // Carregar notícias
    loadNewsItems()
  }

  function loadNewsItems() {
    const newsGrid = document.querySelector(".news-grid")
    const news = JSON.parse(localStorage.getItem("cipoNews") || "[]")
  
    if (newsGrid) {
      newsGrid.innerHTML =
        news.length === 0
          ? "<p>Nenhuma notícia cadastrada.</p>"
          : news
              .map(
                (item, index) => `
            <div class="news-card">
              ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}">` : ""}
              <div class="news-content">
                <h3>${item.title}</h3>
                <p>${item.content}</p>
              </div>
            </div>
          `,
              )
              .join("")
    }
  }
  
  function loadPageSpecificCommands() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html"
    const audioDescriptions = JSON.parse(localStorage.getItem("audioDescriptions") || "{}")
    window.pageCommands = audioDescriptions[currentPage] || {}
    console.log(`Comandos carregados para a página ${currentPage}:`, window.pageCommands)
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
          })
        }
      })
    })
  }
  

})



