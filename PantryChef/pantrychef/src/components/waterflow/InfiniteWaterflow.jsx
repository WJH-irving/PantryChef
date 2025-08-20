import { useEffect, useCallback } from 'react';
import Waterflow from './Waterflow';
import useWaterflow from '@/hooks/useWaterflow';

const InfiniteWaterflow = ({
    apiUrl,
    initialLimit = 4,
    loadMoreLimit = 10,
    scrollThreshold = 200,
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
    className = '',
    style = {}
}) => {
    const {
        data,
        loading,
        hasMore,
        error,
        loadMore
    } = useWaterflow(apiUrl, initialLimit, loadMoreLimit);

    // 监听滚动事件，实现无限加载
    useEffect(() => {
        const handleScroll = () => {
            if (loading || !hasMore) return;

            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const windowHeight = document.documentElement.clientHeight || window.innerHeight;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

            // 当滚动到距离底部指定距离时加载更多
            if (scrollTop + windowHeight >= scrollHeight - scrollThreshold) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, loadMore, scrollThreshold]);

    // 错误处理
    if (error) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--subtext-color)',
                fontSize: '14px'
            }}>
                <div style={{ marginBottom: '10px' }}>{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    重新加载
                </button>
            </div>
        );
    }

    return (
        <div className={className} style={style}>
            <Waterflow
                data={data}
                loading={loading}
                hasMore={hasMore}
                onItemClick={onItemClick}
                onAddToCart={onAddToCart}
                showAddToCart={showAddToCart}
                columns={columns}
                gap={gap}
                cardStyle={cardStyle}
                imageStyle={imageStyle}
                titleStyle={titleStyle}
                tagStyle={tagStyle}
                buttonStyle={buttonStyle}
            />
        </div>
    );
};

export default InfiniteWaterflow;
