document.addEventListener('DOMContentLoaded', () => {

    wordData.then((responseWord) => {
        // log the returned word to the console for reference
        console.log(responseWord[0].word);
        const textLength = responseWord[0].word.length;
        const splitGeneratedWord = responseWord[0].word.split("");
        const inputText = document.getElementsByTagName('input');
        const missedLetters = document.getElementById('missed_letters');
        const newWordButton = document.querySelector('.new-word');
        const actionText = document.querySelector('.action-information-text');
        const mainContainer = document.getElementById('main_container');
        const allInputs = $('input');
        inputText[0].focus(); //Set the focus on one of boxes, prior to having them coloured as soon as the page loads

        //define the keys that are not accepted in our input boxes
        for (let input of inputText) {
            input.addEventListener('keydown', (e) => {
                //Disable number input possibility
                if (e.keyCode >= 48 && e.keyCode <= 57) {
                    e.preventDefault();
                }
                //Disable special character input (ex: . , ;' ][\]) and the tab key
                if (e.keyCode >= 104 && e.keyCode <= 222 || e.keyCode === 9) {
                    e.preventDefault();
                }
            })
        }

        // called in our two different outcomes : winning the game or losing the game, changing the page's appearance
        function changePageStyle() {
            newWordButton.style.visibility = 'visible';
            actionText.style.visibility = 'visible';
            mainContainer.style.opacity = '0.2';
            allInputs.prop('disabled', true);
        }

        // activate the number of boxes based on the returned word's length
        for (var i = textLength - 1; i >= 0; i--) {
            inputText[i].classList.remove('inactive');
            inputText[i].classList.add('active');
        }

        // disable the remaining boxes that won't be filled, entirely.
        for (let element of document.querySelectorAll('.inactive')) {
            element.setAttribute('disabled', 'disabled');
        }

        //counter to increment, select and display images in the order in which they appear in the DOM
        let pictureCounter = 0;
        //counter that will be incremented and used to track the wrong inserted letters
        let missedLetterCounter = 0;
        //an array in which we push our guessed letters to have it as a reference for comparison purposes later on
        let guessedLetter = [];

        //BELOW this line we define everything that happens after we type a letter in a box
        const activeBoxes = document.querySelectorAll('.active');
        let typedInLetters;
        for (let activeBox of activeBoxes) {
            activeBox.addEventListener('keyup', (e) => {
                typedInLetters = activeBox.value;
                //empty all the inputs
                activeBox.value = '';

                //a variable which will act as a helper for our flow control to display the different Hang man parts
                let switcher = false;
                for (let i = 0; i < textLength; i++) {
                    if (splitGeneratedWord[i] === typedInLetters) {
                        $('.active').eq(i).attr('placeholder', splitGeneratedWord[i]);
                        switcher = true;
                        if (typedInLetters != guessedLetter) {
                            guessedLetter.push(typedInLetters);
                        } else {
                            return false;
                        }
                    }
                }
                //filter the array with the pushed correct keys to remove duplicates
                guessedLetter = guessedLetter.filter(function(element, index) {
                    return guessedLetter.indexOf(element) === index;
                });

                //set up a function to call inside the loop below on the winning section, to avoid putting it directly inside for optimization purposes
                function winFunction() {
                    return setTimeout(function() {
                        changePageStyle(); //call the function to change the page display and bring up the "New Word" button
                        document.querySelector('.winning-message').style.visibility = 'visible';
                    }, 50);
                }

                //SECTION that handles winning the game

                let occurence = "";
                for (let i = 0; i < splitGeneratedWord.length; i++) {
                    for (let j = 0; j < guessedLetter.length; j++) {
                        if (guessedLetter[j] === splitGeneratedWord[i]) {
                            occurence += guessedLetter[j];
                            if (occurence.length === textLength) {
                                winFunction();
                                if (e.key === 13) {
                                    window.location.reload(true);
                                }
                            }
                            break;
                        }
                    }
                }

                //SECTION that handles losing the game
                let textMissedLetters = missedLetters.innerText;
                if (!switcher && typedInLetters != false) {
                    for (let k = 0, len = textMissedLetters.length; k < len; k++) {
                        if (typedInLetters === textMissedLetters[k]) {
                            return false;
                        }
                    }
                    missedLetters.append(typedInLetters);
                    $('#hangMan img').eq(pictureCounter).css('visibility', 'visible');
                    pictureCounter++;
                    missedLetterCounter++;
                }
                //Set a time out function to allow the last element in the hangman to have to be displayed before displaying the game over screen
                setTimeout(function() {
                    if (missedLetterCounter > 10) {
                        changePageStyle(); //call the function to change the page display and bring up the "New Word" button
                        $('.game-over-message').css('visibility', 'visible');
                        $('.word-information').css('visibility', 'visible');
                        $('.word-information').append('Your word was: ' + '<span class="generated-word">' + responseWord[0].word + '</span>');
                    }
                }, 1);
            })
        }

        //Refresh the page when clicking on the "New Word" button
        $('.new-word').click(function() {
            window.location.reload(true);
        });
        // Promise rejection/Error handling in case no word comes through
    }).catch(() => {
        alert('Slow down SAILOR!! No word was returned. Please refresh the page!');
    });
});
