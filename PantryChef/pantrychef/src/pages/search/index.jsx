
import { Search, Button, Tag, Cell, CellGroup } from 'react-vant';
import useTitle from '@/hooks/useTitle';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getHotSearches, searchRecipes } from '@/api/search';

const SearchPage = () => {
    useTitle('搜索');
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [historySearches, setHistorySearches] = useState([]);
    const [hotSearches, setHotSearches] = useState([]);

    // 从API获取热门搜索数据
    useEffect(() => {
        // 获取热门搜索
        getHotSearches().then(data => {
            setHotSearches(data);
        });

        // 从localStorage加载历史搜索
        const history = localStorage.getItem('searchHistory');
        if (history) {
            setHistorySearches(JSON.parse(history));
        }
    }, []);

    // 保存历史搜索到localStorage
    const saveSearchHistory = (keyword) => {
        if (!keyword.trim()) return;
        // 去重并保持最新在前
        const newHistory = [keyword, ...historySearches.filter(item => item !== keyword)].slice(0, 10);
        setHistorySearches(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    // 处理搜索
    const handleSearch = () => {
        if (searchValue.trim()) {
            saveSearchHistory(searchValue);
            // 调用搜索API
            searchRecipes(searchValue).then(results => {
                console.log('搜索结果:', results);
                // 这里可以添加搜索结果展示逻辑
            });
        }
    };

    // 清除历史搜索
    const clearHistory = () => {
        setHistorySearches([]);
        localStorage.removeItem('searchHistory');
    };

    return (
        <div style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
            {/* 搜索栏带返回按钮 */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: 'white' }}>
                <Button onClick={() => navigate('/')} type="text" style={{ marginRight: '10px', fontSize: '18px', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', border: '0.5px solid #333' }}>
                    &lt;
                </Button>
                <Search
                    placeholder="输入菜谱名称搜索"
                    value={searchValue}
                    onChange={setSearchValue}
                    onSearch={handleSearch}
                    style={{ flex: 1 }}
                />
            </div>

            {/* 搜索内容区域 */}
            <div style={{ padding: '15px' }}>
                {/* 历史搜索 */}
                {historySearches.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>历史搜索</h3>
                            <Button onClick={clearHistory} type="text" size="small">
                                清除
                            </Button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {historySearches.map((item, index) => (
                                <Tag
                                    key={index}
                                    onClick={() => {
                                        setSearchValue(item);
                                        handleSearch();
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item}
                                </Tag>
                            ))}
                        </div>
                    </div>
                )}

                {/* 热门搜索 */}
                <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>热门搜索</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {hotSearches.map((item, index) => (
                            <Tag
                                key={index}
                                onClick={() => {
                                    setSearchValue(item);
                                    handleSearch();
                                }}
                                color="#f2f2f2"
                                textColor="#333"
                                style={{ cursor: 'pointer' }}
                            >
                                {item}
                            </Tag>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SearchPage

