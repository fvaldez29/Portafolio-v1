import 'dotenv/config'
import axios from 'axios'

export const getProjectController = async(req, res) => {
    try {

        const favoriteProjects = [
            'ITBIS-Calculator',
            'Menu-de-comida-INFOTEP',
            'API-Gestion-de-tareas-API',
            'Chatbox',
            'Find-hat-terminal-',
            'Portafolio'
        ]

        const response = await axios.get(`https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`, {
            headers: process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN} `} : {},
        })

        const repos = response.data
        .filter(repo => favoriteProjects.includes(repo.name))
        .map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
        }));

        console.log(repos)
        console.log(process.env.GITHUB_USERNAME)
        res.render('index', {
            title: 'Portfalio Web',
            repos,
            user: req.user,
            layouts: 'layouts/main'
        })


    } catch (error) {
        console.log('Error fetching repositories: ', error.message)
        res.status(500).json({ error: 'Error fetching repositories' })
    }
}