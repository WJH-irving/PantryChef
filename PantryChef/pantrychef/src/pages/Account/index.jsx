import useTitle from '@/hooks/useTitle';
import {
    useState,
} from 'react'
import {
    Image,
    Cell,
    CellGroup,
    ActionSheet,
    Popup,
    Tabs
} from 'react-vant'

import {
    ServiceO,
    FriendsO,
    StarO,
    SettingO,
    UserCircleO,
    AddO,
    CartO,
    FireO,
    LikeO,
    Search,
    HomeO,
    UserO,
    ChatO,

} from '@react-vant/icons'
import styles from './account.module.css'
import { generateAvatar } from '@/utils/llm';
import { useAuth } from '@/store/auth';

const Account = () => {
    const { user, isAuthenticated, openLogin, logout, setUser } = useAuth();
    const [userInfo, setUserInfo] = useState({
        nickname: user?.nickname || '未登录',
        slogan: user?.slogan || '登录后可同步数据',
        avatar: user?.avatar || '/image/image.png'
    })
    useTitle('我的');
    const [showActionSheet, setShowActionSheet] = useState(false);
    const handleAction = async (e) => {
        console.log(e)
        if (e.type === 1) {
            // AI 生成头像 
            const text = `
        昵称: ${userInfo.nickname}
      slogan: ${userInfo.slogan}
      `;
            const newAvatar = await generateAvatar();
            setUserInfo((prev) => ({ ...prev, avatar: newAvatar }));
            if (isAuthenticated && user) {
                const nextUser = { ...user, avatar: newAvatar };
                setUser(nextUser);
            }
        } else if (e.type === 2) {
            // 图片上传

        }
    }
    const actions = [
        {
            name: 'AI生成头像',
            color: '#ee0a24',
            type: 1
        },
        {
            name: '上传头像',
            color: '#ee0a24',
            type: 2
        }
    ]
    return (
        <div className={styles.container}>
            <div className={styles.header}></div>
            <div className={styles.userContainer}>
                <div className={styles.user}>
                    <Image
                        round
                        width="64px"
                        height="64px"
                        src={isAuthenticated ? (user?.avatar || userInfo.avatar) : userInfo.avatar}
                        style={{ cursor: 'pointer', marginLeft: '1rem' }}
                        onClick={() => {
                            if (!isAuthenticated) {
                                openLogin();
                            } else {
                                setShowActionSheet(true);
                            }
                        }}
                    />
                    <div className='ml4'>
                        <div className={styles.nickname}>{isAuthenticated ? (user?.nickname || userInfo.nickname) : '点击头像登录'}</div>
                        <div className={styles.slogan}>{isAuthenticated ? (user?.slogan || userInfo.slogan) : userInfo.slogan}</div>
                    </div>
                </div>

                <div className="mt1">
                    <CellGroup>
                        <Cell title="服务" icon={<ServiceO />} isLink />
                    </CellGroup>
                    <CellGroup className="mt2">
                        <Cell title="收藏" icon={<StarO />} isLink />
                    </CellGroup>

                    <CellGroup className="mt2">
                        <Cell title="设置" icon={<SettingO />} isLink />
                    </CellGroup>
                    <CellGroup className="mt2">
                        {isAuthenticated ? (
                            <Cell title="退出登录" icon={<UserCircleO />} isLink onClick={logout} />
                        ) : (
                            <Cell title="登录 / 注册" icon={<UserCircleO />} isLink onClick={openLogin} />
                        )}
                    </CellGroup>
                </div>

                <Tabs activeKey={0}>
                    <Tabs.TabPane title="菜谱"></Tabs.TabPane>
                    <Tabs.TabPane title="作品"></Tabs.TabPane>
                </Tabs>

            </div>

            <ActionSheet
                visible={showActionSheet}
                actions={actions}
                cancelText='取消'
                onCancel={() => setShowActionSheet(false)}
                onSelect={(e) => handleAction(e)}
                transitionProps={{ timeout: 300 }}
            >
            </ActionSheet>
        </div>
    )
}

export default Account