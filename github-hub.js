const GITHUB_TOKEN = "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";
const REPO_OWNER = "mateus-matt";
const REPO_NAME = "cipo2";
const FILE_PATH = "data/cipo_data.json";

window.GitHubAPI = window.GitHubAPI || {};

window.GitHubAPI = {
  getFileContent: async () => {
    try {
      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
      console.log('Fetching URL:', url); // Debug

      const response = await fetch(url, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json"
        }
      });

      console.log('Response status:', response.status); // Debug
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('GitHub API Error:', errorData);
        throw new Error(`Erro ao buscar o arquivo: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Decodificação alternativa mais robusta
      const decodedContent = decodeURIComponent(
        atob(data.content)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(decodedContent);

    } catch (error) {
      console.error('Erro no getFileContent:', error);
      throw error;
    }
  },

  updateFileContent: async (content) => {
    try {
      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
      const currentFile = await this.getFileContent();

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json"
        },
        body: JSON.stringify({
          message: "Update CIPO data",
          content: btoa(unescape(encodeURIComponent(JSON.stringify(content)))),
          sha: currentFile.sha
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('GitHub API Error:', errorData);
        throw new Error(`Erro ao atualizar arquivo: ${response.status} ${response.statusText}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error('Erro no updateFileContent:', error);
      throw error;
    }
  }
};