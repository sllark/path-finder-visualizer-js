import React from 'react';
import Node from '../../components/Node/Node'
import {findPathWithDijkstra} from '../Visualizer/algorithms/dijkstra';
import {findPathWithAStar} from '../Visualizer/algorithms/astar';
import {findPathWithBreathFirst} from './algorithms/breathFirst';
import {findPathWithDepthFirst} from './algorithms/depthFirst';
import {findPathWithGreedyBFS} from './algorithms/greedyBFS';
import {gridDivisionMazeGenerator} from './mazeGenerator/gridDivisionMazeGenerator';
import generateRandomWalls from './mazeGenerator/randomWalls';
import About from '../../components/About/About'
import img from '../../img/about.png';






const  startNodeRow = Math.floor(window.innerHeight/60)-2;
const  startNodeCol = Math.floor(Math.floor(window.innerWidth/28)/5);
const  endNodeRow = Math.floor(window.innerHeight/60)-2;
const  endNodeCol = Math.floor(Math.floor(window.innerWidth/28)/1.2);

const aniTimer=100;

class Visualizer extends React.Component{

    constructor(props){
        super(props);


        this.state={
            nodes:[],
            isMousePressed:false,
            currentAlgo:'Dijkstra',
            generateMaze:'select',
            algoSpeed:1,
            allowDiagonal:false,
            startNodeRow:0,
            startNodeCol:0,
            endNodeRow:0,
            endNodeCol:0,
            startNodeSelected:false,
            endNodeSelected:false,
            isVisualized:false,
            isRunning:false,
            showAbout:false
        };

        this.visitedNodesTimeout=undefined;
        this.shortestnodeTimeout=undefined;
    }


    componentDidMount() {



        document.addEventListener('keydown',this.startAlgo);
        let nodes=[],
            column=[],
            totalRows=Math.floor(window.innerHeight/28)-2,
            totalCols=Math.floor(window.innerWidth/28);


        for(let i=0;i<totalRows;i++){
            column=[];
            for(let j=0;j<totalCols;j++){
                column.push({
                    row:i,
                    col:j,
                    isWall:false,
                    visited:false,
                    animateDelay:0,
                    isShortest:false,
                    animation:true

                })
            }
            nodes.push(column);
        }



        this.setState({
            nodes:nodes,
            startNodeRow,
            startNodeCol,
            endNodeRow,
            endNodeCol,

        })
    }

    nodeClicked=(row,col)=>{

        if(this.state.isRunning) return;


        //unselect node
        if(this.state.isMousePressed){
            this.setState({
                isMousePressed:false,
                startNodeSelected:false,
                endNodeSelected:false
            });
            return;
        }

        if((row === this.state.startNodeRow && col === this.state.startNodeCol)){ //select start node

            this.setState({
                startNodeSelected:true,
                endNodeSelected:false,
                isMousePressed:true
            });
            return;

        }else if(( row === this.state.endNodeRow && col === this.state.endNodeCol )){//select end node

            this.setState({
                startNodeSelected:false,
                endNodeSelected:true,
                isMousePressed:true
            });
            return;
        }



        const nodes=this.getNewGridWithWalls(this.state.nodes,row,col);

        this.setState(prevState => {
            return {
                    nodes:nodes,
                    isMousePressed:!prevState.isMousePressed,
                    startNodeSelected:false,
                    endNodeSelected:false,
            }
        });

    };

    mouseEnter=(row,col)=>{


        if(!this.state.isMousePressed || this.state.isRunning) return;

        //if mouse enter in start or end node
        if((row === this.state.startNodeRow && col === this.state.startNodeCol)
            || (row === this.state.endNodeRow && col === this.state.endNodeCol))
            return;





        if(this.state.startNodeSelected){
            if(this.state.nodes[row][col].isWall) return;

            this.setState({
                startNodeRow:row,
                startNodeCol:col
            });

            if(this.state.isVisualized)
                this.restructureVisualizer(row,col,true,false);


        }else if (this.state.endNodeSelected) {
            if(this.state.nodes[row][col].isWall) return;

            this.setState({
                endNodeRow:row,
                endNodeCol:col
            });

            if(this.state.isVisualized)
                this.restructureVisualizer(row,col,false,true);

        }else {// if start/end node are not selected then create a new wall at the node where mous entered

            const nodes=this.getNewGridWithWalls(this.state.nodes,row,col);
            this.setState({nodes:nodes});

        }
    };

    restructureVisualizer=(row,col,isStartSelected=false,isEndSelected=false)=>{

        this.startAlgo({},false,isStartSelected,isEndSelected);


    };


