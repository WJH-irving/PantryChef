import { ShoppingCartO } from '@react-vant/icons';

const CartButton = ({ 
    onClick, 
    itemCount = 0, 
    size = '40px',
    position = 'fixed',
    top = '20px',
    right = '20px',
    showBadge = true,
    badgeColor = 'var(--secondary-color)',
    badgeTextColor = 'white'
}) => {
    return (
        <div
            onClick={onClick}
            style={{
                position,
                top,
                right,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: size,
                height: size,
                backgroundColor: 'var(--primary-color)',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(230, 126, 34, 0.3)',
                transition: 'all 0.3s ease',
                zIndex: 1000
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'scale(1.1)';
                el.style.boxShadow = '0 4px 12px rgba(230, 126, 34, 0.4)';
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'scale(1)';
                el.style.boxShadow = '0 2px 8px rgba(230, 126, 34, 0.3)';
            }}
        >
            <ShoppingCartO 
                style={{ 
                    fontSize: `calc(${size} * 0.5)`, 
                    color: 'white' 
                }} 
            />
            
            {/* 数量徽章 */}
            {showBadge && itemCount > 0 && (
                <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: badgeColor,
                    color: badgeTextColor,
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    animation: 'bounce 0.6s ease-in-out'
                }}>
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
            
            {/* 弹跳动画样式 */}
            <style>{`
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-8px);
                    }
                    60% {
                        transform: translateY(-4px);
                    }
                }
            `}</style>
        </div>
    );
};

export default CartButton; 