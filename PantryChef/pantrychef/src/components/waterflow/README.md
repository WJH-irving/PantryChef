# 瀑布流组件 (Waterflow)

这个目录包含了可复用的瀑布流组件，用于展示卡片式内容的网格布局。

## 组件列表

### 1. Waterflow (基础瀑布流)
基础的瀑布流组件，需要手动传入数据和状态。

**Props:**
- `data`: 数据数组
- `loading`: 是否正在加载
- `hasMore`: 是否还有更多数据
- `onItemClick`: 卡片点击回调
- `onAddToCart`: 添加到购物车回调
- `showAddToCart`: 是否显示"加入购物车"按钮
- `columns`: 列数 (1, 2, 3)
- `gap`: 卡片间距
- `cardStyle`: 卡片样式
- `imageStyle`: 图片样式
- `titleStyle`: 标题样式
- `tagStyle`: 标签样式
- `buttonStyle`: 按钮样式

**使用示例:**
```jsx
import { Waterflow } from '@/components/waterflow';

<Waterflow
    data={recipeList}
    loading={isLoading}
    hasMore={hasMoreData}
    onItemClick={(item) => navigate(`/detail/${item.id}`)}
    onAddToCart={handleAddToCart}
    columns={2}
    gap={15}
/>
```

### 2. InfiniteWaterflow (无限滚动瀑布流)
带无限滚动功能的瀑布流组件，自动处理数据加载和分页。

**Props:**
- `apiUrl`: API接口地址
- `initialLimit`: 初始加载数量
- `loadMoreLimit`: 加载更多时的数量
- `scrollThreshold`: 触发加载的滚动距离
- 其他属性与 Waterflow 相同

**使用示例:**
```jsx
import { InfiniteWaterflow } from '@/components/waterflow';

<InfiniteWaterflow
    apiUrl="/api/waterfall"
    initialLimit={4}
    loadMoreLimit={10}
    scrollThreshold={200}
    onAddToCart={handleAddToCart}
    columns={2}
    gap={15}
/>
```

### 3. VirtualWaterflow (虚拟滚动瀑布流)
高性能的瀑布流组件，使用虚拟滚动技术，适合大量数据的展示。

**Props:**
- `itemHeight`: 预估的卡片高度
- `overscan`: 预渲染的卡片数量
- 其他属性与 Waterflow 相同

**使用示例:**
```jsx
import { VirtualWaterflow } from '@/components/waterflow';

<VirtualWaterflow
    data={recipeList}
    loading={isLoading}
    hasMore={hasMoreData}
    onItemClick={(item) => navigate(`/detail/${item.id}`)}
    onAddToCart={handleAddToCart}
    columns={2}
    gap={15}
    itemHeight={300}
    overscan={5}
/>
```

### 4. useWaterflow (自定义Hook)
用于管理瀑布流数据的自定义Hook，位于 `@/hooks/useWaterflow`。

**返回值:**
- `data`: 数据数组
- `loading`: 加载状态
- `hasMore`: 是否有更多数据
- `error`: 错误信息
- `loadMore`: 加载更多函数
- `refresh`: 刷新数据函数
- `reset`: 重置数据函数

**使用示例:**
```jsx
import useWaterflow from '@/hooks/useWaterflow';

const { data, loading, hasMore, loadMore } = useWaterflow('/api/waterfall', 4, 10);
```

## 数据格式

组件期望的数据格式：
```javascript
{
    id: 'unique-id',
    title: '菜谱标题',
    image: '图片URL',
    avatar: '作者头像URL',
    author: '作者名称',
    category: '分类',
    time: '制作时间'
}
```

## 样式定制

所有组件都支持通过 `style` 属性进行样式定制，包括：
- `cardStyle`: 卡片样式
- `imageStyle`: 图片样式
- `titleStyle`: 标题样式
- `tagStyle`: 标签样式
- `buttonStyle`: 按钮样式

## 响应式支持

组件支持不同的列数配置：
- `columns={1}`: 单列布局
- `columns={2}`: 双列布局（默认）
- `columns={3}`: 三列布局

## 注意事项

1. 确保传入的 `apiUrl` 返回正确的数据格式
2. 图片建议使用相同宽高比的图片以获得最佳效果
3. 组件会自动处理滚动事件，无需手动添加滚动监听
4. 购物车功能需要传入 `onAddToCart` 回调函数
