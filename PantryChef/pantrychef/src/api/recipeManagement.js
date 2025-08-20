// 食谱管理相关的API服务

/**
 * 根据食材生成食谱
 * @param {string} ingredients - 食材列表，用空格分隔
 * @returns {Promise} 返回生成的食谱和补货建议
 */
export const generateRecipes = async (ingredients) => {
    try {
        // 这里应该调用真实的AI API
        // 目前使用模拟数据
        const response = await fetch('/api/recipe/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients })
        });

        if (!response.ok) {
            throw new Error('生成食谱失败');
        }

        return await response.json();
    } catch (error) {
        console.error('API调用失败:', error);
        // 返回模拟数据
        return {
            code: 0,
            data: {
                recipes: [
                    {
                        id: 'recipe-1',
                        title: '番茄炒蛋',
                        image: 'https://img1.baidu.com/it/u=1750243389,4049046637&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=653',
                        category: '家常菜',
                        time: '15',
                        difficulty: '简单',
                        calories: '180',
                        ingredients: ['番茄', '鸡蛋', '葱花', '盐', '生抽'],
                        steps: [
                            '番茄切块，鸡蛋打散',
                            '热油下蛋液炒散盛出',
                            '下番茄翻炒出汁',
                            '加入炒好的鸡蛋翻炒均匀',
                            '调味即可'
                        ],
                        nutrients: {
                            protein: '12g',
                            fat: '8g',
                            carbs: '15g'
                        }
                    },
                    {
                        id: 'recipe-2',
                        title: '紫菜蛋汤',
                        image: 'https://img1.baidu.com/it/u=95894301,726494640&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=664',
                        category: '汤品',
                        time: '10',
                        difficulty: '简单',
                        calories: '120',
                        ingredients: ['紫菜', '鸡蛋', '葱花', '盐', '香油'],
                        steps: [
                            '紫菜泡发洗净',
                            '锅中加水烧开',
                            '加入紫菜煮2分钟',
                            '打入鸡蛋花',
                            '调味撒葱花即可'
                        ],
                        nutrients: {
                            protein: '8g',
                            fat: '5g',
                            carbs: '8g'
                        }
                    }
                ],
                supplements: [
                    {
                        id: 'supplement-1',
                        name: '紫菜',
                        reason: '制作紫菜蛋汤需要',
                        priority: 'high',
                        estimatedPrice: '8.00',
                        category: '干货'
                    },
                    {
                        id: 'supplement-2',
                        name: '葱花',
                        reason: '调味提香',
                        priority: 'medium',
                        estimatedPrice: '2.00',
                        category: '蔬菜'
                    }
                ]
            }
        };
    }
};

/**
 * 获取食谱详情
 * @param {string} recipeId - 食谱ID
 * @returns {Promise} 返回食谱详细信息
 */
export const getRecipeDetail = async (recipeId) => {
    try {
        const response = await fetch(`/api/recipe/${recipeId}`);
        
        if (!response.ok) {
            throw new Error('获取食谱详情失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取食谱详情失败:', error);
        throw error;
    }
};

/**
 * 保存用户食谱
 * @param {Object} recipe - 食谱信息
 * @returns {Promise} 返回保存结果
 */
export const saveUserRecipe = async (recipe) => {
    try {
        const response = await fetch('/api/recipe/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe)
        });

        if (!response.ok) {
            throw new Error('保存食谱失败');
        }

        return await response.json();
    } catch (error) {
        console.error('保存食谱失败:', error);
        throw error;
    }
};

/**
 * 获取用户收藏的食谱
 * @returns {Promise} 返回收藏的食谱列表
 */
export const getUserFavorites = async () => {
    try {
        const response = await fetch('/api/recipe/favorites');
        
        if (!response.ok) {
            throw new Error('获取收藏食谱失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取收藏食谱失败:', error);
        throw error;
    }
};

/**
 * 获取食材分类
 * @returns {Promise} 返回食材分类列表
 */
export const getIngredientCategories = async () => {
    try {
        const response = await fetch('/api/ingredients/categories');
        
        if (!response.ok) {
            throw new Error('获取食材分类失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取食材分类失败:', error);
        // 返回默认分类
        return {
            code: 0,
            data: [
                { id: 'vegetables', name: '蔬菜', icon: '🥬' },
                { id: 'meat', name: '肉类', icon: '🥩' },
                { id: 'seafood', name: '海鲜', icon: '🐟' },
                { id: 'dairy', name: '乳制品', icon: '🥛' },
                { id: 'grains', name: '谷物', icon: '🌾' },
                { id: 'fruits', name: '水果', icon: '🍎' },
                { id: 'spices', name: '调味料', icon: '🧂' }
            ]
        };
    }
};

/**
 * 根据分类获取食材列表
 * @param {string} categoryId - 分类ID
 * @returns {Promise} 返回食材列表
 */
export const getIngredientsByCategory = async (categoryId) => {
    try {
        const response = await fetch(`/api/ingredients/category/${categoryId}`);
        
        if (!response.ok) {
            throw new Error('获取食材列表失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取食材列表失败:', error);
        throw error;
    }
};
