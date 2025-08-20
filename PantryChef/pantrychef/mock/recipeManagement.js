import Mock from 'mockjs';

export default [
    {
        url: '/api/recipe/generate',
        method: 'post',
        timeout: 1000,
        response: (options) => {
            const { ingredients } = JSON.parse(options.body);
            
            let recipes = [];
            let supplements = [];
            
            if (ingredients.includes('番茄') && ingredients.includes('鸡蛋')) {
                recipes.push({
                    id: 'recipe-1',
                    title: '番茄炒蛋',
                    image: 'https://img1.baidu.com/it/u=1750243389,4049046637&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=653',
                    category: '家常菜',
                    time: '15',
                    difficulty: '简单',
                    calories: '180'
                });
                
                if (!ingredients.includes('葱花')) {
                    supplements.push({
                        id: 'supplement-1',
                        name: '葱花',
                        reason: '调味提香',
                        priority: 'medium',
                        estimatedPrice: '2.00'
                    });
                }
            }
            
            if (ingredients.includes('鸡蛋')) {
                recipes.push({
                    id: 'recipe-2',
                    title: '紫菜蛋汤',
                    image: 'https://img1.baidu.com/it/u=95894301,726494640&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=664',
                    category: '汤品',
                    time: '10',
                    difficulty: '简单',
                    calories: '120'
                });
                
                if (!ingredients.includes('紫菜')) {
                    supplements.push({
                        id: 'supplement-2',
                        name: '紫菜',
                        reason: '制作紫菜蛋汤需要',
                        priority: 'high',
                        estimatedPrice: '8.00'
                    });
                }
            }
            
            return {
                code: 0,
                message: '生成成功',
                data: { recipes, supplements }
            };
        }
    },

    {
        url: '/api/recipe/:recipeId',
        method: 'get',
        timeout: 1000,
        response: (options) => {
            const recipeId = options.url.split('/').pop();
            
            // 定义食谱相关的数据模板
            const recipeData = {
                'recipe-1': {
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
                    },
                    tips: '番茄要炒出汁水，鸡蛋要炒得嫩滑'
                },
                'recipe-2': {
                    title: '紫菜蛋汤',
                    image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.pO7JN8KKRQzmHuWMNs_fCwHaFl?w=241&h=182&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
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
                    },
                    tips: '紫菜不要煮太久，保持脆嫩口感'
                },
                'preset-3': {
                    title: '宫保鸡丁',
                    image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.GKNOZd92xP2hM84a0UcoNQHaE9?w=280&h=187&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
                    category: '川菜',
                    time: '25',
                    difficulty: '普通',
                    calories: '320',
                    ingredients: ['鸡胸肉', '花生米', '干辣椒', '花椒', '葱姜蒜'],
                    steps: [
                        '鸡胸肉切丁腌制',
                        '花生米炸酥备用',
                        '炒香干辣椒和花椒',
                        '下鸡丁炒熟',
                        '调味收汁'
                    ],
                    nutrients: {
                        protein: '28g',
                        fat: '18g',
                        carbs: '12g'
                    },
                    tips: '鸡丁要腌制入味，花生米要最后加入'
                },
                'preset-4': {
                    title: '红烧肉',
                    image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.xAcPIZRiZw9NkMBWxh4vgQHaJp?w=161&h=211&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
                    category: '家常菜',
                    time: '60',
                    difficulty: '普通',
                    calories: '450',
                    ingredients: ['五花肉', '冰糖', '生抽', '老抽', '料酒'],
                    steps: [
                        '五花肉切块焯水',
                        '锅中放冰糖炒糖色',
                        '下五花肉翻炒上色',
                        '加调料和水炖煮',
                        '大火收汁'
                    ],
                    nutrients: {
                        protein: '25g',
                        fat: '35g',
                        carbs: '15g'
                    },
                    tips: '炒糖色时火候要控制好，避免炒糊'
                }
            };
            
            // 如果请求的recipeId在预定义数据中，则使用预定义数据
            if (recipeData[recipeId]) {
                const recipe = {
                    id: recipeId,
                    title: recipeData[recipeId].title,
                    image: recipeData[recipeId].image,
                    category: recipeData[recipeId].category,
                    time: recipeData[recipeId].time,
                    difficulty: recipeData[recipeId].difficulty,
                    calories: recipeData[recipeId].calories,
                    ingredients: recipeData[recipeId].ingredients,
                    steps: recipeData[recipeId].steps,
                    nutrients: recipeData[recipeId].nutrients,
                    tips: recipeData[recipeId].tips,
                    author: '美食达人',
                    rating: Mock.Random.float(4, 5, 1, 1),
                    reviews: Mock.Random.integer(50, 200)
                };
                
                return {
                    code: 0,
                    message: '获取成功',
                    data: recipe
                };
            }
            
            // 对于不在预定义数据中的recipeId，生成随机数据
            // 使用固定的模板数据，确保相同ID始终生成相同且匹配的数据
            const recipeTemplates = [
                {
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
                    },
                    tips: '番茄要炒出汁水，鸡蛋要炒得嫩滑'
                },
                {
                    title: '紫菜蛋汤',
                    image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.pO7JN8KKRQzmHuWMNs_fCwHaFl?w=241&h=182&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
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
                    },
                    tips: '紫菜不要煮太久，保持脆嫩口感'
                },
                {
                    title: '红烧肉',
                    image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.xAcPIZRiZw9NkMBWxh4vgQHaJp?w=161&h=211&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
                    category: '家常菜',
                    time: '60',
                    difficulty: '普通',
                    calories: '450',
                    ingredients: ['五花肉', '冰糖', '生抽', '老抽', '料酒'],
                    steps: [
                        '五花肉切块焯水',
                        '锅中放冰糖炒糖色',
                        '下五花肉翻炒上色',
                        '加调料和水炖煮',
                        '大火收汁'
                    ],
                    nutrients: {
                        protein: '25g',
                        fat: '35g',
                        carbs: '15g'
                    },
                    tips: '炒糖色时火候要控制好，避免炒糊'
                },
                {
                    title: '宫保鸡丁',
                    image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.GKNOZd92xP2hM84a0UcoNQHaE9?w=280&h=187&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
                    category: '川菜',
                    time: '25',
                    difficulty: '普通',
                    calories: '320',
                    ingredients: ['鸡胸肉', '花生米', '干辣椒', '花椒', '葱姜蒜'],
                    steps: [
                        '鸡胸肉切丁腌制',
                        '花生米炸酥备用',
                        '炒香干辣椒和花椒',
                        '下鸡丁炒熟',
                        '调味收汁'
                    ],
                    nutrients: {
                        protein: '28g',
                        fat: '18g',
                        carbs: '12g'
                    },
                    tips: '鸡丁要腌制入味，花生米要最后加入'
                },
                {
                    title: '麻婆豆腐',
                    image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.AfeCi3TqUcIbOGe_pTg5IQHaFg?w=239&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
                    category: '川菜',
                    time: '20',
                    difficulty: '普通',
                    calories: '280',
                    ingredients: ['嫩豆腐', '牛肉末', '豆瓣酱', '花椒', '葱花'],
                    steps: [
                        '豆腐切块焯水',
                        '炒香牛肉末',
                        '加入豆瓣酱炒出红油',
                        '加水煮豆腐',
                        '调味撒花椒面'
                    ],
                    nutrients: {
                        protein: '22g',
                        fat: '15g',
                        carbs: '10g'
                    },
                    tips: '豆腐要选用嫩豆腐，煮制时不要翻动太多'
                }
            ];
            
            const authors = ['美食达人', '厨艺大师', '家庭主妇', '专业厨师', '美食博主', '烹饪新手', '料理专家'];
            const tips = [
                '注意火候控制',
                '食材要新鲜',
                '调味要适量',
                '烹饪时间要掌握好',
                '刀工要均匀',
                '注意营养搭配',
                '可根据个人口味调整'
            ];
            
            // 使用种子随机数生成器，确保相同ID生成相同数据
            const seed = parseInt(recipeId.replace(/\D/g, '')) || 1;
            const seededRandom = (seed) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
            };
            
            // 为每个ID固定选择一个模板，确保数据一致性
            const templateIndex = seed % recipeTemplates.length;
            
            const recipe = {
                id: recipeId,
                title: recipeTemplates[templateIndex].title,
                image: recipeTemplates[templateIndex].image,
                category: recipeTemplates[templateIndex].category,
                time: recipeTemplates[templateIndex].time,
                difficulty: recipeTemplates[templateIndex].difficulty,
                calories: recipeTemplates[templateIndex].calories,
                ingredients: recipeTemplates[templateIndex].ingredients,
                steps: recipeTemplates[templateIndex].steps,
                nutrients: recipeTemplates[templateIndex].nutrients,
                tips: recipeTemplates[templateIndex].tips,
                author: authors[seed % authors.length],
                rating: parseFloat((3 + (seed % 21) / 10).toFixed(1)),
                reviews: (seed * 13) % 500 + 50
            };
            
            return {
                code: 0,
                message: '获取成功',
                data: recipe
            };
        }
    },

    {
        url: '/api/ingredients/categories',
        method: 'get',
        timeout: 1000,
        response: () => {
            return {
                code: 0,
                message: '获取成功',
                data: [
                    { id: 'vegetables', name: '蔬菜', icon: '🥬', count: 25 },
                    { id: 'meat', name: '肉类', icon: '🥩', count: 18 },
                    { id: 'seafood', name: '海鲜', icon: '🐟', count: 15 },
                    { id: 'dairy', name: '乳制品', icon: '🥛', count: 12 },
                    { id: 'grains', name: '谷物', icon: '🌾', count: 20 },
                    { id: 'fruits', name: '水果', icon: '🍎', count: 22 },
                    { id: 'spices', name: '调味料', icon: '🧂', count: 30 }
                ]
            };
        }
    },

    {
        url: '/api/ingredients/category/:categoryId',
        method: 'get',
        timeout: 1000,
        response: (options) => {
            const categoryId = options.url.split('/').pop();
            
            const categoryIngredients = {
                vegetables: [
                    { id: 'tomato', name: '番茄', icon: '🍅', price: '3.50' },
                    { id: 'cucumber', name: '黄瓜', icon: '🥒', price: '2.80' },
                    { id: 'carrot', name: '胡萝卜', icon: '🥕', price: '2.20' },
                    { id: 'onion', name: '洋葱', icon: '🧅', price: '1.80' },
                    { id: 'garlic', name: '大蒜', icon: '🧄', price: '4.50' },
                    { id: 'ginger', name: '姜', icon: '🫚', price: '3.20' },
                    { id: 'scallion', name: '葱花', icon: '🧅', price: '2.00' }
                ],
                meat: [
                    { id: 'chicken', name: '鸡肉', icon: '🍗', price: '15.80' },
                    { id: 'pork', name: '猪肉', icon: '🥩', price: '22.50' },
                    { id: 'beef', name: '牛肉', icon: '🥩', price: '45.00' },
                    { id: 'lamb', name: '羊肉', icon: '🥩', price: '38.00' }
                ],
                dairy: [
                    { id: 'egg', name: '鸡蛋', icon: '🥚', price: '0.80' },
                    { id: 'milk', name: '牛奶', icon: '🥛', price: '6.50' },
                    { id: 'cheese', name: '奶酪', icon: '🧀', price: '25.00' }
                ],
                spices: [
                    { id: 'salt', name: '盐', icon: '🧂', price: '2.50' },
                    { id: 'sugar', name: '糖', icon: '🍯', price: '3.80' },
                    { id: 'soy_sauce', name: '酱油', icon: '🫖', price: '8.50' },
                    { id: 'vinegar', name: '醋', icon: '🫖', price: '5.20' }
                ]
            };
            
            const ingredients = categoryIngredients[categoryId] || [];
            
            return {
                code: 0,
                message: '获取成功',
                data: ingredients
            };
        }
    }
];
