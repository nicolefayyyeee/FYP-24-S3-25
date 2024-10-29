import React, { useState, useEffect, useRef } from 'react';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';
import './Avatar.css';

const categories = {
  baseColor: ['6bd9e9', 'ff5733', '9287ff', 'd2b48c', 'ffcc00'],
  earrings: ['none', 'hoop', 'stud'],
  eyebrows: ['down', 'eyelashesDown', 'eyelashesUp'],
  eyes: ['eyes', 'eyesShadow', 'round', 'smiling', 'smilingShadow'],
  facialHair: ['none', 'beard', 'scruff'],
  glasses: ['none', 'round', 'square'],
  hair: ['dannyPhantom', 'dougFunny', 'fonze', 'full', 'mrClean', 'mrT', 'pixie', 'turban'],
  mouth: ['frown', 'laughing', 'nervous', 'pucker', 'smile', 'smirk', 'surprised'],
  nose: ['curve', 'pointed', 'round'],
  shirt: ['collared', 'crew', 'open'],
  backgroundType: ['solid', 'gradientLinear'],
};

const AvatarBuilder = () => {
  const userId = localStorage.getItem('user_id');

  const [options, setOptions] = useState({
    baseColor: '6bd9e9',
    earringColor: 'ff5733',
    earrings: 'hoop',
    earringsProbability: true,
    eyebrows: 'down',
    eyebrowsColor: '9287ff',
    eyes: 'eyes',
    eyesColor: '000000',
    eyeShadowColor: 'ffcc00',
    facialHair: 'beard',
    facialHairColor: 'd2b48c',
    facialHairProbability: true,
    glasses: 'round',
    glassesColor: '6bd9e9',
    glassesProbability: true,
    hair: 'dannyPhantom',
    hairColor: 'ff5733',
    mouth: 'smile',
    mouthColor: '000000',
    nose: 'curve',
    shirt: 'collared',
    shirtColor: '9287ff',
    backgroundType: 'gradientLinear',
    backgroundColor: 'ffb036',
    gradientStartColor: 'ffb036',
    gradientEndColor: 'fe7479',
  });

  const [avatarSVG, setAvatarSVG] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('hair');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlides, setMaxSlides] = useState(0);
  const [shiftAmount, setShiftAmount] = useState(0);

  // Refs for measuring dimensions
  const buttonsWrapperRef = useRef(null);
  const buttonsContainerRef = useRef(null);

  // Calculate maxSlides and shiftAmount
  useEffect(() => {
    const calculateSlides = () => {
      const wrapperWidth = buttonsWrapperRef.current.clientWidth;
      const containerWidth = buttonsContainerRef.current.scrollWidth;
      const availableScroll = containerWidth - wrapperWidth;

      // Calculate shift amount per slide (shift by wrapperWidth)
      const step = wrapperWidth;

      // Calculate maxSlides based on availableScroll and step
      const slides = Math.ceil(availableScroll / step);

      setMaxSlides(slides);
      setShiftAmount(step);
      
      // Adjust currentSlide if necessary
      if (currentSlide > slides) {
        setCurrentSlide(slides);
      }
    };

    calculateSlides();

    window.addEventListener('resize', calculateSlides);

    return () => window.removeEventListener('resize', calculateSlides);
  }, [currentSlide]);

  // Generate avatar SVG whenever options change
  useEffect(() => {
    const avatar = createAvatar(micah, {
      baseColor: [options.baseColor],
      earringColor: [options.earringColor],
      earrings: [options.earrings === 'none' ? '' : options.earrings],
      earringsProbability: options.earrings === 'none' ? 0 : options.earringsProbability ? 100 : 0,
      eyebrows: [options.eyebrows],
      eyebrowsColor: [options.eyebrowsColor],
      eyes: [options.eyes],
      eyesColor: [options.eyesColor],
      eyeShadowColor: [options.eyeShadowColor],
      facialHair: [options.facialHair === 'none' ? '' : options.facialHair],
      facialHairColor: [options.facialHairColor],
      facialHairProbability: options.facialHair === 'none' ? 0 : options.facialHairProbability ? 100 : 0,
      glasses: [options.glasses === 'none' ? '' : options.glasses],
      glassesColor: [options.glassesColor],
      glassesProbability: options.glasses === 'none' ? 0 : options.glassesProbability ? 100 : 0,
      hair: [options.hair],
      hairColor: [options.hairColor],
      mouth: [options.mouth],
      mouthColor: [options.mouthColor],
      nose: [options.nose],
      shirt: [options.shirt],
      shirtColor: [options.shirtColor],
      backgroundColor:
        options.backgroundType === 'gradientLinear'
          ? [options.gradientStartColor, options.gradientEndColor]
          : [options.backgroundColor],
      backgroundType: [options.backgroundType],
    });
    setAvatarSVG(avatar.toString());
  }, [options]);

  // Generate SVG for a specific option
  const generateOptionAvatar = (category, option) => {
    const updatedOptions = { ...options, [category]: option };
    const avatar = createAvatar(micah, {
      ...updatedOptions,
      baseColor: [updatedOptions.baseColor],
      earringColor: [updatedOptions.earringColor],
      earrings: [updatedOptions.earrings === 'none' ? '' : updatedOptions.earrings],
      earringsProbability: updatedOptions.earrings === 'none' ? 0 : updatedOptions.earringsProbability ? 100 : 0,
      eyebrows: [updatedOptions.eyebrows],
      eyebrowsColor: [updatedOptions.eyebrowsColor],
      eyes: [updatedOptions.eyes],
      eyesColor: [updatedOptions.eyesColor],
      eyeShadowColor: [updatedOptions.eyeShadowColor],
      facialHair: [updatedOptions.facialHair === 'none' ? '' : updatedOptions.facialHair],
      facialHairColor: [updatedOptions.facialHairColor],
      facialHairProbability: updatedOptions.facialHair === 'none' ? 0 : updatedOptions.facialHairProbability ? 100 : 0,
      glasses: [updatedOptions.glasses === 'none' ? '' : updatedOptions.glasses],
      glassesColor: [updatedOptions.glassesColor],
      glassesProbability: updatedOptions.glasses === 'none' ? 0 : updatedOptions.glassesProbability ? 100 : 0,
      hair: [updatedOptions.hair],
      hairColor: [updatedOptions.hairColor],
      mouth: [updatedOptions.mouth],
      mouthColor: [updatedOptions.mouthColor],
      nose: [updatedOptions.nose],
      shirt: [updatedOptions.shirt],
      shirtColor: [updatedOptions.shirtColor],
      backgroundColor:
        updatedOptions.backgroundType === 'gradientLinear'
          ? [updatedOptions.gradientStartColor, updatedOptions.gradientEndColor]
          : [updatedOptions.backgroundColor],
      backgroundType: [updatedOptions.backgroundType],
    });
    return avatar.toString();
  };

  // Update a specific option
  const updateOption = (category, value) => {
    setOptions((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // Function to determine the correct colorCategory based on selectedCategory
  // Updated getColorCategory function
  const getColorCategory = (category) => {
  // Skip color selection for baseColor and nose
  if (category === 'baseColor' || category === 'nose') return null;

  // Map other categories to their corresponding color properties
  const mapping = {
    earrings: 'earringColor',
    eyebrows: 'eyebrowsColor',
    eyes: 'eyesColor',
    facialHair: 'facialHairColor',
    glasses: 'glassesColor',
    hair: 'hairColor',
    mouth: 'mouthColor',
    shirt: 'shirtColor',
  };

  // For backgroundType, handle separately
  if (category === 'backgroundType') return 'backgroundType';

  // Return the mapped color category or default to `${category}Color`
  return mapping[category] || `${category}Color`;
};


  // Render color selection options
  const renderColorOptions = (colorCategory) => {
    const isEyesWithShadow = options.eyes === 'eyesShadow' || options.eyes === 'smilingShadow';

    return (
      <div className="color-options-container">
        <div className="color-options">
          {categories.baseColor.map((color) => (
            <div
              key={color}
              className={`color-circle ${options[colorCategory] === color ? 'selected' : ''}`}
              style={{ backgroundColor: `#${color}` }}
              onClick={() => updateOption(colorCategory, color)}
            />
          ))}
        </div>

        {/* Separate row for eyeShadowColor */}
        {colorCategory === 'eyesColor' && isEyesWithShadow && (
          <div className="color-options">
            <span className="color-label">Eyeshadow Color:</span>
            {categories.baseColor.map((color) => (
              <div
                key={color}
                className={`color-circle ${options.eyeShadowColor === color ? 'selected' : ''}`}
                style={{
                  backgroundColor: `#${color}`,
                  opacity: isEyesWithShadow ? 1 : 0.3,
                  pointerEvents: isEyesWithShadow ? 'auto' : 'none',
                }}
                onClick={() => updateOption('eyeShadowColor', color)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render background type selection (Solid or Gradient)
  const renderBackgroundTypeOptions = () => {
    return options.backgroundType === 'solid' ? (
      renderColorOptions('backgroundColor')
    ) : (
      <div className="color-options-container">
        <div className="color-options">
          <span className="color-label">Gradient Color 1:</span>
          {renderColorOptions('gradientStartColor')}
        </div>
        <div className="color-options">
          <span className="color-label">Gradient Color 2:</span>
          {renderColorOptions('gradientEndColor')}
        </div>
      </div>
    );
  };
  
  // Scroll through category buttons
  const scrollCategories = (direction) => {
    setCurrentSlide((prev) => {
      let newSlide = prev + direction;
      if (newSlide < 0) newSlide = 0;
      if (newSlide > maxSlides) newSlide = maxSlides;
      return newSlide;
    });
  };

  // Fetch existing avatar
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!userId) return; 
  
      try {
          const response = await fetch(`http://localhost:5000/get_web_avatar?user_id=${userId}`);
          if (!response.ok) throw new Error("Failed to fetch avatar");
  
          const avatarData = await response.json();
          console.log("Fetched Avatar Data:", avatarData);
          setOptions((prevOptions) => ({
              ...prevOptions,
              ...avatarData,
          }));
      } catch (error) {
          console.error("Error fetching avatar:", error);
      }
  };

    fetchAvatar();
}, [userId]);

  // Handle Save functionality (download SVG)
  const downloadSVG = () => {
    // Example: Download the SVG as a file
    const blob = new Blob([avatarSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'avatar.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save to db
  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/save_web_avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ...options,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error saving avatar:", error);
    }
  };

  // Handle Cancel functionality
  const handleCancel = () => {
    // Reset to default options
    setOptions({
      baseColor: '6bd9e9',
      earringColor: 'ff5733',
      earrings: 'hoop',
      earringsProbability: true,
      eyebrows: 'down',
      eyebrowsColor: '9287ff',
      eyes: 'eyes',
      eyesColor: '000000',
      eyeShadowColor: 'ffcc00',
      facialHair: 'beard',
      facialHairColor: 'd2b48c',
      facialHairProbability: true,
      glasses: 'round',
      glassesColor: '6bd9e9',
      glassesProbability: true,
      hair: 'dannyPhantom',
      hairColor: 'ff5733',
      mouth: 'smile',
      mouthColor: '000000',
      nose: 'curve',
      shirt: 'collared',
      shirtColor: '9287ff',
      backgroundType: 'solid',
      backgroundColor: '6bd9e9',
      gradientStartColor: '6bd9e9',
      gradientEndColor: 'ffffff',
    });
    setSelectedCategory('hair'); // Reset selected category if needed
    setCurrentSlide(0); // Reset to first slide
  };

  // Calculate the transform based on currentSlide and shiftAmount
  const containerStyle = {
    transform: `translateX(-${currentSlide * shiftAmount}px)`,
    transition: 'transform 0.5s ease-in-out',
    display: 'flex',
  };

  return (
    <div className="avatar-builder-container">
      <h1>Avatar Builder</h1>

      {/* Avatar preview display */}
      <div className="avatar-preview" dangerouslySetInnerHTML={{ __html: avatarSVG }} />

      {/* Category selector */}
      <div className="category-select">
        {/* Previous Button - Hidden if on first slide */}
        {currentSlide > 0 && (
          <button
            className="category-arrow"
            onClick={() => scrollCategories(-1)}
            aria-label="Previous Category"
          >
            &lt;
          </button>
        )}

        <div className="category-buttons-wrapper" ref={buttonsWrapperRef}>
          <div className="category-buttons-container" ref={buttonsContainerRef} style={containerStyle}>
            {Object.keys(categories).map((category) => (
              <button
                key={category}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Next Button - Hidden if on last slide */}
        {currentSlide < maxSlides && (
          <button
            className="category-arrow"
            onClick={() => scrollCategories(1)}
            aria-label="Next Category"
          >
            &gt;
          </button>
        )}
      </div>

      {/* Conditionally render color options or background type options */}
      {selectedCategory === 'backgroundType' ? (
        renderBackgroundTypeOptions()
      ) : (
        selectedCategory &&
        getColorCategory(selectedCategory) &&
        renderColorOptions(getColorCategory(selectedCategory))
      )}


      {/* Avatar customization options */}
      <div className="avatar-options">
        {Array.isArray(categories[selectedCategory]) ? (
          <div className="avatar-grid">
            {categories[selectedCategory].map((option) => (
              <div
                key={option}
                className={`option-item ${options[selectedCategory] === option ? 'selected' : ''}`}
                onClick={() => updateOption(selectedCategory, option)}
                dangerouslySetInnerHTML={{ __html: generateOptionAvatar(selectedCategory, option) }}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Save and Cancel buttons */}
      <div className="action-buttons">
        <button onClick={handleSave} className="action-button save-button">
          Save
        </button>
        <button onClick={handleCancel} className="action-button cancel-button">
          Cancel
        </button>
        <button onClick={downloadSVG} className="action-button download-button">
          Download SVG
        </button>
      </div>
    </div>
  );
};

export default AvatarBuilder;
