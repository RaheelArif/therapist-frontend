// src/themes.js

// Default/Public Theme (e.g., for login, public forms)
export const publicTheme = {
    token: {
      colorPrimary: '#856b2e', // A vibrant green
      borderRadius: 2,
      // You can add more tokens: colorBgLayout, fontFamily, etc.
    },
    components: {
      Button: {
        colorPrimary: '#856b2e',
        algorithm: true, // Important for antd v5 to re-calculate derived colors
      },
      Input: {
        colorPrimary: '#856b2e',
        algorithm: true,
      },
      // Add other component-specific overrides if needed
    },
  };
  
  // Admin Theme
  export const adminTheme = {
    token: {
      colorPrimary: '#1890ff', // Classic Ant Design Blue
      borderRadius: 4,
      colorBgLayout: '#f0f2f5', // Light grey background for admin layout
    },
    components: {
      Button: {
        colorPrimary: '#1890ff',
        algorithm: true,
      },
      Menu: { // Example: Theming the Admin Sidebar Menu
        // colorItemBg: '#001529', // Dark background for menu items
        // colorItemText: 'rgba(255, 255, 255, 0.65)',
        // colorItemTextHover: '#ffffff',
        // colorItemTextSelected: '#ffffff',
        // colorItemBgSelected: '#1890ff',
        colorPrimary: '#1890ff', // This will affect selected item color more directly in v5
        algorithm: true,
      }
    },
  };
  
  // Therapist Theme
  export const therapistTheme = {
    token: {
      colorPrimary: '#722ed1', // A distinct purple
      borderRadius: 8, // More rounded corners
      fontFamily: 'Arial, sans-serif', // Different font example
    },
    components: {
      Button: {
        colorPrimary: '#722ed1',
        // colorText: '#FFFFFF', // Example: White text on purple buttons
        algorithm: true,
      },
      Card: { // Example: Theming cards in therapist section
          // colorBgContainer: '#f9f0ff', // Light purple card background
          // colorTextHeading: '#722ed1',
      }
    },
  };