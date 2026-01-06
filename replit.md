# AI Fluens - Replit Agent Guide

## Overview

AI Fluens is a web application that helps users identify AI skill gaps for their current role and provides personalized upskilling plans. Users can:
1. Enter their professional details (no login required)
2. See AI skills needed for their role with required expertise levels
3. Take assessments (basic or advanced) after logging in
4. Get detailed skill gap analysis
5. Generate personalized weekly upskilling plans

## User Flow

1. **Home** → Enter experience, role, title, company, country, goal (optional)
2. **Skills Page** → View required AI skills for the role
3. **Login** → Required to take assessments
4. **Assessment Choice** → Basic (free) or Advanced ($49)
5. **Basic Assessment** → Self-evaluation questionnaire → Results with 1-10 scores
6. **Advanced Assessment** → Payment → AI chat experience → Detailed analysis with reasoning
7. **Upskill Plan** → Choose time commitment → Get weekly learning schedule with resources

## System Architecture

### Frontend (React + Vite)

**Framework**: React 19 with Vite 7
- Fast HMR and optimized builds
- Client-side routing with React Router DOM v7
- State management via React Context API

**UI Libraries**:
- Framer Motion for animations
- Lucide React for icons
- Custom CSS with CSS variables (dark theme)

### Project Structure

```
src/
├── main.jsx              # Entry point with BrowserRouter
├── App.jsx               # Route definitions
├── index.css             # Global styles and CSS variables
├── context/
│   └── AppContext.jsx    # Global state management
├── components/
│   └── Header.jsx        # Navigation header
├── data/
│   └── skillsData.js     # Role-skill mappings and resources
└── pages/
    ├── Home.jsx              # User profile form
    ├── Skills.jsx            # Required skills display
    ├── Login.jsx             # Authentication page
    ├── AssessmentChoice.jsx  # Basic vs Advanced selection
    ├── BasicAssessment.jsx   # Self-evaluation flow
    ├── BasicResults.jsx      # Basic assessment results
    ├── Payment.jsx           # Checkout page
    ├── AdvancedAssessment.jsx # AI chat assessment
    ├── AdvancedResults.jsx   # Detailed analysis
    └── UpskillPlan.jsx       # Weekly learning plan
```

### Data Model

**Profile Data**: experience, role, title, company, country, goal
**Skills**: name, level (basic/intermediate/advanced/expert), description
**Assessment Results**: skill scores (1-10), reasoning (advanced only)
**Upskill Plan**: weekly tasks with resources and time estimates

### Styling

- Dark theme with purple/indigo primary colors
- CSS variables in `index.css` for theming
- Responsive design with CSS Grid and Flexbox
- Glassmorphism effects on cards

## NPM Dependencies

| Package | Purpose |
|---------|---------|
| react, react-dom | Core UI framework |
| react-router-dom | Client-side routing |
| framer-motion | Animations and transitions |
| lucide-react | Icon components |
| vite | Build tool and dev server |

## Development

**Server**: Runs on port 5000 (0.0.0.0)
**Command**: `npm run dev`

## Future Enhancements

- Real authentication integration (Replit Auth)
- Stripe payment integration for advanced assessment
- AI/LLM integration for dynamic assessments
- Database for storing user progress
- Course API integrations for learning resources
