// Função para verificar se as funções do GitHub estão disponíveis
async function checkGitHubAPI() {
  if (
    typeof window.GitHubAPI === "undefined" ||
    typeof window.GitHubAPI.getFileContent === "undefined" ||
    typeof window.GitHubAPI.updateFileContent === "undefined"
  ) {
    console.error("GitHub API async functions not loaded. Please check if github-hub.js is loaded correctly.")
    return false
  }
  return true
}

// Função para carregar a API do GitHub
async function loadGitHubAPI() {
  if (checkGitHubAPI()) {
    console.log("GitHub API functions loaded successfully")
  } else {
    console.error("Failed to load GitHub API functions")
  }
}

// Usar as funções do GitHub através do namespace global
async function exampleUseOfGitHubAPI() {
  if (!checkGitHubAPI()) return

  try {
    const content = await window.GitHubAPI.getFileContent("repo", "path", "token")
    console.log("File content:", content)
  } catch (error) {
    console.error("Error getting file content:", error)
  }
}

async function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Função de logging
async function log(message, type = "info") {
  const types = {
    info: "color: blue",
    error: "color: red",
    success: "color: green",
  }
  console.log(`%c[${type.toUpperCase()}] ${message}`, types[type] || types.info)
}

document.addEventListener("DOMContentLoaded", async () => {
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")

      // Animação opcional para o ícone do menu
      const spans = menuToggle.querySelectorAll("span")
      spans.forEach((span) => span.classList.toggle("active"))
    })
  }

  // Adicionar funcionalidade ao botão Voltar para o Site
  const backToSiteBtn = document.querySelector("#backToSiteBtn")
  if (backToSiteBtn) {
    backToSiteBtn.addEventListener("click", () => {
      const confirmExit = confirm("Tem certeza que deseja voltar para o site principal?")
      if (confirmExit) {
        window.location.href = "index.html"
      }
    })
  }

  try {
    await loadContact()
  } catch (error) {
    console.error("Erro na inicialização:", error)
  }

  const loadContactButton = document.getElementById("loadContactButton")
  if (loadContactButton) {
    loadContactButton.addEventListener("click", loadContact)
  }

  // Verificar autenticação
  if (typeof getFileContent !== "function") {
    console.error("getFileContent is not available. Make sure GitHub API is loaded.")
  } else {
    getFileContent().then((data) => console.log("Arquivo carregado:", data))
  }

  // Attach click handlers directly to buttons
  const buttons = {
    homeBtn: loadHome,
    aboutBtn: loadAbout,
    researchBtn: loadResearch,
    projectsBtn: loadProjects,
    coursesBtn: loadCourses,
    eventsBtn: loadEvents,
    lecturesBtn: loadLectures,
    booksBtn: loadBooks,
    contactBtn: loadContact,
    logoutBtn: logout,
  }

  // Attach event listeners
  Object.entries(buttons).forEach(([id, handler]) => {
    const button = document.getElementById(id)
    if (button) {
      button.onclick = handler
    } else {
      console.error(`Button with id ${id} not found`)
    }
  })

  // Load initial content
  await loadHome()
  await loadExistingProjects()
  // Remova esta linha se a função não for necessária
  // loadStoredContent()
  loadProjects()
  await loadTeamMembers()
  await loadAudioDescriptions()

  // Chame esta função no início do seu script
loadGitHubAPI()
// Chame esta função quando necessário
exampleUseOfGitHubAPI()


  const projectForm = document.getElementById("projectForm")
  if (projectForm) {
    projectForm.addEventListener("submit", handleProjectSubmit)
  } else {
    console.error("Elemento projectForm não encontrado")
  }
})

async function navigateTo(section) {
  // Atualizar a seção atual
  document.getElementById("currentSection").textContent = section.charAt(0).toUpperCase() + section.slice(1)

  // Limpar o conteúdo atual
  const contentArea = document.getElementById("contentArea")
  contentArea.innerHTML = ""

  // Carregar o conteúdo da seção selecionada
  switch (section) {
    case "home":
      loadHomeContent()
      break
    case "projects":
      loadProjectsContent()
      break
    // Adicione casos para outras seções conforme necessário
    default:
      contentArea.innerHTML = `<h2>Conteúdo para ${section} em desenvolvimento</h2>`
  }
}

async function initializeAdmin() {
  await loadGitHubAPI()

  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }

  // Add event listeners for all admin functions
  document.getElementById("homeBtn").addEventListener("click", loadHome)
  document.getElementById("aboutBtn").addEventListener("click", loadAbout)
  document.getElementById("researchBtn").addEventListener("click", loadResearch)
  document.getElementById("projectsBtn").addEventListener("click", loadProjects)
  document.getElementById("coursesBtn").addEventListener("click", loadCourses)
  document.getElementById("eventsBtn").addEventListener("click", loadEvents)
  document.getElementById("lecturesBtn").addEventListener("click", loadLectures)
  document.getElementById("booksBtn").addEventListener("click", loadBooks)
  document.getElementById("contactBtn").addEventListener("click", loadContact)
  document.getElementById("logoutBtn").addEventListener("click", logout)

  // Load initial content
  await loadHome()
}
// Função para carregar conteúdo
async function loadContent(sectionName, content) {
  log(`Carregando seção: ${sectionName}`)
  const contentArea = document.getElementById("contentArea")
  if (!contentArea) {
    log("Elemento contentArea não encontrado", "error")
    return
  }

  // Clear existing content first
  contentArea.innerHTML = ""

  // Small delay to ensure DOM is ready
  setTimeout(() => {
    contentArea.innerHTML = content
    log(`Conteúdo carregado para: ${sectionName}`, "success")
  }, 0)
}

// Função para carregar o conteúdo da página inicial

async function loadHome() {
  try {
    log("Carregando página inicial do painel administrativo...")
    const contentArea = document.getElementById("contentArea")

    if (!contentArea) {
      throw new Error("Elemento contentArea não encontrado!")
    }

    contentArea.innerHTML = `
      <h2>Gerenciar Página Inicial</h2>
      <div class="form-section">
        <h3>Texto de Boas-vindas</h3>
        <form id="welcomeTextForm">
          <div class="form-group">
            <label for="welcomeText">Texto de Boas-vindas</label>
            <textarea id="welcomeText" name="welcomeText" rows="4" required></textarea>
          </div>
          <button type="submit" class="btn-primary">Salvar Texto</button>
        </form>
      </div>

      <div class="form-section">
        <h3>Imagens do Carrossel</h3>
        <form id="carouselImagesForm">
          <div class="form-group">
            <label for="carouselImage1">Imagem 1</label>
            <input type="file" id="carouselImage1" name="carouselImage1" accept="image/*">
          </div>
          <div class="form-group">
            <label for="carouselImage2">Imagem 2</label>
            <input type="file" id="carouselImage2" name="carouselImage2" accept="image/*">
          </div>
          <div class="form-group">
            <label for="carouselImage3">Imagem 3</label>
            <input type="file" id="carouselImage3" name="carouselImage3" accept="image/*">
          </div>
          <button type="submit" class="btn-primary">Salvar Imagens do Carrossel</button>
        </form>
      </div>

      <div class="form-section">
        <h3>CIPÓ News</h3>
        <form id="newsForm">
          <div class="form-group">
            <label for="newsTitle">Título da Notícia</label>
            <input type="text" id="newsTitle" name="title" required>
          </div>
          <div class="form-group">
            <label for="newsContent">Conteúdo da Notícia</label>
            <textarea id="newsContent" name="content" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label for="newsAudioDescription">Audiodescrição da Notícia</label>
            <textarea id="newsAudioDescription" name="audioDescription" rows="4"></textarea>
          </div>
          <div class="form-group">
            <label for="newsImage">Imagem da Notícia</label>
            <input type="file" id="newsImage" name="image" accept="image/*">
          </div>
          <button type="submit" class="btn-primary">Adicionar Notícia</button>
        </form>
      </div>

      <div class="form-section">
        <h3>Notícias Existentes</h3>
        <div id="newsList"></div>
      </div>
    `

    // Adicionar event listeners
    document.getElementById("welcomeTextForm").addEventListener("submit", handleWelcomeTextSubmit)
    document.getElementById("carouselImagesForm").addEventListener("submit", handleCarouselImagesSubmit)
    document.getElementById("newsForm").addEventListener("submit", handleNewsSubmit)

    // Carregar dados existentes
    await loadExistingHomeData()

    log("Página inicial carregada com sucesso!", "success")
  } catch (error) {
    log(`Erro ao carregar página inicial: ${error.message}`, "error")
    showMessage("Erro ao carregar página inicial. Por favor, tente novamente.", "error")
  }
}
window.adminFunctions.loadHome = loadHome

async function handleWelcomeTextSubmit(event) {
  event.preventDefault()
  const welcomeText = document.getElementById("welcomeText").value
  await saveWelcomeText(welcomeText)
}

async function handleCarouselImagesSubmit(event) {
  event.preventDefault()
  const files = [
    document.getElementById("carouselImage1").files[0],
    document.getElementById("carouselImage2").files[0],
    document.getElementById("carouselImage3").files[0],
  ]
  await saveCarouselImages(files)
}

async function handleNewsSubmit(event) {
  event.preventDefault()
  console.log("Função handleNewsSubmit chamada")

  const title = document.getElementById("newsTitle").value
  const content = document.getElementById("newsContent").value
  const image = document.getElementById("newsImage").files[0]

  if (!title || !content) {
    alert("Por favor, preencha todos os campos obrigatórios.")
    return
  }

  try {
    const imageUrl = ""
    if (image) {
      // Lógica para upload da imagem, se necessário
      // imageUrl = await uploadImage(image);
    }

    const newsItem = {
      title,
      content,
      imageUrl,
      date: new Date().toISOString(),
    }

    // Carregar notícias existentes
    const existingNews = JSON.parse(await window.GitHubAPI.getFileContent("newsData")) || []

    // Adicionar nova notícia
    existingNews.push(newsItem)

    // Salvar notícias atualizadas
    await storage.setItem("newsData", JSON.stringify(existingNews))

    alert("Notícia adicionada com sucesso!")

    // Limpar formulário
    document.getElementById("newsForm").reset()

    // Recarregar a lista de notícias
    await loadNewsItems()
  } catch (error) {
    console.error("Erro ao adicionar notícia:", error)
    alert("Ocorreu um erro ao adicionar a notícia. Por favor, tente novamente.")
  }
}

async function loadExistingHomeData() {
  // Carregar texto de boas-vindas
  const homeData = JSON.parse((await window.GitHubAPI.getFileContent("homeData")) || "{}")
  if (homeData.welcomeText) {
    document.getElementById("welcomeText").value = homeData.welcomeText
  }

  // Carregar notícias existentes
  await loadNewsItems()
}

async function saveWelcomeText(welcomeText) {
  const homeData = JSON.parse((await window.getFileContent("homeData")) || "{}")
  homeData.welcomeText = welcomeText
  await window.storage.setItem("homeData", JSON.stringify(homeData))
  showMessage("Texto de boas-vindas salvo com sucesso!", "success")
}

async function saveCarouselImages(files) {
  const homeData = JSON.parse((await window.GitHubAPI.getFileContent("homeData")) || "{}")
  homeData.carouselImages = homeData.carouselImages || []

  const promises = files.map((file, index) => {
    if (file) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          homeData.carouselImages[index] = e.target.result
          resolve()
        }
        reader.readAsDataURL(file)
      })
    } else {
      return Promise.resolve()
    }
  })

  await Promise.all(promises).then(async () => {
    await storage.setItem("homeData", JSON.stringify(homeData))
    showMessage("Imagens do carrossel salvas com sucesso!", "success")
  })
}

async function saveNewsItem(newsItem) {
  const existingNews = JSON.parse((await window.GitHubAPI.getFileContent("cipoNews")) || "[]")
  existingNews.push(newsItem)
  await storage.setItem("cipoNews", JSON.stringify(existingNews))
  showMessage("Notícia adicionada com sucesso!", "success")
  document.getElementById("newsForm").reset()
  await loadNewsItems()
}

