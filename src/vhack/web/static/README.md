# V.H.A.C.K. Web Interface Assets

This directory contains the static assets for the V.H.A.C.K. web interface.

## Structure

- `css/modern.css` - Modern, clean styling with CSS custom properties
- `js/vhack.js` - JavaScript functionality including session management and UI interactions

## Features

### CSS (`modern.css`)
- Modern design with CSS custom properties (variables)
- Responsive layout with CSS Grid
- Professional color scheme with gradients
- Smooth animations and transitions
- Custom scrollbars
- Accessibility focus styles

### JavaScript (`vhack.js`)
- Object-oriented design with VHACKInterface class
- Session persistence across browser refreshes
- Enhanced API communication with session headers
- Clean separation of concerns
- Comprehensive error handling

## Usage

The Flask app automatically serves these files:
- CSS: `{{ url_for('static', filename='css/modern.css') }}`
- JS: `{{ url_for('static', filename='js/vhack.js') }}`

## Development

When making changes:
1. Edit CSS/JS files directly
2. Flask will serve the updated files automatically
3. Browser refresh will load new changes

This separation keeps the HTML template clean and makes maintenance easier.