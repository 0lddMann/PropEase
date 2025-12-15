# PropEase

PropEase is a real estate management prototype designed to streamline property management tasks for administrators, managers, tenants, and clients. This application features a modern user interface with a focus on usability and aesthetics, utilizing a white and red gradient color scheme.

## Features

- **User Authentication**: Secure login for different user roles (Admin, Manager, Tenant, Client).
- **Dashboards**: Role-specific dashboards that provide relevant information and actions.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Dynamic Components**: Reusable components for headers, sidebars, and cards to maintain consistency across the application.
- **Animations**: Smooth transitions and animations to enhance user experience.

## Project Structure

```
PropEase
├── src
│   ├── views
│   │   ├── index.html        # Main login page
│   │   ├── admin.html       # Admin dashboard
│   │   ├── manager.html     # Manager dashboard
│   │   ├── tenant.html      # Tenant dashboard
│   │   ├── client.html      # Client dashboard
│   │   ├── tenants.html     # Tenants list
│   │   ├── properties.html   # Property listings
│   │   ├── leases.html      # Lease information
│   │   ├── clients.html     # Client inquiries
│   │   └── settings.html    # User profile settings
│   ├── components
│   │   ├── header.html      # Header component with logo and navigation
│   │   ├── sidebar.html     # Sidebar navigation component
│   │   ├── card.html        # Reusable card component
│   │   └── profile-panel.html# Profile panel component
│   ├── js
│   │   ├── script.js        # Main JavaScript file
│   │   ├── animations.js    # Animation handling
│   │   └── auth.js          # Authentication logic
│   └── css
│       ├── styles.css       # Main stylesheet
│       ├── animations.css    # Animation styles
│       └── tokens.css       # Design tokens
├── assets
│   ├── logo.svg             # Application logo
│   ├── icons.svg            # Icons for UI elements
│   └── fonts
│       └── README           # Font information
├── .gitignore                # Files to ignore in version control
├── package.json              # Project metadata and dependencies
├── vite.config.js            # Vite configuration
└── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd PropEase
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

- Access the application through the login page at `src/views/index.html`.
- Use the demo accounts provided to explore different user roles:
  - Admin: `admin@demo.com` / `admin123`
  - Manager: `manager@demo.com` / `manager123`
  - Tenant: `tenant@demo.com` / `tenant123`
  - Client: `client@demo.com` / `client123`

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.