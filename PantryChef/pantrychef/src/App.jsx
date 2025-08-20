import './App.css'
import {
  Suspense,
  lazy
} from 'react'
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import MainLayout from '@/components/MainLayout'
import BlankLayout from '@/components/BlankLayout'
import Loading from '@/components/Loading'
import ErrorBoundary from '@/components/ErrorBoundary'
import LoginDialog from '@/components/LoginDialog'
const Home = lazy(() => import('@/pages/Home'))
const Detail = lazy(() => import('@/pages/Detail'))
const Share = lazy(() => import('@/pages/Share'))
const Account = lazy(() => import('@/pages/Account'))
const Search = lazy(() => import('@/pages/Search'))
const RecipeManagement = lazy(() => import('@/pages/RecipeManagement'))

function App() {


  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/recipe-management" element={<RecipeManagement />} />
            <Route path="/share" element={<Share />} />
            <Route path="/account" element={<Account />} />
          </Route>
          <Route element={<BlankLayout />}>
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/search" element={<Search />} />
          </Route>
        </Routes>
        </Suspense>
        {/* 全局登录弹窗 */}
        <LoginDialog />
      </ErrorBoundary>
    </>
  )
}

export default App
