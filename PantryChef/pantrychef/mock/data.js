import Mock from 'mockjs';

export default [
    {
        url: '/api/waterfall',
        method: 'get',
        timeout: 1000,
        response: (req, res) => {
            const page = Math.max(+req.query.page || 1, 1);
            const limit = Math.max(+req.query.limit || 10, 1);

            let list = [];
            
            // 预设数据 - 第一页返回，与详情页预定义数据保持一致
            if (page === 1) {
                list = [
                    {
                        id: 'recipe-1',
                        title: '番茄炒蛋',
                        image: 'https://img1.baidu.com/it/u=1750243389,4049046637&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=653',
                        alt: '番茄炒蛋',
                        author: '美食达人',
                        avatar: '',
                        category: '家常菜',
                        time: '15',
                        likes: 568
                    },
                    {
                        id: 'recipe-2',
                        title: '紫菜蛋汤',
                        image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.pO7JN8KKRQzmHuWMNs_fCwHaFl?w=241&h=182&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
                        alt: '紫菜蛋汤',
                        author: '美食达人',
                        avatar: '',
                        category: '汤品',
                        time: '10',
                        likes: 723
                    },
                    {
                        id: 'preset-3',
                        title: '宫保鸡丁',
                        image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.GKNOZd92xP2hM84a0UcoNQHaE9?w=280&h=187&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
                        alt: '宫保鸡丁',
                        author: '美食家',
                        avatar: '',
                        category: '川菜',
                        time: '20',
                        likes: 489
                    },
                    {
                        id: 'preset-4',
                        title: '红烧肉',
                        image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.xAcPIZRiZw9NkMBWxh4vgQHaJp?w=161&h=211&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
                        alt: '红烧肉',
                        author: '美食家',
                        avatar: '',
                        category: '家常菜',
                        time: '60',
                        likes: 356
                    }
                ];
            } else {
                // 后续页面返回随机数据，ID格式与详情页保持一致
                // 使用与详情页相同的模板数据和种子随机数生成器
                const recipeTemplates = [
                    {
                        title: '番茄炒蛋',
                        image: 'https://img1.baidu.com/it/u=1750243389,4049046637&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=653',
                        category: '家常菜',
                        time: '15',
                        alt: '番茄炒蛋'
                    },
                    {
                        title: '紫菜蛋汤',
                        image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.pO7JN8KKRQzmHuWMNs_fCwHaFl?w=241&h=182&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
                        category: '汤品',
                        time: '10',
                        alt: '紫菜蛋汤'
                    },
                    {
                        title: '红烧肉',
                        image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.xAcPIZRiZw9NkMBWxh4vgQHaJp?w=161&h=211&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
                        category: '家常菜',
                        time: '60',
                        alt: '红烧肉'
                    },
                    {
                        title: '宫保鸡丁',
                        image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.GKNOZd92xP2hM84a0UcoNQHaE9?w=280&h=187&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
                        category: '川菜',
                        time: '25',
                        alt: '宫保鸡丁'
                    },
                    {
                        title: '麻婆豆腐',
                        image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.AfeCi3TqUcIbOGe_pTg5IQHaFg?w=239&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
                        category: '川菜',
                        time: '20',
                        alt: '麻婆豆腐'
                    }
                ];
                
                const authors = ['美食达人', '厨艺大师', '家庭主妇', '专业厨师', '美食博主', '烹饪新手', '料理专家'];
                
                // 使用种子随机数生成器，确保相同ID生成相同数据
                const seededRandom = (seed) => {
                    const x = Math.sin(seed) * 10000;
                    return x - Math.floor(x);
                };
                
                list = [];
                for (let i = 0; i < limit; i++) {
                    // 生成固定的ID，确保与详情页API保持一致
                    const seed = page * limit + i;
                    const recipeId = `recipe-${100000 + seed}`;
                    
                    // 为每个ID固定选择一个模板，确保数据一致性
                    const templateIndex = seed % recipeTemplates.length;
                    
                    list.push({
                        id: recipeId,
                        title: recipeTemplates[templateIndex].title,
                        image: recipeTemplates[templateIndex].image,
                        alt: recipeTemplates[templateIndex].alt,
                        author: authors[seed % authors.length],
                        avatar: '',
                        category: recipeTemplates[templateIndex].category,
                        time: recipeTemplates[templateIndex].time,
                        likes: Math.floor(seededRandom(seed) * 900) + 100
                    });
                }
            }

            const hasMore = page < 10;
            return {
                code: 0,
                data: {
                    list: list,
                    hasMore: hasMore
                }
            };

        }
    }
]