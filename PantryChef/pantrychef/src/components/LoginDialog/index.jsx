import { useEffect, useState } from 'react';
import { Popup, Field, Button, Toast } from 'react-vant';
import { useAuth } from '@/store/auth';

const LoginDialog = () => {
  const { loginVisible, closeLogin, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loginVisible) {
      setUsername('');
      setPassword('');
      setLoading(false);
    }
  }, [loginVisible]);

  const handleSubmit = async () => {
    if (!username.trim()) {
      Toast.show('请输入用户名');
      return;
    }
    setLoading(true);
    try {
      await login({ username, password });
      Toast.show('登录成功');
    } catch (err) {
      Toast.show(err?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popup
      visible={loginVisible}
      open={loginVisible}
      position="bottom"
      round
      onClose={closeLogin}
      style={{ padding: '20px 16px' }}
    >
      <h3 style={{ margin: 0, marginBottom: 12, textAlign: 'center' }}>登录 PantryChef</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Field
          label="用户名"
          placeholder="请输入用户名"
          value={username}
          onChange={setUsername}
        />
        <Field
          label="密码"
          placeholder="请输入密码（示例项目可不填）"
          type="password"
          value={password}
          onChange={setPassword}
        />
        <Button
          block
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          style={{ background: 'var(--primary-color)' }}
        >
          登录
        </Button>
        <Button block type="default" onClick={closeLogin}>取消</Button>
      </div>
    </Popup>
  );
};

export default LoginDialog;