async function loadNewsItems() {
  const newsListContainer = document.getElementById("newsList")
  const news = JSON.parse((await window.GitHubAPI.getFileContent("cipoNews")) || "[]")
  newsListContainer.innerHTML =
    news.length === 0
      ? "<p>Nenhuma notícia cadastrada.</p>"
      : news
          .map(
            (item, index) => `
        <div class="item-card">
          <h4>${item.title}</h4>
          <p>${item.content}</p>
          ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" style="max-width: 200px;">` : ""}
          <p><strong>Audiodescrição:</strong> ${item.audioDescription || "Não definida"}</p>
          <div class="item-actions">
            <button onclick="editNewsItem(${index})" class="btn-edit">Editar</button>
            <button onclick="deleteNewsItem(${index})" class="btn-delete">Excluir</button>
          </div>
        </div>
      `,
          )
          .join("")
}

async function editNewsItem(index) {
  const news = JSON.parse((await window.GitHubAPI.getFileContent("cipoNews")) || "[]")
  const item = news[index]

  const contentArea = document.getElementById("contentArea")
  contentArea.innerHTML = `
    <h2>Editar Notícia</h2>
    <div class="form-section edit-form">
      <form id="editNewsForm" class="edit-news-form">
        <input type="hidden" id="editNewsIndex" value="${index}">
        
        <div class="form-group">
          <label for="editNewsTitle">Título da Notícia</label>
          <input type="text" id="editNewsTitle" name="title" value="${item.title}" required>
        </div>

        <div class="form-group">
          <label for="editNewsContent">Conteúdo da Notícia</label>
          <textarea id="editNewsContent" name="content" rows="4" required>${item.content}</textarea>
        </div>

        <div class="form-group">
          <label for="editNewsAudioDescription">Audiodescrição da Notícia</label>
          <textarea id="editNewsAudioDescription" name="audioDescription" rows="4">${item.audioDescription || ""}</textarea>
        </div>

        <div class="form-group">
          <label for="editNewsImage">Nova Imagem da Notícia (opcional)</label>
          <input type="file" id="editNewsImage" name="image" accept="image/*">
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Salvar Alterações</button>
          <button type="button" onclick="loadHome()" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  `

  document.getElementById("editNewsForm").addEventListener("submit", handleEditNewsSubmit)
}

async function handleEditNewsSubmit(event) {
  event.preventDefault()
  const form = event.target
  const index = Number.parseInt(document.getElementById("editNewsIndex").value)
  const news = JSON.parse((await window.GitHubAPI.getFileContent("cipoNews")) || "[]")

  const updatedItem = {
    ...news[index],
    title: form.title.value,
    content: form.content.value,
    audioDescription: form.audioDescription.value,
  }

  const imageFile = form.image.files[0]
  if (imageFile) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      updatedItem.imageUrl = e.target.result
      await updateNewsItem(index, updatedItem)
    }
    reader.readAsDataURL(imageFile)
  } else {
    await updateNewsItem(index, updatedItem)
  }
}

async function updateNewsItem(index, updatedItem) {
  const news = JSON.parse((await window.GitHubAPI.getFileContent("cipoNews")) || "[]")
  news[index] = updatedItem
  await storage.setItem("cipoNews", JSON.stringify(news))
  showMessage("Notícia atualizada com sucesso!", "success")
  await loadHome()
}

async function deleteNewsItem(index) {
  if (confirm("Tem certeza que deseja excluir esta notícia?")) {
    const news = JSON.parse((await window.GitHubAPI.getFileContent("cipoNews")) || "[]")
    news.splice(index, 1)
    await storage.setItem("cipoNews", JSON.stringify(news))
    showMessage("Notícia excluída com sucesso!", "success")
    await loadNewsItems()
  }
}

async function initializeHomeImageUpload() {
  const homeImageUpload = document.getElementById("homeImageUpload")
  if (homeImageUpload) {
    homeImageUpload.addEventListener("change", handleHomeImageUpload)
  }
}

async function handleHomeImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target.result
      storage.setItem("homeImage", imageData)
      showMessage("Imagem da página inicial atualizada com sucesso!", "success")

      // Disparar um evento personalizado após o upload da imagem
      const customEvent = new Event("homeImageUpdated")
      window.dispatchEvent(customEvent)
    }
    reader.readAsDataURL(file)
  }
}

function displayAdminMessage(message, type) {
  const messageElement = document.createElement("div")
  messageElement.textContent = message
  messageElement.className = `admin-message ${type}` // Adiciona uma classe para estilização
  document.body.appendChild(messageElement)
  setTimeout(() => {
    document.body.removeChild(messageElement)
  }, 3000) // Remove a mensagem após 3 segundos
}

//FUNÇÃO SOBRE-NÓS
async function loadAbout() {
  const contentArea = document.getElementById("contentArea")
  contentArea.innerHTML = `
    <h2>Gerenciar Sobre Nós</h2>
    <div class="form-section">
      <h3>Texto de Boas-vindas</h3>
      <form id="welcomeTextForm">
        <div class="form-group">
          <label for="welcomeText">Texto de Boas-vindas</label>
          <textarea id="welcomeText" name="welcomeText" rows="4" required></textarea>
        </div>
        <button type="submit" class="btn-primary">Salvar Texto</button>
      </form>
    </div>

    <div class="form-section">
      <h3>Texto da História</h3>
      <form id="historyTextForm">
        <div class="form-group">
          <label for="historyText">Texto da História</label>
          <textarea id="historyText" name="historyText" rows="6" required></textarea>
        </div>
        <button type="submit" class="btn-primary">Salvar Texto</button>
      </form>
    </div>

    <div class="form-section">
      <h3>Gerenciar Membros da Equipe</h3>
      <form id="teamMemberForm">
        <div class="form-group">
          <label for="memberName">Nome do Membro</label>
          <input type="text" id="memberName" name="name" required>
        </div>
        <div class="form-group">
          <label for="memberRole">Cargo/Função</label>
          <input type="text" id="memberRole" name="role" required>
        </div>
        <div class="form-group">
          <label for="memberLinkedin">URL do LinkedIn (opcional)</label>
          <input type="text" id="memberLinkedin" name="linkedin">
        </div>
        <div class="form-group">
          <label for="memberInstagram">URL do Instagram (opcional)</label>
          <input type="text" id="memberInstagram" name="instagram">
        </div>
        <div class="form-group">
          <label for="memberImage">Imagem do Membro</label>
          <input type="file" id="memberImage" name="image" accept="image/*">
        </div>
        <button type="submit" class="btn-primary">Adicionar Membro</button>
      </form>
    </div>

    <div class="form-section">
      <h3>Membros da Equipe Existentes</h3>
      <div id="teamMembersList"></div>
    </div>
  `

  // Adicionar event listeners
  addEventListenersWithErrorHandling("welcomeTextForm", "submit", handleWelcomeTextSubmit)
  addEventListenersWithErrorHandling("historyTextForm", "submit", handleHistoryTextSubmit)
  addEventListenersWithErrorHandling("teamMemberForm", "submit", handleTeamMemberSubmit)
  // Carregar dados existentes
  await loadExistingAboutData()
}

async function saveAbout() {
  const aboutContent = document.getElementById("aboutContent").value
  storage.setItem("aboutContent", aboutContent)
  alert("Conteúdo 'Sobre Nós' salvo com sucesso!")
}

async function addTeamMember(newMember) {
  try {
    const members = safeParseJSON(await window.GitHubAPI.getFileContent("teamMembers"), [])
    members.push(newMember)
    storage.setItem("teamMembers", JSON.stringify(members))
    loadTeamMembers()
    showMessage("Membro adicionado com sucesso!", "success")
    document.getElementById("teamMemberForm").reset() // Limpa o formulário
  } catch (error) {
    console.error("Erro ao adicionar membro:", error)
    showMessage("Erro ao adicionar membro", "error")
  }
}

async function editMember(memberId) {
  console.log("Iniciando edição do membro:", memberId)

  try {
    const members = safeParseJSON(await window.GitHubAPI.getFileContent("teamMembers"), [])
    const member = members.find((m) => String(m.id) === String(memberId))

    if (!member) {
      console.error("Membro não encontrado:", memberId)
      showMessage("Membro não encontrado", "error")
      return
    }

    const existingDialog = document.querySelector("dialog")
    if (existingDialog) {
      existingDialog.remove()
    }

    const dialog = document.createElement("dialog")
    dialog.className = "edit-dialog"
    dialog.innerHTML = `
      <form class="edit-form">
        <h3>Editar Membro</h3>
        <input type="hidden" id="editMemberId" value="${member.id}">
        <div class="form-group">
          <label for="editName">Nome</label>
          <input type="text" id="editName" value="${member.name}" required>
        </div>
        <div class="form-group">
          <label for="editRole">Cargo</label>
          <input type="text" id="editRole" value="${member.role}" required>
        </div>
        <div class="form-group">
          <label for="editImage">Imagem Atual</label>
          <img src="${member.imageUrl}" alt="${member.name}" style="max-width: 100px;">
          <input type="file" id="editImage" accept="image/*">
        </div>
        <div class="dialog-buttons">
          <button type="submit" class="btn-primary">Salvar</button>
          <button type="button" class="btn-secondary" onclick="this.closest('dialog').close()">Cancelar</button>
        </div>
      </form>
    `

    document.body.appendChild(dialog)
    dialog.showModal()

    dialog.querySelector("form").onsubmit = async (e) => {
      e.preventDefault()

      try {
        const updatedMember = {
          id: document.getElementById("editMemberId").value,
          name: document.getElementById("editName").value,
          role: document.getElementById("editRole").value,
          imageUrl: member.imageUrl,
        }

        const imageFile = document.getElementById("editImage").files[0]
        if (imageFile) {
          updatedMember.imageUrl = await readFileAsDataURL(imageFile)
        }

        updateMember(updatedMember)
        dialog.close()
      } catch (error) {
        console.error("Erro ao atualizar membro:", error)
        showMessage("Erro ao atualizar membro", "error")
      }
    }
  } catch (error) {
    console.error("Erro ao abrir diálogo de edição:", error)
    showMessage("Erro ao abrir formulário de edição", "error")
  }
}

async function deleteMember(memberId) {
  console.log("Tentando excluir membro com ID:", memberId)

  if (confirm("Tem certeza que deseja excluir este membro da equipe?")) {
    try {
      const teamMembers = safeParseJSON(await window.GitHubAPI.getFileContent("teamMembers"), [])

      // Filtra os membros removendo aquele com o ID correspondente
      const updatedMembers = teamMembers.filter((member) => String(member.id) !== String(memberId))

      if (teamMembers.length === updatedMembers.length) {
        showMessage("Erro: Membro não encontrado para exclusão", "error")
        return
      }

      // Atualiza o storage
      storage.setItem("teamMembers", JSON.stringify(updatedMembers))
      console.log("Membro excluído com sucesso!")

      // Atualiza a exibição da lista
      loadTeamMembers()
      showMessage("Membro excluído com sucesso!", "success")
    } catch (error) {
      console.error("Erro ao excluir membro:", error)
      showMessage("Erro ao excluir membro", "error")
    }
  }
}

async function loadExistingAboutData() {
  // Carregar texto de boas-vindas
  const aboutData = JSON.parse(await window.GitHubAPI.getFileContent("aboutData") || "{}")
  if (aboutData.welcomeText) {
    document.getElementById("welcomeText").value = aboutData.welcomeText
  }
  if (aboutData.historyText) {
    document.getElementById("historyText").value = aboutData.historyText
  }

  // Carregar membros da equipe existentes
  loadTeamMembers()
}

async function saveTeamMember(teamMember) {
  const teamMembers = JSON.parse(await window.GitHubAPI.getFileContent("teamMembers") || "[]")
  teamMembers.push(teamMember)
  storage.setItem("teamMembers", JSON.stringify(teamMembers))
  showMessage("Membro da equipe adicionado com sucesso!", "success")
  document.getElementById("teamMemberForm").reset()
  loadTeamMembers()
}
// Atualiza lista de membros
async function loadTeamMembers() {
  const teamMembersList = document.getElementById("teamMembersList")

  if (!teamMembersList) {
    console.error("Elemento 'teamMembersList' não encontrado.")
    return
  }

  try {
    const members = safeParseJSON(await window.GitHubAPI.getFileContent("teamMembers"), [])
    console.log("Membros carregados:", members)

    if (members.length === 0) {
      teamMembersList.innerHTML = '<p class="no-members">Nenhum membro cadastrado.</p>'
      return
    }

    teamMembersList.innerHTML = members
      .map(
        (member) => `
          <div class="item-card" data-id="${member.id}">
            <img src="${member.imageUrl}" alt="${member.name}" style="max-width: 100px;">
            <h4>${member.name}</h4>
            <p>${member.role}</p>
            <div class="item-actions">
              <button type="button" class="btn-edit" data-id="${member.id}">Editar</button>
              <button type="button" class="btn-delete" data-id="${member.id}">Excluir</button>
            </div>
          </div>
        `,
      )
      .join("")

    document.querySelectorAll(".btn-edit").forEach((button) => {
      button.addEventListener("click", () => editMember(button.dataset.id))
    })

    document.querySelectorAll(".btn-delete").forEach((button) => {
      button.addEventListener("click", () => deleteMember(button.dataset.id))
    })
  } catch (error) {
    console.error("Erro ao carregar membros:", error)
    showMessage("Erro ao carregar membros da equipe", "error")
  }
}
// Função para atualizar um membro da equipe
async function updateMember(updatedMember) {
  try {
    const members = safeParseJSON(await window.GitHubAPI.getFileContent("teamMembers"), [])
    const index = members.findIndex((m) => String(m.id) === String(updatedMember.id))

    if (index !== -1) {
      members[index] = updatedMember
      storage.setItem("teamMembers", JSON.stringify(members))
      loadTeamMembers()
      showMessage("Membro atualizado com sucesso!", "success")
    } else {
      showMessage("Membro não encontrado para atualização", "error")
    }
  } catch (error) {
    console.error("Erro ao atualizar membro:", error)
    showMessage("Erro ao atualizar membro", "error")
  }
}

async function saveHistoryText(historyText) {
  const aboutData = JSON.parse(await window.GitHubAPI.getFileContent("aboutData") || "{}")
  aboutData.historyText = historyText
  storage.setItem("aboutData", JSON.stringify(aboutData))
  showMessage("Texto da história salvo com sucesso!", "success")
}
// Função para submeter o formulário de membro da equipe
async function handleTeamMemberSubmit(event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)
  const newMember = {
    id: Date.now().toString(), // Gera um ID único como string
    name: formData.get("name"),
    role: formData.get("role"),
    imageUrl: "", // Inicialmente vazio
  }

  const imageFile = formData.get("image")
  if (imageFile) {
    readFileAsDataURL(imageFile)
      .then((dataURL) => {
        newMember.imageUrl = dataURL
        addTeamMember(newMember)
      })
      .catch((error) => {
        console.error("Erro ao ler a imagem:", error)
        showMessage("Erro ao carregar a imagem", "error")
      })
  } else {
    addTeamMember(newMember)
  }
}

async function handleHistoryTextSubmit(event) {
  event.preventDefault()
  const historyText = document.getElementById("historyText").value
  saveHistoryText(historyText)
}

async function safeParseJSON(data, fallback = []) {
  try {
    return JSON.parse(data) || fallback
  } catch (error) {
    console.error("Erro ao analisar JSON:", error)
    return fallback
  }
}
async function addEventListenersWithErrorHandling(elementId, eventType, handler) {
  const element = document.getElementById(elementId)
  if (element) {
    element.addEventListener(eventType, handler)
  } else {
    console.error(`Elemento com ID '${elementId}' não encontrado.`)
  }
}

//Audio Descrições

async function handleAudioDescriptionSubmit(event) {
  event.preventDefault()
  const form = event.target
  const audioDescription = {
    commandName: form.commandName.value,
    description: form.audioDescription.value,
  }
  saveAudioDescription(audioDescription)
}

async function updateAudioDescription(oldCommand, updatedAudioDescription) {
  const audioDescriptions = JSON.parse(await window.GitHubAPI.getFileContent("audioDescriptions") || "{}")
  delete audioDescriptions[oldCommand]
  audioDescriptions[updatedAudioDescription.commandName] = updatedAudioDescription.description
  storage.setItem("audioDescriptions", JSON.stringify(audioDescriptions))
  showMessage("Audiodescrição atualizada com sucesso!", "success")
  document.getElementById("audioDescriptionForm").reset()
  document.getElementById("audioDescriptionForm").onsubmit = handleAudioDescriptionSubmit
  document.getElementById("audioDescriptionForm").querySelector("button[type='submit']").textContent =
    "Salvar Audiodescrição"
  loadAudioDescriptions()
}
// Função para lidar com o envio do formulário de audiodescrição

async function manageAudioDescriptions() {
  console.log("Função manageAudioDescriptions() chamada!") // Debugging

  const contentArea = document.getElementById("contentArea")
  if (!contentArea) {
    console.error("Elemento #contentArea não encontrado!")
    return
  }

  contentArea.innerHTML = `
    <h2>Gerenciar Audiodescrições</h2>
    <form id="audioDescriptionForm" class="form-section">
      <div class="input-group">
        <label for="audioCommand">Comando:</label>
        <input type="text" id="audioCommand" required placeholder="Ex: ouvir1, ouvir2">
      </div>
      <div class="input-group">
        <label for="audioDescription">Descrição:</label>
        <textarea id="audioDescription" required placeholder="Digite a audiodescrição"></textarea>
      </div>
      <div class="input-group">
        <label for="audioPage">Página:</label>
        <select id="audioPage" required>
          <option value="index.html">Home</option>
          <option value="sobre-nos.html">Sobre Nós</option>
          <option value="index.html#cipo-news">CIPÓ News</option>
          <option value="projetos.html">Projetos</option>
          <option value="pesquisas.html">Pesquisas</option>
          <option value="cursos.html">Cursos</option>
          <option value="eventos.html">Eventos</option>
          <option value="palestras.html">Palestras</option>
          <option value="livros.html">Livros</option>
          <option value="contato.html">Contatos</option>
        </select>
      </div>
      <button type="submit" class="btn-primary">Salvar Audiodescrição</button>
    </form>

    <div class="form-section">
      <h3>Audiodescrições Existentes</h3>
      <div id="audioDescriptionsList" class="audio-descriptions-list"></div>
    </div>
  `

  // Add form submit event listener
  const form = document.getElementById("audioDescriptionForm")
  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    await saveAudioDescription()
  })

  // Add page selection change handler
  const audioPageSelect = document.getElementById("audioPage")
  const audioCommandInput = document.getElementById("audioCommand")
  const audioDescriptionTextarea = document.getElementById("audioDescription")

  audioPageSelect.addEventListener("change", () => {
    // Clear inputs when page changes
    audioCommandInput.value = ""
    audioDescriptionTextarea.value = ""
  })

  await loadAudioDescriptions()
}

async function saveAudioDescription() {
  const command = document.getElementById("audioCommand").value.trim()
  const description = document.getElementById("audioDescription").value.trim()
  const page = document.getElementById("audioPage").value

  if (!command || !description || !page) {
    alert("Por favor, preencha todos os campos.")
    return
  }

  const audioDescriptions = JSON.parse((await window.GitHubAPI.getFileContent("audioDescriptions")) || "{}")

  if (!audioDescriptions[page]) {
    audioDescriptions[page] = {}
  }

  audioDescriptions[page][command] = description
  await storage.setItem("audioDescriptions", JSON.stringify(audioDescriptions))

  alert("Audiodescrição salva com sucesso!")
  document.getElementById("audioDescriptionForm").reset()
  await loadAudioDescriptions()
}

async function loadAudioDescriptions() {
  const audioDescriptionsList = document.getElementById("audioDescriptionsList")
  const audioDescriptions = JSON.parse((await window.GitHubAPI.getFileContent("audioDescriptions")) || "{}")

  let html = ""
  for (const page in audioDescriptions) {
    for (const command in audioDescriptions[page]) {
      html += `
        <div class="audio-description-item">
          <h4>Página: ${page}</h4>
          <p><strong>Comando:</strong> ${command}</p>
          <p><strong>Descrição:</strong> ${audioDescriptions[page][command]}</p>
          <div class="audio-description-actions">
            <button onclick="editAudioDescription('${page}', '${command}')" class="btn-edit">Editar</button>
            <button onclick="deleteAudioDescription('${page}', '${command}')" class="btn-delete">Excluir</button>
          </div>
        </div>
      `
    }
  }

  audioDescriptionsList.innerHTML = html || "<p>Nenhuma audiodescrição cadastrada.</p>"
}

async function deleteAudioDescription(page, command) {
  if (confirm("Tem certeza que deseja excluir esta audiodescrição?")) {
    const audioDescriptions = JSON.parse((await window.GitHubAPI.getFileContent("audioDescriptions")) || "{}")
    delete audioDescriptions[page][command]
    await storage.setItem("audioDescriptions", JSON.stringify(audioDescriptions))
    await loadAudioDescriptions()
  }
}

async function testAudioDescription(page, command) {
  const audioDescriptions = JSON.parse(await window.GitHubAPI.getFileContent("audioDescriptions") || "{}")
  if (audioDescriptions[page] && audioDescriptions[page][command]) {
    const utterance = new SpeechSynthesisUtterance(audioDescriptions[page][command])
    utterance.lang = "pt-BR"
    utterance.rate = 0.9
    utterance.pitch = 1.1
    window.speechSynthesis.speak(utterance)
  }
}

async function editAudioDescription(page, command) {
  const audioDescriptions = JSON.parse(await window.GitHubAPI.getFileContent("audioDescriptions") || "{}")
  const description = audioDescriptions[page][command]

  if (!description) {
    console.error("Audio description not found:", page, command)
    return
  }

  // Set form values
  document.getElementById("audioCommand").value = command
  document.getElementById("audioDescription").value = description
  document.getElementById("audioPage").value = page

  // Change form button text
  const submitButton = document.querySelector("#audioDescriptionForm button[type='submit']")
  if (submitButton) {
    submitButton.textContent = "Atualizar Audiodescrição"
  }

  // Scroll form into view
  document.getElementById("audioDescriptionForm").scrollIntoView({ behavior: "smooth" })
}

async function loadExistingAudioDescriptions() {
  const audioDescriptionList = document.getElementById("audioDescriptionList")
  const audioDescriptions = JSON.parse(await window.GitHubAPI.getFileContent("audioDescriptions") || "{}")

  audioDescriptionList.innerHTML = Object.entries(audioDescriptions)
    .map(
      ([command, data]) => `
  <div class="item-card">
  <h4>Comando: ${command}</h4>
  <p>Descrição: ${data.description}</p>
  <p>Página: ${data.page}</p>
  <div class="item-actions">
  <button onclick="editAudioDescription('${command}')" class="btn-edit">Editar</button>
  <button onclick="deleteAudioDescription('${command}')" class="btn-delete">Excluir</button>
  </div>
  </div>
  `,
    )
    .join("")
}

const audioBtn = document.getElementById("audioDescriptionsBtn")

if (audioBtn) {
  audioBtn.addEventListener("click", () => {
    console.log("Botão de audiodescrições clicado!") // Debugging
    manageAudioDescriptions()
  })
} else {
  console.error("Botão de audiodescrições não encontrado!")
}

//Função Projetos
async function loadProjects() {
  const contentArea = document.getElementById("contentArea")
  if (!contentArea) {
    console.error("Área de conteúdo não encontrada")
    return
  }

  contentArea.innerHTML = `
    <h2>Gerenciar Projetos</h2>
    <div class="form-section">
      <h3>Adicionar Novo Projeto</h3>
      <form id="addProjectForm">
        <div class="input-group">
          <input type="text" id="projectTitle" name="title" placeholder="Título do Projeto" required>
        </div>
        <div class="input-group">
          <textarea id="projectDescription" name="description" placeholder="Descrição do Projeto" required></textarea>
        </div>
        <div class="input-group">
          <label for="projectIcon">Categoria do Projeto:</label>
          <select id="projectIcon" name="icon" required>
            <option value="">Selecione a Categoria</option>
            <option value="leaf">🌿 Sustentabilidade</option>
            <option value="book">📚 Educação</option>
            <option value="users">👥 Comunidade</option>
            <option value="ribbon">🎗 Inclusão</option>
            <option value="graduation-cap">🎓 Pesquisa</option>
            <option value="universal-access">♿ Acessibilidade</option>
          </select>
        </div>
        <div class="input-group">
          <input type="number" id="projectParticipants" name="participants" placeholder="Número de Participantes" required>
        </div>
        <div class="input-group">
          <label for="projectStatus">Status do Projeto:</label>
          <select id="projectStatus" name="status" required>
            <option value="">Selecione o Status</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="planejado">Planejado</option>
          </select>
        </div>
        <button type="submit" class="btn-primary">Adicionar Projeto</button>
      </form>
    </div>
    <div class="form-section">
      <h3>Lista de Projetos</h3>
      <div id="projectList" class="project-list"></div>
    </div>
  `

  const addProjectForm = document.getElementById("addProjectForm")
  if (addProjectForm) {
    addProjectForm.addEventListener("submit", handleAddProject)
  }

  loadExistingProjects()
}

async function handleAddProject(event) {
  event.preventDefault()
  const form = event.target
  const projectData = {
    id: Date.now().toString(),
    title: form.title.value,
    description: form.description.value,
    icon: form.icon.value,
    participants: Number.parseInt(form.participants.value),
    status: form.status.value,
  }

  addNewProject(projectData)
}


async function saveProject(projectData) {
  const projects = JSON.parse(await window.GitHubAPI.getFileContent("projects") || "[]")
  const existingIndex = projects.findIndex((p) => p.id === projectData.id)

  if (existingIndex !== -1) {
    projects[existingIndex] = projectData
  } else {
    projects.push(projectData)
  }

  storage.setItem("projects", JSON.stringify(projects))
  console.log("Project saved. Updated projects:", projects)
}

async function loadProjectsContent() {
  const contentArea = document.getElementById("contentArea")
  contentArea.innerHTML = `
        <h2>Gerenciar Projetos</h2>
        <div class="form-section">
            <h3>Adicionar/Editar Projeto</h3>
            <form id="projectForm">
                <input type="hidden" id="projectId" name="projectId">
                <div class="input-group">
                    <input type="text" id="projectTitle" name="title" placeholder="Título do Projeto" required>
                </div>
                <div class="input-group">
                    <textarea id="projectDescription" name="description" placeholder="Descrição do Projeto" required></textarea>
                </div>
                <div class="input-group">
                    <input type="text" id="projectIcon" name="icon" placeholder="Ícone (classe Font Awesome)">
                </div>
                <div class="input-group">
                    <input type="number" id="projectParticipants" name="participants" placeholder="Número de Participantes" required>
                </div>
                <div class="input-group">
                    <select id="projectStatus" name="status" required>
                        <option value="">Selecione o Status</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Planejado">Planejado</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Salvar Projeto</button>
            </form>
        </div>
        <div class="form-section">
            <h3>Lista de Projetos</h3>
            <ul id="projectList"></ul>
        </div>
    `

  const projectForm = document.getElementById("projectForm")
  if (projectForm) {
    projectForm.addEventListener("submit", handleProjectSubmit)
  } else {
    console.warn("Elemento 'projectForm' não encontrado.")
  }
  loadExistingProjects()
}

async function handleProjectSubmit(event) {
  event.preventDefault()
  const form = event.target
  const projectId = form.elements.projectId.value
  const projectData = {
    id: projectId,
    icon: form.elements.icon.value,
    title: form.elements.title.value,
    participants: form.elements.participants.value,
    status: form.elements.status.value,
    description: form.elements.description.value,
  }

  try {
    const projects = JSON.parse(await window.GitHubAPI.getFileContent("projects") || "[]")
    const index = projects.findIndex((p) => p.id === projectId)
    projects[index] = projectData
    storage.setItem("projects", JSON.stringify(projects))
    showMessage("Projeto atualizado com sucesso!", "success")
    loadProjects()
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error)
    showMessage("Erro ao atualizar projeto", "error")
  }
}

async function addNewProject(projectData) {
  try {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    projects.push(projectData)
    localStorage.setItem("projects", JSON.stringify(projects))
    showMessage("Projeto adicionado com sucesso!", "success")
    document.getElementById("addProjectForm").reset()
    loadExistingProjects()
  } catch (error) {
    console.error("Erro ao adicionar projeto:", error)
    showMessage("Erro ao adicionar projeto", "error")
  }
}


async function loadExistingProjects() {
  const projectList = document.getElementById("projectList")
  if (!projectList) {
    console.error("Lista de projetos não encontrada")
    return
  }

  try {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    console.log("Projetos carregados:", projects)

    if (projects.length === 0) {
      projectList.innerHTML = "<p>Nenhum projeto cadastrado.</p>"
      return
    }

    projectList.innerHTML = projects
      .map(
        (project) => `
          <div class="project-entry">
            <div class="project-header">
              <h3>${project.title}</h3>
              <span class="status-badge ${project.status}">${formatStatus(project.status)}</span>
            </div>
            <div class="project-info">
              <p class="description">${project.description}</p>
              <div class="meta-info">
                <span><i class="fas fa-users"></i> ${project.participants} Participantes</span>
              </div>
            </div>
            <div class="project-actions">
              <button onclick="editProject('${project.id}')" class="btn-edit">Editar</button>
              <button onclick="deleteProject('${project.id}')" class="btn-delete">Excluir</button>
            </div>
          </div>
        `,
      )
      .join("")
  } catch (error) {
    console.error("Erro ao carregar projetos:", error)
    projectList.innerHTML = "<p>Erro ao carregar projetos. Por favor, tente novamente.</p>"
  }
}

async function validateProjectData(projectData) {
  return projectData.title && projectData.description && projectData.participants && projectData.status
}

async function updateProject(projectData) {
  const projects = JSON.parse(await window.GitHubAPI.getFileContent("projects") || "[]")
  const index = projects.findIndex((p) => p.id === projectData.id)
  if (index !== -1) {
    projects[index] = projectData
    storage.setItem("projects", JSON.stringify(projects))
    console.log("Projeto atualizado:", projectData)
    showMessage("Projeto atualizado com sucesso!", "success")
    document.getElementById("projectForm").reset()
    document.getElementById("projectId").value = ""
    loadExistingProjects()

    // Atualizar a exibição do projeto na página de projetos
    if (window.opener && window.opener.updateProjectDisplay) {
      window.opener.updateProjectDisplay(projectData.id)
    }

    // Disparar evento de storage para atualizar a página de projetos
    window.dispatchEvent(new Event("storage"))
  }
}

async function editProject(projectId) {
  try {
    const projects = JSON.parse(await window.GitHubAPI.getFileContent("projects") || "[]")
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      const contentArea = document.getElementById("contentArea")
      contentArea.innerHTML = `
        <h2>Editar Projeto</h2>
        <div class="form-section edit-form">
          <form id="projectForm" class="edit-project-form">
            <input type="hidden" id="projectId" name="projectId" value="${project.id}">
            
            <div class="form-group">
              <label for="projectIcon">Ícone do Projeto</label>
              <select id="projectIcon" name="icon" class="form-select" required>
                <option value="">Selecione o Ícone</option>
                <option value="leaf" ${project.icon === "leaf" ? "selected" : ""}>🌿 Sustentabilidade</option>
                <option value="book" ${project.icon === "book" ? "selected" : ""}>📚 Educação</option>
                <option value="users" ${project.icon === "users" ? "selected" : ""}>👥 Comunidade</option>
                <option value="ribbon" ${project.icon === "ribbon" ? "selected" : ""}>🎗 Inclusão</option>
                <option value="graduation-cap" ${project.icon === "graduation-cap" ? "selected" : ""}>🎓 Pesquisa</option>
                <option value="universal-access" ${project.icon === "universal-access" ? "selected" : ""}>♿ Acessibilidade</option>
              </select>
            </div>

            <div class="form-group">
              <label for="projectTitle">Título do Projeto</label>
              <input type="text" id="projectTitle" name="title" value="${project.title}" required>
            </div>

            <div class="form-group">
              <label for="projectParticipants">Número de Participantes</label>
              <input type="number" id="projectParticipants" name="participants" value="${project.participants}" required>
            </div>

            <div class="form-group">
              <label for="projectStatus">Status</label>
              <select id="projectStatus" name="status" class="form-select" required>
                <option value="">Selecione o Status</option>
                <option value="em_andamento" ${project.status === "em_andamento" ? "selected" : ""}>Em Andamento</option>
                <option value="concluido" ${project.status === "concluido" ? "selected" : ""}>Concluído</option>
                <option value="planejado" ${project.status === "planejado" ? "selected" : ""}>Planejado</option>
              </select>
            </div>

            <div class="form-group">
              <label for="projectDescription">Descrição</label>
              <textarea id="projectDescription" name="description" rows="4" required>${project.description}</textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">Salvar</button>
              <button type="button" onclick="loadProjects()" class="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      `

      const form = document.getElementById("projectForm")
      form.addEventListener("submit", handleProjectSubmit)
    }
  } catch (error) {
    console.error("Erro ao editar projeto:", error)
    showMessage("Erro ao carregar projeto para edição", "error")
  }
}

