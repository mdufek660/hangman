import prompt from "readline-sync";
import wordBank from "./word-bank.js";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'process';



const dictionary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const rl=readline.createInterface({input,output})
let continueGame=true

const badGuessPhrases=["Nice try, but no", "Swing and a miss!", "Close only counts for horseshoes and hand grenades", "Oof",
						"Try again", "Wrong, but don't give up!", "Wrong again"]

//This just lets me grab a word quick and easy. Randomly generates a number from 0->length-1 and gets that word
let getWord = () => {
	return wordBank[Math.floor(Math.random()*wordBank.length)]
}

//This function takes in an int from 0-6, which represents how many wrong guesses the user has submitted
//It returns a string that corresponds to what state the hanged man should be in according to mistakes
let getDrawing = (wg) =>{
	let returnString=""
	switch(wg){
		case 0:
			return "_________\n\|\| \/\/\n\|\|\/\/\ \n\| \/\ \n\|\|\ \n\|\|\ \n\|\|_______"
		case 1:
			return "_________\n\|\| \/\/  |\n\|\|\/\/\   0\n\| \/\ \n\|\|\ \n\|\|\ \n\|\|_______"
		case 2:
			return "_________\n\|\| \/\/  |\n\|\|\/\/\   0\n\| \/\    |\n\|\|     |\n\|\| \n\|\|_______"
		case 3:
			return "_________\n\|\| \/\/  |\n\|\|\/\/\   0\n\| \/\   \\|\n\|\|     |\n\|\| \n\|\|_______"
		case 4:
			return "_________\n\|\| \/\/  |\n\|\|\/\/\   0\n\| \/\   \\|/\n\|\|     |\n\|\| \n\|\|_______"
		case 5: 
			return "_________\n\|\| \/\/  |\n\|\|\/\/\   0\n\| \/\   \\|/\n\|\|     |\n\|\|    /\n\|\|_______"
		case 6:
			return "_________\n\|\| \/\/  |\n\|\|\/\/\   0\n\| \/\   \\|/\n\|\|     |\n\|\|    / \\\n\|\|_______"
		default:
			return "\n"
	}
}

//This functions prompts the user for an input with a variable display
let getUserInput = async (textToDisplay) => {
	const answer = await rl.question(textToDisplay)
	await new Promise(r => setTimeout(r, 20));
	return answer
}

//This function takes in a string and a letter, and returns an array of all
//the index locations of the character in the string
let getLocationInWord=(phrase, letter)=>{
	let indices=[]
	for(let i=0; i<phrase.length; i++){
		if(phrase[i].toLowerCase()===letter){
			indices.push(i)
		}
	}
	return indices
}

//This function takes in a string, character, and index, and returns a new string
//where the string has been modified at the specified index with the new character
let replaceChar = (phrase, index, character) =>{
	return phrase.substring(0,index)+character+phrase.substring(index+1)
}





while(continueGame){
	let wonGames=0;
	let lostGames=0;
	console.log("About to clear")
	console.clear();
	console.log("Welcome to Hangman!\nPress Ctrl+C to exit at any time\n")
	console.log(getDrawing(0))
	let solved=false
	let guessedLetters=[]
	let currentWord=getWord()

	let wrongGuesses=0
	let guess=""

	let obscuredCW=""
	for(let i=0; i<currentWord.length; i++){
		obscuredCW+="_ "
	}
	
	let cheat=false;
	console.log(obscuredCW)
	while(!solved && wrongGuesses<6){
		//the following for loop is a method of entry validation to ensure only correct inputs get through
		let validEntry=false;

		while(!validEntry){
			guess=await getUserInput("Please enter a new guess: ")
			await new Promise(r => setTimeout(r, 2));
			if(guess=="Cheat code"){
				console.log(currentWord)
				cheat = true;
			}
			else{

				guess=guess[0].toLowerCase()
				if(dictionary.includes(guess) && !guessedLetters.includes(guess)){
					validEntry=true
				}
				else{
					console.log("Your entry of \""+guess+"\" is not valid. Try again")
				}
			}
		}

		guessedLetters.push(guess)

		if(currentWord.toLowerCase().includes(guess)){
			let locations=getLocationInWord(currentWord, guess)
			for(let index=0; index<locations.length; index++){
				let replaceAt=locations[index]*2
				obscuredCW=replaceChar(obscuredCW, replaceAt , guess)
			}
			console.log("Lucky shot, kid\n")
		}
		else{
			wrongGuesses++;
			console.log(badGuessPhrases[Math.floor(Math.random()*badGuessPhrases.length)]+"\n")
		}

		//clear and then re-draw the screen
		console.clear();
		console.log("Welcome to Hangman!\nPress Ctrl+C to exit at any time\nGames won: "+wonGames+ " Games lost: "+lostGames)
		console.log(getDrawing(wrongGuesses))
		console.log(obscuredCW +"          Previous Guesses: "+guessedLetters)

		//the following two if statements check to see if we have hit the end conditions of the game
		if(!obscuredCW.includes("_")){
			if(cheat){
				console.log("Sure you solved it, but you cheated. Was it worth it for a hollow victory?\n")
			}
			else{
				console.log("Congratulations, you solved it and saved a life!\nGuess it wasn't just luck, this time....\n")
			}
			solved=true;
			wonGames++;
			let continueInput = await getUserInput("Play again? y/n: ")
			if(continueInput[0]=="n"){
				continueGame=false;
			}
		}
		if(wrongGuesses==6){
			lostGames++;
			console.log("You failed to solve the word. It was: "+currentWord+"\n")
			let continueInput = await getUserInput("Play again? y/n: ")
			if(continueInput[0]=="n"){
				continueGame=false;
			}
		}
	}
}
console.clear()
rl.close()