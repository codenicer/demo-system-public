import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons';
import './Pagination.css';

const PageElli = () => (
    <li className='page_elli clr-secondary label'>
        ...
    </li>
)

const PageBtn = ({ children, index, pageClick, selPage}) => (
    <li
        className={`br-2 label point clr-secondary ${selPage === index ? 'page_btn-active' : 'page_btn-num' }`}
        key={index}
        onClick={() => {pageClick(()=> {
            return index
        })}}
        >
        {children}
    </li>
)


function Pagination({ count, rows, curPage, pageClick, selPage, range, align}) {
    const [ pageCount, setPageCount ] = useState();

    useEffect(() => {
        setPageCount(Math.ceil(count / rows));
    }, [count])

    return (
        <nav className={align} style={{opacity: count ? 1 : 0}}>
            <ul className='pagination_'>
                <li
                    onClick={() => {selPage !== 1 && pageClick(()=> {
                        return selPage - 1;
                    })}}
                    className={`pad-1 page_btn ${selPage !== 1 ? 'point clr-secondary' : 'page_btn-dis'}`}>
                    <FontAwesomeIcon icon={faStepBackward}/>
                </li>
                {pageCount <= range ?
                    Array.from(Array(pageCount), (e, i) => {
                        const index = i + 1;
                        return <PageBtn key={i} selPage={selPage} index={index} pageClick={pageClick}>{index}</PageBtn>
                    })
                    :
                    <>
                        <PageBtn selPage={selPage} index={1} pageClick={pageClick}>1</PageBtn>
                        {selPage <= 5 ?
                            <PageBtn selPage={selPage} index={2} pageClick={pageClick}>2</PageBtn>
                            :
                            <PageElli />
                        }
                        {selPage >= 6 && selPage <= pageCount - 6 ?
                            <>
                                <PageBtn selPage={selPage} index={selPage - 3} pageClick={pageClick}>{selPage - 3}</PageBtn>
                                <PageBtn selPage={selPage} index={selPage - 2} pageClick={pageClick}>{selPage - 2}</PageBtn>
                                <PageBtn selPage={selPage} index={selPage - 1} pageClick={pageClick}>{selPage - 1}</PageBtn>
                                <PageBtn selPage={selPage} index={selPage} pageClick={pageClick}>{selPage}</PageBtn>
                                <PageBtn selPage={selPage} index={selPage + 1} pageClick={pageClick}>{selPage + 1}</PageBtn>
                                <PageBtn selPage={selPage} index={selPage + 2} pageClick={pageClick}>{selPage + 2}</PageBtn>
                            </>
                            :
                            selPage >= pageCount - 6 ?
                                Array.from(Array(6), (e, i) => {
                                    let value = pageCount - 1;
                                    let minus = Array(6).length - i;
                                    return <PageBtn key={i} selPage={selPage} index={value - minus} pageClick={pageClick}>{value - minus}</PageBtn>
                                })
                                :
                                Array.from(Array(6), (e, i) => {
                                    let value = i + 3;
                                    return <PageBtn key={i} selPage={selPage} index={value} pageClick={pageClick}>{value}</PageBtn>
                                })
                        }
                        {selPage <= pageCount - 6 ?
                            <PageElli />
                            :
                            <PageBtn selPage={selPage} index={parseInt(pageCount) - 1} pageClick={pageClick}>{`${parseInt(pageCount) - 1}`}</PageBtn>
                        }
                        <PageBtn selPage={selPage} index={pageCount} pageClick={pageClick}>{pageCount}</PageBtn>
                    </>
                }
                <li
                    onClick={() => {selPage !== pageCount && pageClick(()=> {
                        return selPage + 1;
                    })}}
                    className={`pad-1 page_btn ${selPage !== pageCount ? 'point clr-secondary' : 'page_btn-dis'}`}>
                    <FontAwesomeIcon icon={faStepForward}/>
                </li>
                <span className='asc label'>Total Records: {selPage === pageCount ? count : rows * selPage } / {count}</span>
            </ul>
        </nav>
    )
}

Pagination.defaultProps = {
    rows: 30,
    range: 10,
    align: 'jse'
}

export default React.memo(Pagination)