async function clearProjects() {
  storage.removeItem("projects")
  loadExistingProjects()
  console.log("Todos os projetos foram removidos do storage")
}

async function deleteProject(projectId) {
  if (confirm("Tem certeza que deseja excluir este projeto?")) {
    try {
      const projects = JSON.parse(await window.GitHubAPI.getFileContent("projects") || "[]")
      const filteredProjects = projects.filter((p) => p.id !== projectId)
      storage.setItem("projects", JSON.stringify(filteredProjects))
      showMessage("Projeto excluído com sucesso!", "success")
      loadExistingProjects()
    } catch (error) {
      console.error("Erro ao excluir projeto:", error)
      showMessage("Erro ao excluir projeto", "error")
    }
  }
}

// Funções auxiliares
async function formatStatus(status) {
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

async function loadFontAwesome() {
  return new Promise((resolve, reject) => {
    // Verifica se já está carregado
    const existingLink = document.querySelector('link[href*="font-awesome"]')
    if (existingLink && existingLink.sheet) {
      resolve(true)
      return
    }

    // Se não estiver carregado, tenta carregar do CDN
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"

    link.onload = () => {
      console.log("Font Awesome carregado com sucesso")
      resolve(true)
    }

    link.onerror = () => {
      console.error("Erro ao carregar Font Awesome do CDN, tentando fallback local")
      // Tenta carregar o fallback local
      link.href = "/assets/fontawesome/css/all.min.css"
      resolve(false)
    }

    document.head.appendChild(link)
  })
}

async function checkFontAwesome() {
  try {
    await loadFontAwesome()

    const span = document.createElement("span")
    span.className = "fas fa-leaf"
    span.style.display = "none"
    document.body.insertBefore(span, document.body.firstChild)

    const computedStyle = window.getComputedStyle(span, null)
    const isFontAwesomeLoaded = computedStyle.getPropertyValue("font-family").includes("Font Awesome")

    document.body.removeChild(span)

    if (!isFontAwesomeLoaded) {
      console.error("Font Awesome não está carregado corretamente!")
      alert("Erro: Font Awesome não está carregado. Os ícones podem não aparecer corretamente.")
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao verificar Font Awesome:", error)
    return false
  }
}

const contentArea = document.getElementById("contentArea")
if (contentArea) {
  const clearButton = document.createElement("button")
  clearButton.textContent = "Limpar Todos os Projetos"
  clearButton.onclick = clearProjects
  contentArea.appendChild(clearButton)
}

//Função de Pesquisa

async function deleteResearch(researchId) {
  console.log("Tentando excluir pesquisa com ID:", researchId)

  if (confirm("Tem certeza que deseja excluir esta pesquisa?")) {
    try {
      const researchEntries = JSON.parse(await window.GitHubAPI.getFileContent("researchEntries") || "[]")

      // Filtra removendo a pesquisa pelo ID
      const updatedResearch = researchEntries.filter((r) => String(r.id) !== String(researchId))

      if (researchEntries.length === updatedResearch.length) {
        showMessage("Erro: Pesquisa não encontrada para exclusão", "error")
        return
      }

      // Atualiza o storage
      storage.setItem("researchEntries", JSON.stringify(updatedResearch))

      console.log("Pesquisa excluída com sucesso!")
      showMessage("Pesquisa excluída com sucesso!", "success")

      // Recarrega a lista para remover o item da interface
      loadExistingResearch()
    } catch (error) {
      console.error("Erro ao excluir pesquisa:", error)
      showMessage("Erro ao excluir pesquisa", "error")
    }
  }
}

async function loadResearch() {
  const content = `
    <h3>Gerenciar Pesquisas</h3>
    <h4>Adicionar Nova Pesquisa</h4>
    <form id="researchForm">
        <div class="form-group">
            <label for="researchIcon">Ícone da Pesquisa</label>
            <select id="researchIcon" required>
                <option value="tractor">Trator (Agricultura)</option>
                <option value="laptop">Computador (Tecnologia)</option>
                <option value="users">Comunidade (Social)</option>
                <option value="leaf">Planta (Botânica)</option>
                <option value="seedling">Muda (Cultivo)</option>
                <option value="flask">Frasco (Laboratório)</option>
            </select>
        </div>
        <div class="form-group">
            <label for="researchTitle">Título da Pesquisa</label>
            <input type="text" id="researchTitle" placeholder="Título da Pesquisa" required>
        </div>
        <div class="form-group">
            <label for="researchResearcher">Nome do Pesquisador</label>
            <input type="text" id="researchResearcher" placeholder="Nome do Pesquisador" required>
        </div>
        <div class="form-group">
            <label for="researchStatus">Status</label>
            <select id="researchStatus" required>
                <option value="ongoing">Em Andamento</option>
                <option value="planned">Planejado</option>
                <option value="completed">Concluído</option>
            </select>
        </div>
        <div class="form-group">
            <label for="researchTimeline">Período</label>
            <input type="text" id="researchTimeline" placeholder="Período (ex: 2024-2025)" required>
        </div>
        <div class="form-group">
            <label for="researchFunding">Financiamento</label>
            <input type="text" id="researchFunding" placeholder="Financiamento" required>
        </div>
        <div class="form-group">
            <label for="researchDescription">Descrição</label>
            <textarea id="researchDescription" rows="4" cols="50" placeholder="Descrição da Pesquisa" required></textarea>
        </div>
        <div class="form-group">
            <label for="researchAreas">Áreas de Estudo</label>
            <input type="text" id="researchAreas" placeholder="Áreas de Estudo (separadas por vírgula)" required>
        </div>
        <button type="submit" class="btn-primary">Adicionar Pesquisa</button>
    </form>
    <h4>Pesquisas Existentes</h4>
    <div id="researchList"></div>
  `
  const contentArea = document.getElementById("contentArea")
  contentArea.innerHTML = content

  // Adicionar event listener para o formulário de pesquisa
  const form = document.getElementById("researchForm")
  if (form) {
    form.addEventListener("submit", addNewResearch)
  } else {
    console.error("Formulário de pesquisa não encontrado")
  }

  // Carregar pesquisas existentes
  loadExistingResearch()
}

async function addNewResearch(event) {
  event.preventDefault()
  console.log("Função addNewResearch chamada")

  const research = {
    id: generateUniqueId(), // Add unique ID
    title: document.getElementById("researchTitle").value,
    researcher: document.getElementById("researchResearcher").value,
    status: document.getElementById("researchStatus").value,
    timeline: document.getElementById("researchTimeline").value,
    funding: document.getElementById("researchFunding").value,
    description: document.getElementById("researchDescription").value,
    icon: document.getElementById("researchIcon").value,
    areas: document
      .getElementById("researchAreas")
      .value.split(",")
      .map((area) => area.trim()),
    lastModified: Date.now(),
  }

  const existingResearch = JSON.parse(await window.GitHubAPI.getFileContent("researchEntries") || "[]")
  existingResearch.push(research)
  storage.setItem("researchEntries", JSON.stringify(existingResearch))

  console.log("Nova pesquisa adicionada:", research)
  alert("Nova pesquisa adicionada com sucesso!")
  document.getElementById("researchForm").reset()
  loadExistingResearch()
  log("Nova pesquisa adicionada!", "success")
}

async function handleResearchSubmit(event) {
  event.preventDefault()
  const form = event.target
  const researchData = {
    id: form.researchId.value,
    icon: form.icon.value,
    title: form.title.value,
    researcher: form.researcher.value,
    status: form.status.value,
    timeline: form.timeline.value,
    funding: form.funding.value,
    description: form.description.value,
    areas: form.areas.value.split(",").map((area) => area.trim()),
    lastModified: Date.now(),
  }

  updateResearch(researchData)
}

async function editResearch(researchId) {
  try {
    const researches = JSON.parse(await window.GitHubAPI.getFileContent("researchEntries") || "[]")
    const research = researches.find((r) => r.id === researchId)
    if (research) {
      const contentArea = document.getElementById("contentArea")
      contentArea.innerHTML = `
        <h2>Editar Pesquisa</h2>
        <div class="form-section edit-form">
          <form id="researchForm" class="edit-research-form">
            <input type="hidden" id="researchId" name="researchId" value="${research.id}">
            
            <div class="form-group">
              <label for="researchIcon">Ícone da Pesquisa</label>
              <select id="researchIcon" name="icon" class="form-select" required>
                <option value="tractor" ${research.icon === "tractor" ? "selected" : ""}>Trator (Agricultura)</option>
                <option value="laptop" ${research.icon === "laptop" ? "selected" : ""}>Computador (Tecnologia)</option>
                <option value="users" ${research.icon === "users" ? "selected" : ""}>Comunidade (Social)</option>
                <option value="leaf" ${research.icon === "leaf" ? "selected" : ""}>Planta (Botânica)</option>
                <option value="seedling" ${research.icon === "seedling" ? "selected" : ""}>Muda (Cultivo)</option>
                <option value="flask" ${research.icon === "flask" ? "selected" : ""}>Frasco (Laboratório)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="researchTitle">Título da Pesquisa</label>
              <input type="text" id="researchTitle" name="title" value="${research.title}" required>
            </div>

            <div class="form-group">
              <label for="researchResearcher">Nome do Pesquisador</label>
              <input type="text" id="researchResearcher" name="researcher" value="${research.researcher}" required>
            </div>

            <div class="form-group">
              <label for="researchStatus">Status</label>
              <select id="researchStatus" name="status" class="form-select" required>
                <option value="ongoing" ${research.status === "ongoing" ? "selected" : ""}>Em Andamento</option>
                <option value="planned" ${research.status === "planned" ? "selected" : ""}>Planejado</option>
                <option value="completed" ${research.status === "completed" ? "selected" : ""}>Concluído</option>
              </select>
            </div>

            <div class="form-group">
              <label for="researchTimeline">Período</label>
              <input type="text" id="researchTimeline" name="timeline" value="${research.timeline}" required>
            </div>

            <div class="form-group">
              <label for="researchFunding">Financiamento</label>
              <input type="text" id="researchFunding" name="funding" value="${research.funding}" required>
            </div>

            <div class="form-group">
              <label for="researchDescription">Descrição</label>
              <textarea id="researchDescription" name="description" rows="4" required>${research.description}</textarea>
            </div>

            <div class="form-group">
              <label for="researchAreas">Áreas de Estudo</label>
              <input type="text" id="researchAreas" name="areas" value="${research.areas.join(", ")}" required>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">Salvar</button>
              <button type="button" onclick="loadResearch()" class="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      `

      const form = document.getElementById("researchForm")
      form.addEventListener("submit", handleResearchSubmit)
    }
  } catch (error) {
    console.error("Erro ao editar pesquisa:", error)
    showMessage("Erro ao carregar pesquisa para edição", "error")
  }
}

async function loadExistingResearch() {
  console.log("Carregando pesquisas existentes...")

  const researchList = document.getElementById("researchList")
  const researchEntries = JSON.parse(await window.GitHubAPI.getFileContent("researchEntries") || "[]")

  researchEntries.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0))

  console.log("Pesquisas carregadas:", researchEntries)

  if (researchEntries.length === 0) {
    researchList.innerHTML = "<p class='no-research'>Nenhuma pesquisa cadastrada.</p>"
    return
  }

  researchList.innerHTML = researchEntries
    .map(
      (item) => `
              <div class="research-card" data-id="${item.id}">
                  <div class="research-header">
                      <div class="research-icon">
                          <i class="fas fa-${item.icon || "flask"}"></i>
                      </div>
                      <h3 class="research-title">${item.title}</h3>
                      <div class="status-badge ${item.status}">${formatResearchStatus(item.status)}</div>
                  </div>
                  <div class="research-content">
                      <p class="researcher-name">Pesquisador(a): ${item.researcher}</p>
                      <p class="research-description">${item.description}</p>
                      <div class="research-meta">
                          <div class="timeline">
                              <i class="fas fa-calendar"></i>
                              <span>${item.timeline}</span>
                          </div>
                          <div class="funding">
                              <i class="fas fa-search"></i>
                              <span>${item.funding}</span>
                          </div>
                      </div>
                      <div class="research-areas">
                          <h4>Áreas de Estudo</h4>
                          <div class="area-tags">
                              ${item.areas.map((area) => `<span class="area-tag">${area}</span>`).join("")}
                          </div>
                      </div>
                      <div class="research-actions">
                          <button onclick="editResearch('${item.id}')" class="btn-edit">Editar</button>
                          <button onclick="deleteResearch('${item.id}')" class="btn-delete">Excluir</button>
                      </div>
                  </div>
              </div>
          `,
    )
    .join("")

  // Adiciona eventos de exclusão após carregar a lista
  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", () => deleteResearch(button.dataset.id))
  })

  showMessage("Pesquisas carregadas!", "success")
}

