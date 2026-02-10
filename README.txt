# Image Steganography with p5.js (Least Significant Bit Encoding)

This project demonstrates how to hide and reveal secret text messages inside images using Least Significant Bit (LSB) steganography. Built with JavaScript and p5.js, it subtly modifies pixel color values to embed data without visibly changing the image.

## Overview

Each pixel in an image contains RGB values ranging from 0–255. By adjusting only the last bit of these values, information can be stored while keeping the image visually identical to the original. This project encodes text into those bits and later decodes it back into readable characters.

The result is a simple, educational example of how data can be concealed inside digital media.

## Features

- Hide custom text inside any PNG or JPG image
- Reveal hidden messages from encoded images
- Automatic image scaling for performance (max 800x800)
- Uses bitwise operations for efficient encoding/decoding
- Works entirely in the browser with p5.js

## How It Works

Each character (1 byte = 8 bits) is written across multiple RGB values by modifying their least significant bit. These tiny changes are imperceptible to the human eye. A null byte is added to signal the end of the message. The decoder reads those bits back and reconstructs the original text.

Alpha (transparency) values are skipped to prevent corruption.

## Usage

1. Add or upload an image to the project
2. Select the image in preload():
   loadImage('yourImage.png')
3. Encode text:
   hideText("Your secret message")
4. Save the generated image
5. Decode with:
   revealText()
   (message prints to the console)

## Tech Stack

- JavaScript
- p5.js
- Bitwise manipulation
- Image processing fundamentals

## Purpose

This project showcases understanding of low-level data representation, pixel manipulation, and creative problem solving. It serves as a practical example of steganography concepts and browser-based graphics programming.
