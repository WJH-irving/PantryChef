import { useState, useEffect, useCallback } from 'react';
import { Popup, Tag, Button, Input, Toast } from 'react-vant';
import { ShoppingCartO, Cross, Plus, Minus } from '@react-vant/icons';

// 购物车项类型
const ITEM_TYPES = {
    INGREDIENT: 'ingredient',  // 食材
    RECIPE: 'recipe'           // 食谱
};

const ShoppingCart = ({ 
    visible, 
    onClose, 
    cartItems = [], 
    onUpdateItems,
    onRemoveItem,
    onUpdateQuantity
}) => {
    const [localItems, setLocalItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editValue, setEditValue] = useState('');

    // 同步外部数据
    useEffect(() => {
        setLocalItems(cartItems);
    }, [cartItems]);

    // 计算总价
    const totalPrice = localItems.reduce((sum, item) => {
        if (item.type === ITEM_TYPES.INGREDIENT) {
            return sum + (item.price * item.quantity);
        } else {
            return sum + (item.price || 0);
        }
    }, 0);

    // 计算总数量
    const totalQuantity = localItems.reduce((sum, item) => sum + item.quantity, 0);

    // 处理数量变化
    const handleQuantityChange = useCallback((itemId, change) => {
        const newItems = localItems.map(item => {
            if (item.id === itemId) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setLocalItems(newItems);
        onUpdateItems?.(newItems);
    }, [localItems, onUpdateItems]);

    // 开始编辑
    const startEdit = (item) => {
        setEditingItem(item);
        setEditValue(item.name || item.title);
    };

    // 保存编辑
    const saveEdit = () => {
        if (!editValue.trim()) {
            Toast.show('名称不能为空');
            return;
        }

        const newItems = localItems.map(item => {
            if (item.id === editingItem.id) {
                return { ...item, name: editValue.trim() };
            }
            return item;
        });
        
        setLocalItems(newItems);
        onUpdateItems?.(newItems);
        setEditingItem(null);
        setEditValue('');
        Toast.show('修改成功');
    };

    // 取消编辑
    const cancelEdit = () => {
        setEditingItem(null);
        setEditValue('');
    };



    // 清空购物车
    const clearCart = () => {
        if (localItems.length === 0) return;
        
        setLocalItems([]);
        onUpdateItems?.([]);
        Toast.show('购物车已清空');
    };

    return (
        <Popup
            title={
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>🛒 购物清单</span>
                    <span style={{ 
                        fontSize: '14px', 
                        color: 'var(--primary-color)',
                        backgroundColor: 'rgba(230, 126, 34, 0.08)',
                        padding: '4px 8px',
                        borderRadius: '12px'
                    }}>
                        {totalQuantity} 件商品
                    </span>
                </div>
            }
            position="right"
            visible={visible}
            open={visible}
            placement="right"
            onClose={onClose}
            style={{ 
                width: '85%', 
                maxWidth: '380px',
                borderRadius: '16px 0 0 16px'
            }}
            overlayStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
            }}
        >
            {localItems.length === 0 ? (
                <div style={{ 
                    padding: '40px 20px', 
                    textAlign: 'center', 
                    color: 'var(--muted-text-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <ShoppingCartO style={{ fontSize: 48, color: 'var(--subtle-text-color)' }} />
                    <div>
                        <p style={{ margin: '0 0 8px 0', fontSize: '16px' }}>购物车是空的</p>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--subtle-text-color)' }}>
                            快去添加一些食材或菜谱吧！
                        </p>
                    </div>
                </div>
            ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                        {localItems.map(item => (
                            <div key={item.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px',
                                marginBottom: '10px',
                                backgroundColor: 'var(--muted-bg)',
                                borderRadius: '12px',
                                border: `1px solid var(--border-color)`,
                                transition: 'all 0.2s ease'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                        <Tag 
                                            size="mini" 
                                            color={item.type === ITEM_TYPES.INGREDIENT ? 'var(--primary-color)' : 'var(--secondary-color)'}
                                            textColor="white"
                                            style={{ fontSize: '10px' }}
                                        >
                                            {item.type === ITEM_TYPES.INGREDIENT ? '食材' : '菜谱'}
                                        </Tag>
                                        {editingItem?.id === item.id ? (
                                            <Input
                                                value={editValue}
                                                onChange={setEditValue}
                                                onBlur={saveEdit}
                                                onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                                                style={{ flex: 1, fontSize: '14px' }}
                                                autoFocus
                                            />
                                        ) : (
                                            <h4 
                                                style={{ 
                                                    margin: 0, 
                                                    fontSize: '16px',
                                                    color: 'var(--text-color)',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => startEdit(item)}
                                            >
                                                {item.name || item.title}
                                            </h4>
                                        )}
                                    </div>
                                    
                                    {item.type === ITEM_TYPES.INGREDIENT ? (
                                        <p style={{ 
                                            margin: '5px 0 0 0', 
                                            color: 'var(--subtext-color)',
                                            fontSize: '14px'
                                        }}>
                                            ¥{item.price?.toFixed(2) || '0.00'} × {item.quantity}
                                        </p>
                                    ) : (
                                        <p style={{ 
                                            margin: '5px 0 0 0', 
                                            color: 'var(--subtext-color)',
                                            fontSize: '14px'
                                        }}>
                                            {item.time ? `${item.time}分钟` : '暂无时间'} • {item.difficulty || '普通'}
                                        </p>
                                    )}
                                </div>

                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px'
                                }}>
                                    {item.type === ITEM_TYPES.INGREDIENT && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Button
                                                size="mini"
                                                onClick={() => handleQuantityChange(item.id, -1)}
                                                style={{ 
                                                    width: '24px', 
                                                    height: '24px', 
                                                    padding: 0,
                                                    fontSize: '12px'
                                                }}
                                            >
                                                <Minus size={12} />
                                            </Button>
                                            <span style={{ 
                                                minWidth: '20px', 
                                                textAlign: 'center',
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}>
                                                {item.quantity}
                                            </span>
                                            <Button
                                                size="mini"
                                                onClick={() => handleQuantityChange(item.id, 1)}
                                                style={{ 
                                                    width: '24px', 
                                                    height: '24px', 
                                                    padding: 0,
                                                    fontSize: '12px'
                                                }}
                                            >
                                                <Plus size={12} />
                                            </Button>
                                        </div>
                                    )}
                                    
                                    {item.type === ITEM_TYPES.INGREDIENT && (
                                        <span style={{
                                            backgroundColor: 'var(--primary-color)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            ¥{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    )}
                                    
                                    <Cross
                                        onClick={() => onRemoveItem?.(item.id)}
                                        style={{ 
                                            color: 'var(--muted-text-color)', 
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            transition: 'all 0.2s ease',
                                            fontSize: '18px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = 'var(--secondary-color)';
                                            e.target.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.color = 'var(--muted-text-color)';
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        padding: '20px',
                        borderTop: `1px solid var(--border-color)`,
                        backgroundColor: 'var(--card-bg)',
                        borderRadius: '0 0 16px 0'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '15px'
                        }}>
                            <span style={{ color: 'var(--subtext-color)', fontSize: '16px' }}>总计:</span>
                            <span style={{ 
                                fontWeight: 'bold', 
                                fontSize: '20px',
                                color: 'var(--primary-color)'
                            }}>
                                ¥{totalPrice.toFixed(2)}
                            </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button 
                                style={{
                                    backgroundColor: 'var(--secondary-color)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '12px 16px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    flex: 1,
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={clearCart}
                            >
                                清空购物车
                            </Button>
                            
                            <Button 
                                style={{
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '12px 24px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    flex: 2,
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(230, 126, 34, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--secondary-color)';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 16px rgba(211, 84, 0, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'var(--primary-color)';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(230, 126, 34, 0.3)';
                                }}
                            >
                                💳 立即结算
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Popup>
    );
};

export default ShoppingCart;