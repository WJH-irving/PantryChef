import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // 更新状态，以便下一次渲染显示备用UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 可以将错误日志发送到服务器
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义备用UI
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>哎呀，出错了</h2>
          <p>{this.state.error?.message || '未知错误'}</p>
          <button
            onClick={() => this.setState({ hasError: false })} 
            style={{ padding: '8px 16px', marginTop: '10px', cursor: 'pointer' }}
          >
            重新加载
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;