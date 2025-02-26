document.addEventListener("DOMContentLoaded", () => {
  function loadHomeImage() {
    const heroSection = document.getElementById("hero")
    if (!heroSection) {
      console.warn("Elemento 'hero' não encontrado. Ignorando carregamento da imagem.")
      return
    }

    const savedImage = localStorage.getItem("homeImage")

    if (savedImage) {
      // Verifica se já existe um carousel
      let carouselInner = heroSection.querySelector(".carousel-inner")
      if (!carouselInner) {
        // Se não existir, cria um novo carousel
        const carousel = document.createElement("div")
        carousel.id = "heroCarousel"
        carousel.className = "carousel"
        carouselInner = document.createElement("div")
        carouselInner.className = "carousel-inner"
        carousel.appendChild(carouselInner)
        heroSection.appendChild(carousel)
      }

      // Adiciona a nova imagem como primeiro item do carousel
      const newItem = document.createElement("div")
      newItem.className = "carousel-item active"
      const img = document.createElement("img")
      img.src = savedImage
      img.alt = "Imagem da Página Inicial"
      newItem.appendChild(img)

      // Insere a nova imagem como primeiro item
      carouselInner.insertBefore(newItem, carouselInner.firstChild)

      // Atualiza as classes 'active' para manter apenas o primeiro item ativo
      const items = carouselInner.querySelectorAll(".carousel-item")
      items.forEach((item, index) => {
        if (index === 0) {
          item.classList.add("active")
        } else {
          item.classList.remove("active")
        }
      })
    }
  }

  loadHomeImage()
  window.addEventListener("homeImageUpdated", loadHomeImage)
})

