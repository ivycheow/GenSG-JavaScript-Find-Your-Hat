// TO NOTE: 
// x represents columns; y represents rows 

const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

// Create a new Field class
class Field{
    constructor(field = [[]]){
        this._field = field;
        this._field[0][0]=pathCharacter; // Define the starting point of pathCharacter
        this.locationX = 0; //To keep track current position of the player within the field for columns
        this.locationY = 0; //To keep track current position of the player within the field for heights
    }

    //Get user input on the size of the gameField
    gameFieldSize(){
        //To create a loop and ensure that user has fulfilled the input criteria of using number between 1 to 10
        while(true){
            this.gameFieldHeight = parseInt(prompt('Please input the height of the game field in number between 1 and 10 --->'));
            if(this.gameFieldHeight >= 1 && this.gameFieldHeight <= 10){
                break;
            } else{
                console.log('Please choose the height of the game field between 1 and 10')
            }
        }
        
        while(true){
            this.gameFieldWidth = parseInt(prompt('Please input the width of the game field in number between 1 and 10 --->'));
            if(this.gameFieldWidth >= 1 && this.gameFieldWidth <= 10){
                break;
            } else{
                console.log('Please choose the width of the game field between 1 and 10')
            }
        }

        return {height:this.gameFieldHeight, width: this.gameFieldWidth}
    }

    //Generate a randomised Field with 3 params: height, width, percentage (percentage of field to be covered with holes)
    //gameField should be a 2D array -> gameField[rowIndex - y][columnIndex - x]
    static generateField(gameFieldHeight, gameFieldWidth, percentage=0.2){
        //Create a new array to be used as the height of the field
        let field = new Array(gameFieldHeight);

        //Create another array nested within the above array for width and restricted by the height specified
        for(let i = 0; i < field.length; i++){
            field[i] = new Array(gameFieldWidth);

            //Create a nested loop to loop through the columns and add individual elements
            for(let j = 0; j < field[i].length; j++){
                //Generate a random number between 0 to 1 but less than 1 
                const randomNumber = Math.random();
                //Where randomNumber is higher than the percentage specified, fieldCharacter will be added otherwise holes will be added
                field[i][j] = randomNumber > percentage ? fieldCharacter : hole;
            }
        }

        //Generate random hat location in field
        let hatLocation;
        do {
            hatLocation = {
                //Represents which column will the hat be at 
                x: Math.floor(Math.random() * gameFieldWidth),
                //Represents which row will the hat be at 
                y: Math.floor(Math.random() * gameFieldHeight)
            };
        } while(field[hatLocation.y] === undefined || field[hatLocation.y][hatLocation.x] === undefined);

        //Based on the random number generated above for the respective row and column, it will be the coordinate of where the hat will be 
        field[hatLocation.y][hatLocation.x] = hat;
        return field
    }

    //Method to concatenate the field generated into a string without array square brackets and comma
    displayField(){
        const fieldString = this._field.join('\n');
        console.log(fieldString)
    }

    //Display instructions on top of the gameField using template string
    instructions(){
        console.log(`\nWELCOME TO FIND THE HAT CHALLENGE\n\n***INSTRUCTIONS***\nType U, D, L, R (Up, Down, Left, Right) and hit Enter to find the hat.\n`)
    }

    //Obtain user's input on the movement and show it on the console
    userInputOnMovements(){
        const answer = prompt('Which way do you want to go --->').toLowerCase();
        switch(answer){
            case "u":
                this.locationY -= 1; //Where 'u' key is pressed, pathCharacter will move up by 1 row 
                break;
            case 'd':
                this.locationY += 1; //Where 'd' key is pressed, pathCharacter will move down by 1 row 
                break;
            case 'l':
                this.locationX -= 1; //Where 'l' key is pressed, pathCharacter will move left by 1 column 
                break;
            case 'r':
                this.locationX += 1; //Where 'l' key is pressed, pathCharacter will move right by 1 column
                break;
            default:
                console.log('Invalid key selected. Enter U, D, L, R.')
                this.userInputOnMovements();
                break;
        }
    }

    //To check if the user has found the hat
    isHat(){
        return this._field[this.locationY][this.locationX] === hat;
    }
    
    //To check if the user has fell into a hole
    isHole(){
        return this._field[this.locationY][this.locationX] === hole;
    }

    //To check if the user's movement is in bounds within the gameField
    isInBound(){
        return(
            this.locationY >= 0 &&
            this.locationX >= 0 &&
            this.locationY < this._field.length &&
            this.locationX < this._field[0].length
        )
    }

    //Initiate new game 
    playGame(){
        //Set playing tyo active
        let playingGame = true;
        //Invoke method -> instructions 
        this.instructions();
        //Execute while playing 
        while(playingGame){
            this.displayField() //Display field in string format
            this.userInputOnMovements() //Obtain user's input on movements
            if(!this.isInBound()){ //If the user's movement is out of bound 
                console.log('Oops, out of bound! You Lost!');
                playingGame = false;
                break;
            } else if(this.isHole()){ //If the user's movement fell into a hole
                console.log('Oops, you fell into a hole! You Lost!');
                playingGame = false;
                break;
            } else if(this.isHat()){ //If the user found the hat
                console.log('Congrats! You have found the hat!');
                playingGame = false;
                break;
            }
        
        //Show user's movement on the gameField
        this._field[this.locationY][this.locationX] = pathCharacter
        }
    }
}

const size = new Field().gameFieldSize();
const newField = new Field(Field.generateField(size.height, size.width, 0.2));
newField.playGame();