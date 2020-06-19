//Took inspiration from:
//http://weblog.jamisbuck.org/2011/1/12/maze-generation-recursive-division-algorithm


const HORIZONTAL=0;
const VERTICAL=1;

export const gridDivisionMazeGenerator= (nodes,startNode,endNode)=>{


    //Supporting Variales

    let wx,// X-cord from where to start creating wall
        wy,// Y-cord from where to start creating wall
        hx,// X-cord for Hole to be created in wall
        hy,// Y-cord for Hole to be created in wall
        box1,// there would be two new boxes when we create a wall in a box
        box2;

    // let allNodesVisitedByOrder=[];

    //Reset all nodes
    for(let i=0;i<nodes.length;i++){
        for(let j=0;j<nodes[i].length;j++){

            nodes[i][j].isWall=false;
            nodes[i][j].isShortest=false;
            nodes[i][j].visited=false;
            nodes[i][j].prevRow=null;
            nodes[i][j].prevCol=null;
            nodes[i][j].isVisited=false;

        }
    }

    nodes[startNode.row][startNode.col].isWall=false;
    nodes[endNode.row][endNode.col].isWall=false;

    //Stack to keep all new boxes
    let S = new Stack();

    //Initial box
    let box={
        x:0,
        y:0,
        maxX:nodes[0].length-1,
        maxY:nodes.length-1,
        width:nodes[0].length-1,
        height:nodes.length-1,
        orientation:choose_orientation(nodes[0].length-1,nodes.length-1)
    };

    S.enqueue(box);


    while (!S.isEmpty()){

        let currentBox = S.dequeue();

        if(currentBox.width < 2 || currentBox.height < 2) continue;


        //from where the wall will start
        wx= currentBox.orientation ? Math.floor(randomNumber(currentBox.x, currentBox.maxX)/2)*2 : currentBox.x;
        wy= currentBox.orientation ? currentBox.y : Math.floor(randomNumber(currentBox.y, currentBox.maxY)/2)*2;

        //where the hole would be in the wall
        hx = wx + (currentBox.orientation ? 0 :  Math.floor(Math.random()*currentBox.width));
        hy = wy + (currentBox.orientation ? Math.floor(Math.random()*currentBox.height) : 0);


        //making new Wall in the currentBox and getting 2 new Boxes

        if(currentBox.orientation){//wall would be created vertically

            //===========check and clear if passsage/hole doesn't gets block by a new wall=============

            let changed=false;

            if(wy>0){
                //if there is a passage right above the wall the make hole right at starting of the wall
                if(!nodes[wy-1][wx].isWall){
                    hy = wy;
                    changed=true;
                }
            }

            if(currentBox.maxY+1<nodes.length){
                //if there is a passage right below the wall the make hole at end of the wall and
                if(!nodes[currentBox.maxY + 1][wx].isWall){
                    hy = currentBox.maxY;
                    if(changed)wy++; //top most node of the wall would also be left empety
                }
            }
            //=====================================================================================



            //new boxes that would be created after a Wall would be constructed in the current box

            box1={
                x:currentBox.x,
                y:currentBox.y,
                maxX:wx-1,
                maxY:currentBox.maxY,
                width:wx-currentBox.x,
                height:currentBox.height,
                orientation:choose_orientation( wx-currentBox.x ,currentBox.height)
            };

            box2={
                x : wx + 1,
                y : wy,
                maxX:currentBox.maxX,
                maxY:currentBox.maxY,
                width : currentBox.maxX - Math.max(wx,1),
                height : currentBox.height,
                orientation : choose_orientation( (currentBox.x+currentBox.width) - wx  , currentBox.height )
            };

            //creating wall
            while (wy <= currentBox.maxY) {
                if(wy !== hy &&  !(wy === startNode.row && wx===startNode.col) && !(wy === endNode.row && wx===endNode.col) ){
                    nodes[wy][wx].isWall=true;
                    // allNodesVisitedByOrder.push(nodes[wy][wx]);
                }
                wy++;
            }

        }
        else {//wall would be created horizontally

            //=========check and clear if passsage gets block by a new wall=========

            let changed=false;
            if(wx > 0 ) {
                if (!nodes[wy][wx - 1].isWall){ //if there is a passage at left side of the horizontal wall
                    hx = wx;//make a hole a starting of the wall
                    changed=true;
                }
            }

            if(currentBox.maxX < nodes[0].length){ // if current box length is smaller than the total width of the grid
                if (nodes[wy][currentBox.maxX + 1]){ // if there is a node after the max width of the current box

                    if (!nodes[wy][currentBox.maxX + 1].isWall){ //if there is a passage at the end (right side)of the horizontal wall

                        // check if really there is a wall and the wall has a passage
                        //to confirm there is a wall at right side, there should be a Wall Node at top or bottom of the selected node
                        if(nodes[wy+1]){
                            if(nodes[wy+1][currentBox.maxX+1].isWall){
                                hx = currentBox.maxX ;
                                if(changed){
                                    wx++;
                                }
                            }
                        }else if(nodes[wy-1]){
                            if(nodes[wy-1][currentBox.maxX+1].isWall){
                                hx = currentBox.maxX;
                                if(changed){
                                    wx++;
                                }
                            }

                        }
                    }



                }
            }

            //================================================================================

            //new boxes that would be created after a Wall would be constructed in the current box

            box1={
                x:currentBox.x,
                y:currentBox.y,
                maxX:currentBox.maxX,
                maxY:wy-1,
                width:currentBox.width,
                height:wy-currentBox.y,
                orientation:choose_orientation(currentBox.width,currentBox.height-wy)
            };

            box2={
                x : wx,
                y : wy+1,
                maxX:currentBox.maxX,
                maxY:currentBox.maxY,
                width : currentBox.width,
                height : currentBox.maxY-wy,
                orientation : choose_orientation( currentBox.width , (currentBox.height+currentBox.y)-wy )
            };

            while (wx <= currentBox.maxX) {
                if(wx !== hx && !(wy === startNode.row && wx===startNode.col) && !(wy === endNode.row && wx===endNode.col)){
                    nodes[wy][wx].isWall=true;
                    // allNodesVisitedByOrder.push(nodes[wy][wx]);
                }
                wx++;
            }
        }


        S.enqueue(box1);
        S.enqueue(box2);

    }

    return {
        // visitedNodes:allNodesVisitedByOrder,
        allNodes:nodes
    };

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


const choose_orientation = (width,height)=>{

    if(height>width)
        return HORIZONTAL;
    else if (height<width)
        return VERTICAL;
    else
        return (Math.random()>0.5 ? HORIZONTAL : VERTICAL);



};


//Does not include min and max
function randomNumber(min, max) {
    min++;
    max--;
    return Math.round(Math.random() * (max - min) + min);
}









//
// export const mazeGeneratorDFS= (grid, x, y, width, height, orientation)=> {
//     if(width <= 4 || height <= 4 ) return;
//
//     let horizontal = orientation === HORIZONTAL;
//
//     let wx = x + (horizontal ? 0 : Math.floor(Math.random()*(width-2))),
//         wy = y + (horizontal ? Math.floor(Math.random()*(height-2)) : 0);
//
//     let px = wx + (horizontal ? Math.floor(Math.random()*(width)) : 0),
//         py = wy + (horizontal ? 0 : Math.floor(Math.random()*(height)));
//
//     let dx = horizontal ? 1 : 0,
//         dy = horizontal ? 0 : 1,
//         length = horizontal ? width : height;
//
//     for(let i=0;i<length;i++){
//
//         console.log(wx);
//         if(wx!==px || wy!==py)
//             grid[wy][wx].isWall=true;
//
//         wx += dx;
//         wy += dy;
//     }
//
//     let nx = x,
//         ny = y,
//         w = horizontal ? width : wx-x+1,
//         h = horizontal ?  wy-y+1 : height;
//
//     mazeGeneratorDFS(grid, nx, ny, w, h, choose_orientation(w, h));
//
//     nx = horizontal ? x: wx+1;
//     ny = horizontal ? wy+1 : y;
//     w = horizontal ? width: x+width-wx-1;
//     h = horizontal ? y+height-wy-1 : height;
//     mazeGeneratorDFS(grid, nx, ny, w, h, choose_orientation(w, h))
//
// };