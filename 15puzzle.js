
let width = 4;
let height = 4;
let container = document.getElementById('board-container');
let bgsuccess = "#33eb42", fcsuccess = "#8b2828";
let bgnormal = "#113606", fcnormal = "#00ffff";
let time = 0, moves = 0;
let time_interval;

oldstats_update();

//updates the best time and least number of moves from the localstorage
function oldstats_update() {
    let besttime = localStorage.getItem('time');
    let leastmoves = localStorage.getItem('leastmoves');
    if(besttime!=null && leastmoves!=null)
        {
        besttime=parseInt(besttime);
        let mins = parseInt(besttime / 60);
        let seconds = besttime % 60;
        if (mins < 10) mins = "0" + String(mins);
        else mins = String(mins);
        if (seconds < 10) seconds = "0" + String(seconds);
        else seconds = String(seconds);
        document.getElementById("besttime").innerText = mins + " : " + seconds;
        document.getElementById("leastmoves").innerText=leastmoves;
    }
    else {
        document.getElementById("oldstats").style.display="none";
    }
}


function inputlengths() {
    // let starttime = performance.now();
    let starttime = performance.now();
    height = parseInt(document.getElementById('getheight').value);
    width = (document.getElementById('getwidth').value);
    if (height > 10 || width > 10 || height < 2 || width < 2) {
        alert('The values of height and width should be in the range 2 to 10');
        return;
    }
    drawboard(width, height);
    shuffle();
    window.clearInterval(time_interval);
    moves = 0;
    time = 0;
    flag = false;
    document.getElementById('num').innerText=String(width*height-1);
    adding_event_listeners_on_drawing_board();
    document.getElementById('inputlenghts').style.display = 'none';
    document.getElementById('won').style.display='none';
    document.getElementById('instructions').style.display='flex';
    document.getElementById('clearstorage').style.display='flex';
    document.getElementById('reset').style.display = 'flex';
    document.getElementById('stats').style.display = 'flex';
    // document.getElementById('oldstats').style.display = 'flex';
    document.getElementById('time').style.display = 'block';
    document.getElementById('time').innerText = String(String(0)+String(0)+" : "+String(0)+String(0));
    document.getElementById('moves').style.display
    document.getElementById('board-container').style.display = 'flex';
    let endtime = performance.now();
    console.log(endtime-starttime);
}

function drawboard(width, height) {
    let id = 1;

    // creating rows
    for (let i = 1; i <= height; i++) {
        let row = document.createElement('div');
        row.classList.add('row');
        row.id = "row" + (i);

        // let container = document.getElementById('board-container');
        container.appendChild(row);
        //creating columns
        for (let j = 1; j <= width; j++) {
            let cell = document.createElement('span');
            cell.classList.add('cell');
            cell.id = "row" + i + "column" + j;
            cell.innerHTML = String(id);
            if (i < height || j < width)
                cell.classList.add("Tile" + id);
            row.appendChild(cell);
            // console.log(cell);
            id++;
        }
    }
    document.getElementById('row' + height + 'column' + width).classList.add("empty");
    document.getElementById('row' + height + 'column' + width).innerText = "";
    
}


function shuffle() {
    for (let row = 1; row <= height; row++) {
        for (let column = 1; column <= width; column++) {

            var row2 = Math.floor(Math.random() * height + 1);
            var column2 = Math.floor(Math.random() * width + 1);
            swaptiles("row" + row + "column" + column, "row" + row2 + "column" + column2);
        }
    }
}


function swaptiles(id1, id2) {
    let temp = document.getElementById(id2).className;
    document.getElementById(id2).className = document.getElementById(id1).className;
    document.getElementById(id1).className = temp;
    temp = document.getElementById(id2).innerText;
    document.getElementById(id2).innerText = document.getElementById(id1).innerText;
    document.getElementById(id1).innerText = temp;
    if (moves == 0) {
        time_tracker();
    }
    moves++;
}



function colorchanger() {
    let num = 1, success = 0;
    for (let i = 1; i <= height; i++) {
        for (let j = 1; j <= width; j++) {
            let text = document.getElementById('row' + i + 'column' + j).innerText;
            text = parseInt(text);
            if (text == num || text == num - 1) {
                document.getElementById('row' + i + 'column' + j).style.backgroundColor = bgsuccess;
                document.getElementById('row' + i + 'column' + j).style.color = fcsuccess;
                success++;
            }
            else {
                document.getElementById('row' + i + 'column' + j).style.backgroundColor = bgnormal;
                document.getElementById('row' + i + 'column' + j).style.color = fcnormal;
            }
            num++;
        }
    }
    return success;
}