    startAlgo=(e,addAnimation=true,isStartSelected=false,isEndSelected=false)=>{

        if(e.type=== 'keydown' && e.keyCode!==13)
            return;


        if(e.type === 'click')
            e.target.blur();


        //clear all nodes befor starting visualization
        let resetNodes = this.resetNodes();
        this.setState({nodes:resetNodes});

        window.setTimeout(()=>{
            const currentAlgo=this.state.currentAlgo;
            const allowDiagonal=this.state.allowDiagonal;

            const nodes=this.state.nodes;
            const startNode=nodes[this.state.startNodeRow][this.state.startNodeCol];
            const endNode=nodes[this.state.endNodeRow][this.state.endNodeCol];

            let result;
            if(currentAlgo.indexOf('Dijkstra')>-1){
                    result=findPathWithDijkstra(nodes,startNode,endNode,allowDiagonal);
            }
            else if(currentAlgo.indexOf('AStar')>-1){
                result= findPathWithAStar(nodes,startNode,endNode,allowDiagonal);
            }
            else if(currentAlgo.indexOf('breathFirst')>-1){
                result = findPathWithBreathFirst(nodes,startNode,endNode,allowDiagonal);
            }
            else if(currentAlgo.indexOf('depthFirst') > -1){
                result = findPathWithDepthFirst(nodes,startNode,endNode,allowDiagonal);
            }
            else if(currentAlgo.indexOf('greedyBestFirst') > -1){
                result = findPathWithGreedyBFS(nodes,startNode,endNode,allowDiagonal);
            }

            this.startVisualizer(result,addAnimation,isStartSelected,isEndSelected);

        },0);


    };


    startVisualizer=(result,addAnimation=true,isStartSelected=false,isEndSelected=false)=>{

        let nodes=[...this.state.nodes],
            allNodes = result.allNodes,
            visitedNodes = result.visitedNodes;

        const startNode=nodes[this.state.startNodeRow][this.state.startNodeCol];
        const endNode=nodes[this.state.endNodeRow][this.state.endNodeCol];
        


        //Set all nodes that are visited and change the state
        for(let i=0;i<visitedNodes.length;i++){
            nodes[visitedNodes[i].row][visitedNodes[i].col].visited=true;

            if(addAnimation)
                nodes[visitedNodes[i].row][visitedNodes[i].col].animateDelay=((i+1)/aniTimer)/this.state.algoSpeed;
            else
                nodes[visitedNodes[i].row][visitedNodes[i].col].animation=false;

        }

        //This state change is for visited nodes and their animation
        this.setState({
            nodes:nodes,
            isRunning:true
        });




        let timeoutForShortestPath = 0;
        if(addAnimation)
            timeoutForShortestPath = Number((visitedNodes.length/aniTimer)/this.state.algoSpeed)*1000;


        //Timeout will run when all visited nodes are animated and it adds shortest path nodes in the grid
        this.visitedNodesTimeout = window.setTimeout(()=>{


            let backTrack=[endNode]; // backtrach array will have shortest path nodes in a sequence
            let lastStep=endNode,
                animationCounter=0.01,
                animationIncrement = animationCounter/this.state.algoSpeed; // Animation delay time counter for shortest nodes

            while(lastStep !== startNode){
                //Finding and setting up shortest path nodes & add them in backtrack array

                let currentNodeRow,
                    currentNodeCol,
                    stepBackNode;

                try{
                    currentNodeRow = backTrack[0].row;
                    currentNodeCol = backTrack[0].col;

                    stepBackNode = allNodes
                        [allNodes[currentNodeRow][currentNodeCol].prevRow]
                        [allNodes[currentNodeRow][currentNodeCol].prevCol];

                }catch (e) {
                    // alert("Can't find shortest path.");
                    break;
                }

                backTrack.unshift(stepBackNode);
                lastStep=stepBackNode;


                if(backTrack[0] !== endNode)
                    nodes[currentNodeRow][currentNodeCol].isShortest=true;

            }

            nodes[endNode.row][endNode.col].isShortest=false;

            if(addAnimation){
                //adding animation delay for shortest nodes
                for(let node of backTrack){
                    if(!node) continue;
                    nodes[node.row][node.col].animateDelay = animationCounter;
                    animationCounter += animationIncrement;
                }
            }



            //setting state nodes with shortest nodes
            this.setState({
                nodes:nodes
            });

            let shortestnodeTimeoutDelay=0;
            if(addAnimation)
                shortestnodeTimeoutDelay=Number((backTrack.length*animationIncrement)*1000);

            //timeout will run after shortest path animation is finished and reset timeouts and state
            this.shortestnodeTimeout=window.setTimeout(()=>{


                const nodeWitoutDelay=this.removeAniDelayFromNodes();

                this.setState({
                    nodes:nodeWitoutDelay,
                    isRunning:false,
                    startNodeSelected:isStartSelected,
                    endNodeSelected:isEndSelected,
                    isMousePressed:(isStartSelected || isEndSelected),
                    isVisualized:true
                });

                clearTimeout(this.visitedNodesTimeout);
                clearTimeout(this.shortestnodeTimeout);




            },shortestnodeTimeoutDelay);

        },timeoutForShortestPath);

    };


