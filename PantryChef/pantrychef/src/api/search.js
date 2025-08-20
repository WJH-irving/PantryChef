// 获取热门搜索关键词
export const getHotSearches = () => {
  return fetch('/api/hot-searches')
    .then(response => response.json())
    .then(data => {
      if (data.code === 0) {
        return data.data;
      }
      throw new Error('Failed to fetch hot searches');
    })
    .catch(error => {
      console.error('Error fetching hot searches:', error);
      return [];
    });
};

// 搜索菜谱
export const searchRecipes = (keyword) => {
  return fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`)
    .then(response => response.json())
    .then(data => {
      if (data.code === 0) {
        return data.data;
      }
      throw new Error('Failed to search recipes');
    })
    .catch(error => {
      console.error('Error searching recipes:', error);
      return [];
    });
};