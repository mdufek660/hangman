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
	switch(wg){
		case 0:
			return "\n"
		case 1:
			return " 0 \n"
		case 2:
			return " 0 \n | \n | \n"
		case 3:
			return " 0 \n\\| \n | \n"
		case 4:
			return " 0 \n\\|/ \n | \n"
		case 5: 
			return " 0 \n\\|/ \n | \n/ \n"
		case 6:
			return " 0 \n\\|/ \n | \n/ \\\n"
		default:
			return "\n"
	}
}

//This functions prompts the user for an input with a variable display
let getUserInput = async (textToDisplay) => {
	const answer = await rl.question(textToDisplay)
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
	console.log("Welcome to Hangman!\nPress Ctrl+C to exit at any time\n")

	let solved=false
	let guessedLetters=[]
	let currentWord=getWord()

	let wrongGuesses=0
	let guess=""

	let obscuredCW=""
	for(let i=0; i<currentWord.length; i++){
		obscuredCW+="_ "
	}
	console.log(obscuredCW)
	while(!solved && wrongGuesses<6){

		//the following for loop is a method of entry validation to ensure only correct inputs get through
		let validEntry=false;
		while(!validEntry){
			guess=await getUserInput("Please enter a new guess: ")
			guess=guess[0].toLowerCase()
			if(dictionary.includes(guess) && !guessedLetters.includes(guess)){
				validEntry=true
			}
			else{
				console.log("Your entry of \""+guess+"\" is not valid. Try again")
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

		console.log(getDrawing(wrongGuesses))
		console.log(obscuredCW +"          Previous Guesses: "+guessedLetters)
		if(!obscuredCW.includes("_")){
			console.log("Congratulations, you solved it and saved a life!\nGuess it wasn't just luck, this time....\n")
			solved=true;
		}
		if(wrongGuesses==6){
			console.log("You failed to solve the word. It was: "+currentWord+"\n\n")
		}
	}
}


// console.log(await getUserInput("What is your next guess?"))
rl.close()