async function updateResearch(researchData) {
  try {
    const researches = JSON.parse(await window.GitHubAPI.getFileContent("researchEntries") || "[]")
    const index = researches.findIndex((r) => r.id === researchData.id)
    if (index !== -1) {
      researches[index] = researchData
      storage.setItem("researchEntries", JSON.stringify(researches))
      showMessage("Pesquisa atualizada com sucesso!", "success")
      loadResearch()
    }
  } catch (error) {
    console.error("Erro ao atualizar pesquisa:", error)
    showMessage("Erro ao atualizar pesquisa", "error")
  }
}

async function formatResearchStatus(status) {
  const statusMap = {
    ongoing: "Em Andamento",
    planned: "Planejado",
    completed: "Concluído",
  }
  return statusMap[status] || status
}

// Funções para Cursos
async function loadCourses() {
  const contentArea = document.getElementById("contentArea")
  contentArea.innerHTML = `
    <h2>Gerenciar Cursos</h2>
    <div class="form-section">
      <h3>Adicionar Novo Curso</h3>
      <form id="addCourseForm">
        <div class="form-group">
          <label for="newCourseTitle">Título do Curso</label>
          <input type="text" id="newCourseTitle" name="title" required>
        </div>

        <div class="form-group">
          <label for="newCourseDuration">Duração (horas)</label>
          <input type="number" id="newCourseDuration" name="duration" min="1">
        </div>

        <div class="form-group">
          <label for="newCourseTeacherType">Tipo de Professor(a)</label>
          <select id="newCourseTeacherType" name="teacherType">
            <option value="">Selecione (Opcional)</option>
            <option value="professor">Professor</option>
            <option value="professora">Professora</option>
            <option value="professores">Professores</option>
            <option value="Doutor">Dr.</option>
            <option value="Doutora">Dra.</option>
            <option value="Mestre">Ms.</option>
          </select>
        </div>

        <div class="form-group">
          <label for="newCourseTeacherName">Nome do(a) Professor(a) (Opcional)</label>
          <input type="text" id="newCourseTeacherName" name="teacherName" placeholder="Nome do(a) professor(a)">
        </div>

        <div class="form-group">
          <label for="newCourseSchedule">Horário Semanal (Opcional)</label>
          <input type="text" id="newCourseSchedule" name="schedule" placeholder="Ex: Segunda e Quarta, 14h-16h">
        </div>

        <div class="form-group">
          <label for="newCourseStartDate">Data de Início (Opcional)</label>
          <input type="date" id="newCourseStartDate" name="startDate">
        </div>

        <div class="form-group">
          <label for="newCourseEndDate">Data de Término (Opcional)</label>
          <input type="date" id="newCourseEndDate" name="endDate">
        </div>

        <div class="form-group">
          <label for="newCourseDescription">Descrição</label>
          <textarea id="newCourseDescription" name="description" rows="4" required></textarea>
        </div>

        <button type="submit" class="btn-primary">Adicionar Curso</button>
      </form>
    </div>
    <div class="form-section">
      <h3>Cursos Existentes</h3>
      <div id="courseList"></div>
    </div>
  `

  const form = document.getElementById("addCourseForm")
  form.addEventListener("submit", addNewCourse)
  loadExistingCourses()
}

