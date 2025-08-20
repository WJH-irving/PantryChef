import { Card, Image, Tag, Skeleton } from 'react-vant';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Waterflow = ({ 
    data = [], 
    loading = false, 
    hasMore = true, 
    onLoadMore, 
    onItemClick,
    onAddToCart,
    showAddToCart = true,
    showAvatar = true,
    showInfo = true,
    columns = 2,
    gap = 15,
    cardStyle = {},
    imageStyle = {},
    titleStyle = {},
    tagStyle = {},
    buttonStyle = {}
}) => {
    const navigate = useNavigate();
    const waterfallRef = useRef(null);

    // 处理卡片点击
    const handleCardClick = useCallback((item) => {
        if (onItemClick) {
            onItemClick(item);
        } else {
            navigate(`/detail/${item.id}`);
        }
    }, [onItemClick, navigate]);

    // 添加食材到购物车
    const handleAddToCart = useCallback((item, event) => {
        event.stopPropagation();
        if (onAddToCart) {
            onAddToCart(item);
        }
    }, [onAddToCart]);

    // 计算卡片宽度
    const getCardWidth = () => {
        if (columns === 1) return '100%';
        if (columns === 2) return `calc(50% - ${gap / 2}px)`;
        if (columns === 3) return `calc(33.333% - ${gap * 2 / 3}px)`;
        return `calc(100% / ${columns} - ${gap * (columns - 1) / columns}px)`;
    };

    // 默认样式
    const defaultCardStyle = {
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: `${gap}px`,
        width: getCardWidth(),
        flexShrink: 0,
        ...cardStyle
    };

    const defaultImageStyle = {
        width: '100%',
        height: 'auto',
        ...imageStyle
    };

    const defaultTitleStyle = {
        fontSize: '16px',
        marginBottom: '5px',
        fontWeight: 'bold',
        ...titleStyle
    };

    const defaultTagStyle = {
        color: 'var(--tag-bg)',
        textColor: 'var(--subtext-color)',
        ...tagStyle
    };

    const defaultButtonStyle = {
        marginTop: '10px',
        width: '100%',
        padding: '8px',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        ...buttonStyle
    };

    return (
        <div
            ref={waterfallRef}
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: `${gap}px`,
                width: '100%',
                boxSizing: 'border-box',
                padding: 0,
                margin: 0
            }}
        >
            {data.map(item => (
                <Card
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    style={defaultCardStyle}
                >
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}
                        className="card-image"
                    >
                        <Image
                            src={item.image}
                            style={{
                                ...defaultImageStyle,
                                objectFit: 'contain',
                                width: '100%'
                            }}
                            alt={item.title}
                        />
                    </div>
                    {showInfo && (
                        <div style={{ padding: '10px' }}>
                            <h3 style={defaultTitleStyle}>{item.title}</h3>
                            {showAvatar && (
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <Image 
                                        size={20} 
                                        src={item.avatar} 
                                        style={{ marginRight: '5px', borderRadius: '50%' }} 
                                    />
                                    <span style={{ fontSize: '12px', color: 'var(--subtext-color)' }}>
                                        {item.author}
                                    </span>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                <Tag size="mini" style={defaultTagStyle}>{item.category}</Tag>
                                <Tag size="mini" style={defaultTagStyle}>{item.time}</Tag>
                            </div>

                            {showAddToCart && (
                                <button
                                    onClick={(e) => handleAddToCart(item, e)}
                                    style={defaultButtonStyle}
                                >
                                    加入购物车
                                </button>
                            )}
                        </div>
                    )}
                </Card>
            ))}

            {/* 加载中状态 */}
            {loading && (
                <div style={{
                    breakInside: 'avoid',
                    marginBottom: `${gap}px`,
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '20px',
                    width: '100%'
                }}>
                    <Skeleton loading title={false} paragraph={{ rows: 1 }} />
                </div>
            )}

            {/* 没有更多数据 */}
            {!hasMore && data.length > 0 && (
                <div style={{
                    width: '100%',
                    textAlign: 'center',
                    padding: '20px',
                    color: 'var(--subtext-color)',
                    fontSize: '14px'
                }}>
                    没有更多数据了
                </div>
            )}

            {/* 空状态 */}
            {!loading && data.length === 0 && (
                <div style={{
                    width: '100%',
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: 'var(--subtext-color)',
                    fontSize: '14px'
                }}>
                    暂无数据
                </div>
            )}
        </div>
    );
};

export default Waterflow;
