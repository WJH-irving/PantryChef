import React from 'react';
import { Waterflow, InfiniteWaterflow, VirtualWaterflow } from './index';
import useWaterflow from '@/hooks/useWaterflow';

// 示例数据
const sampleData = [
    {
        id: '1',
        title: '蒜香烤鸡胸肉',
        image: 'https://img1.baidu.com/it/u=95894301,726494640&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=664',
        avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNkZGRkZGQiLz48dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJNb250c2VycmF0IiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2Ij5VPC90ZXh0Pjwvc3ZnPg==',
        author: '美食家',
        category: '家常菜',
        time: '25'
    },
    {
        id: '2',
        title: '番茄鸡蛋面',
        image: 'https://img1.baidu.com/it/u=1750243389,4049046637&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=653',
        avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNkZGRkZGQiLz48dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJNb250c2VycmF0IiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2Ij5VPC90ZXh0Pjwvc3ZnPg==',
        author: '美食家',
        category: '面食',
        time: '15'
    }
];

// 基础瀑布流示例
export const BasicWaterflowExample = () => {
    const handleItemClick = (item) => {
        console.log('点击了:', item.title);
    };

    const handleAddToCart = (item) => {
        console.log('添加到购物车:', item.title);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>基础瀑布流</h3>
            <Waterflow
                data={sampleData}
                loading={false}
                hasMore={false}
                onItemClick={handleItemClick}
                onAddToCart={handleAddToCart}
                columns={2}
                gap={15}
            />
        </div>
    );
};

// 无限滚动瀑布流示例
export const InfiniteWaterflowExample = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h3>无限滚动瀑布流</h3>
            <InfiniteWaterflow
                apiUrl="/api/waterfall"
                initialLimit={4}
                loadMoreLimit={10}
                scrollThreshold={200}
                columns={2}
                gap={15}
            />
        </div>
    );
};

// 虚拟滚动瀑布流示例
export const VirtualWaterflowExample = () => {
    const handleItemClick = (item) => {
        console.log('点击了:', item.title);
    };

    const handleAddToCart = (item) => {
        console.log('添加到购物车:', item.title);
    };

    return (
        <div style={{ padding: '20px', height: '500px' }}>
            <h3>虚拟滚动瀑布流</h3>
            <VirtualWaterflow
                data={sampleData}
                loading={false}
                hasMore={false}
                onItemClick={handleItemClick}
                onAddToCart={handleAddToCart}
                columns={2}
                gap={15}
                itemHeight={300}
                overscan={5}
            />
        </div>
    );
};

// 使用自定义Hook的示例
export const CustomHookExample = () => {
    const { data, loading, hasMore, error, loadMore, refresh } = useWaterflow('/api/waterfall', 4, 10);

    const handleItemClick = (item) => {
        console.log('点击了:', item.title);
    };

    const handleAddToCart = (item) => {
        console.log('添加到购物车:', item.title);
    };

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>错误: {error}</p>
                <button onClick={refresh}>重试</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h3>自定义Hook瀑布流</h3>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={refresh} disabled={loading}>
                    {loading ? '加载中...' : '刷新'}
                </button>
            </div>
            <Waterflow
                data={data}
                loading={loading}
                hasMore={hasMore}
                onItemClick={handleItemClick}
                onAddToCart={handleAddToCart}
                columns={2}
                gap={15}
            />
            {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button onClick={loadMore} disabled={loading}>
                        {loading ? '加载中...' : '加载更多'}
                    </button>
                </div>
            )}
        </div>
    );
};

// 不同列数配置示例
export const ColumnsExample = () => {
    const handleItemClick = (item) => {
        console.log('点击了:', item.title);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>不同列数配置</h3>
            
            <h4>单列布局</h4>
            <Waterflow
                data={sampleData}
                columns={1}
                gap={15}
                onItemClick={handleItemClick}
            />
            
            <h4>双列布局</h4>
            <Waterflow
                data={sampleData}
                columns={2}
                gap={15}
                onItemClick={handleItemClick}
            />
            
            <h4>三列布局</h4>
            <Waterflow
                data={sampleData}
                columns={3}
                gap={15}
                onItemClick={handleItemClick}
            />
        </div>
    );
};

// 样式定制示例
export const StylingExample = () => {
    const customCardStyle = {
        backgroundColor: '#f8f9fa',
        border: '2px solid #e9ecef',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };

    const customTitleStyle = {
        color: '#2c3e50',
        fontSize: '18px',
        fontFamily: 'Georgia, serif'
    };

    const customButtonStyle = {
        backgroundColor: '#3498db',
        borderRadius: '20px',
        fontSize: '16px',
        fontWeight: 'bold'
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>样式定制示例</h3>
            <Waterflow
                data={sampleData}
                columns={2}
                gap={20}
                cardStyle={customCardStyle}
                titleStyle={customTitleStyle}
                buttonStyle={customButtonStyle}
                showAddToCart={true}
            />
        </div>
    );
};
