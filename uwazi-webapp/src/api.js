const API_URL = "https://your-render-app.onrender.com"; // Your Render backend URL

export const compareArticle = async (articleText) => {
  const response = await fetch(`${API_URL}/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ article_text: articleText })
  });
  return await response.json();
};
