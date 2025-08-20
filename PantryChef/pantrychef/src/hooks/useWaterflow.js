import { useState, useEffect, useCallback } from 'react';

const useWaterflow = (apiUrl, initialLimit = 4, loadMoreLimit = 10) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 加载瀑布流数据
    const loadData = useCallback(async (isLoadMore = false) => {
        if (loading || (!isLoadMore && !hasMore)) return;

        setLoading(true);
        setError(null);
        
        try {
            const currentPage = isLoadMore ? page : 1;
            const limit = currentPage === 1 ? initialLimit : loadMoreLimit;
            
            const response = await fetch(`${apiUrl}?page=${currentPage}&limit=${limit}`);
            const result = await response.json();

            if (result.code === 0) {
                if (isLoadMore) {
                    setData(prevData => [...prevData, ...result.data.list]);
                    setPage(prevPage => prevPage + 1);
                } else {
                    setData(result.data.list);
                    setPage(2);
                }
                setHasMore(result.data.hasMore);
            } else {
                setError(result.message || '加载失败');
            }
        } catch (err) {
            console.error('Failed to load waterfall data:', err);
            setError('网络错误，请稍后重试');
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, apiUrl, initialLimit, loadMoreLimit]);

    // 初始加载数据
    useEffect(() => {
        loadData(false);
    }, [apiUrl]);

    // 加载更多数据
    const loadMore = useCallback(() => {
        if (hasMore && !loading) {
            loadData(true);
        }
    }, [hasMore, loading, loadData]);

    // 刷新数据
    const refresh = useCallback(() => {
        setPage(1);
        setHasMore(true);
        setData([]);
        setError(null);
        loadData(false);
    }, [loadData]);

    // 重置数据
    const reset = useCallback(() => {
        setData([]);
        setPage(1);
        setHasMore(true);
        setLoading(false);
        setError(null);
    }, []);

    return {
        data,
        loading,
        hasMore,
        error,
        loadMore,
        refresh,
        reset
    };
};

export default useWaterflow;
