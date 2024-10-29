import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './StorytellingGame.css';
import Modal from "../containers/modal/Modal";
import useModal from "../containers/hooks/useModal";
import { useNavigate } from "react-router-dom";

// Use the environment variable for the Pexels API key
const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;

// Story templates for each category
const storyTemplates = {
    "Dogs": [
    "One sunny day, [NAME] the adventurous [DOG], wandered into a hidden garden in the [PLACE]. While exploring, [NAME] discovered a mysterious [DISCOVERY], which led them on a thrilling adventure alongside [FRIEND].",
    "[NAME] the brave [DOG] was playing in the [PLACE] when they stumbled upon a secret tunnel. Curious, [NAME] entered and soon found [DISCOVERY]. With the help of [FRIEND], they unlocked its magical powers.",
    "In the heart of the [PLACE], [NAME] the loyal [DOG] found a map leading to an ancient tower. Alongside their trusted companion, [FRIEND], they searched for [DISCOVERY] and embarked on an unforgettable journey.",
    "On a rainy evening, [NAME] the clever [DOG], heard a strange sound coming from the [PLACE]. With [FRIEND] by their side, they discovered [DISCOVERY], and together they solved the mystery.",
    "In the middle of a bustling market in the [PLACE], [NAME] the curious [DOG] uncovered an old chest. Inside, they found [DISCOVERY], which set them on an unexpected quest with [FRIEND].",
    "One quiet afternoon, [NAME] the friendly [DOG], met [FRIEND] in the [PLACE]. Together, they stumbled upon [DISCOVERY], leading them to a magical adventure beyond their wildest dreams."
   ],
    "Birds": [
        "In the sky, a bird named [NAME] soared over the [PLACE]. It was looking for the [DISCOVERY] and met [FRIEND] along the way, who helped find it.",
        "[NAME], the little bird, was curious about the world. It flew across the [PLACE] and discovered [DISCOVERY] hidden among the clouds.",
        "One bright morning, [NAME] the [BIRD] ,decided to explore the colorful [PLACE]. Along the way, [NAME] found [DISCOVERY] and invited [FRIEND] to join the fun.",
        "As the sun began to set, [NAME], a wise old [BIRD], perched on a branch in [PLACE] and shared stories of [DISCOVERY] with young birds eager to listen.",
        "Flying over the sparkling lake in [PLACE], [NAME] the [BIRD] ,discovered a magical reflection that led to [DISCOVERY], a place of wonder and joy.",
        "[NAME], the adventurous [BIRD], heard rumors of a hidden treasure in [PLACE]. With [FRIEND] by its side, [NAME] set off to uncover the mystery behind [DISCOVERY]."
    ],
    "Bugs": [
        "In a vibrant garden, [NAME] the [BUG] ,discovered a secret tunnel leading to [PLACE]. With a sense of adventure, [NAME] crawled through and found [DISCOVERY].",
        "[NAME], a curious little [BUG], loved to explore the flowers. One sunny day, [NAME] found [DISCOVERY], which led to a thrilling chase with [FRIEND] in [PLACE].",
        "Once upon a time, [NAME] the [BUG] buzzed through the [PLACE], searching for [DISCOVERY]. Along the way, [NAME] teamed up with [FRIEND] to solve a puzzling mystery.",
        "In a bustling ant colony, [NAME], a brave little [BUG], learned of a great treasure hidden in [PLACE]. With the help of [FRIEND], [NAME] set off on an epic adventure.",
        "[NAME] the [BUG] enjoyed racing through the leaves of [PLACE]. One day, [NAME] discovered [DISCOVERY] that changed everything and made new friends along the way."
    ],
    "Fish": [
        "Deep in the ocean, [NAME] the [FISH] swam through colorful coral reefs in search of [DISCOVERY]. Along the way, [NAME] met [FRIEND], who shared an incredible secret.",
        "[NAME], a playful little [FISH], loved to explore the hidden caves of [PLACE]. One day, [NAME] stumbled upon [DISCOVERY] and invited [FRIEND] to join the adventure.",
        "In the clear waters of [PLACE], [NAME] the [FISH] heard rumors of a magical pearl that granted wishes. With [FRIEND] by its side, [NAME] set out to find it.",
        "While gliding through the currents of [PLACE], [NAME] the wise old [FISH] shared stories of ancient treasures and the legends surrounding [DISCOVERY].",
        "One sunny day, [NAME] the [FISH] found a map that led to [DISCOVERY]. Excited, [NAME] gathered a group of friends for an unforgettable underwater journey."
    ],
    "Dinosaurs": [
        "In a prehistoric jungle, [NAME] the [DINOSAUR] ,discovered an ancient cave that held secrets about [DISCOVERY]. With bravery, [NAME] entered and uncovered its mysteries.",
        "[NAME], a playful little [DINOSAUR], loved to roam the valleys. One day, [NAME] found a fossil that led to an exciting adventure with [FRIEND] in [PLACE].",
        "Once upon a time, [NAME] the [DINOSAUR] ,roamed the plains of [PLACE], searching for [DISCOVERY]. Along the way, [NAME] made a new friend, [FRIEND], who shared in the adventure.",
        "While exploring the lush forests of [PLACE], [NAME], the clever [DINOSAUR], stumbled upon a hidden valley filled with [DISCOVERY] and friends waiting to play.",
        "In the land of dinosaurs, [NAME] the [DINOSAUR] ,discovered a magical egg that held the key to [DISCOVERY]. With [FRIEND], they went on a quest to protect it."
    ],
    "Toys": [
        "In a child's room, [NAME] the [TOY] came to life and discovered a magical door leading to [PLACE]. With excitement, [NAME] stepped through and found [DISCOVERY].",
        "[NAME], a cheerful [TOY], loved to play with friends. One day, [NAME] found [DISCOVERY] in the toy box that led to an unexpected adventure in [PLACE].",
        "Once upon a time, [NAME] the [TOY] woke up to find a mysterious map in the playroom. It promised a journey to [PLACE] and a hidden treasure: [DISCOVERY].",
        "In the world of toys, [NAME] the [TOY] gathered all its friends for a quest to find [DISCOVERY]. Together, they ventured into the magical realm of [PLACE].",
        "[NAME], the brave little [TOY], discovered a forgotten toy in the attic of [PLACE]. Together, they set off on an adventure to uncover its magical history and [DISCOVERY]."
    ],
    "Superheroes": [
        "In the bustling city of [PLACE], [NAME] the [SUPERHERO] discovered a hidden lair that contained [DISCOVERY]. With courage, [NAME] vowed to protect it from villains.",
        "[NAME], a young [SUPERHERO], loved to help people in need. One day, while flying over [PLACE], [NAME] found [DISCOVERY] and teamed up with [FRIEND] to save the day.",
        "Once upon a time, [NAME] the [SUPERHERO] was faced with a challenging mission in [PLACE]. With [FRIEND] by their side, they sought to uncover [DISCOVERY] and thwart the evil plan.",
        "In the heart of [PLACE], [NAME] the [SUPERHERO] heard a call for help. Racing to the scene, [NAME] discovered [DISCOVERY], which could change everything for the city.",
        "[NAME], the clever [SUPERHERO], found an ancient artifact while on patrol in [PLACE]. With its powers, [NAME] and [FRIEND] embarked on a thrilling adventure."
    ],
    "Fairy Tales": [
        "In a magical forest, [NAME] the brave hero discovered a hidden castle in [PLACE]. Inside, [NAME] found [DISCOVERY] that would change the kingdom forever.",
        "[NAME], a kind-hearted princess, dreamed of adventure beyond her castle. One day, she stumbled upon [DISCOVERY] in the enchanted garden of [PLACE].",
        "Once upon a time, [NAME] the [CHARACTER] traveled through [PLACE] on a quest to find [DISCOVERY]. Along the way, [NAME] encountered magical creatures and forged new friendships.",
        "In a world filled with magic, [NAME], a clever [CHARACTER], found an ancient book in [PLACE]. Its pages revealed secrets about [DISCOVERY] that would grant wishes.",
        "[NAME], a gentle giant, lived in the hills of [PLACE]. One day, [NAME] discovered a hidden treasure, [DISCOVERY], that brought joy to the entire village."
    ],
    "Princesses": [
        "In a beautiful kingdom, Princess [NAME] discovered a hidden door in her castle that led to [PLACE]. Inside, she found [DISCOVERY], a gift for her people.",
        "Princess [NAME] loved to explore the gardens of [PLACE]. One sunny afternoon, she discovered [DISCOVERY] and embarked on a magical adventure with [FRIEND].",
        "Once upon a time, Princess [NAME] faced a challenge in [PLACE]. With the help of her friends, she sought [DISCOVERY] to save her kingdom from danger.",
        "In the royal library of [PLACE], Princess [NAME] uncovered a mysterious book that held the key to [DISCOVERY]. Excited, she gathered her friends for a quest.",
        "Princess [NAME] dreamed of adventure beyond the palace walls. One day, she discovered [DISCOVERY] hidden in [PLACE] and set off to share it with her kingdom."
    ],
    "Cars": [
        "In a bustling city, [NAME] the race car found a secret track that led to [PLACE]. With excitement, [NAME] raced to discover [DISCOVERY] waiting at the finish line.",
        "[NAME], a cheerful little car, loved to zoom around the streets of [PLACE]. One day, [NAME] found [DISCOVERY] that led to an incredible journey with [FRIEND].",
        "Once upon a time, [NAME] the speedy car entered a grand race in [PLACE]. Along the way, [NAME] discovered [DISCOVERY] that changed everything for the racers.",
        "In the heart of [PLACE], [NAME] the vintage car stumbled upon a hidden garage filled with magical gadgets and [DISCOVERY] waiting to be discovered.",
        "[NAME], the clever car, loved solving puzzles. One day, while driving through [PLACE], [NAME] found [DISCOVERY] that needed to be unlocked with a special key."
    ],
    "Trains": [
        "In a lively train station, [NAME] the locomotive discovered a hidden track that led to [PLACE]. With excitement, [NAME] chugged along to find [DISCOVERY].",
        "[NAME], a friendly little train, loved to travel through the mountains of [PLACE]. One day, [NAME] stumbled upon [DISCOVERY] and invited [FRIEND] for an adventure.",
        "Once upon a time, [NAME] the brave train set off on a journey to [PLACE]. Along the way, [NAME] discovered [DISCOVERY] that brought joy to everyone aboard.",
        "In a magical land of trains, [NAME] the engineer found an ancient map in [PLACE]. It promised a route to [DISCOVERY], and excitement filled the air.",
        "[NAME], a steam train, loved telling stories of adventure. One day, it discovered [DISCOVERY] hidden in the valleys of [PLACE] and shared it with its passengers."
    ],
    "Planes": [
        "In a bustling airport, [NAME] the airplane took off on a journey to [PLACE]. Along the way, [NAME] discovered [DISCOVERY] that changed the course of its flight.",
        "[NAME], a cheerful little plane, loved to soar through the clouds. One day, it spotted [DISCOVERY] in the distance and raced to share the excitement with [FRIEND].",
        "Once upon a time, [NAME] the brave pilot flew over [PLACE]. With [FRIEND] by its side, [NAME] embarked on an adventure to find [DISCOVERY] hidden in the skies.",
        "In the world of aviation, [NAME] the legendary plane found an ancient compass in [PLACE]. Its magic led to [DISCOVERY] and opened new horizons.",
        "[NAME], the adventurous plane, discovered a secret landing strip in [PLACE]. Excited, it shared the news with [FRIEND] and planned a fantastic journey."
    ],
    "Bikes": [
        "In a sunny park, [NAME] the bicycle, found a hidden trail that led to [PLACE]. With enthusiasm, [NAME] pedaled along to discover [DISCOVERY].",
        "[NAME], a bright red bike, loved to ride through the streets of [PLACE]. One day, it found [DISCOVERY] that led to an unexpected adventure with [FRIEND].",
        "Once upon a time, [NAME] the bike raced down a hill in [PLACE]. Along the way, it discovered [DISCOVERY] and invited [FRIEND] for a thrilling ride.",
        "In a world of bikes, [NAME] the speedy bicycle found an old map in [PLACE]. It promised a journey to [DISCOVERY] and a chance to explore new paths.",
        "[NAME], the clever bike, loved to solve riddles. One day, while cruising through [PLACE], [NAME] found [DISCOVERY] that held the key to a hidden adventure."
    ],
    "Sports": [
        "In a vibrant stadium, [NAME] the athlete prepared for the big game in [PLACE]. With determination, [NAME] sought [DISCOVERY] that would lead to victory.",
        "[NAME], a young soccer player, loved to practice in the fields of [PLACE]. One day, [NAME] found [DISCOVERY] that led to an unforgettable match with [FRIEND].",
        "Once upon a time, [NAME] the basketball star dreamed of winning the championship in [PLACE]. With hard work, [NAME] discovered [DISCOVERY] that made all the difference.",
        "In a world of sports, [NAME] the champion swimmer found a secret training ground in [PLACE]. There, [NAME] discovered [DISCOVERY] that improved their skills.",
        "[NAME], a dedicated runner, prepared for the marathon in [PLACE]. With perseverance, [NAME] found [DISCOVERY] that inspired their journey to the finish line."
    ],
    "Cats": [
    "In the quiet streets of the city, [NAME] the curious [CAT] wandered into [PLACE], where a hidden world of magic awaited. There, [NAME] uncovered [DISCOVERY] with the help of [FRIEND].",
    "[NAME], a graceful [CAT], loved to nap in the sun. One day, [NAME] awoke in [PLACE] and found [DISCOVERY]. This led [NAME] on an adventure with [FRIEND] to uncover its mysteries.",
    "In the peaceful garden of [PLACE], [NAME] the clever [CAT] was playing when they discovered [DISCOVERY]. Together with [FRIEND], they embarked on a quest to unlock its secrets.",
    "[NAME], a playful [CAT], was always exploring. One day, [NAME] ventured into [PLACE] and found [DISCOVERY]. With [FRIEND] by their side, they set off on a magical journey.",
    "In the enchanted woods of [PLACE], [NAME] the brave [CAT] heard rumors of [DISCOVERY]. With [FRIEND] at their side, [NAME] set out to find it, leading to an unforgettable adventure.",
    "While exploring [PLACE], [NAME] the adventurous [CAT] stumbled upon [DISCOVERY]. Intrigued, [NAME] joined forces with [FRIEND] to discover its hidden powers."
    ],
    "Robots": [
        "In a futuristic city, [NAME] the robot whirred to life, traveling to [PLACE]. There, [NAME] discovered [DISCOVERY], sparking an unexpected adventure with [FRIEND].",
        "[NAME], a highly intelligent robot, was on a mission in [PLACE]. While searching for clues, [NAME] uncovered [DISCOVERY], which held the key to a great mystery.",
        "Once upon a time, [NAME] the robot inventor built a new device in [PLACE]. But when [DISCOVERY] was found, it led to a surprising adventure with a fellow machine.",
        "In a world of robots, [NAME] the friendly android discovered an old blueprint in [PLACE]. The plans revealed [DISCOVERY], sparking a quest to complete an unfinished project.",
        "[NAME], a quick-witted robot, enjoyed solving problems. One day, while exploring [PLACE], [NAME] found [DISCOVERY], which led to an unexpected partnership with [FRIEND]."
    ],
    "Monsters": [
        "Deep in the forest, [NAME] the monster roared with excitement when it found a hidden path to [PLACE]. There, [NAME] uncovered [DISCOVERY] that sparked a wild adventure.",
        "[NAME], a shy but curious monster, wandered into the caves of [PLACE]. Inside, [NAME] found [DISCOVERY] that introduced them to a new friend, [FRIEND].",
        "Once upon a night under the full moon, [NAME] the monster crept through [PLACE]. Along the way, they discovered [DISCOVERY], which led them to an unexpected journey.",
        "In a world of creatures, [NAME] the mighty monster stumbled upon an ancient artifact in [PLACE]. The discovery of [DISCOVERY] brought an exciting challenge to [NAME]'s peaceful life.",
        "[NAME], a friendly monster, loved to explore the dark woods of [PLACE]. One day, [NAME] uncovered [DISCOVERY], leading to a surprising adventure with [FRIEND]."
    ],
    "Magic": [
        "In the enchanted forest of [PLACE], [NAME] the young wizard discovered [DISCOVERY] that unlocked their hidden powers.",
        "[NAME], a gifted sorcerer, found an old spellbook in [PLACE]. Inside, they discovered [DISCOVERY], leading to a magical journey with [FRIEND].",
        "Once upon a time in a magical land, [NAME] the witch brewed a potion that revealed [DISCOVERY], sending them on an unexpected adventure.",
        "In a world of magic, [NAME] the apprentice mage found a hidden portal in [PLACE]. The portal led to [DISCOVERY], which began an incredible adventure.",
        "[NAME], a talented wizard, was practicing spells in [PLACE] when they stumbled upon [DISCOVERY], starting an unexpected journey with their magical companion, [FRIEND]."
    ],
    "Castles": [
        "High atop the hills in [PLACE], [NAME] the knight rode toward the ancient castle where [DISCOVERY] awaited.",
        "[NAME], the brave ruler of the castle, discovered [DISCOVERY] in the forgotten chambers of [PLACE], leading to an exciting quest with [FRIEND].",
        "Once upon a time, [NAME] the squire ventured into the castle of [PLACE] and discovered [DISCOVERY], sparking an unforgettable adventure.",
        "In a world of castles and kings, [NAME] the daring prince uncovered a secret door in [PLACE]. Behind it lay [DISCOVERY], which led them on a dangerous mission.",
        "[NAME], a noble warrior, was guarding the castle of [PLACE] when they discovered [DISCOVERY], which set off an epic journey with [FRIEND]."
    ],
    "Pirates": [
        "Aboard the ship in [PLACE], [NAME] the pirate captain scanned the horizon for [DISCOVERY], setting sail toward a thrilling adventure.",
        "[NAME], the fearless pirate, found a mysterious map in [PLACE]. It led them to [DISCOVERY], sparking a treasure hunt with [FRIEND].",
        "Once upon the high seas, [NAME] the pirate sailed toward [PLACE], where they discovered [DISCOVERY], starting an unforgettable journey.",
        "In a world of pirates and treasure, [NAME] the cunning pirate captain uncovered a chest in [PLACE]. Inside was [DISCOVERY], leading to a dangerous voyage.",
        "[NAME], a young sailor aboard a pirate ship, found [DISCOVERY] hidden in [PLACE], beginning an unexpected quest for fortune with [FRIEND]."
    ],
    "Mermaids": [
        "Beneath the ocean in [PLACE], [NAME] the mermaid swam through the reefs, discovering [DISCOVERY] that led to a grand adventure.",
        "[NAME], a curious mermaid, found a hidden cave in [PLACE]. Inside, they uncovered [DISCOVERY], which led to an unforgettable journey with [FRIEND].",
        "Once upon a time in the depths of the sea, [NAME] the mermaid explored [PLACE] and discovered [DISCOVERY], leading them to a magical encounter.",
        "In a world of underwater wonders, [NAME] the mermaid princess found a pearl in [PLACE]. The pearl contained [DISCOVERY], starting a journey into the unknown.",
        "[NAME], a playful mermaid, loved to explore the waters of [PLACE]. One day, [NAME] found [DISCOVERY], sparking an exciting adventure with their ocean friends."
    ],
    "Rainbows": [
        "In a land beyond the clouds, [NAME] followed the bright rainbow to [PLACE]. At the end, they discovered [DISCOVERY], leading to an adventure full of color.",
        "[NAME], a cheerful explorer, saw a rainbow stretching over [PLACE]. They followed it to [DISCOVERY], beginning a magical journey with [FRIEND].",
        "Once upon a time, [NAME] chased a rainbow through [PLACE]. At its end, they uncovered [DISCOVERY], starting an exciting adventure.",
        "In a world where rainbows sparkled in the sky, [NAME] found a hidden path under one in [PLACE]. There, they discovered [DISCOVERY], which led them to unexpected wonders.",
        "[NAME], a lover of all things magical, followed a rainbow through [PLACE]. When they arrived, they found [DISCOVERY], starting a journey filled with joy and surprises."
    ],
    "Candy": [
        "In the sweet world of [PLACE], [NAME] the candy maker discovered [DISCOVERY], setting off a delicious adventure with [FRIEND].",
        "[NAME], a curious child, wandered through [PLACE], the land of candy, and found [DISCOVERY], leading to a sugary surprise.",
        "Once upon a time, [NAME] visited the candy factory in [PLACE]. There, they uncovered [DISCOVERY], which led to a fun and flavorful journey.",
        "In a world of sweets and treats, [NAME] the candy chef found a secret recipe in [PLACE]. This recipe contained [DISCOVERY], starting a mouthwatering adventure.",
        "[NAME], with a sweet tooth, explored the candy village of [PLACE]. During their adventure, they stumbled upon [DISCOVERY], leading to a tasty new journey."
    ],
    "Jungle": [
        "Deep in the jungle of [PLACE], [NAME] the explorer trekked through thick vines and trees to discover [DISCOVERY], leading to a wild adventure.",
        "[NAME], an adventurer, ventured into the jungle of [PLACE]. There, they uncovered [DISCOVERY], beginning an unforgettable journey with [FRIEND].",
        "Once upon a time, [NAME] the jungle guide led a group through [PLACE]. Along the way, they found [DISCOVERY], which changed their journey forever.",
        "In the dense jungles of [PLACE], [NAME] the explorer stumbled upon an ancient temple hiding [DISCOVERY], sparking a thrilling adventure.",
        "[NAME], a brave traveler, wandered into the jungle of [PLACE]. There, they uncovered [DISCOVERY], which led them on a wild journey with [FRIEND]."
    ],
    "Farm": [
        "On a sunny day at [PLACE] farm, [NAME] the farmer found [DISCOVERY], which led to an exciting adventure with the animals.",
        "[NAME], a young farmer, loved working on [PLACE]. One day, they discovered [DISCOVERY], sparking an unforgettable farm adventure.",
        "Once upon a time on the [PLACE] farm, [NAME] was taking care of the animals when they found [DISCOVERY], which started a surprising journey.",
        "In a world full of crops and animals, [NAME] the farmer discovered something magical in [PLACE]. It was [DISCOVERY], which led them to an unexpected adventure.",
        "[NAME], a happy farmer, explored the fields of [PLACE]. There, they found [DISCOVERY], starting a new journey with their farm friends."
    ],
    "Zoo": [
        "At [PLACE] zoo, [NAME] the zookeeper discovered [DISCOVERY], leading to a day of exciting animal adventures.",
        "[NAME], a young visitor at the zoo, wandered through [PLACE] and found [DISCOVERY], starting an unexpected adventure with [FRIEND].",
        "Once upon a time, [NAME] the zookeeper noticed something unusual in [PLACE]. There, they uncovered [DISCOVERY], sparking a thrilling journey.",
        "In the busy zoo of [PLACE], [NAME] the animal caretaker found [DISCOVERY], which led to a day full of excitement with the animals.",
        "[NAME], an adventurous animal lover, visited [PLACE] zoo. They found [DISCOVERY] there, beginning an unforgettable adventure with the zoo animals."
    ],
    "Ocean": [
        "Beneath the waves of [PLACE], [NAME] the ocean explorer swam through coral reefs and discovered [DISCOVERY], starting an undersea adventure.",
        "[NAME], a young diver, explored the deep ocean of [PLACE]. While swimming, they found [DISCOVERY], beginning a watery journey with [FRIEND].",
        "Once upon a time, [NAME] the oceanographer was researching marine life in [PLACE]. There, they discovered [DISCOVERY], which led to an amazing underwater adventure.",
        "In a world beneath the waves, [NAME] the sea explorer found a mysterious cave in [PLACE]. Inside, they uncovered [DISCOVERY], starting a deep-sea adventure.",
        "[NAME], a curious ocean adventurer, was diving in [PLACE] when they stumbled upon [DISCOVERY], which led them on an exciting journey under the sea."
    ],
    "Forest": [
        "In the dense forest of [PLACE], [NAME] the adventurer trekked through towering trees and discovered [DISCOVERY], starting a woodland adventure.",
        "[NAME], a brave explorer, wandered through the forest of [PLACE]. Along the way, they uncovered [DISCOVERY], which began an exciting journey with [FRIEND].",
        "Once upon a time, [NAME] the forest ranger was patrolling [PLACE] when they found [DISCOVERY], sparking a thrilling adventure through the trees.",
        "In the quiet forests of [PLACE], [NAME] the nature lover stumbled upon [DISCOVERY], leading to a mysterious and exciting adventure.",
        "[NAME], a fearless hiker, wandered deep into the forest of [PLACE]. There, they uncovered [DISCOVERY], which led to an unforgettable adventure with [FRIEND]."
    ],
    "Mountains": [
        "High in the mountains of [PLACE], [NAME] the climber reached new heights and discovered [DISCOVERY], leading to an exciting adventure above the clouds.",
        "[NAME], a daring mountain explorer, set out on a journey to [PLACE]. Along the way, they uncovered [DISCOVERY], which began a thrilling adventure with [FRIEND].",
        "Once upon a time, [NAME] the mountaineer was scaling the peaks of [PLACE] when they discovered [DISCOVERY], which changed their journey forever.",
        "In a world of towering mountains, [NAME] the explorer found a hidden cave in [PLACE]. Inside, they uncovered [DISCOVERY], leading to an epic adventure.",
        "[NAME], an experienced climber, was hiking through the mountains of [PLACE] when they stumbled upon [DISCOVERY], beginning a challenging and rewarding journey."
    ],
    "Camping": [
        "In the quiet woods of [PLACE], [NAME] set up camp and discovered [DISCOVERY], leading to a night full of adventure under the stars.",
        "[NAME], an excited camper, hiked through [PLACE] with their friends. Along the way, they uncovered [DISCOVERY], sparking an unforgettable camping trip.",
        "Once upon a time, [NAME] the camper pitched a tent in [PLACE]. During the night, they found [DISCOVERY], leading to an exciting outdoor adventure.",
        "In a world of campfires and tents, [NAME] discovered a hidden trail in [PLACE]. The trail led to [DISCOVERY], beginning a thrilling camping adventure.",
        "[NAME], a seasoned camper, loved exploring new places. While camping in [PLACE], they uncovered [DISCOVERY], which made for an unforgettable night around the fire."
    ],
    "Adventure": [
        "In the wild lands of [PLACE], [NAME] the adventurer set off on a journey and discovered [DISCOVERY], beginning an exciting adventure like no other.",
        "[NAME], always seeking excitement, ventured to [PLACE] with [FRIEND]. There, they uncovered [DISCOVERY], sparking an incredible adventure.",
        "Once upon a time, [NAME] set out on a grand adventure through [PLACE]. Along the way, they found [DISCOVERY], leading them on a thrilling journey.",
        "In a world filled with exploration, [NAME] traveled to [PLACE] in search of adventure. They discovered [DISCOVERY], starting an unforgettable journey.",
        "[NAME], a fearless explorer, wandered into [PLACE] with [FRIEND]. Together, they discovered [DISCOVERY], which set off an exciting adventure filled with surprises."
    ],
    "Treasure": [
        "In a dusty old map, [NAME] the treasure hunter found a clue that led them to [PLACE]. There, they uncovered [DISCOVERY], beginning a thrilling treasure hunt.",
        "[NAME], always searching for hidden riches, ventured to [PLACE] with [FRIEND]. Together, they found [DISCOVERY], sparking an unforgettable treasure adventure.",
        "Once upon a time, [NAME] followed a treasure map to [PLACE]. Along the way, they discovered [DISCOVERY], leading to a treasure hunt beyond their wildest dreams.",
        "In a world of hidden riches, [NAME] uncovered an ancient chest in [PLACE]. Inside was [DISCOVERY], starting a daring treasure-seeking journey.",
        "[NAME], a brave adventurer, sailed to [PLACE] in search of treasure. They uncovered [DISCOVERY], which led them on a challenging but rewarding quest for gold."
    ],
    "Friendship": [
        "In the bustling town of [PLACE], [NAME] met [FRIEND], and together they discovered [DISCOVERY], which deepened their bond of friendship.",
        "[NAME], always looking for adventure, met [FRIEND] in [PLACE]. Together, they found [DISCOVERY], leading to a fun and exciting journey that strengthened their friendship.",
        "Once upon a time, [NAME] and [FRIEND] set off on a journey through [PLACE]. Along the way, they uncovered [DISCOVERY], creating memories that would last a lifetime.",
        "In a world where friendship is key, [NAME] and [FRIEND] traveled to [PLACE]. There, they discovered [DISCOVERY], leading to an unforgettable adventure together.",
        "[NAME], a loyal friend, and [FRIEND] embarked on a journey through [PLACE]. Along the way, they uncovered [DISCOVERY], which brought them even closer together."
    ],
    "Weather": [
        "In the stormy skies above [PLACE], [NAME] noticed [DISCOVERY] in the clouds, leading to an adventure that changed the way they saw the weather forever.",
        "[NAME], a weather enthusiast, was exploring [PLACE] when they uncovered [DISCOVERY], leading to a thrilling journey through rain and shine.",
        "Once upon a time, [NAME] was caught in a storm in [PLACE]. As the rain poured down, they found [DISCOVERY], sparking an unexpected adventure in the weather.",
        "In a world where the weather changes in an instant, [NAME] discovered [DISCOVERY] during a snowstorm in [PLACE], leading to a surprising weather-related journey.",
        "[NAME], always fascinated by the weather, traveled to [PLACE] during a heatwave. There, they found [DISCOVERY], which led them on an exciting adventure in the elements."
    ],
    "Seasons": [
        "In the vibrant autumn of [PLACE], [NAME] discovered [DISCOVERY], leading to a magical adventure through the changing seasons.",
        "[NAME], a lover of the outdoors, explored [PLACE] during the spring. There, they uncovered [DISCOVERY], beginning a journey through the blooming season.",
        "Once upon a time, [NAME] set out on a journey during winter in [PLACE]. While trekking through the snow, they found [DISCOVERY], which sparked a frosty adventure.",
        "In a world where the seasons shift like magic, [NAME] ventured to [PLACE] during summer. There, they uncovered [DISCOVERY], leading to a sunny, warm adventure.",
        "[NAME], always fascinated by the changing seasons, traveled to [PLACE] in the fall. They discovered [DISCOVERY], which began an adventure full of colorful surprises."
    ],
    "Holidays": [
        "In the festive town of [PLACE], [NAME] celebrated the holiday by discovering [DISCOVERY], which led to a magical and heartwarming adventure.",
        "[NAME], excited for the holidays, visited [PLACE] with [FRIEND]. Together, they found [DISCOVERY], starting a joyful holiday journey.",
        "Once upon a holiday season, [NAME] traveled to [PLACE] to enjoy the festivities. While there, they discovered [DISCOVERY], making the holiday unforgettable.",
        "In a world full of celebrations, [NAME] found a special holiday surprise in [PLACE]. This [DISCOVERY] started an adventure full of holiday cheer and excitement.",
        "[NAME], a lover of holiday traditions, explored [PLACE] with [FRIEND]. During their adventure, they uncovered [DISCOVERY], making it the best holiday ever."
    ],
    "School": [
        "At [PLACE] school, [NAME] the student discovered [DISCOVERY], which led to an unexpected and exciting school adventure with [FRIEND].",
        "[NAME], a curious learner, was exploring the halls of [PLACE] school when they uncovered [DISCOVERY], sparking an unforgettable educational journey.",
        "Once upon a time at [PLACE] school, [NAME] was working on a project when they discovered [DISCOVERY], leading to a surprising and fun adventure.",
        "In a world of classrooms and learning, [NAME] found something unusual in [PLACE]. The discovery of [DISCOVERY] led to an exciting school day with [FRIEND].",
        "[NAME], a bright and eager student, loved going to [PLACE] school. One day, they stumbled upon [DISCOVERY], which made for the most exciting school day ever."
    ],
    "Family": [
        "In the cozy home of [PLACE], [NAME] and their family discovered [DISCOVERY], leading to a heartwarming adventure filled with love and laughter.",
        "[NAME], enjoying a family outing in [PLACE], stumbled upon [DISCOVERY] with [FAMILY_MEMBER]. Together, they experienced a memorable family adventure.",
        "Once upon a time, [NAME] and their family traveled to [PLACE]. There, they uncovered [DISCOVERY], making it a family adventure they would never forget.",
        "In a world full of family fun, [NAME] and their siblings explored [PLACE]. During their journey, they found [DISCOVERY], leading to an exciting family adventure.",
        "[NAME], always enjoying family time, was spending the day with [FAMILY_MEMBER] in [PLACE]. They discovered [DISCOVERY], which brought them closer together in an unforgettable way."
    ],
    "Music": [
        "In the music-filled streets of [PLACE], [NAME] heard a melody that led them to [DISCOVERY], beginning an adventure full of rhythm and harmony.",
        "[NAME], a talented musician, was playing their instrument in [PLACE] when they discovered [DISCOVERY], sparking a magical musical journey with [FRIEND].",
        "Once upon a time, [NAME] attended a concert in [PLACE]. During the performance, they found [DISCOVERY], leading them on a musical adventure.",
        "In a world of melodies and songs, [NAME] stumbled upon an old instrument in [PLACE]. The sound of [DISCOVERY] started a musical journey like no other.",
        "[NAME], who loved to make music, was playing in [PLACE] when they discovered [DISCOVERY]. It led them on an unforgettable journey filled with rhythm and joy."
    ],
    "Dance": [
        "In the lively dance hall of [PLACE], [NAME] twirled and spun, discovering [DISCOVERY], which led to an exciting dance-filled adventure with [FRIEND].",
        "[NAME], a skilled dancer, was performing in [PLACE] when they found [DISCOVERY], sparking a journey full of dance and excitement.",
        "Once upon a time, [NAME] attended a dance competition in [PLACE]. During the event, they uncovered [DISCOVERY], leading to a thrilling adventure on the dance floor.",
        "In a world where music and movement collided, [NAME] discovered a hidden dance studio in [PLACE]. Inside, they found [DISCOVERY], which started an unforgettable dance journey.",
        "[NAME], always eager to dance, was practicing in [PLACE] when they uncovered [DISCOVERY], which led to an amazing dance adventure with [FRIEND]."
    ],
    "Painting": [
        "In the colorful streets of [PLACE], [NAME] found an old easel and began painting. During their work, they uncovered [DISCOVERY], starting a creative adventure.",
        "[NAME], a young artist, was painting in [PLACE] when they discovered [DISCOVERY], leading to a beautiful and artistic journey with [FRIEND].",
        "Once upon a time, [NAME] was creating art in [PLACE]. As they painted, they found [DISCOVERY], which led them on an inspiring and artistic adventure.",
        "In a world of vibrant colors and creativity, [NAME] stumbled upon a forgotten painting in [PLACE]. The discovery of [DISCOVERY] led to an artistic journey full of wonder.",
        "[NAME], always passionate about art, was painting in [PLACE] when they uncovered [DISCOVERY], beginning an exciting and colorful artistic journey."
    ],
    "Balloons": [
        "In the bright and cheerful skies above [PLACE], [NAME] watched as balloons floated by. One balloon led them to [DISCOVERY], sparking an adventure full of wonder.",
        "[NAME], at a balloon festival in [PLACE], discovered [DISCOVERY] with [FRIEND]. Together, they experienced a magical journey that soared through the skies.",
        "Once upon a time, [NAME] followed a trail of balloons through [PLACE]. At the end, they found [DISCOVERY], leading to an exciting and uplifting adventure.",
        "In a world filled with colorful balloons, [NAME] discovered a hidden balloon workshop in [PLACE]. Inside, they found [DISCOVERY], which led to a joyful journey.",
        "[NAME], who loved balloons, was celebrating in [PLACE] when they uncovered [DISCOVERY], which took them on a whimsical and fun adventure with [FRIEND]."
    ],
    "Circus": [
        "In the big top of [PLACE], [NAME] watched as the circus performers dazzled the crowd. Behind the scenes, they discovered [DISCOVERY], leading to an exciting circus adventure.",
        "[NAME], a curious visitor at the circus in [PLACE], wandered backstage and uncovered [DISCOVERY], sparking a thrilling journey with the performers.",
        "Once upon a time, [NAME] attended the circus in [PLACE]. During the show, they found [DISCOVERY], leading to a spectacular and unexpected adventure.",
        "In a world full of acrobats and clowns, [NAME] found a secret passage at the circus in [PLACE]. Inside, they discovered [DISCOVERY], which led to a magical circus adventure.",
        "[NAME], a lover of the circus, was watching a show in [PLACE] when they uncovered [DISCOVERY], leading them to an unforgettable circus journey with [FRIEND]."
    ],
    "Gardening": [
        "In the peaceful garden of [PLACE], [NAME] the gardener was tending to plants when they uncovered [DISCOVERY], leading to a blooming adventure.",
        "[NAME], an enthusiastic gardener, was planting seeds in [PLACE] when they discovered [DISCOVERY], sparking an exciting journey of growth and nature.",
        "Once upon a time, [NAME] was working in their garden in [PLACE]. While digging, they found [DISCOVERY], which led to a surprising and beautiful gardening adventure.",
        "In a world where plants grow tall and strong, [NAME] discovered an ancient seed in [PLACE]. Planting it revealed [DISCOVERY], starting a magical gardening journey.",
        "[NAME], always enjoying the outdoors, was gardening in [PLACE] when they uncovered [DISCOVERY], leading to an adventure full of nature’s wonders."
    ],
    "Ice Cream": [
        "In the colorful ice cream shop in [PLACE], [NAME] discovered [DISCOVERY], leading to a delicious and sweet adventure with [FRIEND].",
        "[NAME], a lover of ice cream, was enjoying a cone in [PLACE] when they uncovered [DISCOVERY], sparking a fun and tasty journey.",
        "Once upon a time, [NAME] visited an ice cream parlor in [PLACE]. There, they found [DISCOVERY], which led them on a scrumptious adventure.",
        "In a world full of sweet treats, [NAME] uncovered a secret flavor in [PLACE]. This flavor, [DISCOVERY], led to a delightful and flavorful ice cream adventure.",
        "[NAME], always excited for ice cream, was at [PLACE] when they found [DISCOVERY], leading to a fun-filled and delicious journey with [FRIEND]."
    ],
    "Bubbles": [
        "In the park at [PLACE], [NAME] blew giant bubbles that floated high in the sky. One bubble led them to [DISCOVERY], sparking an exciting bubble-filled adventure.",
        "[NAME], a lover of bubbles, was playing in [PLACE] when they saw a magical bubble. Inside was [DISCOVERY], leading to a surprising and playful journey.",
        "Once upon a time, [NAME] was blowing bubbles in [PLACE] when they discovered [DISCOVERY], which led them on a fun and whimsical adventure.",
        "In a world where bubbles floated everywhere, [NAME] followed a giant bubble through [PLACE]. The bubble led to [DISCOVERY], starting a bubbly and exciting journey.",
        "[NAME], always fascinated by bubbles, was at [PLACE] when they found [DISCOVERY] inside a shimmering bubble, leading to a fun and magical bubble-filled adventure."
    ],
    "Birthday Parties": [
        "At a birthday party in [PLACE], [NAME] discovered [DISCOVERY], which led to a fun and exciting birthday adventure with [FRIEND].",
        "[NAME], excited for their birthday, was celebrating in [PLACE] when they found [DISCOVERY], sparking an unforgettable birthday journey.",
        "Once upon a time, [NAME] was at a birthday party in [PLACE]. During the festivities, they uncovered [DISCOVERY], leading to a joyful and surprising birthday adventure.",
        "In a world full of balloons and cake, [NAME] was celebrating their birthday in [PLACE] when they discovered [DISCOVERY], making it the most special birthday yet.",
        "[NAME], always ready for fun, was at a birthday party in [PLACE] when they found [DISCOVERY], leading to an exciting and fun-filled birthday celebration."
    ],
    "Rockets": [
        "In the rocket launch pad of [PLACE], [NAME] the astronaut prepared for takeoff. During their mission, they discovered [DISCOVERY], leading to an out-of-this-world adventure.",
        "[NAME], a young space enthusiast, was at the rocket station in [PLACE] when they uncovered [DISCOVERY], sparking a thrilling space adventure.",
        "Once upon a time, [NAME] boarded a rocket in [PLACE]. During their journey, they discovered [DISCOVERY], leading to an exciting space exploration.",
        "In a world of rockets and stars, [NAME] launched from [PLACE] and discovered [DISCOVERY] among the stars, beginning an incredible space adventure.",
        "[NAME], always dreaming of space, was watching rockets launch in [PLACE] when they found [DISCOVERY], leading them on an unforgettable rocket-fueled journey."
    ],
    "Underwater Adventure": [
        "Beneath the waves in [PLACE], [NAME] the diver swam through the coral reefs and discovered [DISCOVERY], starting an exciting underwater adventure.",
        "[NAME], an underwater explorer, was diving in [PLACE] when they uncovered [DISCOVERY], leading to an amazing underwater journey with [FRIEND].",
        "Once upon a time, [NAME] explored the ocean depths in [PLACE]. There, they discovered [DISCOVERY], sparking an unforgettable underwater adventure.",
        "In a world beneath the sea, [NAME] found a hidden cave in [PLACE]. Inside, they uncovered [DISCOVERY], starting a magical underwater journey.",
        "[NAME], a curious diver, was exploring the ocean in [PLACE] when they found [DISCOVERY], leading to an exciting and wondrous underwater adventure."
    ],
    "Magic Show": [
        "At the magic show in [PLACE], [NAME] watched in awe as tricks and illusions dazzled the crowd. Behind the scenes, they discovered [DISCOVERY], leading to a magical adventure.",
        "[NAME], a fan of magic, was attending a show in [PLACE] when they uncovered [DISCOVERY], sparking a surprising and magical journey with [FRIEND].",
        "Once upon a time, [NAME] went to a magic show in [PLACE]. During the performance, they discovered [DISCOVERY], leading them on an exciting magical adventure.",
        "In a world full of illusions and spells, [NAME] attended a magic show in [PLACE]. There, they found [DISCOVERY], which led to a mysterious and enchanting journey.",
        "[NAME], always fascinated by magic, was at a show in [PLACE] when they found [DISCOVERY], leading them on an unforgettable magical adventure with [FRIEND]."
    ]
};

