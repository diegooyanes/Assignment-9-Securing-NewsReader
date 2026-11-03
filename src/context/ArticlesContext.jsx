/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const ArticlesContext = createContext(null);

export function ArticlesProvider({ children }) {
  const { user } = useAuth();
  const [savedArticlesByUser, setSavedArticlesByUser] = useState(() =>
    JSON.parse(localStorage.getItem('savedArticlesByUser') || '{}')
  );

  useEffect(() => {
    localStorage.setItem('savedArticlesByUser', JSON.stringify(savedArticlesByUser));
  }, [savedArticlesByUser]);

  const getUserSavedArticles = () => {
    return user ? savedArticlesByUser[user.username] || [] : [];
  };

  const saveArticle = (article) => {
    if (!user) return;
    setSavedArticlesByUser(prev => {
      const articles = prev[user.username] || [];
      if (articles.some(a => a.url === article.url)) return prev;
      return { ...prev, [user.username]: [...articles, article] };
    });
  };

  const removeArticle = (url) => {
    if (!user) return;
    setSavedArticlesByUser(prev => ({
      ...prev,
      [user.username]: (prev[user.username] || []).filter(a => a.url !== url)
    }));
  };

  const isArticleSaved = (url) => {
    return getUserSavedArticles().some(a => a.url === url);
  };

  const getAllUserArticles = () => savedArticlesByUser;

  return (
    <ArticlesContext.Provider value={{
      saveArticle,
      removeArticle,
      isArticleSaved,
      getUserSavedArticles,
      getAllUserArticles
    }}>
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within ArticlesProvider');
  }
  return context;
}