    getNewGridWithWalls=(grid,row,col)=>{

        const nodes=grid.slice();

        const node=nodes[row][col];


        nodes[row][col]={
            ...node,
            isWall: !node.isWall,
            visited:false,
            isShortest:false
        };

        return nodes;
    };

    resetNodes=()=>{

        let nodesClone=cloneNodes(this.state.nodes);

        for (let i=0;i<nodesClone.length;i++){
            for (let j=0;j<nodesClone[i].length;j++) {

                // nodesClone[i][j]["isWall"]=false;
                nodesClone[i][j]['isShortest']=false;
                nodesClone[i][j]['visited']=false;
                nodesClone[i][j]['prevRow']=null;
                nodesClone[i][j]['prevCol']=null;
                nodesClone[i][j]['animateDelay']=0;
                nodesClone[i][j]['animation']=true;
            }
        }

        clearTimeout(this.visitedNodesTimeout);
        clearTimeout(this.shortestnodeTimeout);

        this.setState({isVisualized:false});
        return nodesClone;
    };

    removeAniDelayFromNodes=()=>{
        let nodesClone = cloneNodes(this.state.nodes);

        for (let i=0;i<nodesClone.length;i++){
            for (let j=0;j<nodesClone[i].length;j++) {
                nodesClone[i][j]['animateDelay']=0;
            }
        }

        return nodesClone;
    };

    resetVisualizer=()=>{

        let nodesClone = cloneNodes(this.state.nodes);

        for (let i=0;i<nodesClone.length;i++){

            for (let j=0;j<nodesClone[i].length;j++) {


                nodesClone[i][j]["isWall"]=false;
                nodesClone[i][j]['isShortest']=false;
                nodesClone[i][j]['visited']=false;
                nodesClone[i][j]['prevRow']=null;
                nodesClone[i][j]['prevCol']=null;
                nodesClone[i][j]['animateDelay']=0;
                nodesClone[i][j]['animation']=true;

            }
        }


        clearTimeout(this.visitedNodesTimeout);
        clearTimeout(this.shortestnodeTimeout);


        this.setState({
            nodes:nodesClone,
            isRunning:false,
            isVisualized:false,
            currentAlgo:'Dijkstra',
            generateMaze:'select',
            algoSpeed:1,
            allowDiagonal:false,
            startNodeRow,
            startNodeCol,
            endNodeRow,
            endNodeCol,
        });

    };

    resetWalls=()=>{

        if(this.state.isRunning)
            return;

        let nodesClone = cloneNodes(this.state.nodes);

        for (let i=0;i<nodesClone.length;i++){
            for (let j=0;j<nodesClone[i].length;j++) {
                nodesClone[i][j]["isWall"]=false;
            }
        }

        this.setState({
            nodes:nodesClone,
            generateMaze:'select'

        });

    };

    resetPath=()=>{

        if(this.state.isRunning)
            return;

        let nodesClone = cloneNodes(this.state.nodes);

        for (let i=0;i<nodesClone.length;i++){
            for (let j=0;j<nodesClone[i].length;j++) {

                nodesClone[i][j]['isShortest']=false;
                nodesClone[i][j]['visited']=false;
                nodesClone[i][j]['prevRow']=null;
                nodesClone[i][j]['prevCol']=null;
                nodesClone[i][j]['animateDelay']=0;
                nodesClone[i][j]['animation']=true;

            }
        }



        this.setState({
            nodes:nodesClone,
            isVisualized:false
        });

    };


    algoSetup=(e)=>{
        this.setState({
            currentAlgo:e.target.value,
        })
    };

    speedChangeHandler=(e)=>{
        this.setState({
            algoSpeed:e.target.value,
        })
    };

    diagonalChangeHandler=(e)=>{

        this.setState(prevState => {
            return{
                allowDiagonal:!prevState.allowDiagonal
            }
        })
    };

