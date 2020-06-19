//Took inspiration from:
//https://en.wikipedia.org/wiki/Breadth-first_search

export const findPathWithBreathFirst = (nodes,startNode, endNode,allowDiagonals)=>{

    let allNodesVisitedByOrder=[];




    for(let i=0;i<nodes.length;i++){
        for(let j=0;j<nodes[i].length;j++){
            if(startNode!==nodes[i][j]){
                nodes[i][j].isVisited=false;

            }
        }
    }


    let neighboursList;
    let pq = new PriorityQueue();

    pq.enqueue(startNode);

    while (!pq.isEmpty()){

        let currentNode = pq.dequeue();
        currentNode.isVisited = true;

        if(currentNode.isWall){
            continue;
        }

        allNodesVisitedByOrder.push(currentNode);

        neighboursList=getNeighboursNodes(currentNode,nodes,allowDiagonals);

        neighboursList.forEach(neighbourNode=>{


            if(!neighbourNode.isVisited){

                neighbourNode.isVisited=true;
                // backTrack[neighbourNode['node']]=currentNode[0];
                nodes[neighbourNode.row][neighbourNode.col].prevRow=currentNode.row;
                nodes[neighbourNode.row][neighbourNode.col].prevCol=currentNode.col;
                pq.enqueue(nodes[neighbourNode.row][neighbourNode.col]);
            }
        });

        if(currentNode.row === endNode.row && currentNode.col === endNode.col ){
            // console.log('breaking');
            break;
        }

    }

    allNodesVisitedByOrder.shift();
    allNodesVisitedByOrder.pop();

    return {
        visitedNodes:allNodesVisitedByOrder,
        allNodes:nodes
    };

};

//
// const updatedNodes=(nodes)=>{
//
//     let allNodes=[...nodes];
//
//     for(let i=0;i<allNodes.length;i++){
//
//         for(let j=0;j<allNodes[i].length;j++){
//             // allNodes.push(nodes[i][j]);
//             allNodes[i][j].isVisited=false;
//             allNodes[i][j].distance = Infinity;
//         }
//     }
//
//
//     return allNodes;
// };


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
                if (element.distance < this.collection[i-1].distance){
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


    dequeue() {
        return this.collection.shift();
    };

    isEmpty() {
        return (this.collection.length === 0)
    };
}








// class Graph {
//     // constructor() {
//         // this.nodes = [];
//         // this.neighboursList = {}; // list showing all neighbour nodes of a node
//     // }
//
//     //
//     //
//     // addNode(node) {
//     //     this.nodes.push(node);
//     //     this.neighboursList[node] = [];
//     // }
//     //
//     //
//     // addEdge(node1, node2, weight) {
//     //     this.neighboursList[node1].push({node:node2, weight: weight});
//     //     this.neighboursList[node2].push({node:node1, weight: weight});
//     // }
//     //
//
//
//
//
//
//     // findPathWithDijkstra(startNode, endNode){
//     //     let times = {};
//     //     let backtrace = {};
//     //     let pq = new PriorityQueue();
//     //
//     //     times[startNode] = 0;
//     //
//     //     // console.log({...times});
//     //
//     //
//     //     this.nodes.forEach(node => {
//     //         if (node !== startNode) {
//     //             times[node] = Infinity
//     //         }
//     //     });
//     //
//     //     pq.enqueue([startNode, 0]);
//     //
//     //
//     //
//     //     while (!pq.isEmpty()) {
//     //         let shortestStep = pq.dequeue();
//     //         let currentNode = shortestStep[0];
//     //         this.neighboursList[currentNode].forEach(neighbor => {
//     //             let time = times[currentNode] + neighbor.weight;
//     //             if (time < times[neighbor.node]) {
//     //                 times[neighbor.node] = time;
//     //                 backtrace[neighbor.node] = currentNode;
//     //                 pq.enqueue([neighbor.node, time]);
//     //             }
//     //         });
//     //     }
//     //
//     //     console.log({...backtrace});
//     //
//     //
//     //
//     //     let path = [endNode];
//     //     let lastStep = endNode;
//     //
//     //     while(lastStep !== startNode) {
//     //         path.unshift(backtrace[lastStep]);
//     //         lastStep = backtrace[lastStep]
//     //     }
//     //
//     //     return `Path is ${path} and time is ${times[endNode]}`;
//     // }
//
//
// }
