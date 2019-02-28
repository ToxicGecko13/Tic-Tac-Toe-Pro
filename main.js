// Mark Harder, Basic Tic Tac Toe, Lesson 15, MHIntegrity
// setup the inital state of the board by creating our gameState variable.
// so that we can restart a new game by reinitializing the state, use a function.
// Games can be either turn based on realtime, this game is turn based.
var vm = new Vue({
    el: '#app',
    data: {
        gameState: {}
    },
    mounted: function() {
        // Vue instance's lifecyle that runs after an instance is mounted. 
        this.InitializeBoardState();
    },
    methods: {
        InitializeBoardState: function() {
            this.LoadBoardState();
        
            // Update the screen so it is ready to go for the first turn.
            this.UpdateScreenState();
        
            // add events for when the users click on squares.
            // From homework for lesson 13, only apply to emply locatons.
            document.querySelectorAll('.sq').forEach((element) => {
                if (element.innerText === "") {
                    element.addEventListener('click', this.MainGameLogic);
                };
            });
        },
        LoadBoardState: function() {
            // From homework for lesson 13
            let tempGS = localStorage.getItem("TicTacToe-Pro");
        
            if (tempGS !== null) {
                this.gameState = JSON.parse(tempGS);
            } else {
                this.ResetGame();
            }
        },
        ResetGame: function() {
            // Don't reset the win count
            let tempXWinCount = this.gameState.XWinCount === null ? 0 : this.gameState.XWinCount;
            let tempOWinCount = this.gameState.OWinCount === null ? 0 : this.gameState.OWinCount;
            let tempTieCount = this.gameState.TieWins === null ? 0 : this.gameState.TieWins;
        
            this.gameState = {
                board: [
                    ['', '', ''],
                    ['', '', ''],
                    ['', '', '']
                ],
                Next: "X",
                Winner: "",
                XWinCount: tempXWinCount,
                OWinCount: tempOWinCount,
                TieWins: tempTieCount
            };
            document.getElementById('AIPlayerMove').disabled = false;
            this.SaveBoardState();
            this.UpdateScreenState();
            // add events for when the users click on squares.
            document.querySelectorAll('.sq').forEach((element) => {
                element.addEventListener('click', this.MainGameLogic);
            });
        },
        SaveBoardState: function() {
            // From homework for lesson 13
            localStorage.setItem("TicTacToe-Pro", JSON.stringify(this.gameState));
        },
        ResetWinCount: function() {
            this.gameState.XWinCount = 0;
            this.gameState.OWinCount = 0;
            this.gameState.TieWins = 0;
            this.SaveBoardState();
            this.LoadBoardState();
            this.UpdateScreenState();
        },
        UpdateScreenState: function() {
            // Use our this.gameState data to update what is displayed on our app page
            // Now using the {{}} to update values from this.gameState.#
            
            // Update each of the board squares based on this.gameState
            for (let row = 0; row <= 2; row++) {
                for (let col = 0; col <= 2; col++) {
                    document.getElementById(row.toString() + col.toString()).innerText = this.gameState.board[row][col];
                }
            }
        },
        WinnerScreen: function(){
            // After we have a winner remove the events for remaining squares so they don't fire.
            for (let row = 0; row <= 2; row++) {
                for (let col = 0; col <= 2; col++) {
                    if (this.gameState.board[row][col] === "") {
                        document.getElementById(`${row}${col}`).removeEventListener('click', this.MainGameLogic);
                    }
                }
            }
            alert(`Game End : Winner ${this.gameState.Winner}`);
        },
        MainGameLogic: function(event) {
            // Event based game loop, called when the user click/chooses a game board square.
            // event.target.id[0] returns a string, so we need to convert it to a number.
            let row = Number(event.target.id[0]);
            let col = Number(event.target.id[1]);

            // add the next X or O
            this.gameState.board[row][col] = this.gameState.Next;
            // change the next X or O
            this.gameState.Next = this.gameState.Next === "X" ? "O" : "X";
        
            // remove the event from the grid so there is no new event
            event.target.removeEventListener('click', this.MainGameLogic);
        
            // Check to see if we have a winner
            let Winner = false;
            if (this.CheckForWinner()) {
                Winner = true;
                // After we have a winner remove the events for remaining squares so they don't fire.
                for (let row = 0; row <= 2; row++) {
                    for (let col = 0; col <= 2; col++) {
                        if (this.gameState.board[row][col] === "") {
                            document.getElementById(`${row}${col}`).removeEventListener('click', this.MainGameLogic);
                        }
                    }
                }
            };
        
            this.SaveBoardState();
            this.UpdateScreenState();
            if (Winner){
                this.WinnerScreen();
            }
        },
        TestForWin: function(TestBoard) {
            // Break out the test for a specific player win.
            // Return 'X' or 'O' of the winner, 'Tie' for a full board, '' for no current winner.
            // Changed in lesson 14
            // Setup the variable we are going to return.
            let Winner = '';
           
            // Here is the simplest logic for checking every possibility for win.
            let row1 = TestBoard[0][0] + TestBoard[0][1] + TestBoard[0][2];
            let row2 = TestBoard[1][0] + TestBoard[1][1] + TestBoard[1][2];
            let row3 = TestBoard[2][0] + TestBoard[2][1] + TestBoard[2][2];
            
            // first check to see of the board is full
            if (row1.length + row2.length + row3.length === 9) {
                Winner = "Tie";
            }
            
            // check rows for win
            if (row1 === "XXX" || row2 === "XXX" || row3 === "XXX") {
                Winner = "X";
            }
            if (row1 === "OOO" || row2 === "OOO" || row3 === "OOO") {
                Winner = "O";
            }
        
            // check cols for win
            let col1 = TestBoard[0][0] + TestBoard[1][0] + TestBoard[2][0];
            let col2 = TestBoard[0][1] + TestBoard[1][1] + TestBoard[2][1];
            let col3 = TestBoard[0][2] + TestBoard[1][2] + TestBoard[2][2];    
            if (col1 === "XXX" || col2 === "XXX" || col3 === "XXX") {
                Winner = "X";
            }
            if (col1 === "OOO" || col2 === "OOO" || col3 === "OOO") {
                Winner = "O";
            }
        
            // check diagonal for win
            let x1 = TestBoard[0][0] + TestBoard[1][1] + TestBoard[2][2];
            let x2 = TestBoard[0][2] + TestBoard[1][1] + TestBoard[2][0];
            if (x1 === "XXX" || x2 === "XXX") {
                Winner = "X";
            }
            if (x1 === "OOO" || x2 === "OOO") {
                Winner = "O";
            }
        
            return Winner;
        },
        CheckForWinner: function() {
            let Winner = this.TestForWin(this.gameState.board);
            this.gameState.Winner = Winner;
            if (Winner === "X") {
                this.gameState.XWinCount ++;
            }
            if (Winner === "O") {
                this.gameState.OWinCount ++;
            }
            if (Winner === "Tie") {
                this.gameState.TieWins ++;
            }
        
            // Return true if the a winner has been found.
            return (this.gameState.Winner.length > 0);
        },
        AIPlayerMove: function() {
            // Play the next players move Lesson16-Final
            let PlayLocations = [];
            let PlayLocation = { row: null, col: null };
            let NextPlayer = this.gameState.Next;
            let LastPlayer = this.gameState.Next === "X" ? "O" : "X";
            let Winner = false;
        
            // Strategy Steps - assumption  of all steps is that we test only empty locations
        
            // 1. Look for a winning location, by testing for a win.  
            PlayLocations = this.gameState.board.reduce((accumulator, rowArray, rowIndex) => {
                return rowArray.reduce((cellAccumulator, cell, colIndex) => {
                    if (cell === "") {
                        // Test each empty location by setting it as then testing for a win, making sure to clean it out after.
                        this.gameState.board[rowIndex][colIndex] = NextPlayer;
                        if (this.TestForWin(this.gameState.board) === NextPlayer) {
                            // Add this location as a winning location.
                            cellAccumulator.push( { row: rowIndex, col: colIndex} );
                        };
                        this.gameState.board[rowIndex][colIndex] = "";
                    };
                    return cellAccumulator;
                }, accumulator);
            }, []);
        
            // 2. Look for a blocking move, by testing as other players for a win.
            if (PlayLocations.length === 0) {
                PlayLocations = this.gameState.board.reduce((accumulator, rowArray, rowIndex) => {
                    return rowArray.reduce((cellAccumulator, cell, colIndex) => {
                        if (cell === "") {
                            // Test each empty location by setting it as then testing for a win, making sure to clean it out after.
                            this.gameState.board[rowIndex][colIndex] = LastPlayer;
                            if (this.TestForWin(this.gameState.board) === LastPlayer) {
                                // Add this location as a winning location.
                                cellAccumulator.push({ row: rowIndex, col: colIndex });
                            };
                            this.gameState.board[rowIndex][colIndex] = "";
                        };
                        return cellAccumulator;
                    }, accumulator);
                }, []);
            };
        
            // 3. If the center location is available, choose it.
            if (PlayLocations.length === 0 && this.gameState.board[1][1] === "") {
                PlayLocations.push({ row: 1, col: 1 });
            };
        
            // 4. Setup for a double potential win.
            if (PlayLocations.length === 0 && this.gameState.board[1][1] === NextPlayer) {
                // Check to see if there is an opponent on the side next to the location, this is preferred
                if (this.gameState.board[0][0] === "" && this.gameState.board[2][2] === "") {
                    if (this.gameState.board[0][1] === LastPlayer || this.gameState.board[1][0] === LastPlayer) {
                        PlayLocations.push({ row: 0, col: 0});
                    }
                    if (this.gameState.board[1][2] === LastPlayer || this.gameState.board[2][1] === LastPlayer) {
                        PlayLocations.push({ row: 2, col: 2});
                    }
                }
                if (this.gameState.board[0][2] === "" && this.gameState.board[2][0] === "") {
                    if (this.gameState.board[0][1] === LastPlayer || this.gameState.board[1][2] === LastPlayer) {
                        PlayLocations.push({ row: 0, col: 2});
                    }
                    if (this.gameState.board[1][0] === LastPlayer || this.gameState.board[2][1] === LastPlayer) {
                        PlayLocations.push({ row: 2, col: 0});
                    }
                }
            }
        
            // 5. check for available opposing corners.  
            if (PlayLocations.length === 0) {
                // Check to see if there is an opponent on the side next to the location, this is preferred
                if (this.gameState.board[0][0] === "" && this.gameState.board[2][2] === "") {
                    PlayLocations.push({ row: 0, col: 0});
                    PlayLocations.push({ row: 2, col: 2});
                }
                if (this.gameState.board[0][2] === "" && this.gameState.board[2][0] === "") {
                    PlayLocations.push({ row: 0, col: 2});
                    PlayLocations.push({ row: 2, col: 0});
                }
            }
        
            // 6. randomly select a location
            if (PlayLocations.length === 0) {
                PlayLocations = this.gameState.board.reduce((accumulator, rowArray, rowIndex) => {
                    // Call map on the rowArray to add any empty location to an array we are returning.
                    return rowArray.reduce( (cellAccumulator, cell, colIndex) => {
                        return (cell === "") ? cellAccumulator.concat( { row: rowIndex, col: colIndex} ) : cellAccumulator;
                    }, accumulator );
                }, []);
            }
            if (PlayLocations.length > 0) {
                // randomly choose a location from your choices
                let index = Math.floor(Math.random() * PlayLocations.length);
                PlayLocation = { row: PlayLocations[index].row, col: PlayLocations[index].col };
        
                // assign the ai location
                this.gameState.board[PlayLocation.row][PlayLocation.col] = NextPlayer;
                // change the next X or O
                this.gameState.Next = this.gameState.Next === "X" ? "O" : "X";
                // remove the event from the grid so there is no new event
                document.getElementById(`${PlayLocation.row}${PlayLocation.col}`).removeEventListener('click', this.MainGameLogic);
                // Check to see if we have a winner
                if (this.CheckForWinner()) {
                    Winner = true;
                };
                this.SaveBoardState();
            };
            this.UpdateScreenState();
            if (Winner) {
                this.WinnerScreen();
            }
        }
        // end of Vue methods
    }
});