async function addNewCourse(event) {
  event.preventDefault()
  const form = event.target
  const courseData = {
    title: form.title.value,
    duration: Number.parseInt(form.duration.value),
    teacherType: form.teacherType.value || null,
    teacherName: form.teacherName.value || null,
    schedule: form.schedule.value || null,
    startDate: form.startDate.value || null,
    endDate: form.endDate.value || null,
    description: form.description.value,
  }

  try {
    const courses = JSON.parse(await window.GitHubAPI.getFileContent("courses") || "[]")
    courses.push(courseData)
    storage.setItem("courses", JSON.stringify(courses))
    showMessage("Novo curso adicionado com sucesso!", "success")
    form.reset()
    loadExistingCourses()
  } catch (error) {
    console.error("Erro ao adicionar novo curso:", error)
    showMessage("Erro ao adicionar novo curso", "error")
  }
}

async function editCourse(courseId) {
  try {
    const courses = JSON.parse(await window.GitHubAPI.getFileContent("courses") || "[]")
    const course = courses.find((c, index) => index === courseId)
    if (course) {
      const contentArea = document.getElementById("contentArea")
      contentArea.innerHTML = `
        <h2>Editar Curso</h2>
        <div class="form-section edit-form">
          <form id="courseForm" class="edit-course-form">
            <input type="hidden" id="courseId" name="courseId" value="${courseId}">
            
            <div class="form-group">
              <label for="courseTitle">Título do Curso</label>
              <input type="text" id="courseTitle" name="title" value="${course.title}" required>
            </div>

            <div class="form-group">
              <label for="courseDuration">Duração (horas)</label>
              <input type="number" id="courseDuration" name="duration" value="${course.duration}" required min="1">
            </div>

            <div class="form-group">
              <label for="courseTeacherType">Tipo de Professor(a)</label>
              <select id="courseTeacherType" name="teacherType">
              <option value="">Selecione (Opcional)</option>
              <option value="professor" ${course.teacherType === "professor" ? "selected" : ""}>Professor</option>
              <option value="professora" ${course.teacherType === "professora" ? "selected" : ""}>Professora</option>
              <option value="professores" ${course.teacherType === "professores" ? "selected" : ""}>Professores</option>
              <option value="Doutor">Dr.</option>
              <option value="Doutora">Dra.</option>
              <option value="Mestre">Ms.</option>
              </select>
            </div>

            <div class="form-group">
              <label for="courseTeacherName">Nome do(a) Professor(a) (Opcional)</label>
              <input type="text" id="courseTeacherName" name="teacherName" value="${course.teacherName || ""}" placeholder="Nome do(a) professor(a)">
            </div>

            <div class="form-group">
              <label for="courseSchedule">Horário Semanal (Opcional)</label>
              <input type="text" id="courseSchedule" name="schedule" value="${course.schedule || ""}" placeholder="Ex: Segunda e Quarta, 14h-16h">
            </div>

            <div class="form-group">
              <label for="courseStartDate">Data de Início (Opcional)</label>
              <input type="date" id="courseStartDate" name="startDate" value="${course.startDate || ""}">
            </div>

            <div class="form-group">
              <label for="courseEndDate">Data de Término (Opcional)</label>
              <input type="date" id="courseEndDate" name="endDate" value="${course.endDate || ""}">
            </div>

            <div class="form-group">
              <label for="courseDuration">Duração (horas)</label>
              <input type="number" id="courseDuration" name="duration" value="${course.duration || ""}" min="1">
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">Salvar</button>
              <button type="button" onclick="loadCourses()" class="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      `

      const form = document.getElementById("courseForm")
      form.addEventListener("submit", handleCourseSubmit)
    }
  } catch (error) {
    console.error("Erro ao editar curso:", error)
    showMessage("Erro ao carregar curso para edição", "error")
  }
}

