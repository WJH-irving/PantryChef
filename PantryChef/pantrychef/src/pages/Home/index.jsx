import { Search } from 'react-vant';
import useTitle from '@/hooks/useTitle';
import { Tabs } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useAuth } from '@/store/auth';
import ShoppingCart from '@/components/ShoppingCart';
import CartButton from '@/components/CartButton';
import { InfiniteWaterflow } from '@/components/waterflow';

// 添加购物车数字徽章的弹跳动画样式
const cartBadgeStyle = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-8px);
        }
        60% {
            transform: translateY(-4px);
        }
    }
`;

const Home = () => {
    useTitle('首页');
    const navigate = useNavigate();
    
    // 使用购物车Hook
    const {
        cartItems,
        cartOpen,
        totalPrice,
        totalQuantity,
        addIngredient,
        removeCartItem,
        updateQuantity,
        editItemName,
        clearCart,
        toggleCart,
        closeCart
    } = useShoppingCart();

    // 鉴权
    const { isAuthenticated, requireAuth, openLogin } = useAuth();

    const handleSearchClick = () => {
        navigate('/search');
    };

    // 添加食材到购物车
    const addToCart = useCallback((item, event) => {
        // 阻止事件冒泡，避免触发Card的onClick
        event.stopPropagation();
        if (!requireAuth()) {
            return;
        }
        
        // 将菜谱作为食材添加到购物车
        addIngredient({
            id: item.id,
            name: item.title,
            title: item.title,
            price: item.time ? parseInt(item.time) * 2 : 20,
            time: item.time,
            difficulty: '普通',
            category: item.category
        });
        
        console.log(`已添加 ${item.title} 到购物车`);
    }, [addIngredient]);

    return (
        <div style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
            {/* 添加CSS动画样式 */}
            <style>{cartBadgeStyle}</style>
            
            {/* 不可用但可点击的搜索栏 */}
            <div style={{ position: 'relative', margin: '15px' }}>
                <Search
                    placeholder="搜索菜谱"
                    disabled
                    onClick={handleSearchClick}
                    style={{ backgroundColor: 'var(--input-bg)' }}
                />
                {/* 透明点击层，修复 disabled 无法触发点击 */}
                <div
                    onClick={handleSearchClick}
                    aria-label="打开搜索页"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        cursor: 'text',
                        zIndex: 5,
                        borderRadius: '8px'
                    }}
                />
            </div>

            <div style={{ padding: '10px' }}>
                <Tabs activeKey={0}>
                    <Tabs.TabPane title="推荐">
                        <div style={{ marginTop: '15px' }}>
                            <InfiniteWaterflow
                                apiUrl="/api/waterfall"
                                initialLimit={4}
                                loadMoreLimit={10}
                                scrollThreshold={200}
                                onItemClick={(item) => navigate(`/detail/${item.id}`)}
                                onAddToCart={addToCart}
                                columns={2}
                                gap={15}
                                imageStyle={{ maxHeight: '200px', objectFit: 'cover' }}
                                showAvatar={false}
                                showInfo={true}
                            />
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane title="关注">
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted-text-color)' }}>
                            关注更多厨师，获取个性化推荐
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            </div>

            {/* 购物车按钮 */}
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

            {/* 使用新的购物车组件 */}
            <ShoppingCart
                visible={cartOpen}
                onClose={closeCart}
                cartItems={cartItems}
                onUpdateItems={(items) => {
                    // 这里可以添加额外的逻辑，比如同步到服务器
                    console.log('购物车更新:', items);
                }}
                onRemoveItem={removeCartItem}
                onUpdateQuantity={updateQuantity}
            />
        </div>
    )
}

export default Home

