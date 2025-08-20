import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, Image, Tag, Skeleton } from 'react-vant';
import { useNavigate } from 'react-router-dom';

const VirtualWaterflow = ({ 
    data = [], 
    loading = false, 
    hasMore = true, 
    onLoadMore,
    onItemClick,
    onAddToCart,
    showAddToCart = true,
    columns = 2,
    gap = 15,
    cardStyle = {},
    imageStyle = {},
    titleStyle = {},
    tagStyle = {},
    buttonStyle = {},
    itemHeight = 300, // 预估的卡片高度
    overscan = 5 // 预渲染的卡片数量
}) => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    // 计算卡片宽度
    const getCardWidth = useCallback(() => {
        if (columns === 1) return '100%';
        if (columns === 2) return `calc(50% - ${gap / 2}px)`;
        if (columns === 3) return `calc(33.333% - ${gap * 2 / 3}px)`;
        return `calc(100% / ${columns} - ${gap * (columns - 1) / columns}px)`;
    }, [columns, gap]);

    // 计算总高度
    const totalHeight = useMemo(() => {
        const rows = Math.ceil(data.length / columns);
        return rows * (itemHeight + gap) + gap;
    }, [data.length, columns, itemHeight, gap]);

    // 计算可见区域的卡片索引
    const visibleRange = useMemo(() => {
        const start = Math.max(0, Math.floor(scrollTop / (itemHeight + gap)) * columns - overscan);
        const end = Math.min(
            data.length,
            Math.ceil((scrollTop + containerHeight) / (itemHeight + gap)) * columns + overscan
        );
        return { start, end };
    }, [scrollTop, containerHeight, itemHeight, gap, columns, overscan, data.length]);

    // 滚动处理
    const handleScroll = useCallback((e) => {
        const newScrollTop = e.target.scrollTop;
        setScrollTop(newScrollTop);

        // 检查是否需要加载更多
        if (onLoadMore && hasMore && !loading) {
            const scrollHeight = e.target.scrollHeight;
            const clientHeight = e.target.clientHeight;
            if (newScrollTop + clientHeight >= scrollHeight - 200) {
                onLoadMore();
            }
        }
    }, [onLoadMore, hasMore, loading]);

    // 容器大小变化处理
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerHeight(entry.contentRect.height);
            }
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    // 默认样式
    const defaultCardStyle = useMemo(() => ({
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: `${gap}px`,
        width: getCardWidth(),
        flexShrink: 0,
        ...cardStyle
    }), [getCardWidth, gap, cardStyle]);

    const defaultImageStyle = useMemo(() => ({
        width: '100%',
        height: 'auto',
        ...imageStyle
    }), [imageStyle]);

    const defaultTitleStyle = useMemo(() => ({
        fontSize: '16px',
        marginBottom: '5px',
        fontWeight: 'bold',
        ...titleStyle
    }), [titleStyle]);

    const defaultTagStyle = useMemo(() => ({
        color: 'var(--tag-bg)',
        textColor: 'var(--subtext-color)',
        ...tagStyle
    }), [tagStyle]);

    const defaultButtonStyle = useMemo(() => ({
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
    }), [buttonStyle]);

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

    // 渲染卡片
    const renderCard = useCallback((item, index) => {
        const row = Math.floor(index / columns);
        const top = row * (itemHeight + gap);

        return (
            <div
                key={item.id}
                style={{
                    position: 'absolute',
                    top: `${top}px`,
                    left: `${(index % columns) * (100 / columns)}%`,
                    width: getCardWidth(),
                    height: itemHeight
                }}
            >
                <Card
                    onClick={() => handleCardClick(item)}
                    style={defaultCardStyle}
                >
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        className="card-image"
                    >
                        <Image
                            src={item.image}
                            style={defaultImageStyle}
                            alt={item.title}
                        />
                    </div>
                    <div style={{ padding: '10px' }}>
                        <h3 style={defaultTitleStyle}>{item.title}</h3>
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
                </Card>
            </div>
        );
    }, [columns, itemHeight, gap, getCardWidth, defaultCardStyle, defaultImageStyle, defaultTitleStyle, defaultTagStyle, defaultButtonStyle, showAddToCart, handleCardClick, handleAddToCart]);

    // 可见的卡片数据
    const visibleData = useMemo(() => {
        return data.slice(visibleRange.start, visibleRange.end);
    }, [data, visibleRange.start, visibleRange.end]);

    return (
        <div
            ref={containerRef}
            style={{
                height: '100%',
                overflow: 'auto',
                position: 'relative'
            }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                {visibleData.map((item, index) => 
                    renderCard(item, visibleRange.start + index)
                )}
            </div>

            {/* 加载中状态 */}
            {loading && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '20px'
                }}>
                    <Skeleton loading title={false} paragraph={{ rows: 1 }} />
                </div>
            )}

            {/* 没有更多数据 */}
            {!hasMore && data.length > 0 && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
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
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
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

export default VirtualWaterflow;
