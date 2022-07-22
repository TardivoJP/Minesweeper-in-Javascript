window.onload=()=>{

    const gameGrid=document.querySelector("#game-grid");
    const minesCounter=document.querySelector("#minesCounter");
    const newGameBtn=document.querySelector("#newGameBtn");
    const timeCounter=document.querySelector("#timeCounter");
    

    let arr = [];

    for(i=0;i<10;i++){
        arr[i]=[];
        for(j=0;j<10;j++){
            arr[i][j]=0;
        }
    }

    
    function createMines(minesAmount){

        for(i=0;i<minesAmount;i++){
            let randomX = Math.floor(Math.random() * 9);
            let randomY = Math.floor(Math.random() * 9);
            let handBrake = 0;
    
            while(arr[randomX][randomY]!==0){
                randomX = Math.floor(Math.random() * 9);
                randomY = Math.floor(Math.random() * 9);
        
                handBrake++;
                if(handBrake>300){
                    break;
                }
            }
        
            if(handBrake>300){
                break;
            }
    
    
            arr[randomX][randomY]="*";
        }

    }

    function createNumbers(){

        for(i=0;i<10;i++){
            for(j=0;j<10;j++){
                if(arr[i][j]=='*'){
                    if(Number.isInteger(arr[i][j+1])){arr[i][j+1]++;}
                    
                    if(Number.isInteger(arr[i][j-1])){arr[i][j-1]++;}
                    
                    if(i<9){
                        if(Number.isInteger(arr[i+1][j])){arr[i+1][j]++;}
                        if(Number.isInteger(arr[i+1][j+1])){arr[i+1][j+1]++;}
                        if(Number.isInteger(arr[i+1][j-1])){arr[i+1][j-1]++;}    
                    }
                    
                    if(i>0){
                        if(Number.isInteger(arr[i-1][j])){arr[i-1][j]++;}
                        if(Number.isInteger(arr[i-1][j+1])){arr[i-1][j+1]++;}
                        if(Number.isInteger(arr[i-1][j-1])){arr[i-1][j-1]++;}    
                    }
                    
                }
            }
        }

    }

    let tileCoordinateX=11;
    let tileCoordinateY=11;
    let wasItEmpty=false;
    let timerStarted=false;
    let sec = 0;
    let timer = setInterval(function(){
        sec++;
    }, 1000);
    let minesLeft=12;
    let correctCounter=0;
    minesCounter.textContent=`Mines: ${minesLeft}`;
    timeCounter.textContent=`Time: ${sec}`

    gameGrid.addEventListener("contextmenu", e => e.preventDefault());

    function displayOnGrid(){
        
        gameGrid.innerHTML = '';
        let yCounter = 0;
        let xCounter = 0;   
        
        for(i=0;i<arr.length;i++){
            arr[i].forEach(element => {
                const cellElement = document.createElement('div');

                if(element > 0 || element=="*"){
                    cellElement.textContent = element;
                }
                
                cellElement.dataset.coordsX = xCounter;
                cellElement.dataset.coordsY = yCounter;
                cellElement.dataset.clicked = 0;
                cellElement.dataset.flagged = 0;

                if(element=="*"){
                    cellElement.dataset.trueValue = cellElement.textContent;    
                }else{
                    cellElement.dataset.trueValue = parseInt(cellElement.textContent);
                }

                cellElement.classList.add("cell");

                switch(true){
                    case (element==1):
                        cellElement.classList.add("tile1");
                    break;
    
                    case (element==2):
                        cellElement.classList.add("tile2");
                    break;
    
                    case (element==3):
                        cellElement.classList.add("tile3");
                    break;
    
                    case (element==4):
                        cellElement.classList.add("tile4");
                    break;
    
                    case (element==5):
                        cellElement.classList.add("tile5");
                    break;
    
                    case (element==6):
                        cellElement.classList.add("tile6");
                    break;
    
                    case (element==7):
                        cellElement.classList.add("tile7");
                    break;
    
                    case (element==8):
                        cellElement.classList.add("tile8");
                    break;
                }

                if(yCounter<9){
                    yCounter++;
                } else{
                    xCounter++;
                    yCounter=0;
                }
                
                gameGrid.appendChild(cellElement);
            })
        }

        for (let item of document.querySelectorAll("#game-grid div")) {
            item.addEventListener("click", function (evt) {

                if(timerStarted==false){
                    clearInterval(timer);
                    sec = 0;
                    timer = setInterval(function(){
                        timeCounter.textContent=`Time: ${sec}`
                        sec++;
                    }, 1000);
                    timerStarted=true;
                }

                if(evt.target.dataset.clicked==0&&evt.target.dataset.flagged==0){
                    tileCoordinateX = parseInt(evt.target.dataset.coordsX);
                    tileCoordinateY = parseInt(evt.target.dataset.coordsY);
    
                    if(evt.target.textContent==0){
                        wasItEmpty=true;
                    }
    
                    evt.target.classList.add("showTile");
                    if(evt.target.textContent=="*"){
                        evt.target.classList.add("explosion");
                        alert("BOOM!");
                        gameOver();
                    }
    
                    evt.target.dataset.clicked=1;
    
                    grabDataset();
                }

            }, false);

            item.addEventListener("contextmenu", function (evt) {

                if(evt.target.dataset.clicked==0){

                    if(timerStarted==false){
                        clearInterval(timer);
                        sec = 0;
                        timer = setInterval(function(){
                            timeCounter.textContent=`Time: ${sec}`
                            sec++;
                        }, 1000);
                        timerStarted=true;
                    }

                    if(evt.target.dataset.flagged==0){
                        evt.target.textContent="F";
                        evt.target.dataset.flagged=1;
                        evt.target.classList.add("flagged");
                        evt.target.classList.add("showTile");
                        minesLeft--;
                        minesCounter.textContent=`Mines: ${minesLeft}`;
                        if(evt.target.dataset.trueValue=="*"){correctCounter++;}

                        if(correctCounter==12){
                            alert("You win!");
                        }

                    }else{
                        if(evt.target.dataset.trueValue=="*"){
                            evt.target.textContent="*"; 
                        }else if(isNaN(evt.target.dataset.trueValue)){
                            evt.target.textContent='';    
                        }else{
                            evt.target.textContent=evt.target.dataset.trueValue;
                        }
                        evt.target.dataset.flagged=0;
                        evt.target.classList.remove("flagged");
                        evt.target.classList.remove("showTile");
                        minesLeft++;
                        minesCounter.textContent=`Mines: ${minesLeft}`;
                        if(evt.target.dataset.trueValue=="*"){correctCounter--;}
                    }

                }

            }, false);
        }

    }
    
    createMines(12);
    createNumbers();
    displayOnGrid();


    newGameBtn.addEventListener('click', ()=>{

        arr = [];
        for(i=0;i<10;i++){
            arr[i]=[];
            for(j=0;j<10;j++){
                arr[i][j]=0;
            }
        }

        createMines(12);
        createNumbers();
        displayOnGrid();
        tileCoordinateX=11;
        tileCoordinateY=11;
        wasItEmpty=false;
        timerStarted=false;
        clearInterval(timer);
        sec=0;
        minesLeft=12;
        correctCounter=0;
        minesCounter.textContent=`Mines: ${minesLeft}`;
        timeCounter.textContent=`Time: ${sec}`
    })



    function gameOver(){
        clearInterval(timer);
        timeCounter.textContent=`Time: ${sec}`
        for (let item of document.querySelectorAll("#game-grid div")) {
            item.dataset.clicked=1;
            if(item.textContent=="*"){
                item.classList.add("showTile");
            }
        }
    }

    function grabDataset(){

        if(wasItEmpty){

            let z=0;
            let x=tileCoordinateX;
            let y=tileCoordinateY;
            let maximumCheckX=true;
            let minimumCheckX=true;
            let maximumCheckY=true;
            let minimumCheckY=true;
                
            let positions=[];
            let a=0;
            let b=1;
                
            let arrClone1 = JSON.parse(JSON.stringify(arr));
            let arrClone2 = JSON.parse(JSON.stringify(arr));
            let arrClone3 = JSON.parse(JSON.stringify(arr));
            let arrClone4 = JSON.parse(JSON.stringify(arr));
            let arrClone5 = JSON.parse(JSON.stringify(arr));
            let arrClone6 = JSON.parse(JSON.stringify(arr));
            let arrClone7 = JSON.parse(JSON.stringify(arr));
            let arrClone8 = JSON.parse(JSON.stringify(arr));
            let arrClone9 = JSON.parse(JSON.stringify(arr));
            let arrClone10 = JSON.parse(JSON.stringify(arr));
            let arrClone11 = JSON.parse(JSON.stringify(arr));
            let arrClone12 = JSON.parse(JSON.stringify(arr));
            let arrClone13 = JSON.parse(JSON.stringify(arr));
            let arrClone14 = JSON.parse(JSON.stringify(arr));
            let arrClone15 = JSON.parse(JSON.stringify(arr));
            let arrClone16 = JSON.parse(JSON.stringify(arr));
            let arrClone17 = JSON.parse(JSON.stringify(arr));
            let arrClone18 = JSON.parse(JSON.stringify(arr));
            let arrClone19 = JSON.parse(JSON.stringify(arr));
            let arrClone20 = JSON.parse(JSON.stringify(arr));
            let arrClone21 = JSON.parse(JSON.stringify(arr));
            let arrClone22 = JSON.parse(JSON.stringify(arr));
            let arrClone23 = JSON.parse(JSON.stringify(arr));
            let arrClone24 = JSON.parse(JSON.stringify(arr));
            
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(maximumCheckY==true&&arrClone1[x][y+1]==0){
                    arrClone1[x][y+1]=2;
                    y=y+1;
                } else if(minimumCheckY==true&&arrClone1[x][y-1]==0){
                    arrClone1[x][y-1]=2;
                    y=y-1;
                } else if(maximumCheckX==true&&arrClone1[x+1][y]==0){
                    arrClone1[x+1][y]=2;
                    x=x+1;
                } else if(minimumCheckX==true&&arrClone1[x-1][y]==0){
                    arrClone1[x-1][y]=2;
                    x=x-1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(maximumCheckY==true&&arrClone2[x][y+1]==0){
                    arrClone2[x][y+1]=2;
                    y=y+1;
                } else if(minimumCheckY==true&&arrClone2[x][y-1]==0){
                    arrClone2[x][y-1]=2;
                    y=y-1;
                } else if(minimumCheckX==true&&arrClone2[x-1][y]==0){
                    arrClone2[x-1][y]=2;
                    x=x-1;
                } else if(maximumCheckX==true&&arrClone2[x+1][y]==0){
                    arrClone2[x+1][y]=2;
                    x=x+1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(maximumCheckY==true&&arrClone3[x][y+1]==0){
                    arrClone3[x][y+1]=2;
                    y=y+1;
                } else if(minimumCheckX==true&&arrClone3[x-1][y]==0){
                    arrClone3[x-1][y]=2;
                    x=x-1;
                } else if(minimumCheckY==true&&arrClone3[x][y-1]==0){
                    arrClone3[x][y-1]=2;
                    y=y-1;
                } else if(maximumCheckX==true&&arrClone3[x+1][y]==0){
                    arrClone3[x+1][y]=2;
                    x=x+1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(maximumCheckY==true&&arrClone4[x][y+1]==0){
                    arrClone4[x][y+1]=2;
                    y=y+1;
                } else if(minimumCheckX==true&&arrClone4[x-1][y]==0){
                    arrClone4[x-1][y]=2;
                    x=x-1;
                } else if(maximumCheckX==true&&arrClone4[x+1][y]==0){
                    arrClone4[x+1][y]=2;
                    x=x+1;
                } else if(minimumCheckY==true&&arrClone4[x][y-1]==0){
                    arrClone4[x][y-1]=2;
                    y=y-1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(maximumCheckY==true&&arrClone5[x][y+1]==0){
                    arrClone5[x][y+1]=2;
                    y=y+1;
                } else if(maximumCheckX==true&&arrClone5[x+1][y]==0){
                    arrClone5[x+1][y]=2;
                    x=x+1;
                } else if(minimumCheckX==true&&arrClone5[x-1][y]==0){
                    arrClone5[x-1][y]=2;
                    x=x-1;
                } else if(minimumCheckY==true&&arrClone5[x][y-1]==0){
                    arrClone5[x][y-1]=2;
                    y=y-1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(maximumCheckY==true&&arrClone6[x][y+1]==0){
                    arrClone6[x][y+1]=2;
                    y=y+1;
                } else if(maximumCheckX==true&&arrClone6[x+1][y]==0){
                    arrClone6[x+1][y]=2;
                    x=x+1;
                } else if(minimumCheckY==true&&arrClone6[x][y-1]==0){
                    arrClone6[x][y-1]=2;
                    y=y-1;
                } else if(minimumCheckX==true&&arrClone6[x-1][y]==0){
                    arrClone6[x-1][y]=2;
                    x=x-1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(minimumCheckY==true&&arrClone7[x][y-1]==0){
                    arrClone7[x][y-1]=2;
                    y=y-1;
                } else if(maximumCheckY==true&&arrClone7[x][y+1]==0){
                    arrClone7[x][y+1]=2;
                    y=y+1;
                } else if(maximumCheckX==true&&arrClone7[x+1][y]==0){
                    arrClone7[x+1][y]=2;
                    x=x+1;
                } else if(minimumCheckX==true&&arrClone7[x-1][y]==0){
                    arrClone7[x-1][y]=2;
                    x=x-1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(minimumCheckY==true&&arrClone8[x][y-1]==0){
                    arrClone8[x][y-1]=2;
                    y=y-1;
                } else if(maximumCheckY==true&&arrClone8[x][y+1]==0){
                    arrClone8[x][y+1]=2;
                    y=y+1;
                } else if(minimumCheckX==true&&arrClone8[x-1][y]==0){
                    arrClone8[x-1][y]=2;
                    x=x-1;
                } else if(maximumCheckX==true&&arrClone8[x+1][y]==0){
                    arrClone8[x+1][y]=2;
                    x=x+1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(minimumCheckY==true&&arrClone9[x][y-1]==0){
                    arrClone9[x][y-1]=2;
                    y=y-1;
                } else if(minimumCheckX==true&&arrClone9[x-1][y]==0){
                    arrClone9[x-1][y]=2;
                    x=x-1;
                } else if(maximumCheckY==true&&arrClone9[x][y+1]==0){
                    arrClone9[x][y+1]=2;
                    y=y+1;
                } else if(maximumCheckX==true&&arrClone9[x+1][y]==0){
                    arrClone9[x+1][y]=2;
                    x=x+1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(minimumCheckY==true&&arrClone10[x][y-1]==0){
                    arrClone10[x][y-1]=2;
                    y=y-1;
                } else if(minimumCheckX==true&&arrClone10[x-1][y]==0){
                    arrClone10[x-1][y]=2;
                    x=x-1;
                } else if(maximumCheckX==true&&arrClone10[x+1][y]==0){
                    arrClone10[x+1][y]=2;
                    x=x+1;
                } else if(maximumCheckY==true&&arrClone10[x][y+1]==0){
                    arrClone10[x][y+1]=2;
                    y=y+1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(minimumCheckY==true&&arrClone11[x][y-1]==0){
                    arrClone11[x][y-1]=2;
                    y=y-1;
                } else if(maximumCheckX==true&&arrClone11[x+1][y]==0){
                    arrClone11[x+1][y]=2;
                    x=x+1;
                } else if(minimumCheckX==true&&arrClone11[x-1][y]==0){
                    arrClone11[x-1][y]=2;
                    x=x-1;
                } else if(maximumCheckY==true&&arrClone11[x][y+1]==0){
                    arrClone11[x][y+1]=2;
                    y=y+1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(minimumCheckY==true&&arrClone12[x][y-1]==0){
                    arrClone12[x][y-1]=2;
                    y=y-1;
                } else if(maximumCheckX==true&&arrClone12[x+1][y]==0){
                    arrClone12[x+1][y]=2;
                    x=x+1;
                } else if(maximumCheckY==true&&arrClone12[x][y+1]==0){
                    arrClone12[x][y+1]=2;
                    y=y+1;
                } else if(minimumCheckX==true&&arrClone12[x-1][y]==0){
                    arrClone12[x-1][y]=2;
                    x=x-1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(maximumCheckX==true&&arrClone13[x+1][y]==0){
                    arrClone13[x+1][y]=2;
                    x=x+1;
                } else if(minimumCheckY==true&&arrClone13[x][y-1]==0){
                    arrClone13[x][y-1]=2;
                    y=y-1;
                } else if(maximumCheckY==true&&arrClone13[x][y+1]==0){
                    arrClone13[x][y+1]=2;
                    y=y+1;
                } else if(minimumCheckX==true&&arrClone13[x-1][y]==0){
                    arrClone13[x-1][y]=2;
                    x=x-1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(maximumCheckX==true&&arrClone14[x+1][y]==0){
                    arrClone14[x+1][y]=2;
                    x=x+1;
                } else if(minimumCheckY==true&&arrClone14[x][y-1]==0){
                    arrClone14[x][y-1]=2;
                    y=y-1;
                } else if(minimumCheckX==true&&arrClone14[x-1][y]==0){
                    arrClone14[x-1][y]=2;
                    x=x-1;
                } else if(maximumCheckY==true&&arrClone14[x][y+1]==0){
                    arrClone14[x][y+1]=2;
                    y=y+1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(maximumCheckX==true&&arrClone15[x+1][y]==0){
                    arrClone15[x+1][y]=2;
                    x=x+1;
                } else if(minimumCheckX==true&&arrClone15[x-1][y]==0){
                    arrClone15[x-1][y]=2;
                    x=x-1;
                } else if(minimumCheckY==true&&arrClone15[x][y-1]==0){
                    arrClone15[x][y-1]=2;
                    y=y-1;
                } else if(maximumCheckY==true&&arrClone15[x][y+1]==0){
                    arrClone15[x][y+1]=2;
                    y=y+1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(maximumCheckX==true&&arrClone16[x+1][y]==0){
                    arrClone16[x+1][y]=2;
                    x=x+1;
                } else if(minimumCheckX==true&&arrClone16[x-1][y]==0){
                    arrClone16[x-1][y]=2;
                    x=x-1;
                } else if(maximumCheckY==true&&arrClone16[x][y+1]==0){
                    arrClone16[x][y+1]=2;
                    y=y+1;
                } else if(minimumCheckY==true&&arrClone16[x][y-1]==0){
                    arrClone16[x][y-1]=2;
                    y=y-1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(maximumCheckX==true&&arrClone17[x+1][y]==0){
                    arrClone17[x+1][y]=2;
                    x=x+1;
                } else if(maximumCheckY==true&&arrClone17[x][y+1]==0){
                    arrClone17[x][y+1]=2;
                    y=y+1;
                } else if(minimumCheckX==true&&arrClone17[x-1][y]==0){
                    arrClone17[x-1][y]=2;
                    x=x-1;
                } else if(minimumCheckY==true&&arrClone17[x][y-1]==0){
                    arrClone17[x][y-1]=2;
                    y=y-1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(maximumCheckX==true&&arrClone18[x+1][y]==0){
                    arrClone18[x+1][y]=2;
                    x=x+1;
                } else if(maximumCheckY==true&&arrClone18[x][y+1]==0){
                    arrClone18[x][y+1]=2;
                    y=y+1;
                } else if(minimumCheckY==true&&arrClone18[x][y-1]==0){
                    arrClone18[x][y-1]=2;
                    y=y-1;
                } else if(minimumCheckX==true&&arrClone18[x-1][y]==0){
                    arrClone18[x-1][y]=2;
                    x=x-1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(minimumCheckX==true&&arrClone19[x-1][y]==0){
                    arrClone19[x-1][y]=2;
                    x=x-1;
                } else if(maximumCheckY==true&&arrClone19[x][y+1]==0){
                    arrClone19[x][y+1]=2;
                    y=y+1;
                } else if(maximumCheckX==true&&arrClone19[x+1][y]==0){
                    arrClone19[x+1][y]=2;
                    x=x+1;
                } else if(minimumCheckY==true&&arrClone19[x][y-1]==0){
                    arrClone19[x][y-1]=2;
                    y=y-1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(minimumCheckX==true&&arrClone20[x-1][y]==0){
                    arrClone20[x-1][y]=2;
                    x=x-1;
                } else if(maximumCheckY==true&&arrClone20[x][y+1]==0){
                    arrClone20[x][y+1]=2;
                    y=y+1;
                } else if(minimumCheckY==true&&arrClone20[x][y-1]==0){
                    arrClone20[x][y-1]=2;
                    y=y-1;
                } else if(maximumCheckX==true&&arrClone20[x+1][y]==0){
                    arrClone20[x+1][y]=2;
                    x=x+1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(minimumCheckX==true&&arrClone21[x-1][y]==0){
                    arrClone21[x-1][y]=2;
                    x=x-1;
                } else if(minimumCheckY==true&&arrClone21[x][y-1]==0){
                    arrClone21[x][y-1]=2;
                    y=y-1;
                } else if(maximumCheckY==true&&arrClone21[x][y+1]==0){
                    arrClone21[x][y+1]=2;
                    y=y+1;
                } else if(maximumCheckX==true&&arrClone21[x+1][y]==0){
                    arrClone21[x+1][y]=2;
                    x=x+1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(minimumCheckX==true&&arrClone22[x-1][y]==0){
                    arrClone22[x-1][y]=2;
                    x=x-1;
                } else if(minimumCheckY==true&&arrClone22[x][y-1]==0){
                    arrClone22[x][y-1]=2;
                    y=y-1;
                } else if(maximumCheckX==true&&arrClone22[x+1][y]==0){
                    arrClone22[x+1][y]=2;
                    x=x+1;
                } else if(maximumCheckY==true&&arrClone22[x][y+1]==0){
                    arrClone22[x][y+1]=2;
                    y=y+1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(minimumCheckX==true&&arrClone23[x-1][y]==0){
                    arrClone23[x-1][y]=2;
                    x=x-1;
                } else if(maximumCheckX==true&&arrClone23[x+1][y]==0){
                    arrClone23[x+1][y]=2;
                    x=x+1;
                } else if(minimumCheckY==true&&arrClone23[x][y-1]==0){
                    arrClone23[x][y-1]=2;
                    y=y-1;
                } else if(maximumCheckY==true&&arrClone23[x][y+1]==0){
                    arrClone23[x][y+1]=2;
                    y=y+1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
            
            x=tileCoordinateX;
            y=tileCoordinateY;
            maximumCheckX=true;
            minimumCheckX=true;
            maximumCheckY=true;
            minimumCheckY=true;
            
            while(z<5){
                if((x+1)>=10){maximumCheckX=false;}
                if((x-1)<=-1){minimumCheckX=false;}
                if((y+1)>=10){maximumCheckY=false;}
                if((y-1)<=-1){minimumCheckY=false;}
                
                if(minimumCheckX==true&&arrClone24[x-1][y]==0){
                    arrClone24[x-1][y]=2;
                    x=x-1;
                } else if(maximumCheckX==true&&arrClone24[x+1][y]==0){
                    arrClone24[x+1][y]=2;
                    x=x+1;
                } else if(maximumCheckY==true&&arrClone24[x][y+1]==0){
                    arrClone24[x][y+1]=2;
                    y=y+1;
                } else if(minimumCheckY==true&&arrClone24[x][y-1]==0){
                    arrClone24[x][y-1]=2;
                    y=y-1;
                } else{
                    break;
                }
                
                positions[a]=x;
                positions[b]=y;
                
                a+=2;
                b+=2;
            }
    
            a=0;
            b=1;

            //console.log(positions);

            for(i=0;i<positions.length/2;i++){
    
                x=positions[a];
                y=positions[b];
    
                for (let item of document.querySelectorAll("#game-grid div")) {
                    if(item.dataset.coordsX==x&&item.dataset.coordsY==y){
                        item.dataset.clicked=1;
                        item.classList.add("showTile");
                    }
                }
    
                a+=2;
                b+=2;
            }

            a=0;
            b=1;
    
            for(i=0;i<positions.length/2;i++){
    
                x=positions[a];
                y=positions[b]+1;

                if(x>=0&&x<=9&&y>=0&&y<=9&&arr[x][y]!==0){
                    for (let item of document.querySelectorAll("#game-grid div")) {
                        if(item.dataset.coordsX==x&&item.dataset.coordsY==y){
                            item.dataset.clicked=1;
                            item.classList.add("showTile");
                        }
                    }
                }
    
                a+=2;
                b+=2;
            }

            a=0;
            b=1;
    
            for(i=0;i<positions.length/2;i++){
    
                x=positions[a];
                y=positions[b]-1;

                if(x>=0&&x<=9&&y>=0&&y<=9&&arr[x][y]!==0){
                    for (let item of document.querySelectorAll("#game-grid div")) {
                        if(item.dataset.coordsX==x&&item.dataset.coordsY==y){
                            item.dataset.clicked=1;
                            item.classList.add("showTile");
                        }
                    }
                }
    
                a+=2;
                b+=2;
            }

            a=0;
            b=1;
    
            for(i=0;i<positions.length/2;i++){
    
                x=positions[a]+1;
                y=positions[b];

                if(x>=0&&x<=9&&y>=0&&y<=9&&arr[x][y]!==0){
                    for (let item of document.querySelectorAll("#game-grid div")) {
                        if(item.dataset.coordsX==x&&item.dataset.coordsY==y){
                            item.dataset.clicked=1;
                            item.classList.add("showTile");
                        }
                    }
                }
    
                a+=2;
                b+=2;
            }

            a=0;
            b=1;
    
            for(i=0;i<positions.length/2;i++){
    
                x=positions[a]+1;
                y=positions[b]+1;

                if(x>=0&&x<=9&&y>=0&&y<=9&&arr[x][y]!==0){
                    for (let item of document.querySelectorAll("#game-grid div")) {
                        if(item.dataset.coordsX==x&&item.dataset.coordsY==y){
                            item.dataset.clicked=1;
                            item.classList.add("showTile");
                        }
                    }
                }
    
                a+=2;
                b+=2;
            }

            a=0;
            b=1;
    
            for(i=0;i<positions.length/2;i++){
    
                x=positions[a]+1;
                y=positions[b]-1;

                if(x>=0&&x<=9&&y>=0&&y<=9&&arr[x][y]!==0){
                    for (let item of document.querySelectorAll("#game-grid div")) {
                        if(item.dataset.coordsX==x&&item.dataset.coordsY==y){
                            item.dataset.clicked=1;
                            item.classList.add("showTile");
                        }
                    }
                }
    
                a+=2;
                b+=2;
            }

            a=0;
            b=1;
    
            for(i=0;i<positions.length/2;i++){
    
                x=positions[a]-1;
                y=positions[b];

                if(x>=0&&x<=9&&y>=0&&y<=9&&arr[x][y]!==0){
                    for (let item of document.querySelectorAll("#game-grid div")) {
                        if(item.dataset.coordsX==x&&item.dataset.coordsY==y){
                            item.dataset.clicked=1;
                            item.classList.add("showTile");
                        }
                    }
                }
    
                a+=2;
                b+=2;
            }

            a=0;
            b=1;
    
            for(i=0;i<positions.length/2;i++){
    
                x=positions[a]-1;
                y=positions[b]+1;

                if(x>=0&&x<=9&&y>=0&&y<=9&&arr[x][y]!==0){
                    for (let item of document.querySelectorAll("#game-grid div")) {
                        if(item.dataset.coordsX==x&&item.dataset.coordsY==y){
                            item.dataset.clicked=1;
                            item.classList.add("showTile");
                        }
                    }
                }
    
                a+=2;
                b+=2;
            }

            a=0;
            b=1;
    
            for(i=0;i<positions.length/2;i++){
    
                x=positions[a]-1;
                y=positions[b]-1;

                if(x>=0&&x<=9&&y>=0&&y<=9&&arr[x][y]!==0){
                    for (let item of document.querySelectorAll("#game-grid div")) {
                        if(item.dataset.coordsX==x&&item.dataset.coordsY==y){
                            item.dataset.clicked=1;
                            item.classList.add("showTile");
                        }
                    }
                }
    
                a+=2;
                b+=2;
            }

            

        }

        wasItEmpty=false;
        tileCoordinateX=11;
        tileCoordinateY=11;
        
    }




}