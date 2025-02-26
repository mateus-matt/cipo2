document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
  
    // Simples verificação de credenciais (deve ser feita no servidor em produção)
    if (username === "admin" && password === "senha123") {
      localStorage.setItem("loggedIn", "true")
      window.location.href = "admin.html"
    } else {
      alert("Credenciais inválidas")
    }
  })
  
  