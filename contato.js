const formAudioEnabled = false

document.addEventListener("DOMContentLoaded", () => {
  loadPageSpecificCommands()
  loadContactInfo()
  setupFormSubmission()
  const form = document.getElementById("contactForm")
  const statusMessage = document.getElementById("statusMessage")
  const searchInput = document.getElementById("searchInput")
  const searchButton = document.getElementById("searchButton")
  const nameInput = document.getElementById("name")
  const emailInput = document.getElementById("email")
  const messageInput = document.getElementById("message")

  // Auto-focus the search input when the page loads
  searchInput.focus()

  function speak(text) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel() // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "pt-BR"
      window.speechSynthesis.speak(utterance)
    }
  }

  function stopSpeech() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }

  function getPageDescription() {
    const mainContent = document.querySelector("main")
    const formSection = document.querySelector(".contact-form")
    const footerContent = document.querySelector("footer")

    // Clone the main content to avoid modifying the original
    const mainClone = mainContent.cloneNode(true)

    // Remove the form and footer sections from the clone
    const formToRemove = mainClone.querySelector(".contact-form")
    if (formToRemove) formToRemove.remove()

    // Get the text content of the remaining elements
    return mainClone.innerText.trim()
  }

  function getEmailClientUrl(userEmail, subject, body) {
    const domain = userEmail.split("@")[1].toLowerCase()
    const recipientEmail = "labcipo.ufra@gmail.com" // Email fixo para receber as mensagens

    if (domain.includes("gmail.com")) {
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    } else if (domain.includes("outlook.com") || domain.includes("hotmail.com")) {
      return `https://outlook.office.com/mail/deeplink/compose?to=${recipientEmail}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    } else {
      return `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
  }

  function handleNavigation(term) {
    const pages = {
      inicio: "index.html",
      começo: "index.html",
      home: "index.html",
      sobre: "sobre-nos.html",
      news: "index.html#cipo-news",
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

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    console.log("Termo de pesquisa:", searchTerm) // Log para debugging

    if (window.pageCommands && window.pageCommands[searchTerm]) {
      console.log("Comando específico encontrado:", window.pageCommands[searchTerm])
      speak(window.pageCommands[searchTerm])
    } else if (searchTerm === "contato1") {
      const contactContent = getContactContent()
      console.log("Conteúdo da página de contato:", contactContent)
      speak(contactContent)
    } else {
      console.log("Comando não reconhecido, tentando navegação")
      handleNavigation(searchTerm)
    }
  }

  searchButton.addEventListener("click", () => {
    handleSearch()
  })

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchButton.click()
    }
  })

  // Stop speech when the page visibility changes
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSpeech()
    }
  })

  // Stop speech when clicking on navigation links
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", stopSpeech)
  })

  function setupFormSubmission() {
    const form = document.getElementById("contactForm")
    const statusMessage = document.getElementById("statusMessage")
    const nameInput = document.getElementById("name")
    const emailInput = document.getElementById("email")
    const messageInput = document.getElementById("message")

    function submitForm(event) {
      event.preventDefault()

      // Get trimmed values
      const name = nameInput.value.trim()
      const email = emailInput.value.trim()
      const message = messageInput.value.trim()

      // Clear previous status
      statusMessage.textContent = ""
      statusMessage.className = "status-message"

      // Validate fields
      if (!name || !email || !message) {
        statusMessage.textContent = "Por favor, preencha todos os campos."
        statusMessage.className = "status-message error"
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        statusMessage.textContent = "Por favor, insira um email válido."
        statusMessage.className = "status-message error"
        return
      }

      // Prepare email content
      const subject = "Novo contato do site CIPÓ"
      const body = `
  Relatório de Contato:
  
  Nome: ${name}
  Email: ${email}
  
  Mensagem:
  ${message}
  
  Este é um relatório automático gerado pelo formulário de contato do site CIPÓ.
          `.trim()

      // Get email client URL
      const mailtoLink = getEmailClientUrl(email, subject, body)

      // Open email client
      window.open(mailtoLink, "_blank")

      // Show success message
      statusMessage.textContent = "Mensagem preparada para envio. Por favor, verifique sua janela de e-mail."
      statusMessage.className = "status-message success"

      // Reset form
      form.reset()
    }

    // Handle form submission
    form.addEventListener("submit", submitForm)

    // Handle .fim submission
    messageInput.addEventListener("input", () => {
      if (messageInput.value.trim().endsWith(".fim")) {
        const event = new Event("submit")
        form.dispatchEvent(event)
      }
    })
  }

  emailInput.addEventListener("focus", () => {
    if (formAudioEnabled) {
      speak("Você está no campo de email.")
    }
  })

  messageInput.addEventListener("focus", () => {
    if (formAudioEnabled) {
      speak(
        "Você está no campo de mensagem. Após escrever sua dúvida, digite .fim no final para enviar automaticamente.",
      )
    }
  })

  nameInput.addEventListener("focus", () => {
    if (formAudioEnabled) {
      speak("Você está no campo de nome. Digite seu nome completo.")
    }
  })

  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (menuToggle && navMenu) {
    // Função para alternar o menu
    function toggleMenu(event) {
      event.preventDefault()
      event.stopPropagation()
      menuToggle.classList.toggle("active")
      navMenu.classList.toggle("active")
      console.log("Menu toggled") // Para debug
    }

    // Evento de clique no botão do menu
    menuToggle.addEventListener("click", toggleMenu)

    // Fechar menu ao clicar fora
    document.addEventListener("click", (event) => {
      if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        menuToggle.classList.remove("active")
        navMenu.classList.remove("active")
      }
    })

    // Fechar menu ao clicar em um link
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })

    // Prevenir que cliques dentro do menu fechem ele
    navMenu.addEventListener("click", (event) => {
      event.stopPropagation()
    })
  }
})

