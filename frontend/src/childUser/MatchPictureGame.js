import React, { useState, useEffect } from 'react';
import './MatchPictureGame.css';
import axios from 'axios';

// Use the environment variable for the Pexels API key
const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;

const categoryMapping = {
    Animals: ["cats", "dog", "bird", "rabbit", "penguin", "elephant", "panda", "fish", "cow", "goat"],
    Furnitures: ["chair", "wardrobe", "sofa", "drawer", "lamp", "bookshelf", "bench", "curtain", "fan", "television"],
    Insects: ["flies", "ant", "centipede", "grasshopper", "ladybug", "dragonfly", "mosquito", "butterfly", "bee", "tick"],
    Clothings: ["tshirt", "shoes", "socks", "dress", "hat", "swim suit", "scarf", "coat", "blouse", "skirt"],
    Flowers: ["sunflower", "rose", "daisy", "lily", "tulip", "cherry blossom", "lotus", "lavender", "chrysanthemum", "orchid"],
    Vegetables: ["broccoli", "tomatoes", "cucumber", "potatoes", "onion", "corn", "carrot", "mushroom", "ginger", "cabbage"],
    Fruits: ["cherry", "grape", "strawberry", "apple", "watermelon", "mango", "banana", "durian", "blueberry", "kiwi"],
    Nationalflag: ["Malaysia flag", "Singapore flag", "Australia flag", "Canada flag", "USA flag", "Korea flag", "Republic of China flag", "United Kingdom flag", "France flag", "Germany flag" ],
    Food: ["ice cream", "meat", "cola", "fruit", "cake", "chocolate", "cookies", "vegetables", "burger", "sushi"],
    Hobbies: ["jogging","dancing", "badminton", "swimming", "singing", "painting", "reading", "camping", "writing", "horse riding"]
};

const MatchPictureGame = () => {
    const [pictures, setPictures] = useState([]);
    const [words, setWords] = useState([]);
    const [correctMatches, setCorrectMatches] = useState(0);
    const [score, setScore] = useState(0);
    const [showCongrats, setShowCongrats] = useState(false);
    const [draggedWord, setDraggedWord] = useState(null);
    const [time, setTime] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        startTimer();
        fetchPexelsPictures(); // Fetch pictures when the component loads
    }, []);

    // Function to randomly select a category 
    const getRandomCategory = () => {
        const categories = Object.keys(categoryMapping);  
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];  
    };

    // Function to randomly select 5 subcategories from the selected category
    const getRandomSubcategories = (category) => {
        const subcategories = categoryMapping[category];  // Get subcategories for the selected category
        const shuffled = subcategories.sort(() => 0.5 - Math.random());  // Shuffle the array
        return shuffled.slice(0, 5);  // Return 5 random subcategories
    };

    // Function to get additional 5 distractor words
    const getAdditionalWords = (selectedSubcategories, category) => {
        const allSubcategories = categoryMapping[category];  // Get all subcategories in the selected category
        const remainingSubcategories = allSubcategories.filter(subcategory => !selectedSubcategories.includes(subcategory));
        const shuffled = remainingSubcategories.sort(() => 0.5 - Math.random());  // Shuffle the remaining subcategories
        return shuffled.slice(0, 5);  // Get 5 distractor words
    };

    
    // Function to fetch pictures for each selected subcategory
    const fetchPexelsPictures = async () => {
        try {
            const selectedCategory = getRandomCategory();  // Get a random category (e.g., Animals, Food, etc.)
            console.log("Selected Category:", selectedCategory);  

            const selectedSubcategories = getRandomSubcategories(selectedCategory);  // Get 5 random subcategories
            console.log("Selected Subcategories:", selectedSubcategories);  

            const picturePromises = selectedSubcategories.map(async (subcategory) => {
                const response = await axios.get('https://api.pexels.com/v1/search', {
                    headers: {
                        Authorization: PEXELS_API_KEY
                    },
                    params: {
                        query: subcategory,
                        per_page: 1  
                    }
                });
                const photo = response.data.photos[0];
                return {
                    id: photo.id,
                    imageUrl: photo.src.medium,
                    name: subcategory  
                };
            });

            const allPictures = await Promise.all(picturePromises);
            setPictures(allPictures);

            // Get 5 additional distractor words
            const additionalWords = getAdditionalWords(selectedSubcategories, selectedCategory);

            // Combine correct and distractor words, then shuffle them
            const allWords = [...selectedSubcategories, ...additionalWords].sort(() => 0.5 - Math.random());
            setWords(allWords);  // Set the final shuffled list of 10 words

        } catch (error) {
            console.error('Error fetching pictures from Pexels:', error);
        }
    };

    const startTimer = () => {
        const newIntervalId = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);
        setIntervalId(newIntervalId);
    };

    const stopTimer = () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    };

    const handleCorrectMatch = (matchedPicture) => {
        setScore(score + 1);
        setCorrectMatches(correctMatches + 1);

        // Remove the matched picture from the pictures array
        setPictures((prevPictures) => prevPictures.filter((picture) => picture.id !== matchedPicture.id));

        if (correctMatches + 1 === 5) {
            setShowCongrats(true);
            stopTimer();
        }
    };

    const handleIncorrectMatch = () => {
        setScore(score - 1);
    };

    const handleDragStart = (word) => {
        setDraggedWord(word);
    };

    const handleDrop = (picture) => {
        if (draggedWord === picture.name) {
            handleCorrectMatch(picture);
        } else {
            handleIncorrectMatch();
        }
        setDraggedWord(null);
    };

    const allowDrop = (event) => {
        event.preventDefault();
    };

    const closeModal = () => {
        setShowCongrats(false);
        resetGame();
    };

    const resetGame = () => {
        stopTimer();
        setScore(0);
        setCorrectMatches(0);
        setTime(0);
        fetchPexelsPictures();  // Fetch new pictures for a new game
        startTimer();
    };

    return (
        <div className="game-container">
            <h1>Drag the word to match the pictures</h1>

            <div>
                <p>Score: {score}</p>
                <p>Time: {time} seconds</p>
            </div>

            <div className="picture-grid">
                {pictures.map((picture, index) => (
                    <div 
                        key={index} 
                        className="picture-container" 
                        onDrop={() => handleDrop(picture)} 
                        onDragOver={allowDrop} 
                    >
                        <img src={picture.imageUrl} alt={picture.name} className="game-image" />
                    </div>
                ))}
            </div>

            <div className="word-grid">
                {words.map((word, index) => (
                    <div 
                        key={index} 
                        className="word-container" 
                        draggable 
                        onDragStart={() => handleDragStart(word)}
                    >
                        <p>{word}</p>
                    </div>
                ))}
            </div>

            <div className={`congrats-popup ${showCongrats ? 'show' : ''}`}>
                <button className="close-btn" onClick={closeModal}>&times;</button>
                <h2>Congratulations!</h2>
                <p>Your total score is: {score}/5</p>
                <p>Total time used: {time} seconds</p>
            </div>
        </div>
    );
};

export default MatchPictureGame;
