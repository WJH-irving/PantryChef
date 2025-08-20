import React, { useState, useCallback } from 'react';
import { Search, Button, Card, Tag, Toast, Loading, Image } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import useTitle from '@/hooks/useTitle';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useAuth } from '@/store/auth';
import ShoppingCart from '@/components/ShoppingCart';
import CartButton from '@/components/CartButton';
import styles from './recipeManagement.module.css';

const RecipeManagement = () => {
    useTitle('食谱管理');
    const navigate = useNavigate();
    const { requireAuth } = useAuth();
    
    const {
        cartItems,
        cartOpen,
        totalQuantity,
        addIngredient,
        toggleCart,
        closeCart
    } = useShoppingCart();

    const [inputIngredients, setInputIngredients] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedRecipes, setGeneratedRecipes] = useState([]);
    const [supplementSuggestions, setSupplementSuggestions] = useState([]);

    const handleIngredientInput = (value) => {
        setInputIngredients(value);
    };

    const generateRecipes = useCallback(async () => {
        if (!inputIngredients.trim()) {
            Toast.show('请输入食材');
            return;
        }

        if (!requireAuth()) return;

        setIsGenerating(true);
        try {
            const response = await fetch('/api/recipe/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients: inputIngredients })
            });

            const result = await response.json();
            
            if (result.code === 0) {
                setGeneratedRecipes(result.data.recipes);
                setSupplementSuggestions(result.data.supplements);
                Toast.show('食谱生成成功！');
            } else {
                Toast.show(result.message || '生成食谱失败');
            }
        } catch (error) {
            console.error('生成食谱失败:', error);
            Toast.show('生成食谱失败，请重试');
        } finally {
            setIsGenerating(false);
        }
    }, [inputIngredients, requireAuth]);

    const addSupplementToCart = useCallback((supplement) => {
        addIngredient({
            id: supplement.id,
            name: supplement.name,
            title: supplement.name,
            price: parseFloat(supplement.estimatedPrice),
            reason: supplement.reason,
            priority: supplement.priority,
            category: '补货建议'
        });
        Toast.show(`已添加 ${supplement.name} 到购物车`);
    }, [addIngredient]);

    const handleRecipeClick = useCallback((recipe) => {
        navigate(`/detail/${recipe.id}`, { 
            state: { recipe, from: 'recipe-management' }
        });
    }, [navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    智能食谱生成
                </h2>
                
                <div className={styles.searchSection}>
                    <Search
                        value={inputIngredients}
                        onChange={handleIngredientInput}
                        placeholder="请输入您有的食材，如：番茄 鸡蛋 葱花"
                    />
                </div>

                <button
                    className={styles.generateButton}
                    disabled={isGenerating}
                    onClick={generateRecipes}
                >
                    {isGenerating ? '生成中...' : '生成食谱'}
                </button>

                {isGenerating && (
                    <div className={styles.loadingContainer}>
                        <Loading type="spinner" />
                        <p className={styles.loadingText}>AI正在为您生成食谱...</p>
                    </div>
                )}
            </div>

            {generatedRecipes.length > 0 && (
                <div style={{ padding: '0 20px 20px' }}>
                    <h3 className={styles.sectionTitle}>
                        推荐食谱
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {generatedRecipes.map(recipe => (
                            <Card
                                key={recipe.id}
                                onClick={() => handleRecipeClick(recipe)}
                                className={styles.card}
                            >
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <Image
                                        src={recipe.image}
                                        width={80}
                                        height={80}
                                        className={styles.recipeImage}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h4 className={styles.recipeTitle}>
                                            {recipe.title}
                                        </h4>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                            <Tag size="mini" className={styles.tag}>{recipe.category}</Tag>
                                            <Tag size="mini" className={styles.tag}>{recipe.time}分钟</Tag>
                                            <Tag size="mini" className={styles.tag}>{recipe.difficulty}</Tag>
                                        </div>
                                        <p style={{ fontSize: '14px', color: 'var(--subtext-color)', margin: 0 }}>
                                            热量: {recipe.calories} kcal
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {supplementSuggestions.length > 0 && (
                <div style={{ padding: '0 20px 20px' }}>
                    <h3 className={styles.sectionTitle}>
                        补货建议
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {supplementSuggestions.map(supplement => (
                            <Card key={supplement.id} className={styles.supplementCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                                            {supplement.name}
                                        </h4>
                                        <p style={{ fontSize: '14px', color: 'var(--subtext-color)', margin: '0 0 5px 0' }}>
                                            {supplement.reason}
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--muted-text-color)', margin: 0 }}>
                                            预估价格: ¥{supplement.estimatedPrice}
                                        </p>
                                    </div>
                                    
                                    <button
                                        className={styles.addButton}
                                        onClick={() => addSupplementToCart(supplement)}
                                    >
                                        添加
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            <CartButton
                onClick={() => {
                    if (!requireAuth()) return;
                    toggleCart();
                }}
                itemCount={totalQuantity}
                position="fixed"
                top="80px"
                right="20px"
                size="50px"
            />

            <ShoppingCart
                visible={cartOpen}
                onClose={closeCart}
                cartItems={cartItems}
                onUpdateItems={(items) => console.log('购物车更新:', items)}
                onRemoveItem={(itemId) => console.log('删除项目:', itemId)}
                onUpdateQuantity={(itemId, quantity) => console.log('更新数量:', itemId, quantity)}
            />

        </div>
    );
};

export default RecipeManagement;
