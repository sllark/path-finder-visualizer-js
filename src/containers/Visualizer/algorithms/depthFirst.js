//Took inspiration from:
//https://en.wikipedia.org/wiki/Depth-first_search


export const findPathWithDepthFirst = (nodes,startNode, endNode,allowDiagonals)=>{

    let allNodesVisitedByOrder=[];



    for(let i=0;i<nodes.length;i++){
        for(let j=0;j<nodes[i].length;j++){
                nodes[i][j].isVisited=false;
        }
    }


    let neighboursList;
    let S = new Stack();

    S.enqueue(startNode);

    while (!S.isEmpty()){

        let currentNode = S.dequeue();

        if(currentNode.isWall){
            continue;
        }

        if(!currentNode.isVisited){
            currentNode.isVisited = true;

            allNodesVisitedByOrder.push(currentNode);

            neighboursList=getNeighboursNodes(currentNode,nodes,allowDiagonals);

            neighboursList.forEach(neighbourNode=>{

                    if(!neighbourNode.isVisited){
                        // backTrack[neighbourNode['node']]=currentNode[0];
                        nodes[neighbourNode.row][neighbourNode.col].prevRow=currentNode.row;
                        nodes[neighbourNode.row][neighbourNode.col].prevCol=currentNode.col;
                        S.enqueue(nodes[neighbourNode.row][neighbourNode.col]);
                    }

            });

        }




        if(currentNode.row === endNode.row && currentNode.col === endNode.col ){
            // console.log('breaking');
            break;
        }
    }

    allNodesVisitedByOrder.shift();
    allNodesVisitedByOrder.pop();

    // console.log(endNode)
    // console.log(allNodesVisitedByOrder[allNodesVisitedByOrder.length-1]);
    return {
        visitedNodes:allNodesVisitedByOrder,
        allNodes:nodes
    };

};


const getNeighboursNodes = (currentNode,nodes,allowDiagonals)=>{


    let neighbours=[];

    let lastRow=nodes[nodes.length-1];

    //upper node
    if(currentNode.row>0) {
        neighbours.push(nodes[currentNode.row-1][currentNode.col]);
        neighbours[neighbours.length-1].weight=1;

    }
    //left node
    if(currentNode.col>0){
        neighbours.push(nodes[currentNode.row][currentNode.col-1]);
        neighbours[neighbours.length-1].weight=1;
    }
    //right node
    if(currentNode.col < lastRow[lastRow.length-1].col){
        neighbours.push(nodes[currentNode.row][currentNode.col+1]);
        neighbours[neighbours.length-1].weight=1;
    }
    // bottom node
    if(currentNode.row < lastRow[0].row){
        neighbours.push(nodes[currentNode.row+1][currentNode.col]);
        neighbours[neighbours.length-1].weight=1;
    }


    if(allowDiagonals){
        // upper left node
        if(currentNode.row>0 && currentNode.col>0){
            neighbours.push(nodes[currentNode.row-1][currentNode.col-1]);
            neighbours[neighbours.length-1].weight=1.5;
        }
        //upper right node
        if(currentNode.row>0 && currentNode.col < lastRow[lastRow.length-1].col){

            neighbours.push(nodes[currentNode.row-1][currentNode.col+1]);
            neighbours[neighbours.length-1].weight=1.5;
        }
        // bottom left node
        if(currentNode.row < lastRow[0].row && currentNode.col>0){
            neighbours.push(nodes[currentNode.row+1][currentNode.col-1]);
            neighbours[neighbours.length-1].weight=1.5;
        }
        // bottom right node
        if(currentNode.row < lastRow[0].row && currentNode.col < lastRow[lastRow.length-1].col){
            neighbours.push(nodes[currentNode.row+1][currentNode.col+1]);
            neighbours[neighbours.length-1].weight=1.5;
        }
    }


    return neighbours;


};


class Stack {
    constructor() {
        this.collection = [];
    }

    enqueue(element){
        this.collection.push(element);
    };

    dequeue() {
        return this.collection.pop();
    };

    isEmpty() {
        return (this.collection.length === 0)
    };
}