function loadContactInfo() {
  const emailAddress = localStorage.getItem("contactEmail") || "Email não disponível"
  const emailElement = document.getElementById("contactEmail")
  const emailLink = document.getElementById("contactEmailLink")

  if (emailElement && emailLink) {
    emailElement.textContent = emailAddress

    if (emailAddress !== "Email não disponível") {
      emailLink.href = `mailto:${emailAddress}`
    } else {
      emailLink.removeAttribute("href")
      emailLink.style.pointerEvents = "none"
      emailLink.style.color = "inherit"
      emailLink.style.textDecoration = "none"
    }
  }

  // Phone
  document.getElementById("contactPhone").textContent =
    localStorage.getItem("contactPhone") || "Telefone não disponível"

  // Address
  document.getElementById("contactAddress").textContent =
    localStorage.getItem("contactAddress") || "Endereço não disponível"

  // Hours
  document.getElementById("contactHours").textContent = localStorage.getItem("contactHours") || "Horário não disponível"

  // Instagram handling
  const instagramHandle = localStorage.getItem("contactInstagram") || "Instagram não disponível"
  const instagramUrl = localStorage.getItem("contactInstagramUrl") || "#"
  const instagramDescription = localStorage.getItem("contactInstagramDescription") || ""

  const instagramElement = document.getElementById("contactInstagram")
  const instagramLink = document.getElementById("contactInstagramLink")
  const instagramDescElement = document.getElementById("contactInstagramDescription")

  if (instagramElement && instagramLink && instagramDescElement) {
    instagramElement.textContent = instagramHandle
    instagramLink.href = instagramUrl
    instagramDescElement.textContent = instagramDescription

    if (instagramHandle === "Instagram não disponível") {
      instagramLink.style.pointerEvents = "none"
      instagramLink.style.textDecoration = "none"
      instagramLink.style.color = "inherit"
    }
  }
}

function loadPageSpecificCommands() {
  const audioDescriptions = JSON.parse(localStorage.getItem("audioDescriptions") || "{}")
  window.pageCommands = audioDescriptions["contact.html"] || {}
  console.log("Comandos carregados para a página de Contato:", window.pageCommands)
}