    mazeChangeHandler=(e)=>{
        if(this.state.isRunning) return;

        this.setState({
            generateMaze:e.target.value,
        });

        let nodesGrid=this.state.nodes;
        const startNode=nodesGrid[this.state.startNodeRow][this.state.startNodeCol];
        const endNode=nodesGrid[this.state.endNodeRow][this.state.endNodeCol];

        if(e.target.value==='walls'){

            let randomWalls=generateRandomWalls(nodesGrid,startNode,endNode);

            this.setState({
                nodes:randomWalls,
            });

        }
        else if(e.target.value==='simple'){


            let nodesClone = cloneNodes(nodesGrid);

            let result=gridDivisionMazeGenerator(nodesClone,startNode,endNode);

            this.setState({
                nodes:result.allNodes
            })


        }

    };


    toggleAbout=()=>{

        console.log('clicked');
        this.setState(prevState => {
            return{
                showAbout:!prevState.showAbout
            }
        })

    };


    render(){

        return(
            <>
                <div className='visualizerHeader'>
                    <label htmlFor="algoDropdown">Algorithm:
                        <select name="algoDropdown" id="algoDropdown" value={this.state.currentAlgo} onChange={this.algoSetup}>
                            <option value="Dijkstra">Dijkstra Algoritm</option>
                            <option value="AStar">A* Algoritm</option>
                            <option value="breathFirst">Breath First</option>
                            <option value="depthFirst">Depth First</option>
                            <option value="greedyBestFirst">GBF Search</option>
                        </select>
                    </label>

                    <label htmlFor="generateMaze" >Generate:
                        <select name="generateMaze"
                                disabled={this.state.isRunning}
                                id="generateMaze"
                                value={this.state.generateMaze}
                                onChange={this.mazeChangeHandler}>

                            <option value="select">Select Pattern</option>
                            <option value="walls">Random Walls</option>
                            <option value="simple">Simple Maze</option>
                        </select>
                    </label>

                    <button onClick={this.startAlgo}>Start</button>
                    <button onClick={this.resetVisualizer}>Reset Visualizer</button>
                    <button onClick={this.resetWalls} disabled={(this.state.isRunning)}>Reset Walls</button>
                    <button onClick={this.resetPath} disabled={(this.state.isRunning)}>Reset Path</button>


                    <label htmlFor="allowDiagonal">
                        Allow Diagonal:
                        <input type="checkbox"
                               id='allowDiagonal'
                               checked={this.state.allowDiagonal}
                               onChange={this.diagonalChangeHandler}/>
                    </label>

                    <label htmlFor="algoSpeed">Speed:
                        <select name="algoSpeed"
                                id="algoSpeed"
                                value={this.state.algoSpeed}
                                onChange={this.speedChangeHandler}>
                            <option value="0.0625">0.0625x</option>
                            <option value="0.125">0.125x</option>
                            <option value="0.25">0.25x</option>
                            <option value="0.5">0.5x</option>
                            <option value="0.75">0.75x</option>
                            <option value="1">1x</option>
                            <option value="1.5 ">1.5x</option>
                            <option value="1.75">1.75x</option>
                            <option value="2">2x</option>
                            <option value="4">4x</option>
                        </select>
                    </label>

                    <img src={img} alt="about" onClick={this.toggleAbout}/>
                </div>

                <div className='visualizer'>
                    {this.state.nodes.map(colum=>{

                        return colum.map(node=>{
                            return <Node
                                    class='node'
                                    row={node.row}
                                    col={node.col}
                                    isStartNode={node.row === this.state.startNodeRow && node.col === this.state.startNodeCol}
                                    isEndNode={node.row === this.state.endNodeRow && node.col === this.state.endNodeCol}
                                    isStartNodeSelected={this.state.startNodeSelected}
                                    isEndNodeSelected={this.state.endNodeSelected}
                                    isWall={node.isWall}
                                    isVisited={node.visited}
                                    isShortest={node.isShortest}
                                    animation={node.animation}
                                    delay={node.animateDelay}
                                    clicked={this.nodeClicked}
                                    mouseEnter={this.mouseEnter}
                                    // mouseUp={this.mouseUp}
                                    key={node.row+' '+ node.col}/>

                        })

                    })
                    }
                </div>

                <About show={this.state.showAbout} toggle={this.toggleAbout}/>
            </>
        )

    }
    
    
}

export const cloneNodes=(grid)=>{
    let nodesClone=[];

    let nodesStateClone=[...grid];

    let nodeObj,rowClone;

    for (let i=0;i<nodesStateClone.length;i++){
        nodesClone[i]=[];
        rowClone=nodesStateClone[i];
        for (let j=0;j<nodesStateClone[i].length;j++) {
            nodesClone[i][j]={...rowClone[j]};
        }
    }

    return nodesClone;
};


export default Visualizer;