async function handleCourseSubmit(event) {
  event.preventDefault()
  const form = event.target
  const courseId = Number.parseInt(form.courseId.value)
  const courseData = {
    title: form.title.value,
    duration: form.duration.value ? Number.parseInt(form.duration.value) : null,
    teacherType: form.teacherType.value || null,
    teacherName: form.teacherName.value || null,
    schedule: form.schedule.value || null,
    startDate: form.startDate.value || null,
    endDate: form.endDate.value || null,
    description: form.description.value,
  }

  updateCourse(courseId, courseData)
}

async function loadExistingCourses() {
  const courseList = document.getElementById("courseList")
  try {
    const courses = JSON.parse(await window.GitHubAPI.getFileContent("courses") || "[]")
    if (courses.length === 0) {
      courseList.innerHTML = "<p>Nenhum curso cadastrado.</p>"
      return
    }

    courseList.innerHTML = courses
      .map(
        (course, index) => `
          <div class="course-card">
            <h4>${course.title}</h4>
            <p><strong>Duração:</strong> ${course.duration} horas</p>
            ${course.teacherType ? `<p><strong>Responsável:</strong> ${formatTeacherType(course.teacherType)}${course.teacherName ? ` - ${course.teacherName}` : ""}</p>` : ""}
            ${course.schedule ? `<p><strong>Horário:</strong> ${course.schedule}</p>` : ""}
            ${course.startDate ? `<p><strong>Início:</strong> ${formatDate(course.startDate)}</p>` : ""}
            ${course.endDate ? `<p><strong>Término:</strong> ${formatDate(course.endDate)}</p>` : ""}
            <p>${course.description}</p>
            <div class="course-actions">
              <button onclick="editCourse(${index})" class="btn-edit">Editar</button>
              <button onclick="deleteCourse(${index})" class="btn-delete">Excluir</button>
            </div>
          </div>
        `,
      )
      .join("")
  } catch (error) {
    console.error("Erro ao carregar cursos:", error)
    courseList.innerHTML = "<p>Erro ao carregar cursos.</p>"
  }
}

async function formatTeacherType(type) {
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

async function updateCourse(courseId, courseData) {
  try {
    const courses = JSON.parse(await window.GitHubAPI.getFileContent("courses") || "[]")
    courses[courseId] = courseData
    storage.setItem("courses", JSON.stringify(courses))
    showMessage("Curso atualizado com sucesso!", "success")
    loadCourses()
  } catch (error) {
    console.error("Erro ao atualizar curso:", error)
    showMessage("Erro ao atualizar curso", "error")
  }
}

async function deleteCourse(courseId) {
  if (confirm("Tem certeza que deseja excluir este curso?")) {
    try {
      const courses = JSON.parse(await window.GitHubAPI.getFileContent("courses") || "[]")
      courses.splice(courseId, 1)
      storage.setItem("courses", JSON.stringify(courses))
      showMessage("Curso excluído com sucesso!", "success")
      loadExistingCourses()
    } catch (error) {
      console.error("Erro ao excluir curso:", error)
      showMessage("Erro ao excluir curso", "error")
    }
  }
}

loadCourses()

// Funções para Eventos
async function editEvent(eventId) {
  try {
    const events = JSON.parse(await window.GitHubAPI.getFileContent("events") || "[]")
    const event = events.find((e) => e.id === eventId)
    if (event) {
      const contentArea = document.getElementById("contentArea")
      contentArea.innerHTML = `
        <h2>Editar Evento</h2>
        <div class="form-section edit-form">
          <form id="eventForm" class="edit-event-form">
            <input type="hidden" id="eventId" name="eventId" value="${eventId}">
            
            <div class="form-group">
              <label for="eventTitle">Título do Evento</label>
              <input type="text" id="eventTitle" name="title" value="${event.title}" required>
            </div>

            <div class="form-group">
              <label for="eventDate">Data do Evento</label>
              <input type="date" id="eventDate" name="date" value="${event.date}" required>
            </div>

            <div class="form-group">
              <label for="eventLocation">Local do Evento</label>
              <input type="text" id="eventLocation" name="location" value="${event.location}" required>
            </div>

            <div class="form-group">
              <label for="eventDescription">Descrição</label>
              <textarea id="eventDescription" name="description" rows="4" required>${event.description}</textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">Salvar</button>
              <button type="button" onclick="loadEvents()" class="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      `

      const form = document.getElementById("eventForm")
      form.addEventListener("submit", handleEventSubmit)
    }
  } catch (error) {
    console.error("Erro ao editar evento:", error)
    showMessage("Erro ao carregar evento para edição", "error")
  }
}

// Função para lidar com o envio do formulário de evento
async function handleEventSubmit(event) {
  event.preventDefault()
  const form = event.target
  const eventData = {
    id: form.eventId.value,
    title: form.title.value,
    date: form.date.value,
    location: form.location.value,
    description: form.description.value,
  }

  updateEvent(eventData.id, eventData)
}

// Função para atualizar um evento
async function updateEvent(eventId, eventData) {
  try {
    const events = JSON.parse(await window.GitHubAPI.getFileContent("events") || "[]")
    const index = events.findIndex((e) => e.id === eventId)
    if (index !== -1) {
      events[index] = eventData
      storage.setItem("events", JSON.stringify(events))
      showMessage("Evento atualizado com sucesso!", "success")
      loadEvents()
    } else {
      showMessage("Evento não encontrado!", "error")
    }
  } catch (error) {
    console.error("Erro ao atualizar evento:", error)
    showMessage("Erro ao atualizar evento", "error")
  }
}

// Função para carregar eventos
async function loadEvents() {
  const contentArea = document.getElementById("contentArea")
  contentArea.innerHTML = `
    <h2>Gerenciar Eventos</h2>
    <div class="form-section">
      <h3>Adicionar Novo Evento</h3>
      <form id="addEventForm">
        <div class="form-group">
          <label for="newEventTitle">Título do Evento</label>
          <input type="text" id="newEventTitle" name="title" required>
        </div>

        <div class="form-group">
          <label for="newEventDate">Data do Evento</label>
          <input type="date" id="newEventDate" name="date" required>
        </div>

        <div class="form-group">
          <label for="newEventLocation">Local do Evento</label>
          <input type="text" id="newEventLocation" name="location" required>
        </div>

        <div class="form-group">
          <label for="newEventDescription">Descrição</label>
          <textarea id="newEventDescription" name="description" rows="4" required></textarea>
        </div>

        <button type="submit" class="btn-primary">Adicionar Evento</button>
      </form>
    </div>
    <div class="form-section">
      <h3>Eventos Existentes</h3>
      <div id="eventList"></div>
    </div>
  `

  const form = document.getElementById("addEventForm")
  form.addEventListener("submit", addNewEvent)
  loadExistingEvents()
}

// Função para adicionar um novo evento
async function addNewEvent(event) {
  event.preventDefault()
  const form = event.target
  const newEvent = {
    id: Date.now().toString(), // Gera um ID único
    title: form.title.value,
    date: form.date.value,
    location: form.location.value,
    description: form.description.value,
  }

  try {
    const events = JSON.parse(await window.GitHubAPI.getFileContent("events") || "[]")
    events.push(newEvent)
    storage.setItem("events", JSON.stringify(events))
    showMessage("Novo evento adicionado com sucesso!", "success")
    form.reset()
    loadExistingEvents()
  } catch (error) {
    console.error("Erro ao adicionar novo evento:", error)
    showMessage("Erro ao adicionar novo evento", "error")
  }
}

// Função para carregar eventos existentes
async function loadExistingEvents() {
  const eventList = document.getElementById("eventList")
  if (!eventList) {
    console.error("Lista de eventos não encontrada")
    return
  }

  try {
    const events = JSON.parse(await window.GitHubAPI.getFileContent("events") || "[]")
    eventList.innerHTML =
      events.length === 0
        ? "<p>Nenhum evento cadastrado.</p>"
        : events
            .map(
              (event) => `
          <div class="item-card">
            <h4>${event.title}</h4>
            <p><strong>Data:</strong> ${formatDate(event.date)}</p>
            <p><strong>Local:</strong> ${event.location}</p>
            <p>${event.description}</p>
            <div class="item-actions">
              <button onclick="editEvent('${event.id}')" class="btn-edit">Editar</button>
              <button onclick="deleteEvent('${event.id}')" class="btn-delete">Excluir</button>
            </div>
          </div>
        `,
            )
            .join("")
  } catch (error) {
    console.error("Erro ao carregar eventos:", error)
    eventList.innerHTML = "<p>Erro ao carregar eventos. Por favor, tente novamente.</p>"
  }
}

// Função para deletar um evento
async function deleteEvent(eventId) {
  if (confirm("Tem certeza que deseja excluir este evento?")) {
    try {
      const events = JSON.parse(await window.GitHubAPI.getFileContent("events") || "[]")
      const updatedEvents = events.filter((e) => e.id !== eventId)
      storage.setItem("events", JSON.stringify(updatedEvents))
      showMessage("Evento excluído com sucesso!", "success")
      loadExistingEvents()
    } catch (error) {
      console.error("Erro ao excluir evento:", error)
      showMessage("Erro ao excluir evento", "error")
    }
  }
}

// Função auxiliar para formatar a data
async function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("pt-BR")
}

//Função para Palestras
async function editLecture(lectureId) {
  try {
    const lectures = JSON.parse(await window.GitHubAPI.getFileContent("lectures") || "[]")
    const lecture = lectures.find((l) => l.id === lectureId)
    if (lecture) {
      const contentArea = document.getElementById("contentArea")
      contentArea.innerHTML = `
        <h2>Editar Palestra</h2>
        <div class="form-section edit-form">
          <form id="lectureForm" class="edit-lecture-form">
            <input type="hidden" id="lectureId" name="lectureId" value="${lectureId}">
            
            <div class="form-group">
              <label for="lectureTitle">Título da Palestra</label>
              <input type="text" id="lectureTitle" name="title" value="${lecture.title}" required>
            </div>

            <div class="form-group">
              <label for="lectureSpeaker">Nome do Palestrante</label>
              <input type="text" id="lectureSpeaker" name="speaker" value="${lecture.speaker}" required>
            </div>

            <div class="form-group">
              <label for="lectureDate">Data da Palestra</label>
              <input type="date" id="lectureDate" name="date" value="${lecture.date}" required>
            </div>

            <div class="form-group">
              <label for="lectureMediator">Nome do Mediador (opcional)</label>
              <input type="text" id="lectureMediator" name="mediator" value="${lecture.mediator || ""}">
            </div>

            <div class="form-group">
              <label for="lectureDescription">Descrição</label>
              <textarea id="lectureDescription" name="description" rows="4" required>${lecture.description}</textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">Salvar</button>
              <button type="button" onclick="loadLectures()" class="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      `

      const form = document.getElementById("lectureForm")
      form.addEventListener("submit", handleLectureSubmit)
    }
  } catch (error) {
    console.error("Erro ao editar palestra:", error)
    showMessage("Erro ao carregar palestra para edição", "error")
  }
}

// Função para lidar com o envio do formulário de palestra
async function handleLectureSubmit(event) {
  event.preventDefault()
  const form = event.target
  const lectureData = {
    id: form.lectureId.value,
    title: form.title.value,
    speaker: form.speaker.value,
    date: form.date.value,
    mediator: form.mediator.value,
    description: form.description.value,
  }

  updateLecture(lectureData.id, lectureData)
}

