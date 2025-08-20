import React, { useState } from 'react';
import { Popup, Button, Tag, Search } from 'react-vant';

const IngredientSelector = ({ visible, onClose, onConfirm, selectedIngredients = [] }) => {
    const [selected, setSelected] = useState(selectedIngredients);
    
    // 模拟食材数据
    const ingredients = [
        { id: 'tomato', name: '番茄', icon: '🍅' },
        { id: 'egg', name: '鸡蛋', icon: '🥚' },
        { id: 'onion', name: '洋葱', icon: '🧅' },
        { id: 'garlic', name: '大蒜', icon: '🧄' },
        { id: 'ginger', name: '姜', icon: '🫚' },
        { id: 'scallion', name: '葱花', icon: '🧅' },
        { id: 'salt', name: '盐', icon: '🧂' },
        { id: 'soy_sauce', name: '酱油', icon: '🫖' },
        { id: 'oil', name: '油', icon: '🫗' }
    ];

    const toggleIngredient = (ingredient) => {
        setSelected(prev => {
            const isSelected = prev.find(item => item.id === ingredient.id);
            if (isSelected) {
                return prev.filter(item => item.id !== ingredient.id);
            } else {
                return [...prev, ingredient];
            }
        });
    };

    const handleConfirm = () => {
        onConfirm(selected);
        onClose();
    };

    return (
        <Popup
            visible={visible}
            onClose={onClose}
            position="bottom"
            style={{ height: '60%' }}
        >
            <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 20px 0' }}>选择食材</h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                    {ingredients.map(ingredient => {
                        const isSelected = selected.find(item => item.id === ingredient.id);
                        return (
                            <Button
                                key={ingredient.id}
                                size="small"
                                type={isSelected ? 'primary' : 'default'}
                                onClick={() => toggleIngredient(ingredient)}
                            >
                                {ingredient.icon} {ingredient.name}
                            </Button>
                        );
                    })}
                </div>

                {selected.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <h4>已选择:</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {selected.map(ingredient => (
                                <Tag key={ingredient.id}>
                                    {ingredient.icon} {ingredient.name}
                                </Tag>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '15px' }}>
                    <Button block onClick={onClose}>取消</Button>
                    <Button type="primary" block onClick={handleConfirm}>确认</Button>
                </div>
            </div>
        </Popup>
    );
};

export default IngredientSelector;
