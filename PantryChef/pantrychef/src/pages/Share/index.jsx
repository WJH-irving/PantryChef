
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast, Tag, Divider, Button, Form, Field } from 'react-vant';
import { ArrowLeft, Plus, Minus } from '@react-vant/icons';

const Share = () => {
    const navigate = useNavigate();
    
    // 表单状态
    const [form, setForm] = useState({
        title: '',
        category: '',
        time: '',
        difficulty: '',
        calories: '',
        ingredients: [{ name: '', amount: '' }],
        steps: [''],
        tips: ''
    });
    
    // 处理表单字段变化
    const handleFormChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    // 处理食材变化
    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...form.ingredients];
        newIngredients[index][field] = value;
        setForm(prev => ({
            ...prev,
            ingredients: newIngredients
        }));
    };
    
    // 添加食材
    const addIngredient = () => {
        setForm(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', amount: '' }]
        }));
    };
    
    // 删除食材
    const removeIngredient = (index) => {
        if (form.ingredients.length <= 1) return;
        const newIngredients = [...form.ingredients];
        newIngredients.splice(index, 1);
        setForm(prev => ({
            ...prev,
            ingredients: newIngredients
        }));
    };
    
    // 处理步骤变化
    const handleStepChange = (index, value) => {
        const newSteps = [...form.steps];
        newSteps[index] = value;
        setForm(prev => ({
            ...prev,
            steps: newSteps
        }));
    };
    
    // 添加步骤
    const addStep = () => {
        setForm(prev => ({
            ...prev,
            steps: [...prev.steps, '']
        }));
    };
    
    // 删除步骤
    const removeStep = (index) => {
        if (form.steps.length <= 1) return;
        const newSteps = [...form.steps];
        newSteps.splice(index, 1);
        setForm(prev => ({
            ...prev,
            steps: newSteps
        }));
    };
    
    // 提交表单
    const handleSubmit = () => {
        // 简单验证
        if (!form.title) {
            Toast.fail('请输入食谱名称');
            return;
        }
        
        if (!form.category) {
            Toast.fail('请输入食谱分类');
            return;
        }
        
        // 这里可以添加分享逻辑，比如调用API保存食谱
        Toast.success('食谱分享成功！');
        console.log('分享的食谱:', form);
        
        // 重置表单
        setForm({
            title: '',
            category: '',
            time: '',
            difficulty: '',
            calories: '',
            ingredients: [{ name: '', amount: '' }],
            steps: [''],
            tips: ''
        });
    };
    
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
            
            <h1 style={{ textAlign: 'center', margin: '16px 0' }}>分享我的食谱</h1>
            
            <Form>
                {/* 食谱名称 */}
                <Form.Item label="食谱名称">
                    <Field
                        value={form.title}
                        onChange={(val) => handleFormChange('title', val)}
                        placeholder="请输入食谱名称"
                    />
                </Form.Item>
                
                {/* 分类 */}
                <Form.Item label="分类">
                    <Field
                        value={form.category}
                        onChange={(val) => handleFormChange('category', val)}
                        placeholder="请输入食谱分类"
                    />
                </Form.Item>
                
                {/* 时间 */}
                <Form.Item label="制作时间">
                    <Field
                        value={form.time}
                        onChange={(val) => handleFormChange('time', val)}
                        placeholder="请输入制作时间（分钟）"
                        type="number"
                    />
                </Form.Item>
                
                {/* 难度 */}
                <Form.Item label="难度">
                    <Field
                        value={form.difficulty}
                        onChange={(val) => handleFormChange('difficulty', val)}
                        placeholder="请输入难度（如：简单、中等、困难）"
                    />
                </Form.Item>
                
                {/* 卡路里 */}
                <Form.Item label="卡路里">
                    <Field
                        value={form.calories}
                        onChange={(val) => handleFormChange('calories', val)}
                        placeholder="请输入卡路里"
                        type="number"
                    />
                </Form.Item>
                
                <Divider />
                
                {/* 食材 */}
                <h2 style={{ margin: '16px 0 8px' }}>食材</h2>
                {form.ingredients.map((ingredient, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <Field
                            value={ingredient.name}
                            onChange={(val) => handleIngredientChange(index, 'name', val)}
                            placeholder="食材名称"
                            style={{ flex: 1 }}
                        />
                        <Field
                            value={ingredient.amount}
                            onChange={(val) => handleIngredientChange(index, 'amount', val)}
                            placeholder="用量"
                            style={{ flex: 1 }}
                        />
                        <Button 
                            icon={<Minus />} 
                            type="default" 
                            size="small"
                            onClick={() => removeIngredient(index)}
                            disabled={form.ingredients.length <= 1}
                        />
                    </div>
                ))}
                <Button 
                    icon={<Plus />} 
                    type="default" 
                    size="small"
                    onClick={addIngredient}
                    style={{ marginBottom: '16px' }}
                >
                    添加食材
                </Button>
                
                <Divider />
                
                {/* 步骤 */}
                <h2 style={{ margin: '16px 0 8px' }}>制作步骤</h2>
                {form.steps.map((step, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ lineHeight: '32px' }}>{index + 1}.</span>
                        <Field
                            value={step}
                            onChange={(val) => handleStepChange(index, val)}
                            placeholder={`步骤 ${index + 1}`}
                            style={{ flex: 1 }}
                        />
                        <Button 
                            icon={<Minus />} 
                            type="default" 
                            size="small"
                            onClick={() => removeStep(index)}
                            disabled={form.steps.length <= 1}
                        />
                    </div>
                ))}
                <Button 
                    icon={<Plus />} 
                    type="default" 
                    size="small"
                    onClick={addStep}
                    style={{ marginBottom: '16px' }}
                >
                    添加步骤
                </Button>
                
                <Divider />
                
                {/* 小贴士 */}
                <Form.Item label="小贴士">
                    <Field
                        type="textarea"
                        value={form.tips}
                        onChange={(val) => handleFormChange('tips', val)}
                        placeholder="请输入烹饪小贴士"
                        rows="3"
                    />
                </Form.Item>
                
                <Button 
                    type="primary" 
                    block 
                    round 
                    style={{ marginTop: '16px', backgroundColor: '#ff6b35', borderColor: '#ff6b35' }}
                    onClick={handleSubmit}
                >
                    分享食谱
                </Button>
            </Form>
        </div>
    );
};

export default Share

