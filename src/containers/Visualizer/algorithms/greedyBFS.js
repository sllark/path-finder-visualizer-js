//Took inspiration from:
//https://en.wikipedia.org/wiki/Best-first_search
// https://www.javatpoint.com/ai-informed-search-algorithms#:~:text=Greedy%20best%2Dfirst%20search%20algorithm,the%20advantages%20of%20both%20algorithms.

export const findPathWithGreedyBFS = (nodes,startNode, endNode,allowDiagonals)=>{

    let allNodesVisitedByOrder=[];

    let loopNode;

    //reset all nodes
    for(let i=0;i<nodes.length;i++){

        for(let j=0;j<nodes[i].length;j++){

            loopNode=nodes[i][j];
            loopNode.isVisited=false;
            loopNode.f=0;
            loopNode.h=0;
            loopNode.closed=0;
            loopNode.prevRow=null;
            loopNode.prevCol=null;

            if(!loopNode.isWall)
                loopNode.weight = 1;
            else
                loopNode.weight = 0;
        }

    }


    let neighboursList;
    let pq = new PriorityQueue();

    startNode.h = heuristic(startNode,endNode); //get h cost

    pq.enqueue(startNode);

    while (!pq.isEmpty()){

        let currentNode = pq.dequeue();

        if(currentNode.row === endNode.row && currentNode.col === endNode.col ){
            // console.log('breaking');
            break;
        }


        if(currentNode.isWall){
            continue;
        }

        currentNode.isVisited = true;

        allNodesVisitedByOrder.push(currentNode);

        neighboursList = getNeighboursNodes(currentNode,nodes,allowDiagonals);

        neighboursList.forEach( neighbourNode =>{

            if(! (neighbourNode.isWall || neighbourNode.closed) ) {


                let beenVisited = neighbourNode.isVisited;

                if (!beenVisited) {

                    let neigh = nodes[neighbourNode.row][neighbourNode.col];

                    neigh.isVisited = true;
                    neigh.h = neighbourNode.h || heuristic(neighbourNode, endNode);
                    neigh.f = neigh.h;

                    // backTrack[neighbourNode['node']]=currentNode[0];
                    neigh.prevRow = currentNode.row;
                    neigh.prevCol = currentNode.col;

                    if (!beenVisited)
                        pq.enqueue(neigh);
                    else
                        pq.reorder(neigh);

                }
            }
        });


    }

    //remove start node
    allNodesVisitedByOrder.shift();

    return {
        visitedNodes:allNodesVisitedByOrder,
        allNodes:nodes
    };

};


const getNeighboursNodes = (currentNode,nodes,allowDiagonals)=>{


    let neighbours=[];

    let lastRow=nodes[nodes.length-1];


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

    //upper node
    if(currentNode.row>0) {
        neighbours.push(nodes[currentNode.row-1][currentNode.col]);
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


class PriorityQueue {
    constructor() {
        this.collection = [];
    }

    enqueue(element){
        if (this.isEmpty()){
            this.collection.push(element);
        } else {
            let added = false;
            for (let i = 1; i <= this.collection.length; i++){
                if (element.f < this.collection[i-1].f){
                    this.collection.splice(i-1, 0, element);
                    added = true;
                    break;
                }
            }
            if (!added){
                this.collection.push(element);
            }
        }


    };

    reorder(element){


        let eleIndex=this.collection.indexOf(element);

        while (eleIndex>0){
            let leftIndex=eleIndex-1;

            if(eleIndex.f<this.collection[leftIndex].f){
                let leftElement=this.collection[leftIndex];
                this.collection[leftIndex]=element;
                this.collection[eleIndex]=leftElement;

                eleIndex=leftIndex;
            }else
                break;
        }


        // if (this.isEmpty()){
        //     this.collection.push(element);
        // } else {
        //     let added = false;
        //     for (let i = 1; i <= this.collection.length; i++){
        //         if (element.f < this.collection[i-1].f){
        //             this.collection.splice(i-1, 0, element);
        //             added = true;
        //             break;
        //         }
        //     }
        //     if (!added){
        //         this.collection.push(element);
        //     }
        // }
    };

    dequeue() {
        return this.collection.shift();
    };

    isEmpty() {
        return (this.collection.length === 0)
    };
}


function heuristic(node,goal) {

    // console.log(node.row,goal.x)
    const dx = Math.abs(node.row - goal.row);
    const dy = Math.abs(node.col - goal.col);

    // console.log(dx,dy);

    return dx + dy;
}



