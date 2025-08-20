import {
    useState,
    useEffect
} from 'react'
import {
    Tabbar,
} from 'react-vant';
import {
    HomeO,
    Search,
    Share,
    Star,
    UserO,
} from '@react-vant/icons';
import {
    Outlet,
    useNavigate,
    useLocation
} from 'react-router-dom';

// 菜单栏配置
const tabs = [
    { icon: < HomeO />, title: '首页', path: '/home' },
    { icon: < Search />, title: '食谱管理', path: '/recipe-management' },
    { icon: < Share />, title: '食谱分享', path: '/share' },
    { icon: < UserO />, title: '个人中心', path: '/account' },
]
const MainLayout = () => {
    const [active, setActive] = useState('home')
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        console.log(location.pathname, '////')
        // es6 的使用 
        const index = tabs.findIndex(tab => location.pathname.startsWith(tab.path));
        // setActive(tabs[index].path);
        setActive(index);
    }, [location.pathname]);
    return (
        <div
            className="flex flex-col h-screen"
            style={{ paddingBottom: '50px' }}
        >
            <div className="flex-1">
                <Outlet />
            </div>

            <Tabbar value={active} onChange={
                (key) => {
                    setActive(key);
                    navigate(tabs[key].path);
                }
            }>
                {
                    tabs.map((tab, index) => (
                        <Tabbar.Item
                            key={index}
                            icon={tab.icon}
                        >
                            {tab.title}
                        </Tabbar.Item>
                    ))
                }
            </Tabbar>
        </div>
    )
}

export default MainLayout