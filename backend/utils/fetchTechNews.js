const axios = require('axios');
require('dotenv').config();

// Fetch tech news from NewsAPI
const fetchTechNews = async () => {
  const apiKey = process.env.NEWS_API;
  const url = `https://newsapi.org/v2/top-headlines?category=technology&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
const articles = response.data.articles.map((article) => ({
  source: article.source ? article.source.name : 'Unknown Source', 
  author: article.author || 'Unknown Author', // Default if no author provided
  title: article.title,
  description: article.description,
  url: article.url, 
  urlToImage: article.urlToImage, 
  publishedAt: article.publishedAt, // Date and time in UTC
  content: article.content || 'Content not available', // Fallback for missing content
}));

    return articles;
    // we make a return statement here (not a response) because this is a helper function that will be used in the controller at backend.
  } catch (error) {
    console.error('Error fetching tech news:', error.message);
    throw new Error('Failed to fetch tech news');
  }
};

module.exports = fetchTechNews;
