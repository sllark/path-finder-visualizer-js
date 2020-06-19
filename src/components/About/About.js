import React from 'react';
import Backdrop from './Backdrop';

const About =(props)=>{
    let className='aboutContent';

    if(!props.show)
        className+=' hideAbout';

    return(
        <>
            <Backdrop show={props.show} clicked={props.toggle}/>
            <div className={className}>
                <div className="close" onClick={props.toggle}/>
                <div className="nodeDescription">
                    <div className="node start"/>
                    <p>Start Node</p>
                </div>
                <div className="nodeDescription">
                    <div className="node end"/>
                    <p>End Node</p>
                </div>
                <div className="nodeDescription">
                    <div className="node wall"/>
                    <p>Wall Node</p>
                </div>
                <div className="nodeDescription">
                    <div className="node visit"/>
                    <p>Visited Node</p>
                </div>
                <div className="nodeDescription">
                    <div className="node short"/>
                    <p>Shortest Path Node</p>
                </div>


                <div className="instructions">
                    <h3>Instructions:</h3>
                    <p>
                        Click on Start/End Node to select it. After selecting the node, move your mouse on Grid to rearrange the Node
                    </p>

                    <p>
                        Click on White/Empty Box and start moving your mouse on Grid to make a Wall. To stop creating the wall, Click again on the Grid.
                    </p>

                    <p>
                        Chose Algorithm, from top-left Dropdown, which you want to play with.
                    </p>

                    <p>
                        If you want to add a Maze or random Walls in the Grid, you can select it from "Generate" Dropdown.
                    </p>

                    <p>
                        Click "Start" Button to start the Visualizer and see the magic.
                    </p>

                    <p>
                        You can change Speed of Visualizer from "Speed" Dropdown preset at top-right side.
                    </p>

                    <p>
                        Play with different Algorithms and have fun...
                    </p>

                </div>
            </div>

        </>
    )

};

export default About;