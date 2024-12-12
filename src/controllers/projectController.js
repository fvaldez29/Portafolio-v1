import 'dotenv/config'
import axios from 'axios'

export const getProjectController = async (req, res) => {
  try {
    const favoriteProjects = [
      'ITBIS-Calculator',
      'Menu-de-comida-INFOTEP',
      'API-Gestion-de-tareas-API',
      'Chatbox',
      'Find-hat-terminal-',
      'Sleep-Debt-Calculator'
    ]

    const response = await axios.get(`https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`, {
      headers: process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {},
      params: {
        per_page: 100, 
        page: 1, 
      },
    })

  
    const repos = await Promise.all(
      response.data
        .filter(repo => favoriteProjects.includes(repo.name))
        .map(async (repo) => {
          
          const languagesResponse = await axios.get(repo.languages_url, {
            headers: process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {},
          })


          const languages = Object.keys(languagesResponse.data)

          return {
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            technologies: languages.join(', '),
          }
        })
    )

    console.log(repos)
    res.render('index', {
      title: 'Portafolio Web',
      repos,
      user: req.user,
      layouts: 'layouts/main',
    })
  } catch (error) {
    console.log('Error fetching repositories: ', error.message)
    res.status(500).json({ error: 'Error fetching repositories' })
  }
}
