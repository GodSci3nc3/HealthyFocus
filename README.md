# HealthyFocus - Digital Wellness Platform

<div align="center">
  <img src="https://github.com/user-attachments/assets/807e9781-5139-42c8-9fef-d97f174f6ea8" alt="HealthyFocus Platform" style="width: 600px; height: 600px;">
  
  <p align="center">
    <strong>A comprehensive web platform designed to help users manage their digital device time efficiently through personalized wellness tracking and intelligent recommendations.</strong>
  </p>
  
  <p align="center">
    <strong>Transform your digital habits with data-driven insights and personalized wellness strategies.</strong>
  </p>
</div>

---

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Key Capabilities](#key-capabilities)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Features

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white; margin: 10px;">
          <h3>User Authentication</h3>
          <p>Secure registration and login system with password recovery and profile management</p>
        </div>
      </td>
      <td align="center" width="33%">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; color: white; margin: 10px;">
          <h3>Digital Time Tracking</h3>
          <p>Complete CRUD operations for daily activities with detailed time and category tracking</p>
        </div>
      </td>
      <td align="center" width="33%">
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; color: white; margin: 10px;">
          <h3>Personalized Profiles</h3>
          <p>Custom user profiles with personal information, preferences, and digital usage goals</p>
        </div>
      </td>
    </tr>
    <tr>
      <td align="center" width="33%">
        <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; color: white; margin: 10px;">
          <h3>Analytics Dashboard</h3>
          <p>Interactive charts and visualizations for comprehensive digital habit analysis</p>
        </div>
      </td>
      <td align="center" width="33%">
        <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 20px; border-radius: 10px; color: white; margin: 10px;">
          <h3>Smart Recommendations</h3>
          <p>AI-powered suggestions for optimizing digital time usage based on detected patterns</p>
        </div>
      </td>
      <td align="center" width="33%">
        <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 20px; border-radius: 10px; color: #333; margin: 10px;">
          <h3>Progress Tracking</h3>
          <p>Weekly and monthly activity summaries with goal comparison and achievement metrics</p>
        </div>
      </td>
    </tr>
  </table>
</div>

## Technology Stack

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js">
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios">
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint">
      </td>
    </tr>
  </table>
</div>

## Key Capabilities

<div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 5px solid #007bff;">

### Digital Wellness Management
- **Activity Tracking**: Record daily digital activities with duration and category classification
- **Usage Categories**: Work, leisure, social media, entertainment, and custom categories
- **Goal Setting**: Establish personal digital usage targets and wellness objectives
- **Progress Monitoring**: Real-time tracking of digital habits and achievement metrics

### Data Analysis & Insights
- **Interactive Visualizations**: Chart.js powered graphs showing usage patterns and trends
- **Habit Detection**: Automatic identification of digital usage patterns and behaviors
- **Comparative Analysis**: Weekly and monthly comparisons with established goals
- **Personalized Reports**: Detailed insights into digital wellness progress

### User Experience Features
- **Responsive Design**: Mobile-first approach with TailwindCSS for all device types
- **Intuitive Interface**: Clean, modern UI focused on user engagement and clarity
- **Secure Authentication**: Protected user data with robust login and registration systems
- **Profile Customization**: Tailored experience based on individual preferences and needs

</div>

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- npm or yarn package manager

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/GodSci3nc3/HealthyFocus.git
   cd HealthyFocus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Configuration**
   - Set up MySQL database
   - Configure connection parameters in environment variables
   - Run database migrations if available

4. **Environment Variables**
   Create a `.env.local` file with:
   ```env
   DATABASE_URL=your_mysql_connection_string
   NEXTAUTH_SECRET=your_auth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Getting Started
1. Create your account through the registration system
2. Complete your profile with personal information and digital usage preferences
3. Begin logging daily digital activities with time tracking
4. Set personal wellness goals and usage targets
5. Monitor progress through the analytics dashboard
6. Receive personalized recommendations for improved digital wellness

### Core Features
- **Activity Logging**: Record screen time across different categories and devices
- **Dashboard Analytics**: View comprehensive charts and progress metrics
- **Goal Management**: Set, track, and adjust digital wellness objectives
- **Habit Analysis**: Discover patterns in your digital usage behavior
- **Wellness Recommendations**: Get personalized suggestions for healthier digital habits

## Project Structure

```
HealthyFocus/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes and endpoints
│   │   ├── register/       # User registration pages
│   │   ├── user/          # User dashboard and profile
│   │   └── globals.css    # Global styling
│   ├── components/         # Reusable React components
│   └── libs/              # Utility libraries and helpers
├── database/              # Database schemas and migrations
├── public/               # Static assets and images
└── package.json          # Project dependencies and scripts
```

---

<div align="center">
  <strong>Developed by Arturo Rosales V</strong><br>
  <a href="https://github.com/GodSci3nc3">GitHub</a> | 
  <a href="mailto:rosalesvelazquezarturo@email.com">Email</a>
  
  <p>For questions, issues, or collaboration opportunities, please reach out through GitHub or email.</p>
</div>

##