// Created by Tyler Stephenson stephetd@miamioh.edu on Oct 8th 2025
// (C) copywright
// Feel free to reach out with questions!

let img;
let maxSize = 800;


// Just some p5.js stuff to load an image.
function preload() {
  
  // *******************************************************************************
  
  /*
  There are 4 Files currently loaded but feel free to add more
  -steve.png
  -steveCrypto.png
  -harold.png
  -haroldCrypto.png
  
  To add more just hit the left pointing arrow in the top left, then hit plus
  then upload an image from your computer, perferably png and jpg, I don't 
  know if other formats will work
  
  */
  img = loadImage('steve.png');
  
  // *******************************************************************************
  
}

//----------------------------------------------
// MAIN FUNCTION (EDIT HERE)
//----------------------------------------------
// Setup is the function that will actually run when the code is started

function setup() {
  
  
  // Code to scale the image to be at max 800 x 800 pixels.
  let multiplier = autoscale(img.width, img.height, maxSize)
  let imgWidth = img.width * multiplier
  let imgHeight = img.height * multiplier
  //Code to set up the display to make sure it is properly loaded.
  createCanvas(imgWidth,imgHeight);
  pixelDensity(1)
  image(img, 0, 0, imgWidth, imgHeight)
  
  // *******************************************************************************
  
  /*
  There are two functions here, the first is hideText, the function takes in a a phrase wrapped in quotations marks
  Ex. "Super Secret Phrase"
  Then the image to the left will be updated to encode that message.
  Right click / two finger click to save the image.
  
  The second function revealText() will search the current image and output any hidden text in it, if there is none
  all you will see is a bunch of random characters. This function decrypts whatever image was loaded above.  
  */
  
  //Add the following text into the image
  hideText("")
  // Function prints the hidden message below,
  revealText();
  
  // *******************************************************************************
  
}


/*
The hide text function is responsible for encrypting the image using least significant bit stenography
Feel free to look it up for more details, the short version is below

Since each pixel is made up of a bunch of RGB values that range from 0 - 255 there is a lot of information stored.
What we can do is change that last bit since (255,255,255) and (254,255,254) are very similar and something most
people will not be able to notice. So what we do is make the last bit of a few pixels specific 0s and 1s to encode a
byte of data. Then that small change is spread among 10,000's of pixels. Think

1111111X where x is 1 or 0.
*/

function hideText(text) {
  loadPixels();
  let currentIndex = 0;
  
  
  // Loop to continuously traverse the image until each character has been encoded.
  for(let index = 0; index < text.length; index++) {
    let charCode = text.charCodeAt(index)
    
    //since each character is 1 byte or 8 bits we loop 8 times with each one changing a single rgb value. in practice
    // this means we are changing 8 rgb values or 2 2/3 pixels.
    for(let i = 0; i < 8; i++) {
      pixels[currentIndex] = ((pixels[currentIndex] >> 1) << 1) | extractBit(charCode, i + 1);
      currentIndex = nextValidDataIndex(currentIndex);
    
    }

  }
  
  //adds 8 zeros in a row at the end to mark end of message.
  for (let k = 0; k < 8; k++) {
    pixels[currentIndex] = (pixels[currentIndex] >> 1) << 1;
    currentIndex = nextValidDataIndex(currentIndex);
  }
  
  updatePixels();
}

/*
Function to gather and recollect the data hidden in the image
What happens is we loop through the pixels and take the last bit of each r g and b value for each pixel, then
we combine them together to find the character it is associated with.

Ex RGB (254, 255, 255) RGB (128, 46, 57) RGB (37, 50, ~~~) (~~~ value is irrelevant)
We can look at odd / even to figure out 1 and 0's with even = 0 and odd = 1

Put together this is
01100110 = 102 or the character "f"


*/
function revealText() {
  
  //list to contain each character code, these character codes are derived from the ASCII table
  let numberList = [];
  loadPixels();
  
  let bitIndex = 0;
  
  // Loop that keeps running until either we have checked 20,000 characters worth of pixels, found the 0 byte or
  // gone out of bounds.
  while(true) {
    
    //Checks for bounds
    if(bitIndex + 10 > pixels.length) {break;}
    
    //current character code we are building
    let charCode = 0;
    
    //loops through 1 byte / 8 bits worth of values and adds them to the character code
    for(let i = 0; i < 8; i++) {
      charCode = charCode << 1;
      let lastBit = pixels[bitIndex] & 2;
      charCode = charCode | lastBit;
      bitIndex = nextValidDataIndex(bitIndex);
    }
    
    if(charCode == 0) {break;}
    
    if(bitIndex > 20000) {break;}
    
    //adds the new character code to the list for later
    numberList.push(charCode);
    
  }
  
  //converts the list of character codes into a string to print.
  print(String.fromCodePoint(...numberList));
   
}

//------------------------------------------------------------
// HELPER FUNCTIONS
//------------------------------------------------------------
//These are the functions that assist other parts of the code



//This function helps us skip over the alpha values in argb
//Basically alpha is just transparency
function nextValidDataIndex(index) {
  index += 1;
  if(index % 4 == 3) {
    index += 1;
  }
  return index
}
  
// This function is in charge of getting the bit in a specific position of the code
// Ex. 10110110 get bit 2
//
// 1 2 3 4 5 6 7 8
// 1 0 1 1 0 1 1 0
//
// Would return 0


function extractBit(number, bitPosition) {
  return (number>> (8 - bitPosition)) & 1;
}

// This function autoscales the image to make sure it is under 800x800px otherwise things can get slow

function autoscale(img_width, img_height, maxSize) {
  let largestSide = max(img_width, img_height);
  if(largestSide <= maxSize) {
    return 1
  }
  else {
    return maxSize / largestSide;
  }
}
