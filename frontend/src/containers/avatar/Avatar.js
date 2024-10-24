import React, { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';

const AvatarBuilder = () => {
  const [options, setOptions] = useState({
    baseColor: '#77311d',    // Skin tone options (Base color)
    earringColor: '#77311d', // Earring color
    earrings: 'hoop',        // Earrings style
    eyebrows: 'down',        // Eyebrows style
    eyes: 'eyes',            // Eyes style
    eyesColor: '#000000',    // Eyes color
    facialHair: 'beard',     // Facial hair style
    facialHairColor: '#000000', // Facial hair color
    glasses: 'round',        // Glasses style
    glassesColor: '#000000', // Glasses color
    hair: 'dannyPhantom',    // Hair style
    hairColor: '#000000',    // Hair color
    mouth: 'smile',          // Mouth style
    mouthColor: '#000000',   // Mouth color
    nose: 'curve',           // Nose style
    shirt: 'collared',       // Shirt style
    shirtColor: '#000000',   // Shirt color
  });

  const [avatarSVG, setAvatarSVG] = useState('');

  // Generate avatar whenever options change
  useEffect(() => {
    const avatar = createAvatar(micah, {
      earringsProbability: 100,
      glassesProbability: 100,
      facialHairProbability: 100,
      baseColor: ["f9c9b6"],    // Skin tone color
      earringColor: ["ffffff"], // Earring color
      earrings: [options.earrings],      // Earrings style
      eyebrows: [options.eyebrows],      // Eyebrows style
      eyes: [options.eyes],              // Eyes style
      eyesColor: ["000000"],      // Eyes color
      facialHair: [options.facialHair],  // Facial hair style
      facialHairColor: ["ffffff"], // Facial hair color
      glasses: [options.glasses],        // Glasses style
      glassesColor: ["ffffff"], // Glasses color
      hair: [options.hair],              // Hair style
      hairColor: ["000000"],      // Hair color
      mouth: [options.mouth],            // Mouth style
      mouthColor: ["000000"],    // Mouth color
      nose: [options.nose],              // Nose style
      shirt: [options.shirt],            // Shirt style
      shirtColor: ["000000"],    // Shirt color
    });

    // Generate the SVG and set it in the state
    setAvatarSVG(avatar.toString());
  }, [options]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={styles.container}>
      <h1>Avatar Builder</h1>
      <div style={styles.controls}>

        {/* Earrings */}
        <label>
          Earrings:
          <select name="earrings" value={options.earrings} onChange={handleChange}>
            <option value="hoop">Hoop</option>
            <option value="stud">Stud</option>
          </select>
        </label>

        {/* Eyebrows */}
        <label>
          Eyebrows:
          <select name="eyebrows" value={options.eyebrows} onChange={handleChange}>
            <option value="down">Down</option>
            <option value="eyelashesDown">Eyelashes Down</option>
            <option value="eyelashesUp">Eyelashes Up</option>
          </select>
        </label>

        {/* Eyes */}
        <label>
          Eyes:
          <select name="eyes" value={options.eyes} onChange={handleChange}>
            <option value="eyes">Eyes</option>
            <option value="eyesShadow">Eyes Shadow</option>
            <option value="round">Round</option>
            <option value="smiling">Smiling</option>
            <option value="smilingShadow">Smiling Shadow</option>
          </select>
        </label>

        {/* Facial Hair */}
        <label>
          Facial Hair:
          <select name="facialHair" value={options.facialHair} onChange={handleChange}>
            <option value="beard">Beard</option>
            <option value="scruff">Scruff</option>
          </select>
        </label>

        {/* Glasses */}
        <label>
          Glasses:
          <select name="glasses" value={options.glasses} onChange={handleChange}>
            <option value="round">Round</option>
            <option value="square">Square</option>
          </select>
        </label>


        {/* Hair */}
        <label>
          Hair:
          <select name="hair" value={options.hair} onChange={handleChange}>
            <option value="dannyPhantom">Danny Phantom</option>
            <option value="dougFunny">Doug Funny</option>
            <option value="fonze">Fonze</option>
            <option value="full">Full</option>
            <option value="mrClean">Mr. Clean</option>
            <option value="mrT">Mr. T</option>
            <option value="pixie">Pixie</option>
            <option value="turban">Turban</option>
          </select>
        </label>


        {/* Mouth */}
        <label>
          Mouth:
          <select name="mouth" value={options.mouth} onChange={handleChange}>
            <option value="frown">Frown</option>
            <option value="laughing">Laughing</option>
            <option value="nervous">Nervous</option>
            <option value="pucker">Pucker</option>
            <option value="sad">Sad</option>
            <option value="smile">Smile</option>
            <option value="smirk">Smirk</option>
            <option value="surprised">Surprised</option>
          </select>
        </label>

       
        {/* Nose */}
        <label>
          Nose:
          <select name="nose" value={options.nose} onChange={handleChange}>
            <option value="curve">Curve</option>
            <option value="pointed">Pointed</option>
            <option value="tound">Round</option>
          </select>
        </label>

        {/* Shirt */}
        <label>
          Shirt:
          <select name="shirt" value={options.shirt} onChange={handleChange}>
            <option value="collared">Collared</option>
            <option value="crew">Crew</option>
            <option value="open">Open</option>
          </select>
        </label>

      </div>

      {/* Render the SVG */}
      <div style={styles.avatar} dangerouslySetInnerHTML={{ __html: avatarSVG }} />
      <button onClick={() => navigator.clipboard.writeText(avatarSVG)}>
        Copy SVG
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#ffff',
  },
  controls: {
    marginBottom: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '15px',
  },
  avatar: {
    margin: '20px auto',
    width: '200px',
    height: '200px',
    border: '1px solid #ccc',
  },
};

export default AvatarBuilder;