// Example categories for kids to choose from
const categories = [ 
    "Dogs", "Birds", "Bugs", "Fish", "Dinosaurs", "Toys", "Superheroes",  
    "Fairy Tales", "Princesses", "Cars", "Trains", "Planes", "Bikes", "Sports",  
    "Cats", "Robots", "Monsters", "Magic", "Castles", "Pirates", "Mermaids",  
    "Rainbows", "Candy", "Jungle", "Farm", "Zoo", "Ocean", "Forest", "Mountains",  
    "Camping", "Adventure", "Treasure", "Friendship", "Weather", "Seasons",  
    "Holidays", "School", "Family", "Music", "Dance", "Painting", "Balloons",  
    "Circus", "Gardening", "Ice Cream", "Bubbles", "Birthday Parties",  
    "Rockets", "Underwater Adventure", "Magic Show" 
];

const StorytellingGame = () => {
    const navigate = useNavigate();
    const { modalOpen, modalHeader, modalMessage, modalAction, openModal, closeModal } = useModal(); // modal
 
    // for time limit
    const logoutUser = useCallback(() => {
        openModal("Time limit is up!", "You have been logged out.", () => {
            localStorage.clear();
            setTimeout(() => {
            navigate('/login');
            }, 100); 
        });
        }, [openModal, navigate]);
    
        useEffect(() => {
        let timer;
        const storedLogoutTime = localStorage.getItem('logoutTime');
    
        if (storedLogoutTime) {
            const remainingTime = storedLogoutTime - Date.now();
    
            if (remainingTime > 0) {
            timer = setTimeout(() => {
                logoutUser();
            }, remainingTime);
            } else {
            logoutUser();
            }
        }
    
        return () => {
            clearTimeout(timer); 
        };
        }, [logoutUser]);

    const [selectedCategory, setSelectedCategory] = useState(null);  
    const [images, setImages] = useState([]);  
    const [selectedPicture, setSelectedPicture] = useState(null); 
    const [generatedStory, setGeneratedStory] = useState('');  

    // Function to fetch images from Pexels API based on category
    const fetchImages = (category) => {
        axios.get(`https://api.pexels.com/v1/search?query=${category}&per_page=10`, {
            headers: {
                Authorization: PEXELS_API_KEY
            }
        })
        .then(response => {
            setImages(response.data.photos);  
        })
        .catch(error => {
            console.error('Error fetching images from Pexels:', error); 
        });
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        fetchImages(category);  
        setSelectedPicture(null);  
        setGeneratedStory('');  
    };

const generateStory = (description, category) => {
    
    const templates = storyTemplates[category];
    if (!templates) {
        setGeneratedStory('Sorry, no story template available for this category.');
        return;
    }

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    const randomNames = [
        "Charlie", "Bella", "Max", "Luna", "Oliver", "Sophie", 
        "Milo", "Chloe", "Rocky", "Zoe", "Jack", "Daisy", 
        "Toby", "Lily", "Cooper", "Sadie", "Buddy", "Ruby"
    ];
    
    const randomPlaces = [
        "the enchanted forest", "the magical kingdom",  
        "the whimsical garden", "the mysterious cave", "the hidden valley", 
         "the towering mountains", "the ancient castle", 
        "the starlit sky", "the playful meadow", "the bustling village"
    ];
    
    const randomDiscoveries = [
        "a hidden treasure", "a magical stone", "a secret map", 
        "a shimmering gem", "an ancient artifact", "a mystical flower", 
        "a talking book", "a golden key", "a treasure chest full of candy", 
        "a mysterious egg", "a lost magical wand", "an enchanted mirror"
    ];
    
    const randomFriends = [
        "a talking rabbit", "a kind dragon", "a playful squirrel", 
        "a wise old owl", "a mischievous fox", "a gentle giant", 
        "a brave unicorn", "a clever raccoon", "a magical fairy", 
        "a cheerful dolphin", "a friendly bear", "a curious kitten"
    ];

    const selectedName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const selectedPlace = randomPlaces[Math.floor(Math.random() * randomPlaces.length)];
    const selectedDiscovery = randomDiscoveries[Math.floor(Math.random() * randomDiscoveries.length)];
    const selectedFriend = randomFriends[Math.floor(Math.random() * randomFriends.length)];

    // Create the story by replacing placeholders
    let story = randomTemplate
        .replace(/\[NAME\]/g, selectedName)
        .replace(/\[PLACE\]/g, selectedPlace)
        .replace(/\[DISCOVERY\]/g, selectedDiscovery)
        .replace(/\[FRIEND\]/g, selectedFriend);

if (category === "Birds") {
    story = story.replace(/\[BIRD\]/g, "bird");
} else if (category === "Fish") {
    story = story.replace(/\[FISH\]/g, "fish");
} else if (category === "Bugs") {
    story = story.replace(/\[BUG\]/g, "bug");
} else if (category === "Dogs") {
    story = story.replace(/\[DOG\]/g, "dog");
} else if (category === "Toys") {
    story = story.replace(/\[TOY\]/g, "toy");
} else if (category === "Superheroes") {
    story = story.replace(/\[SUPERHERO\]/g, "superhero");
} else if (category === "Dinosaurs") {
    story = story.replace(/\[DINOSAUR\]/g, "dinosaur");
} else if (category === "Cats") { 
    story = story.replace(/\[CAT\]/g, "cat");
}

    setGeneratedStory(story);
};

    const handlePictureSelect = (picture) => {
        setSelectedPicture(picture);
        generateStory(picture.alt, selectedCategory);  
    };

    return (
        <>
<div className="storytelling-game-container">
    <h1>Storytelling Game</h1>

    {/* Step 1: Select a Category */}
    {!selectedCategory && (
        <div className="category-selection">
            <h3>Select a Category:</h3>
            {/* Change this from category-grid to scrollable-grid */}
            <div className="scrollable-grid">
                {categories.map((category, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleCategorySelect(category)}
                        className="category-button" 
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    )}

    {/* Step 2: Display Fetched Images */}
    {selectedCategory && !selectedPicture && (
        <div>
            <h3 className="pictures-text">Choose images from the {selectedCategory} category to get started!</h3>
            <div className="pictures-grid">
                {images.map((picture) => (
                    <div 
                        key={picture.id}
                        className="picture-option"
                        onClick={() => handlePictureSelect(picture)}
                    >
                        <img src={picture.src.medium} alt={picture.alt} />
                        <p>{picture.alt}</p>
                    </div>
                ))}
            </div>
        </div>
    )}

    {/* Step 3: Display Selected Picture and Generated Story */}
    {selectedPicture && (
        <div className="selected-story-container">
            <div className="selected-picture">
                <img src={selectedPicture.src.medium} alt={selectedPicture.alt} />
            </div>
            <div className="story-display">
                <h3>A story just for you:</h3>
                <p>{generatedStory}</p>
                
            </div>
        </div>
    )}
</div>
            <Modal 
                isOpen={modalOpen} 
                onClose={closeModal} 
                onConfirm={modalAction}
                header={modalHeader} 
                message={modalMessage} 
            />
        </>
    );
};

export default StorytellingGame;