// Função para atualizar uma palestra
async function updateLecture(lectureId, lectureData) {
  try {
    const lectures = JSON.parse(await window.GitHubAPI.getFileContent("lectures") || "[]")
    const index = lectures.findIndex((l) => l.id === lectureId)
    if (index !== -1) {
      lectures[index] = lectureData
      storage.setItem("lectures", JSON.stringify(lectures))
      showMessage("Palestra atualizada com sucesso!", "success")
      loadLectures()
    } else {
      showMessage("Palestra não encontrada!", "error")
    }
  } catch (error) {
    console.error("Erro ao atualizar palestra:", error)
    showMessage("Erro ao atualizar palestra", "error")
  }
}

// Função para carregar palestras
async function loadLectures() {
  const contentArea = document.getElementById("contentArea")
  contentArea.innerHTML = `
    <h2>Gerenciar Palestras</h2>
    <div class="form-section">
      <h3>Adicionar Nova Palestra</h3>
      <form id="addLectureForm">
        <div class="form-group">
          <label for="newLectureTitle">Título da Palestra</label>
          <input type="text" id="newLectureTitle" name="title" required>
        </div>

        <div class="form-group">
          <label for="newLectureSpeaker">Nome do Palestrante</label>
          <input type="text" id="newLectureSpeaker" name="speaker" required>
        </div>

        <div class="form-group">
          <label for="newLectureDate">Data da Palestra</label>
          <input type="date" id="newLectureDate" name="date" required>
        </div>

        <div class="form-group">
          <label for="newLectureMediator">Nome do Mediador (opcional)</label>
          <input type="text" id="newLectureMediator" name="mediator">
        </div>

        <div class="form-group">
          <label for="newLectureDescription">Descrição</label>
          <textarea id="newLectureDescription" name="description" rows="4" required></textarea>
        </div>

        <button type="submit" class="btn-primary">Adicionar Palestra</button>
      </form>
    </div>
    <div class="form-section">
      <h3>Palestras Existentes</h3>
      <div id="lectureList"></div>
    </div>
  `

  const form = document.getElementById("addLectureForm")
  form.addEventListener("submit", addNewLecture)
  loadExistingLectures()
}

// Função para adicionar uma nova palestra
async function addNewLecture(event) {
  event.preventDefault()
  const form = event.target
  const newLecture = {
    id: Date.now().toString(), // Gera um ID único
    title: form.title.value,
    speaker: form.speaker.value,
    date: form.date.value,
    mediator: form.mediator.value,
    description: form.description.value,
  }

  try {
    const lectures = JSON.parse(await window.GitHubAPI.getFileContent("lectures") || "[]")
    lectures.push(newLecture)
    storage.setItem("lectures", JSON.stringify(lectures))
    showMessage("Nova palestra adicionada com sucesso!", "success")
    form.reset()
    loadExistingLectures()
  } catch (error) {
    console.error("Erro ao adicionar nova palestra:", error)
    showMessage("Erro ao adicionar nova palestra", "error")
  }
}

// Função para carregar palestras existentes
async function loadExistingLectures() {
  const lectureList = document.getElementById("lectureList")
  if (!lectureList) {
    console.error("Lista de palestras não encontrada")
    return
  }

  try {
    const lectures = JSON.parse(await window.GitHubAPI.getFileContent("lectures") || "[]")
    lectureList.innerHTML =
      lectures.length === 0
        ? "<p>Nenhuma palestra cadastrada.</p>"
        : lectures
            .map(
              (lecture) => `
          <div class="item-card">
            <h4>${lecture.title}</h4>
            <p><strong>Palestrante:</strong> ${lecture.speaker}</p>
            <p><strong>Data:</strong> ${formatDate(lecture.date)}</p>
            ${lecture.mediator ? `<p><strong>Mediador:</strong> ${lecture.mediator}</p>` : ""}
            <p>${lecture.description}</p>
            <div class="item-actions">
              <button onclick="editLecture('${lecture.id}')" class="btn-edit">Editar</button>
              <button onclick="deleteLecture('${lecture.id}')" class="btn-delete">Excluir</button>
            </div>
          </div>
        `,
            )
            .join("")
  } catch (error) {
    console.error("Erro ao carregar palestras:", error)
    lectureList.innerHTML = "<p>Erro ao carregar palestras. Por favor, tente novamente.</p>"
  }
}

// Função para deletar uma palestra
async function deleteLecture(lectureId) {
  if (confirm("Tem certeza que deseja excluir esta palestra?")) {
    try {
      const lectures = JSON.parse(await window.GitHubAPI.getFileContent("lectures") || "[]")
      const updatedLectures = lectures.filter((l) => l.id !== lectureId)
      storage.setItem("lectures", JSON.stringify(updatedLectures))
      showMessage("Palestra excluída com sucesso!", "success")
      loadExistingLectures()
    } catch (error) {
      console.error("Erro ao excluir palestra:", error)
      showMessage("Erro ao excluir palestra", "error")
    }
  }
}

// Função para editar um livro
async function editBook(bookId) {
  try {
    const books = JSON.parse(await window.GitHubAPI.getFileContent("books") || "[]")
    const book = books.find((b) => b.id === bookId)
    if (book) {
      const contentArea = document.getElementById("contentArea")
      contentArea.innerHTML = `
        <h2>Editar Livro</h2>
        <div class="form-section edit-form">
          <form id="bookForm" class="edit-book-form">
            <input type="hidden" id="bookId" name="bookId" value="${bookId}">
            
            <div class="form-group">
              <label for="bookTitle">Título do Livro</label>
              <input type="text" id="bookTitle" name="title" value="${book.title}" required>
            </div>

            <div class="form-group">
              <label for="bookAuthor">Autor</label>
              <input type="text" id="bookAuthor" name="author" value="${book.author}" required>
            </div>

            <div class="form-group">
              <label for="bookIllustrator">Ilustrador</label>
              <input type="text" id="bookIllustrator" name="illustrator" value="${book.illustrator}" required>
            </div>

            <div class="form-group">
              <label for="bookDescription">Descrição</label>
              <textarea id="bookDescription" name="description" rows="4" required>${book.description}</textarea>
            </div>

            <div class="form-group">
              <label for="bookCover">Capa do Livro</label>
              ${book.cover ? `<img src="${book.cover}" alt="Capa atual" style="max-width: 200px; margin-bottom: 10px;">` : ""}
              <input type="file" id="bookCover" name="cover" accept="image/*">
              <small class="form-text text-muted">Deixe em branco para manter a capa atual</small>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">Salvar</button>
              <button type="button" onclick="loadBooks()" class="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      `

      const form = document.getElementById("bookForm")
      form.addEventListener("submit", handleBookSubmit)
    }
  } catch (error) {
    console.error("Erro ao editar livro:", error)
    showMessage("Erro ao carregar livro para edição", "error")
  }
}

async function handleBookSubmit(event) {
  event.preventDefault()
  const form = event.target
  const bookId = form.bookId.value

  try {
    const books = JSON.parse(await window.GitHubAPI.getFileContent("books") || "[]")
    const bookIndex = books.findIndex((b) => b.id === bookId)

    if (bookIndex === -1) {
      throw new Error("Livro não encontrado")
    }

    const updatedBook = {
      ...books[bookIndex],
      title: form.title.value,
      author: form.author.value,
      illustrator: form.illustrator.value,
      description: form.description.value,
    }

    const coverFile = form.cover.files[0]
    if (coverFile) {
      updatedBook.cover = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsDataURL(coverFile)
      })
    }

    books[bookIndex] = updatedBook
    storage.setItem("books", JSON.stringify(books))

    showMessage("Livro atualizado com sucesso!", "success")
    loadBooks()
  } catch (error) {
    console.error("Erro ao atualizar livro:", error)
    showMessage("Erro ao atualizar livro", "error")
  }
}

// Função para lidar com o upload da capa
async function uploadCover(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      resolve(event.target.result)
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsDataURL(file)
  })
}

// Função para carregar livros
async function loadBooks() {
  const contentArea = document.getElementById("contentArea")
  contentArea.innerHTML = `
    <h2>Gerenciar Livros</h2>
    <div class="form-section">
      <h3>Adicionar Novo Livro</h3>
      <form id="addBookForm">
        <div class="form-group">
          <label for="newBookTitle">Título do Livro</label>
          <input type="text" id="newBookTitle" name="title" required>
        </div>

        <div class="form-group">
          <label for="newBookAuthor">Autor</label>
          <input type="text" id="newBookAuthor" name="author" required>
        </div>

        <div class="form-group">
          <label for="newBookIllustrator">Ilustrador</label>
          <input type="text" id="newBookIllustrator" name="illustrator" required>
        </div>

        <div class="form-group">
          <label for="newBookReleaseDate">Data de Lançamento</label>
          <input type="date" id="newBookReleaseDate" name="releaseDate" required>
        </div>

        <div class="form-group">
          <label for="newBookType">Tipo</label>
          <select id="newBookType" name="type" required>
            <option value="infantil">Infantil</option>
            <option value="juvenil">Juvenil</option>
          </select>
        </div>

        <div class="form-group">
          <label for="newBookDescription">Descrição</label>
          <textarea id="newBookDescription" name="description" rows="4" required></textarea>
        </div>

        <div class="form-group">
          <label for="newBookCover">Capa do Livro</label>
          <input type="file" id="newBookCover" name="cover" accept="image/*" required>
        </div>

        <button type="submit" class="btn-primary">Adicionar Livro</button>
      </form>
    </div>
    <div class="form-section">
      <h3>Livros Existentes</h3>
      <div id="bookList"></div>
    </div>
  `

  const form = document.getElementById("addBookForm")
  form.addEventListener("submit", addNewBook)
  loadExistingBooks()
}

// Função para adicionar um novo livro
async function addNewBook(event) {
  event.preventDefault()
  const form = event.target

  try {
    const coverFile = form.cover.files[0]
    if (!coverFile) {
      showMessage("Por favor, selecione uma imagem de capa", "error")
      return
    }

    const coverBase64 = await convertToBase64(coverFile)

    const newBook = {
      id: Date.now().toString(),
      title: form.title.value,
      author: form.author.value,
      illustrator: form.illustrator.value,
      releaseDate: form.releaseDate.value,
      type: form.type.value,
      description: form.description.value,
      cover: coverBase64,
    }

    const books = JSON.parse(await window.GitHubAPI.getFileContent("books") || "[]")
    books.push(newBook)
    storage.setItem("books", JSON.stringify(books))
    showMessage("Novo livro adicionado com sucesso!", "success")
    form.reset()
    loadExistingBooks()
  } catch (error) {
    console.error("Erro ao adicionar novo livro:", error)
    showMessage("Erro ao adicionar novo livro", "error")
  }
}

// Função para carregar livros existentes
async function loadExistingBooks() {
  const bookList = document.getElementById("bookList")
  if (!bookList) {
    console.error("Lista de livros não encontrada")
    return
  }

  try {
    const books = JSON.parse(await window.GitHubAPI.getFileContent("books") || "[]")
    bookList.innerHTML =
      books.length === 0
        ? "<p>Nenhum livro cadastrado.</p>"
        : books
            .map(
              (book) => `
          <div class="item-card">
            ${book.cover ? `<img src="${book.cover}" alt="${book.title}" style="max-width: 200px; margin-bottom: 1rem;">` : ""}
            <h4>${book.title}</h4>
            <p><strong>Autor:</strong> ${book.author}</p>
            <p><strong>Ilustrador:</strong> ${book.illustrator}</p>
            <p><strong>Data de Lançamento:</strong> ${formatDate(book.releaseDate)}</p>
            <p><strong>Tipo:</strong> ${formatBookType(book.type)}</p>
            <p>${book.description}</p>
            <div class="item-actions">
              <button onclick="editBook('${book.id}')" class="btn-edit">Editar</button>
              <button onclick="deleteBook('${book.id}')" class="btn-delete">Excluir</button>
            </div>
          </div>
        `,
            )
            .join("")
  } catch (error) {
    console.error("Erro ao carregar livros:", error)
    bookList.innerHTML = "<p>Erro ao carregar livros. Por favor, tente novamente.</p>"
  }
}

// Função para formatar o tipo de livro
async function formatBookType(type) {
  switch (type) {
    case "infantil":
      return "Infantil"
    case "juvenil":
      return "Juvenil"
    default:
      return "Desconhecido"
  }
}

// Função para atualizar um livro
async function updateBook(bookId, bookData) {
  try {
    const books = JSON.parse(await window.GitHubAPI.getFileContent("books") || "[]")
    const index = books.findIndex((b) => b.id === bookId)
    if (index !== -1) {
      books[index] = bookData
      storage.setItem("books", JSON.stringify(books))
      showMessage("Livro atualizado com sucesso!", "success")
      loadBooks()
    } else {
      showMessage("Livro não encontrado", "error")
    }
  } catch (error) {
    console.error("Erro ao atualizar livro:", error)
    showMessage("Erro ao atualizar livro", "error")
  }
}

