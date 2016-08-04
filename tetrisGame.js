/**
 * Created by Anan on 2016/8/4.
 */
var timer,number,nextnum,t_row,t_cell,level;
var now_cube=[];
var next_cube=[];
var num=Math.round(Math.random() * 6);
var board=new Array(11);
var score=0;
var colors=['red','green','black','grey'];
var TetrisGame = function() {

    var pageInit = function() {

        //set table about prompt
        setTable(6,10,"next","table2");
        
        //draw the table1;
        $('.btn_draw').on('click',function() {
            t_row=$('.row').val();
            t_cell=$('.cell').val();
            level=$('.level').val();

            if( t_row<=10||t_cell<=10 ||t_row>=20 || t_cell>=30){
                alert("Rows and columns can not be less than 10 and rows can't more than 20,col can't more than 30 ! '");
                return;
            }
            $('#table1').html('');
            setTable(t_row,t_cell,"table","table1");

            //declare a array to record the status of table;
            for( var i=0;i<t_row;i++ ) {
                board[i]=[];
                for( var j=0; j<t_cell; j++ ) {
                    board[i][j] = 0;//init the '0' ,filled the '1';
                }
            }
        });
        
        //start the game;
        $('.btn_start').on('click',function() {
            beginGame(true);
        });
        
        //pause the game;
        $('.btn_pause').on('click',function() {
            console.log('board',board)
            var txt=$('.btn_pause').text();
            if( txt=='PAUSE' ) {
                clearInterval(timer);
                $('.btn_pause').text('CONTINUE');
            }
            else{
                timer = setInterval(moveDown,parseInt(1000/level));
                $('.btn_pause').text('PAUSE');
            }
        })
        document.onkeydown=keyControl;
    };

    //setTable
    var setTable = function( row,cell,child,parent ) {
        var setTable="<table id="+child+"  border=1 style='border-collapse:collapse;'>";
        for( var i=0;i<row;i++ ) {
            setTable+="<tr>";
            for( var j=0; j<cell; j++ ) {
                setTable+="<td></td>";
            }
            setTable+="</tr>"
        }
        setTable+="<table>";
        $('#'+parent).append(setTable);
    };

    //init cube
    var initCube = function(type,cube,m,n) {

        //'7' types cube;
        switch (type){
            case 0:{
                cube=[{x:m, y:n},{x:m, y:(n+1)},{x:(m+1), y:(n+1)},{x:(m+1), y:(n+2)}];//反z形
                break;
            }
            case 1:{
                cube=[{x:m,y:n},{x:(m+1), y:n},{x:m, y:(n+1)},{x:(m+1), y:(n+1)}];//田字形状
                break;
            }
            case 2:{
                cube= [{x:m,y:n},{x:m,y:(n+1)},{x:m,y:(n+2)},{x:m,y:(n+3)}];//"|"形状
                break;
            }
            case 3:{
                cube = [{x:m,y:n},{x:m,y:(n+1)},{x:(m+1), y:(n+1)},{x:(m+2), y:(n+1)}];//'L'字形状
                break;
            }
            case 4:{
                cube = [{x:m, y:(n+1)},{x:(m+1), y:(n+1)},{x:(m+2), y:(n+1)},{x:(m+2), y:n}];//"J"字形状
                break;
            }
            case 5:{
                cube = [{x:(m+1), y:n},{x:m, y:(n+1)},{x:(m+1), y:(n+1)},{x:(m+2), y:(n+1)}];//’倒T‘字形状
                break;
            }
            case 6:{
                cube = [{x:(m+1), y:n},{x:m, y:(n+1)},{x:(m+1), y:(n+1)},{x:m, y:(n+2)}];////"z"字形
                break;
            }
        };
        return cube;
    }
    
    //show next cube;
    var showNext = function() {
        $('#next tr td').removeClass('cube');
        for(var i=0; i<4; i++){
            $('#next tr').eq(next_cube[i].x).find('td').eq(next_cube[i].y).addClass('cube');
        }
    }
    
    //key event
    var keyControl = function(event) {
        var keycode=event.keyCode;
        switch(keycode){
            case 37:{
                moveLeft();
                break;
            }
            case 38:{
                rotate();
            }
            case 39:{
                moveRight()
                break;
            }
            case 40:{
                moveDown();
                break;
            }
        }
    }
    
    //beginGame
    var beginGame = function(status)  {
        if(status) {
            paintBoard(true);
            $('.score').text('0');
            $('.btn_draw').attr('disabled',true);
        };
        number=parseInt(Math.random()*3);
        now_cube=initCube(num,now_cube,0,4);
        if( !replaceOk() ) {
            alert('game over!( click restart to start)');
            $('.btn_draw').attr('disabled',false);
            return false;
        }
        paintwCube(true);
        timer = setInterval(moveDown,parseInt(1000/level));//auto moveDown
        nextnum = Math.round(Math.random() * 6);//next_num
        next_cube=initCube(nextnum,next_cube,1,4);
        showNext();
    }

    //paint or wipe the cube;
    var paintwCube = function(status) {
        for(var i=0; i<4; i++){
            if(status==true){
                $('#table tr').eq(now_cube[i].x).find('td').eq(now_cube[i].y).addClass('cube');
            }
            else{
                $('#table tr').eq(now_cube[i].x).find('td').eq(now_cube[i].y).removeClass('cube');
            }
        }
    }
    
    //update board's fill
    var updateBoard = function() {
        for(var i=0;i<4;i++){
            board[now_cube[i].x][now_cube[i].y]=1;
        }
    }
    
    //paint all board again;
    var paintBoard = function(status) {
        for(var i=0;i<t_row;i++){
            for(var j=0; j<t_cell; j++){
                var obj=$('#table tr').eq(i).find('td').eq(j);
                obj.removeClass('cube');
                if(status==true){
                    board[i][j]=0;
                }else{
                    if(board[i][j]==1) obj.addClass('cube');
                }
            }
        }
    }

    //remove the filled rows;
    var removeRows = function() {
        var rows=0;
        for(var i=0;i<t_row;i++){
            var j=0;
            for(;j<t_cell; j++){

                //judge a row is all filled;
                if(board[i][j]==0){
                    break;
                }
            }
            //if the row all filled;
            if(j==t_cell){

                //add 1 if filled rows add
                rows++;
                if(i!=0){
                    for(var k=i;k>=1;k--){
                        board[k]=board[k-1];
                    }
                }
                board[0][i] = 0;
            }
        }
        return rows;
    }

    //check direct and change the cube coordirate;
    var checkDirect = function(direct) {
        paintwCube(false);
        for(var i=0;i<4;i++){
            switch (direct){
                case 0:{
                    now_cube[i].x+=1;
                    break;
                }
                case 1:{
                    now_cube[i].y-=1;
                    break;
                }
                case 2:{
                    now_cube[i].y+=1;
                    break;
                }
            }

        }
        paintwCube(true);
    }

    //move down
    var moveDown = function() {
        
        // if don't reach the bottom
        if( checkBottom() ) {
            checkDirect(0);
        }
        //reach the bottom
        else{
            updateBoard();
            var rows=removeRows();
            //if have the filled row
            if(rows!=0){
                //update score
                score = score + rows*10;
                $(".score").text(score);
                paintBoard(false);//update board
            }
            clearInterval(timer);
            num = nextnum;
            beginGame();
        }
    }

    //move left
    var moveLeft = function() {
        for(var i=0;i<4;i++){
            if(!isOK(now_cube[i].x,now_cube[i].y-1)){
                return false;
            }
        }
        checkDirect(1);
    }

    //move right
    var moveRight = function() {
        for(var i=0;i<4;i++){
            if(!isOK(now_cube[i].x,now_cube[i].y+1)){
                return false;
            }
        }
        checkDirect(2);
    }

    //move rotate
    var rotate = function() {
        //Multidimensional Arrays can't use slice to copy,this copy will affect the original array;
        var new_cube = [];
        for(var i=0; i<4; i++){
            new_cube[i] = {x:0, y:0};
        }
        for(var i=0; i<4; i++){
            new_cube[i].x = now_cube[i].x;
            new_cube[i].y = now_cube[i].y;
        }

        //Seeking the center point of four points , and around the center
        var cx = Math.round((new_cube[0].x + new_cube[1].x + new_cube[2].x + new_cube[3].x)/4);//math.round()四舍五入，求整数；
        var cy = Math.round((new_cube[0].y + new_cube[1].y + new_cube[2].y + new_cube[3].y)/4);
        for(var i=0; i<4; i++){
            new_cube[i].x = cx+cy-now_cube[i].y;//X coordinate of the rotate point
            new_cube[i].y = cy-cx+now_cube[i].x;//Y coordinate of the rotate point
        }
        for(var i=0;i<4;i++){
            if(!isOK(new_cube[i].x,new_cube[i].y)){
                return;
            }
        }
        paintwCube(false);
        now_cube = new_cube.slice(0);
        paintwCube(true);
    }

    //judge if replaceOk
    var replaceOk = function() {
        //检查刚生产的四个小方格是否可以放在初始化的位置.
        for(var i=0; i<4; i++){
            if(!isOK(now_cube[i].x, now_cube[i].y)){
                return false;
            }
        }
        return true;
    }

    //judge if reach the bottom
    var checkBottom = function() {
        for(var i=0;i<4;i++){
            if(!isOK(now_cube[i].x+1,now_cube[i].y)){
                return false;
            }
        }
        return true;
    }

    //judge it can rotate?
    var isOK = function(x,y) {
        
        if(x>(t_row-1)||x<0||y>(t_cell-1)||y<0){
            return false;
        }
        if(board[x][y]==1){
            return false;
        }
        return true;
    }

    return {
        init: function() {
            pageInit();
        }
    }
}();