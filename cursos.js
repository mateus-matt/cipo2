document.addEventListener("DOMContentLoaded", () => {
    loadPageSpecificCommands()
    const menuToggle = document.querySelector(".menu-toggle")
    const navMenu = document.querySelector(".nav-menu")
    const dropdowns = document.querySelectorAll(".dropdown")
    const searchInput = document.getElementById("searchInput")
    const searchButton = document.getElementById("searchButton")
    console.log("DOM carregado, iniciando carregamento dos cursos...")
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
    function loadCoursesFromLocalStorage() {
      const coursesGrid = document.querySelector(".courses-grid")
      if (!coursesGrid) {
        console.error("Elemento courses-grid não encontrado")
        return
      }
  
      coursesGrid.innerHTML = ""
  
      try {
        const courses = JSON.parse(localStorage.getItem("courses") || "[]")
        console.log("Cursos carregados:", courses)
  
        if (courses.length === 0) {
          coursesGrid.innerHTML = `
                        <div class="course-card">
                            <h2>Introdução a Libras</h2>
                            <p class="description">Aprendendo libras</p>
                        </div>
                        <div class="course-card">
                            <h2>Curso de desenho (Exclusivo para TEA)</h2>
                            <p class="description">Curso GRATUITO e acolhedor e feito para despertar a criatividade de pessoas com Transtorno do Espectro Autista.</p>
                        </div>
                    `
          return
        }
  
        const coursesHTML = courses
          .map(
            (course) => `
                    <div class="course-card">
                        <h2>${course.title || ""}</h2>
                        ${course.duration ? `<p class="duration"><strong>Duração:</strong> ${course.duration} horas</p>` : ""}
                        ${
                          course.teacherType
                            ? `
                            <p class="teacher">
                                <strong>Responsável:</strong> ${formatTeacherType(course.teacherType)}
                                ${course.teacherName ? `${course.teacherName}` : ""}
                            </p>
                        `
                            : ""
                        }
                        ${course.schedule ? `<p class="schedule"><strong>Horário:</strong> ${course.schedule}</p>` : ""}
                        ${course.startDate ? `<p class="dates"><strong>Início:</strong> ${formatDate(course.startDate)}</p>` : ""}
                        ${course.endDate ? `<p class="dates"><strong>Término:</strong> ${formatDate(course.endDate)}</p>` : ""}
                        <p class="description">${course.description || ""}</p>
                    </div>
                `,
          )
          .join("")
  
        coursesGrid.innerHTML = coursesHTML
        console.log("Cursos renderizados com sucesso")
      } catch (error) {
        console.error("Erro ao carregar cursos:", error)
        coursesGrid.innerHTML = `
                    <div class="course-card error">
                        <p>Erro ao carregar os cursos. Por favor, tente novamente mais tarde.</p>
                    </div>
                `
      }
    }
  
    // Função auxiliar para formatar o tipo de professor
    function formatTeacherType(type) {
      const types = {
        professor: "Professor",
        professora: "Professora",
        professores: "Professores",
        Doutor: "Dr.",
        Doutora: "Dra.",
        Mestre: "Ms.",
      }
      return types[type] || type
    }
  
    // Função auxiliar para formatar datas
    function formatDate(dateString) {
      if (!dateString) return ""
      try {
        return new Date(dateString).toLocaleDateString("pt-BR")
      } catch (error) {
        console.error("Erro ao formatar data:", error)
        return dateString
      }
    }
  
    loadCoursesFromLocalStorage()
  
    // Speech recognition setup
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognition = new SpeechRecognition()
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
      return "Bem-vindo à página de Cursos do Projeto CIPÓ. Aqui você encontrará informações sobre nossos cursos disponíveis. Digite 'cursos1' para ouvir uma descrição de todos os cursos, ou digite 'c1', 'c2', 'c3' para ouvir sobre cada curso individualmente. Para navegar pelo site, você pode dizer: 'home', 'sobre', 'notícias', 'extensão', 'pesquisas', 'palestras', 'eventos', 'livros' ou 'contatos'."
    }
  
    function getCourseDescription(index) {
      const courses = {
        1: "Sustentabilidade na Amazônia. Duração: 40 horas. Aprenda sobre práticas sustentáveis e preservação ambiental na região amazônica.",
        2: "Empreendedorismo Social. Duração: 30 horas. Desenvolva habilidades para criar negócios com impacto social positivo.",
        3: "Tecnologias para Inclusão. Duração: 25 horas. Explore ferramentas e tecnologias para promover a inclusão social e digital.",
      }
      return courses[index] || "Curso não encontrado."
    }
  
    function getCoursesContent() {
      const coursesSection = document.querySelector(".courses-grid")
      if (!coursesSection) return "Não foi possível encontrar a seção de cursos."
  
      const courseCards = coursesSection.querySelectorAll(".course-card")
      let content = "Nossos Cursos: "
  
      courseCards.forEach((card, index) => {
        const title = card.querySelector("h2").textContent
        const description = card.querySelector("p:last-child").textContent
        content += `Curso ${index + 1}: ${title}. ${description} `
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
      } else if (searchTerm === "cursos1") {
        const coursesContent = getCoursesContent()
        console.log("Conteúdo dos cursos:", coursesContent)
        speak(coursesContent)
      } else if (searchTerm.match(/^c\\d+$/)) {
        const courseNumber = Number.parseInt(searchTerm.substring(1))
        const description = getCourseDescription(courseNumber)
        console.log("Descrição do curso:", description)
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
  
    // Recarregar cursos quando houver mudanças no localStorage
    window.addEventListener("storage", (e) => {
      if (e.key === "courses") {
        console.log("Mudança detectada no localStorage, recarregando cursos...")
        loadCoursesFromLocalStorage()
      }
    })
  
    function loadPageSpecificCommands() {
      const audioDescriptions = JSON.parse(localStorage.getItem("audioDescriptions") || "{}")
      window.pageCommands = audioDescriptions["courses.html"] || {}
      console.log("Comandos carregados para a página de Cursos:", window.pageCommands)
    }
  })
  
  