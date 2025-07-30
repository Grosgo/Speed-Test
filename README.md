# SpeedGauge Web App

A lightweight speed test interface with a custom UI tailored to client specifications. The project combines responsive data visualization with a dynamic animated background to deliver both functionality and aesthetic appeal.

## Features

- Real-time download speed measurement using asynchronous requests
- Animated gauge needle reflecting speed readings with precision
- Performance stats panel showing average, peak, and lowest speeds
- Galaxy-inspired canvas background with mouse-driven parallax motion
- Clean layout optimized for desktop resolution

## Technologies Used

- HTML5, CSS3, JavaScript (Vanilla)
- Canvas API for animated background
- Fetch API for network speed simulation

## Getting Started

To run locally:

1. Clone the repository  
   `git clone https://github.com/your-username/speedgauge-webapp.git`

2. Open `index.html` in any modern browser  
   No build tools or server required

3. Click the **Start Test** button to begin the simulation

## Customization

- Change `maxSpeed` in `script.js` to adjust the speed range
- Modify star density or explosion behavior in the `Galaxy` class
- Update visual styles in `style.css` to match branding or themes

## Notes

- The speed test uses a static download request via Cloudflare  
  This may be adjusted depending on geographic location or performance needs

- Background animation is performance-heavy and may affect slower devices  
  Consider tuning canvas resolution or particle count if needed

## License

You are free to use, modify, or repurpose it for your own needs.
