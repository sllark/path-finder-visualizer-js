import React from 'react';



class Node extends React.Component{



    render(){

        const {
            col,
            row,
            clicked,
            isStartNode,
            isEndNode,
            isWall,
            isVisited,
            isShortest,
            mouseEnter,
            // mouseUp,
            animation,
            isStartNodeSelected,
            isEndNodeSelected

        }=this.props;


        let classe='node';
        if(isStartNode)
            classe+=" startNode";
        else if(isEndNode)
            classe+=" endNode";
        else if(isWall)
            classe+=" wallNode";

        if(isVisited)
            classe+=" visited";
        if(isShortest)
            classe+=" shortest";

        if(!animation)
            classe+=" noAnimation";

        if(isStartNode && isStartNodeSelected)
            classe+=" noAnimation";
        if(isEndNode && isEndNodeSelected)
            classe+=" noAnimation";



        // console.log(this.props.count);
        // if(this.props.count>1)
        //     classe+=" remove";


        let animationStyle={};
        // if(this.props.delay<=0)
        //     animationStyle.animation='none';
        // else{
            // animationStyle.animation="animateVisitedNodes 0.05s forwards ease-out";
            animationStyle.animationDelay=this.props.delay+'s';

        // }



        return(
            <div
                className={classe}
                // onClick={()=>clicked(row,col)}
                onMouseEnter={()=>mouseEnter(row,col)}
                // onMouseUp={mouseUp}
                onMouseDown={()=>clicked(row,col)}
                style={animationStyle}
                // style={{border:10}}
                />
        )

    }

}


export default Node;