import React,{useEffect} from 'react'
import Container from '../../atoms/Container/Container';
import FloristList from './FloristList/FloristList';
import ItemList from './ItemList/ItemList';
import PageNotFound from '../../atoms/PageNotFound/PageNotFound';
import { Route, Switch, Link } from 'react-router-dom';
import HistoryList from './HistoryList/HistoryList';
import './FloristHeadTabletView.css';
// const FloristList = lazy(()=>import('./FloristList/FloristList'))
// const ItemList = lazy(()=>import('./ItemList/ItemList'))
// const PageNotFound = lazy(()=>import('../../atoms/PageNotFound/PageNotFound'))



const FloristHeadTabletView = (props) => {
    const { match ,location} = props;
    return (
        <Container
            css='_florsit_head-view-wrap grd'
        >
            <Switch>      
                <Route path={`${match.path}`} exact component={FloristList} />
                <Route path={`${match.path}/itemlist`} exact component={ItemList} />
                <Route path={`${match.path}/historylist`} exact component={HistoryList} />
                <Route component={PageNotFound} />
             </Switch>
            <div
                className='grd _florist_footer-wrap'>
                <Link to={`${match.path}`}
                    className={`header-3 color-white grd aic jic point ${location.pathname === '/system' ? '_florist_footer-tab_active' : match.path  !== '/system/itemlist' && '_florist_footer-tab_first-child'}`}>
                    Florist List
                </Link>
                <Link 
                    to={`${match.path}/itemlist`}
                    className={`header-3 color-white grd aic jic point ${location.pathname === '/system/itemlist' && '_florist_footer-tab_active'}`}>
                    Item List
                </Link>
                <Link 
                    to={`${match.path}/historylist`}
                    className={`header-3 color-white grd aic jic point ${location.pathname === '/system/historylist' && '_florist_footer-tab_active'}`}>
                    History List
                </Link>
            </div>
        </Container>
    )
}

export default FloristHeadTabletView

//<Suspense  fallback={ <PagePreloader text='Please wait...' isfetching={true} />} >
//</Suspense>  
//component={ItemList} 
// 
//    
             