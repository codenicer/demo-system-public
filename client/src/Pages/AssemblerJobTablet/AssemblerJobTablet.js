import React,{lazy,Suspense} from 'react';
import PagePreloader from '../../components/PagePreloader/PagePreloader';
import Container from '../../atoms/Container/Container';
import { Route, Switch, Link } from 'react-router-dom';

import PageNotFound from '../../atoms/PageNotFound/PageNotFound';
import AssemblerJob from '../../Pages/AssemblerJob/AssemblerJob';
import AssemblerJobPage from '../../Pages/AssemblerJob/AssemblerJobPage/AssemblerJobPage';


// const PageNotFound = lazy(()=>import('../../atoms/PageNotFound/PageNotFound'))
// const AssemblerJob = lazy(()=>import('../../Pages/AssemblerJob/AssemblerJob'))
// const AssemblerJobPage = lazy('../../Pages/AssemblerJob/AssemblerJobPage/AssemblerJobPage')

const AssemblerJobTablet = (props) => {
    const {match, location} = props;

    // check floristheadtabletview css for styling
    return (
        <Container css='_assemblerjob_tablet-wrap grd'>
            <Switch>
                    <Route path={`${match.path}`} exact render={() => <AssemblerJob {...props} mobile={true}/>} />
                    <Route path={`${match.path}/myjob`} exact render={() => <AssemblerJobPage {...props} mobile={true}/>} />
                    <Route component={PageNotFound} />
            </Switch>
            <div
                className='grd _florist_footer-wrap'>
                <Link to={`${match.path}`}
                    className={`header-3 color-white grd aic jic point ${location.pathname === '/system' ? '_florist_footer-tab_active' : match.path  !== '/system/itemlist' && '_florist_footer-tab_first-child'}`}>
                    List
                </Link>
                <Link 
                    to={`${match.path}/myjob`}
                    className={`header-3 color-white grd aic jic point ${location.pathname === '/system/myjob' && '_florist_footer-tab_active'}`}>
                    Job
                </Link>
            </div>
        </Container>
    )
}

export default AssemblerJobTablet


//   <Suspense  fallback={ <PagePreloader text='Please wait...' isfetching={true} />} >
//   </Suspense>