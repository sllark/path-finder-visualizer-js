import React from 'react';


const Backdrop=(props)=>{

    let className='backdrop';

    if(!props.show)
        className+=' hide';

    return(
        <div className={className} onClick={props.clicked}/>
    )

};


export default Backdrop;