// Função para excluir um livro
async function deleteBook(bookId) {
  if (confirm("Tem certeza que deseja excluir este livro?")) {
    try {
      const books = JSON.parse(await window.GitHubAPI.getFileContent("books") || "[]")
      const updatedBooks = books.filter((b) => b.id !== bookId)
      storage.setItem("books", JSON.stringify(updatedBooks))
      showMessage("Livro excluído com sucesso!", "success")
      loadBooks()
    } catch (error) {
      console.error("Erro ao excluir livro:", error)
      showMessage("Erro ao excluir livro", "error")
    }
  }
}

//Função de Contatos

async function loadContact() {
  try {
    const data = await window.GitHubAPI.getFileContent();
    const contactData = data.contactData || {};

    const content = `
      <div class="contact-management">
        <h2>Gerenciar Contatos</h2>
        
        <div class="contact-form-section">
          <form id="contactForm">
            <div class="form-group">
              <label>Email Principal:</label>
              <input type="email" id="contactEmail" value="${contactData.email || ''}" required>
            </div>

            <div class="form-group">
              <label>Telefone:</label>
              <input type="tel" id="contactPhone" value="${contactData.phone || ''}" required>
            </div>

            <div class="form-group">
              <label>Endereço:</label>
              <textarea id="contactAddress" required>${contactData.address || ''}</textarea>
            </div>

            <div class="form-group">
              <label>Horário de Atendimento:</label>
              <input type="text" id="contactHours" value="${contactData.hours || ''}" required>
            </div>

            <div class="social-section">
              <h3>Redes Sociais</h3>
              
              <div class="form-group">
                <label>Instagram:</label>
                <input type="text" id="contactInstagram" value="${contactData.instagram || ''}" placeholder="@seuinstagram">
              </div>

              <div class="form-group">
                <label>URL do Instagram:</label>
                <input type="url" id="contactInstagramUrl" value="${contactData.instagramUrl || ''}" placeholder="https://instagram.com/seuinstagram">
              </div>

              <div class="form-group">
                <label>Descrição do Instagram:</label>
                <textarea id="contactInstagramDescription">${contactData.instagramDescription || ''}</textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">Salvar Contatos</button>
              <button type="button" class="btn-secondary" onclick="testContactPreview()">Visualizar</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const contentArea = document.getElementById('contentArea');
    if (!contentArea) throw new Error('Área de conteúdo não encontrada');
    
    contentArea.innerHTML = content;

    // Event Listener para o formulário
    document.getElementById('contactForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const updatedContact = {
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        address: document.getElementById('contactAddress').value,
        hours: document.getElementById('contactHours').value,
        instagram: document.getElementById('contactInstagram').value,
        instagramUrl: document.getElementById('contactInstagramUrl').value,
        instagramDescription: document.getElementById('contactInstagramDescription').value
      };

      try {
        const fullData = await window.GitHubAPI.getFileContent();
        await window.GitHubAPI.updateFileContent({
          ...fullData,
          contactData: updatedContact
        });
        
        showMessage("Contatos atualizados com sucesso!", "success");
        loadContact(); // Recarrega os dados
      } catch (error) {
        console.error("Erro ao salvar contatos:", error);
        showMessage("Erro ao salvar contatos", "error");
      }
    });

  } catch (error) {
    console.error("Erro ao carregar contatos:", error);
    showMessage("Erro ao carregar dados de contato", "error");
  }
}

// Função auxiliar para visualização
function testContactPreview() {
  const previewContent = `
    <div class="contact-preview">
      <h3>Pré-visualização do Contato</h3>
      <p>Email: ${document.getElementById('contactEmail').value}</p>
      <p>Telefone: ${document.getElementById('contactPhone').value}</p>
      <p>Endereço: ${document.getElementById('contactAddress').value}</p>
      <p>Horário: ${document.getElementById('contactHours').value}</p>
      <p>Instagram: ${document.getElementById('contactInstagram').value}</p>
    </div>
  `;
  
  showMessage(previewContent, "info", 5000);
}

async function saveContactData(contactData) {
  try {
    await updateFileContent({ ...(await window.GitHubAPI.getFileContent()), contactData })
    showMessage("Dados de contato salvos com sucesso!", "success")
  } catch (error) {
    console.error("Erro ao salvar dados de contato:", error)
    showMessage("Erro ao salvar dados de contato", "error")
  }
}
async function logout() {
  log("Realizando logout")
  storage.removeItem("loggedIn")
  window.location.href = "login.html"
}

// Função para carregar a página de contato
async function showMessage(message, type) {
  const messageElement = document.createElement("div")
  messageElement.textContent = message
  messageElement.className = `message ${type}`
  document.body.appendChild(messageElement)
  setTimeout(() => messageElement.remove(), 3000)

  if (typeof displayAdminMessage === "async function") {
    displayAdminMessage(message, type)
  } else {
    alert(message)
  }
}

// Adicionar estilos CSS
const style = document.createElement("style")
style.textContent = `
  .audio-description-item {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;
  }

  .audio-description-item h5 {
      margin: 0 0 0.5rem 0;
      color: #333;
  }

  .audio-description-item p {
      margin: 0 0 1rem 0;
      color: #666;
  }

  .audio-description-actions {
      display: flex;
      gap: 0.5rem;
  }

  #audioDescriptionForm {
      margin-bottom: 2rem;
  }

  #audioDescriptionForm input,
  #audioDescriptionForm textarea {
      width: 100%;
      margin-bottom: 1rem;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
  }

  .menu-item {
      cursor: pointer;
  }
  .priority-member {
    border: 2px solid;
    background-color: rgba(255, 215, 0, 0.1);
  }

  .priority-member[data-priority="4"] {
    border-color: #FFD700; /* Gold for Coordenador */
  }

  .priority-member[data-priority="3"] {
    border-color: #C0C0C0; /* Silver for Comissão Técnica */
  }

  .priority-member[data-priority="2"] {
    border-color: #CD7F32; /* Bronze for Comissão Científica */
  }

  .edit-member-dialog {
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  max-width: 500px;
  width: 90%;
  z-index: 1000;
}

.edit-member-dialog form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.edit-member-dialog input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.edit-member-dialog .image-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.edit-member-dialog .dialog-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 15px;
}

.edit-member-dialog button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-member-dialog .save-button {
  background-color: #deb887;
  color: white;
}

.edit-member-dialog .cancel-button {
  background-color: #f1f1f1;
}

.edit-member-dialog button:hover {
  opacity: 0.9;
}
`
document.head.appendChild(style)

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Bind menu click handlers
  document.getElementById("homeBtn").addEventListener("click", loadHome)
  document.getElementById("aboutBtn").addEventListener("click", loadAbout)
  document.getElementById("projectsBtn").addEventListener("click", loadProjects)
  document.getElementById("researchBtn").addEventListener("click", loadResearch)
  document.getElementById("coursesBtn").addEventListener("click", loadCourses)
  document.getElementById("eventsBtn").addEventListener("click", loadEvents)
  document.getElementById("lecturesBtn").addEventListener("click", loadLectures)
  document.getElementById("booksBtn").addEventListener("click", loadBooks)
  document.getElementById("contactBtn").addEventListener("click", loadContact)
  document.getElementById("logoutBtn").addEventListener("click", logout)
  document.getElementById("welcomeTextForm")?.addEventListener("submit", handleWelcomeTextSubmit)
  document.getElementById("historyTextForm")?.addEventListener("submit", handleHistoryTextSubmit)
  document.getElementById("teamMemberForm")?.addEventListener("submit", handleTeamMemberSubmit)
  document.getElementById("projectForm").addEventListener("submit", handleProjectSubmit)
  document.getElementById("audioDescriptionsBtn").addEventListener("click", loadAudioDescriptions)
  // Adicione event listeners para os botões
  document.getElementById("loadContactButton").addEventListener("click", loadContact)
  document.getElementById("saveContactButton").addEventListener("click", saveContact)

  // Load initial content
  loadHome()
  loadExistingProjects()
  // Remova esta linha se a função não for necessária
  // loadStoredContent()
  loadProjects()
  loadTeamMembers()
  loadExistingAudioDescriptions()
  const backToSiteBtn = document.getElementById("backToSiteBtn")

  backToSiteBtn.addEventListener("click", () => {
    const confirmExit = confirm("Tem certeza que deseja voltar para o site principal?")
    if (confirmExit) {
      window.location.href = "index.html"
    }
  })

  // Carregar conteúdo inicial
  loadTeamMembers()
  loadExistingAudioDescriptions()

  // Adicionar event listeners para formulários
  safeAddEventListener("teamMemberForm", "submit", handleTeamMemberSubmit)
  safeAddEventListener("audioDescriptionForm", "submit", handleAudioDescriptionSubmit)

  console.log("Inicializando admin.js")

  // Adicionar event listeners para os botões do menu
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      const sectionName = e.target.textContent.trim()
      loadContent(sectionName)
    })
  })

  // Event listener específico para o botão de Audiodescrições
  const audioDescriptionsButton = document.getElementById("audioDescriptionsBtn")
  if (audioDescriptionsButton) {
    audioDescriptionsButton.addEventListener("click", () => loadContent("Audiodescrições"))
  }

  // Adicionar event listener para o formulário de audiodescrição
  const audioDescriptionForm = document.getElementById("audioDescriptionForm")
  if (audioDescriptionForm) {
    audioDescriptionForm.addEventListener("submit", handleAudioDescriptionSubmit)
  }

  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((button) => {
    button.addEventListener("click", (e) => {
      const sectionName = e.target.textContent.trim()
      loadContent(sectionName)
    })
  })

  const audioDescriptionsBtn = document.querySelector('.nav-item[data-action="audioDescriptions"]')
  if (audioDescriptionsBtn) {
    audioDescriptionsBtn.addEventListener("click", () => loadContent("Audiodescrições"))
  } else {
    console.error("Botão de Audiodescrições não encontrado")
  }

  // Carregar conteúdo inicial (Home)
  loadContent("Home")
})

// Tornar funções disponíveis globalmente
window.addNewCourse = addNewCourse
window.addNewEvent = addNewEvent
window.addNewLecture = addNewLecture
window.addNewBook = addNewBook
window.editCourse = editCourse
window.deleteCourse = deleteCourse
window.editEvent = editEvent
window.deleteEvent = deleteEvent
window.editLecture = editLecture
window.deleteLecture = deleteLecture
window.editBook = editBook
window.deleteBook = deleteBook
window.editMember = editMember
window.deleteMember = deleteMember
window.updateMember = updateMember
window.loadTeamMembers = loadTeamMembers
window.editAudioDescription = editAudioDescription
window.deleteAudioDescription = deleteAudioDescription
window.saveAudioDescription = saveAudioDescription
window.saveWelcomeText = saveWelcomeText
window.saveHistoryText = saveHistoryText
window.loadAbout = loadAbout
window.loadHome = loadHome
window.loadProjects = loadProjects
window.loadResearch = loadResearch
window.editResearch = editResearch
window.deleteResearch = deleteResearch
window.formatResearchStatus = formatResearchStatus
window.loadCourses = loadCourses
window.loadEvents = loadEvents
window.loadLectures = loadLectures
window.loadBooks = loadBooks
window.loadContact = loadContact
window.logout = logout
window.addTeamMember = addTeamMember
window.editMember = editMember
window.deleteMember = deleteMember
window.loadTeamMembers = loadTeamMembers
window.loadProjectsContent = loadProjectsContent
window.loadContent = loadContent
window.deleteAudioDescription = deleteAudioDescription
window.getFileContent = getFileContent
window.updateFileContent = updateFileContent
window.checkGitHubAPI = checkGitHubAPI
window.exampleUseOfGitHubAPI = exampleUseOfGitHubAPI
window.loadGitHubAPI= loadGitHubAPI

// Função auxiliar para ler arquivo como Data URL
async function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}

// Dummy functions and variable declarations to resolve errors
const loadStoredContent = () => {
  // Implementação da função loadStoredContent
  console.log("Carregando conteúdo armazenado...")
  // Adicione aqui a lógica para carregar o conteúdo armazenado
}

// Chame esta função onde for necessário
loadStoredContent()
const loadHomeContent = () => {}
const storage = localStorage
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      resolve(event.target.result)
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsDataURL(file)
  })
}
const saveContact = () => {}
const safeAddEventListener = (elementId, eventType, handler) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.addEventListener(eventType, handler)
  } else {
    console.error(`Elemento com ID '${elementId}' não encontrado.`)
  }
}