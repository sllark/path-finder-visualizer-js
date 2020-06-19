import {cloneNodes} from '../Visualizer';

const generateRandomWalls=(grid,startNode,endNode)=>{

    let nodesClone = cloneNodes(grid),
        nodeObj;

    for (let i=0;i<nodesClone.length;i++){

        for (let j=0;j<nodesClone[i].length;j++) {

            nodeObj = {...nodesClone[i][j]};

            if( (nodeObj.row === startNode.row && nodeObj.col === startNode.col)
                || (nodeObj.row === endNode.row && nodeObj.col === endNode.col)){
                nodesClone[i][j]=nodeObj;
                continue;
            }


            nodeObj["isWall"]=false;

            nodeObj["isWall"] = Math.random() > 0.63;

            nodeObj['isShortest']=false;
            nodeObj['visited']=false;

            nodesClone[i][j]=nodeObj;
        }

    }

    return nodesClone;

};


export default generateRandomWalls;