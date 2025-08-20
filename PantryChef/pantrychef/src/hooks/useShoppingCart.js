import { useState, useCallback, useEffect } from 'react';

// 购物车项类型
export const ITEM_TYPES = {
    INGREDIENT: 'ingredient',  // 食材
    RECIPE: 'recipe'           // 食谱
};

// 购物车Hook
export const useShoppingCart = (initialItems = []) => {
    const [cartItems, setCartItems] = useState(initialItems);
    const [cartOpen, setCartOpen] = useState(false);

    // 从localStorage加载购物车数据
    useEffect(() => {
        const savedCart = localStorage.getItem('pantryChefCart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart);
            } catch (error) {
                console.error('Failed to parse saved cart:', error);
            }
        }
    }, []);

    // 保存购物车数据到localStorage
    const saveCartToStorage = useCallback((items) => {
        try {
            localStorage.setItem('pantryChefCart', JSON.stringify(items));
        } catch (error) {
            console.error('Failed to save cart to storage:', error);
        }
    }, []);

    // 添加食材到购物车
    const addIngredient = useCallback((ingredient) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => 
                item.id === ingredient.id && item.type === ITEM_TYPES.INGREDIENT
            );
            
            let newItems;
            if (existingItem) {
                // 如果已存在，增加数量
                newItems = prevItems.map(item =>
                    item.id === ingredient.id && item.type === ITEM_TYPES.INGREDIENT
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // 添加新食材
                const newIngredient = {
                    ...ingredient,
                    type: ITEM_TYPES.INGREDIENT,
                    quantity: 1,
                    price: ingredient.price || Math.floor(Math.random() * 30) + 10, // 默认价格
                    name: ingredient.name || ingredient.title
                };
                newItems = [...prevItems, newIngredient];
            }
            
            saveCartToStorage(newItems);
            return newItems;
        });
    }, [saveCartToStorage]);

    // 添加食谱到购物车
    const addRecipe = useCallback((recipe) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => 
                item.id === recipe.id && item.type === ITEM_TYPES.RECIPE
            );
            
            if (existingItem) {
                // 食谱已存在，不重复添加
                return prevItems;
            }
            
            // 添加新食谱
            const newRecipe = {
                ...recipe,
                type: ITEM_TYPES.RECIPE,
                quantity: 1,
                name: recipe.title
            };
            
            const newItems = [...prevItems, newRecipe];
            saveCartToStorage(newItems);
            return newItems;
        });
    }, [saveCartToStorage]);

    // 添加补货建议到购物车
    const addReplenishment = useCallback((ingredient) => {
        const replenishmentItem = {
            ...ingredient,
            type: ITEM_TYPES.INGREDIENT,
            quantity: 1,
            price: ingredient.price || Math.floor(Math.random() * 30) + 10,
            name: ingredient.name || ingredient.title,
            isReplenishment: true // 标记为补货建议
        };
        
        addIngredient(replenishmentItem);
    }, [addIngredient]);

    // 从购物车移除商品
    const removeCartItem = useCallback((id) => {
        setCartItems(prevItems => {
            const newItems = prevItems.filter(item => item.id !== id);
            saveCartToStorage(newItems);
            return newItems;
        });
    }, [saveCartToStorage]);

    // 更新商品数量
    const updateQuantity = useCallback((id, newQuantity) => {
        if (newQuantity < 1) return;
        
        setCartItems(prevItems => {
            const newItems = prevItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            );
            saveCartToStorage(newItems);
            return newItems;
        });
    }, [saveCartToStorage]);

    // 编辑商品名称
    const editItemName = useCallback((id, newName) => {
        if (!newName.trim()) return;
        
        setCartItems(prevItems => {
            const newItems = prevItems.map(item =>
                item.id === id ? { ...item, name: newName.trim() } : item
            );
            saveCartToStorage(newItems);
            return newItems;
        });
    }, [saveCartToStorage]);

    // 清空购物车
    const clearCart = useCallback(() => {
        setCartItems([]);
        saveCartToStorage([]);
    }, [saveCartToStorage]);

    // 切换购物车显示状态
    const toggleCart = useCallback(() => {
        setCartOpen(prev => !prev);
    }, []);

    // 关闭购物车
    const closeCart = useCallback(() => {
        setCartOpen(false);
    }, []);

    // 计算总价
    const totalPrice = cartItems.reduce((sum, item) => {
        if (item.type === ITEM_TYPES.INGREDIENT) {
            return sum + (item.price * item.quantity);
        } else {
            return sum + (item.price || 0);
        }
    }, 0);

    // 计算总数量
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // 获取食材列表
    const getIngredients = useCallback(() => {
        return cartItems.filter(item => item.type === ITEM_TYPES.INGREDIENT);
    }, [cartItems]);

    // 获取食谱列表
    const getRecipes = useCallback(() => {
        return cartItems.filter(item => item.type === ITEM_TYPES.RECIPE);
    }, [cartItems]);

    // 获取补货建议列表
    const getReplenishments = useCallback(() => {
        return cartItems.filter(item => item.isReplenishment);
    }, [cartItems]);

    return {
        // 状态
        cartItems,
        cartOpen,
        totalPrice,
        totalQuantity,
        
        // 操作方法
        addIngredient,
        addRecipe,
        addReplenishment,
        removeCartItem,
        updateQuantity,
        editItemName,
        clearCart,
        
        // 显示控制
        toggleCart,
        closeCart,
        
        // 查询方法
        getIngredients,
        getRecipes,
        getReplenishments,
        
        // 直接设置（用于外部同步）
        setCartItems: (items) => {
            setCartItems(items);
            saveCartToStorage(items);
        }
    };
}; 