# Sago Detection Web App

A static HTML/CSS/JavaScript application for sago plant detection and mapping.

## Features

### 🔐 Authentication
- Mock login system (demo@sago.com / demo123)
- Session management with localStorage
- Automatic redirect protection

### 📊 Dashboard
- Real-time statistics (Total, Mature, Immature plants)
- Interactive map view with plant pins
- Recent uploads sidebar
- Plant classification system

### 🗺️ Interactive Map
- Static aerial map background
- Clickable location pins
- Two modes: Detection View & Upload Mode
- Visual indicators for mature/immature plants

### 📱 Plant Management
- Image upload with drag & drop support
- Manual classification (Mature/Immature)
- Plant details modal with confidence scores
- Location-based plant tracking

### 🎨 UI/UX Features
- Beautiful research institute branding
- Responsive design for all devices
- Smooth animations and transitions
- Toast notifications for user feedback

## File Structure

```
static-sago-app/
├── index.html          # Login page
├── dashboard.html      # Main dashboard
├── styles.css          # All styling
├── auth.js            # Authentication logic
├── dashboard.js       # Dashboard functionality
└── README.md          # This file
```

## How to Use

1. **Login**: Use demo@sago.com / demo123
2. **View Plants**: Default detection view shows all plant pins
3. **Upload Mode**: 
   - Click "Upload Mode" button
   - Click on map to select location
   - Upload plant image
   - Classify as mature/immature
4. **View Details**: Click any pin or recent upload item

## Key Interactions

- **Map Clicking**: Select upload locations
- **Drag & Drop**: Upload plant images
- **Pin Clicking**: View plant details
- **Keyboard Shortcuts**:
  - `Escape`: Close modal
  - `U`: Switch to upload mode
  - `D`: Switch to detection mode

## Mock Data

The app includes 139 mock plant entries matching your design:
- 4 Mature plants
- 135 Immature plants
- Random locations and dates
- Real sago plant images from Unsplash/Pexels

## Design Highlights

- Matches your provided design aesthetic
- Research institute logo recreation
- Professional color scheme
- Modern card-based layout
- Interactive visual feedback

Perfect for UI/UX testing and demonstration!