function adding_event_listeners_on_drawing_board() {
    //mouse click control event listener
   for (let i = 1; i <= height; i++) {
    for (let j = 1; j <= width; j++) {
        let id = "row" + i + "column" + j;
        document.getElementById(id).addEventListener('click', function () {
            let emptytile = (document.getElementsByClassName('empty'))[0];
            let emptyid = emptytile.id; //e.g. ---> row2column3
            let emptyrow = emptyid[3], emptycol = emptyid[10];
            let currentrow = (this.id)[3], currentcolumn = (this.id)[10];
            if (currentrow == emptyrow || currentcolumn == emptycol) {
                swaptiles(id,emptyid);
            }
            ifwon(colorchanger());
            document.getElementById('moves').innerText = String(moves);
        });
    }
}
    


    //keyboard key control event listener
    document.onkeydown = function (e) {
        let emptytile = (document.getElementsByClassName('empty'))[0];
        let emptyid = emptytile.id;
        let emptyrow = emptyid[3], emptycol = emptyid[10];
        switch (e.code) {
            case "ArrowLeft":
                if (parseInt(emptycol) + 1 <= width) {
                    let swapid = "row" + emptyrow + "column" + String(parseInt(emptycol) + 1);
                    swaptiles(emptyid, swapid);
                    ifwon(colorchanger());
                }
                break;
            case "ArrowUp":
                if (parseInt(emptyrow) + 1 <= height) {
                    let swapid = "row" + String(parseInt(emptyrow) + 1) + "column" + emptycol;
                    swaptiles(emptyid, swapid);
                    ifwon(colorchanger());
                }

                break;
            case "ArrowRight":
                if (parseInt(emptycol) - 1 > 0) {
                    let swapid = "row" + emptyrow + "column" + String(parseInt(emptycol) - 1);
                    swaptiles(emptyid, swapid);
                    ifwon(colorchanger());
                }
                break;
            case "ArrowDown":
                if (parseInt(emptyrow) - 1 > 0) {
                    let swapid = "row" + String(parseInt(emptyrow) - 1) + "column" + emptycol;
                    swaptiles(emptyid, swapid);
                    ifwon(colorchanger());
                }
                break;
        }
        document.getElementById('moves').innerText = String(moves);
    };

}


function time_tracker() {
    time_interval = setInterval(() => {
        time = time + 1;
        let mins = parseInt(time / 60);
        let seconds = time % 60;
        if (mins < 10) mins = "0" + String(mins);
        else mins = String(mins);
        if (seconds < 10) seconds = "0" + String(seconds);
        else seconds = String(seconds);
        document.getElementById("time").innerText = mins + " : " + seconds;
    }, 1000);
}


function reset() {
    window.clearInterval(time_interval);
    shuffle();
    colorchanger();
    document.getElementById('won').style.display='none';
    time = 0;
    moves = 0;
    document.getElementById('time').innerText = String(String(0)+String(0)+" : "+String(0)+String(0));
    document.getElementById('moves').innerText = String(moves);
    document.getElementById('oldstats').style.display = "flex";
}


function ifwon(success_count) {
    if (success_count >= width * height - 1) {
        window.clearInterval(time_interval);
        document.getElementById("won").style.display='flex';
        document.getElementById("won").innerHTML = "Congratulations! You have successfully finished this game. <br> <div>Number of moves taken : <span class='result'>" + moves + "</span></div><div>Amount of Time taken : <span class='result'>" + document.getElementById("time").innerText + "</span> mins</div>";
        document.getElementById("board-container").style.fontSize = "3rem";


        let besttime = localStorage.getItem('time');
        let leastmoves = localStorage.getItem('leastmoves');

        //if the local storage is empty
        if (besttime == null || leastmoves == null) {
            localStorage.setItem('time', String(time));
            localStorage.setItem('leastmoves', String(moves));

            // dynamically display these values in the 'oldstats' class
            let mins=parseInt(time/60);
            let seconds=parseInt(time%60);
            if (mins < 10) mins = "0" + String(mins);
            else mins = String(mins);
            if (seconds < 10) seconds = "0" + String(seconds);
            else seconds = String(seconds);
            document.getElementById("besttime").innerText = mins + " : " + seconds;
            document.getElementById("leastmoves").innerText=moves;

            document.getElementById('oldstats').style.display = "flex";
        }
        else {
            if (parseInt(besttime) > time) {
                localStorage.removeItem('time');
                localStorage.setItem('time', String(time));
                let mins=parseInt(time/60);
                let seconds=parseInt(time%60);
                if (mins < 10) mins = "0" + String(mins);
                else mins = String(mins);
                if (seconds < 10) seconds = "0" + String(seconds);
                else seconds = String(seconds);
                document.getElementById("besttime").innerText = mins + " : " + seconds;
            }
            if (parseInt(leastmoves) > moves) {
                document.getElementById('leastmoves').innerHTML = moves;
                localStorage.removeItem('leastmoves')
                localStorage.setItem('leastmoves', String(moves));
            }
            document.getElementById('oldstats').style.display = "flex";
        }
    }
}

function clearrecords(){
    localStorage.removeItem('time');
    localStorage.removeItem('leastmoves');
    document.getElementById("oldstats").style.display="none";
}
