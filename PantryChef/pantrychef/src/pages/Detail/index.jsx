
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeDetail } from '@/api/recipeManagement';
import { Image, Toast, Tag, Divider, Skeleton, Button, Form, Field, Cell } from 'react-vant';
import { GoodJob, GoodJobO, ChatO, Star, StarO, ArrowLeft } from '@react-vant/icons';

const Detail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [comments, setComments] = useState([
        { id: 1, author: '用户A', content: '这个食谱真的很棒！', time: '2025-07-20' },
        { id: 2, author: '用户B', content: '按照这个方法做出来的菜味道很好。', time: '2025-07-22' }
    ]);
    const [newComment, setNewComment] = useState('');
    
    const handleSubmitComment = () => {
        if (newComment.trim() === '') {
            Toast.fail('评论内容不能为空');
            return;
        }
        
        const comment = {
            id: comments.length + 1,
            author: '当前用户',
            content: newComment,
            time: new Date().toLocaleDateString()
        };
        
        setComments([...comments, comment]);
        setNewComment('');
        Toast.success('评论发表成功');
    };
    
    useEffect(() => {
        const fetchRecipeDetail = async () => {
            try {
                setLoading(true);
                const res = await getRecipeDetail(id);
                if (res.code === 0) {
                    setRecipe(res.data);
                } else {
                    Toast.fail('获取食谱详情失败');
                }
            } catch (error) {
                Toast.fail('获取食谱详情失败: ' + error.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchRecipeDetail();
        }
    }, [id]);
    
    if (loading) {
        return (
            <div style={{ padding: '16px' }}>
                <Skeleton title animated />
                <Skeleton paragraph={{ rows: 8 }} animated />
            </div>
        );
    }
    
    if (!recipe) {
        return <div>未找到食谱详情</div>;
    }
    
    return (
        <div style={{ padding: '16px' }}>
            {/* 返回按钮 */}
            <Button 
                icon={<ArrowLeft />} 
                type="default" 
                size="small"
                onClick={() => navigate(-1)}
                style={{ marginBottom: '16px' }}
            >
                返回
            </Button>
            
            {/* 食谱图片 */}
            <Image
                src={recipe.image}
                alt={recipe.title}
                radius={8}
                style={{ width: '100%', height: '200px' }}
            />
            
            {/* 食谱名称 */}
            <h1 style={{ margin: '16px 0 8px' }}>{recipe.title}</h1>
            
            {/* 标签信息 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <Tag type="primary">{recipe.category}</Tag>
                <Tag type="success">{recipe.time}分钟</Tag>
                <Tag type="warning">{recipe.difficulty}</Tag>
                <Tag type="danger">{recipe.calories}卡路里</Tag>
            </div>
            
            {/* 作者信息 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <span>作者: {recipe.author}</span>
                <span style={{ margin: '0 8px' }}>|</span>
                <span>评分: {recipe.rating} ({recipe.reviews}条评论)</span>
            </div>
            
            <Divider />
            
            {/* 食材 */}
            <h2 style={{ margin: '16px 0 8px' }}>食材</h2>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
            
            <Divider />
            
            {/* 步骤 */}
            <h2 style={{ margin: '16px 0 8px' }}>制作步骤</h2>
            <ol>
                {recipe.steps.map((step, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>{step}</li>
                ))}
            </ol>
            
            <Divider />
            
            {/* 营养信息 */}
            <h2 style={{ margin: '16px 0 8px' }}>营养信息</h2>
            <ul>
                <li>蛋白质: {recipe.nutrients.protein}</li>
                <li>脂肪: {recipe.nutrients.fat}</li>
                <li>碳水化合物: {recipe.nutrients.carbs}</li>
            </ul>
            
            <Divider />
            
            {/* 小贴士 */}
            <h2 style={{ margin: '16px 0 8px' }}>小贴士</h2>
            <p>{recipe.tips}</p>
            
            <Divider />
            
            {/* 点赞、评论、收藏功能 */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
                <Button 
                    icon={isLiked ? <GoodJob /> : <GoodJobO />} 
                    type="default" 
                    size="small"
                    onClick={() => setIsLiked(!isLiked)}
                >
                    点赞
                </Button>
                <Button 
                    icon={<ChatO />} 
                    type="default" 
                    size="small"
                    onClick={() => {
                        // 滚动到评论区
                        document.getElementById('comment-section').scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    评论
                </Button>
                <Button 
                    icon={isFavorited ? <Star /> : <StarO />} 
                    type="default" 
                    size="small"
                    onClick={() => setIsFavorited(!isFavorited)}
                >
                    收藏
                </Button>
            </div>
            
            <Divider />
            
            {/* 评论区 */}
            <div id="comment-section" style={{ marginTop: '24px' }}>
                <h2 style={{ margin: '16px 0 8px' }}>评论区</h2>
                
                {/* 评论列表 */}
                <div style={{ marginBottom: '16px' }}>
                    {comments.map(comment => (
                        <Cell 
                            key={comment.id}
                            title={comment.author}
                            label={comment.content}
                            value={comment.time}
                            style={{ marginBottom: '8px' }}
                        />
                    ))}
                </div>
                
                {/* 评论输入框 */}
                <Form>
                    <Field
                        type="textarea"
                        placeholder="请输入您的评论..."
                        rows="3"
                        value={newComment}
                        onChange={setNewComment}
                    />
                    <Button 
                        type="primary" 
                        block 
                        round 
                        style={{ marginTop: '16px', backgroundColor: '#ff6b35', borderColor: '#ff6b35' }}
                        onClick={handleSubmitComment}
                    >
                        发表评论
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Detail

