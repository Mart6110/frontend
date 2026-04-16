// Application Text Constants
export const APP_TEXT = {
  // Application Name
  APP_NAME: "Sandbatteri",
  
  // Navigation
  NAV: {
    SIMPLE_VIEW: "Simple View",
    ADVANCED_VIEW: "Advanced View",
    SETTINGS: "Settings",
    LOGOUT: "Logout",
  },

  // Home Page
  HOME: {
    WELCOME_TITLE: "Welcome",
    WELCOME_MESSAGE: "Enter your Product Key to access the dashboard.",
    API_KEY_PLACEHOLDER: "Product Key",
    SUBMIT_BUTTON: "Apply",
  },

  // Simple View Page
  SIMPLE_VIEW: {
    TITLE: "Simple View",
    CONTENT: "Dashboard simple view content goes here.",
  },

  // Advanced View Page
  ADVANCED_VIEW: {
    TITLE: "Advanced View",
    CONTENT: "Dashboard advanced view content goes here.",
  },

  // Dashboard Common
  DASHBOARD: {
    // KPI Labels
    KPI: {
      TEMPERATURE: "Temperature",
      ENERGY_IN: "Energy In",
      ENERGY_OUT: "Energy Out",
      EFFICIENCY: "Efficiency",
      PUMP_STATUS: "Pump Status",
      FLOW_RATE: "Flow Rate",
      STATE_OF_CHARGE: "State of Charge",
      POWER: "Power",
    },
    
    // Chart Titles
    CHARTS: {
      TEMPERATURE_HISTORY: "Temperature History",
      ENERGY_TRANSFER: "Energy Transfer",
      FLOW_RATE: "Flow Rate",
      PUMP_ACTIVITY: "Pump Activity",
      EFFICIENCY_TREND: "Efficiency Trend",
      TEMPERATURE_VS_PUMP: "Temperature vs Pump Activity",
      SYSTEM_OVERVIEW: "System Overview",
    },
    
    // Status Labels
    STATUS: {
      PUMP_ON: "Running",
      PUMP_OFF: "Stopped",
      SYSTEM_ACTIVE: "Active",
      SYSTEM_IDLE: "Idle",
      CHARGING: "Charging",
      DISCHARGING: "Discharging",
      STANDBY: "Standby",
    },
    
    // Time Range Options
    TIME_RANGE: {
      LIVE: "Live",
      ONE_HOUR: "1 Hour",
      SIX_HOURS: "6 Hours",
      TWELVE_HOURS: "12 Hours",
      ONE_DAY: "1 Day",
      ONE_WEEK: "1 Week",
      ONE_MONTH: "1 Month",
    },
    
    // Units
    UNITS: {
      TEMPERATURE: "°C",
      ENERGY: "kWh",
      POWER: "kW",
      FLOW: "L/min",
      EFFICIENCY: "%",
      TIME: "s",
    },
    
    // Event Types
    EVENTS: {
      PUMP_START: "Pump Started",
      PUMP_STOP: "Pump Stopped",
      TEMPERATURE_HIGH: "High Temperature",
      TEMPERATURE_LOW: "Low Temperature",
      CHARGING_START: "Charging Started",
      CHARGING_STOP: "Charging Stopped",
      DISCHARGING_START: "Discharging Started",
      DISCHARGING_STOP: "Discharging Stopped",
      ERROR: "Error",
      WARNING: "Warning",
    },
    
    // Loading & Error States
    LOADING: "Loading data...",
    NO_DATA: "No data available",
    ERROR: "Failed to load data",
    UPDATING: "Updating...",
  },

  // Settings
  SETTINGS: {
    TITLE: "Settings",
    SECTION_TITLE: "Sand Battery Configuration",
    SAVE_BUTTON: "Save Settings",
    
    // Form Fields
    CAPACITY: {
      LABEL: "Battery Capacity",
      PLACEHOLDER: "100",
      HELPER: "Total energy storage capacity in kWh",
    },
    MAX_CHARGE_RATE: {
      LABEL: "Max Charge Rate",
      PLACEHOLDER: "50",
      HELPER: "Maximum charging power in kW",
    },
    MAX_DISCHARGE_RATE: {
      LABEL: "Max Discharge Rate",
      PLACEHOLDER: "50",
      HELPER: "Maximum discharging power in kW",
    },
    OPERATING_MODE: {
      LABEL: "Operating Mode",
      HELPER: "Battery operation mode",
      OPTIONS: {
        AUTO: "Automatic",
        CHARGE: "Charge Only",
        DISCHARGE: "Discharge Only",
        STANDBY: "Standby",
      },
    },
    TARGET_TEMPERATURE: {
      LABEL: "Target Temperature",
      PLACEHOLDER: "600",
      HELPER: "Target operating temperature in °C (200-800)",
    },
    EFFICIENCY: {
      LABEL: "System Efficiency",
      HELPER: "Round-trip energy efficiency (%)",
    },
    MIN_STATE_OF_CHARGE: {
      LABEL: "Minimum State of Charge",
      HELPER: "Minimum allowed battery charge level (%)",
    },
    MAX_STATE_OF_CHARGE: {
      LABEL: "Maximum State of Charge",
      HELPER: "Maximum allowed battery charge level (%)",
    },
  },

  // Dialogs
  DIALOGS: {
    CLEAR_API_KEY: {
      TITLE: "Clear Product Key",
      MESSAGE: "Are you sure you want to clear your Product key? You will be logged out.",
      CANCEL: "Cancel",
      CONFIRM: "Clear",
    },
  },

  // Footer
  FOOTER: {
    COPYRIGHT: (year: number) => `© ${year} Sandbatteri`,
  },

  // Validation Messages
  VALIDATION: {
    API_KEY: {
      REQUIRED: "Product key is required",
      MIN_LENGTH: "Product key must be at least 10 characters",
    },
    CAPACITY: {
      REQUIRED: "Capacity is required",
      MIN: "Capacity must be at least 1 kWh",
      MAX: "Capacity cannot exceed 10000 kWh",
    },
    MAX_CHARGE_RATE: {
      REQUIRED: "Max charge rate is required",
      MIN: "Must be at least 1 kW",
      MAX: "Cannot exceed 1000 kW",
    },
    MAX_DISCHARGE_RATE: {
      REQUIRED: "Max discharge rate is required",
      MIN: "Must be at least 1 kW",
      MAX: "Cannot exceed 1000 kW",
    },
    OPERATING_MODE: {
      REQUIRED: "Operating mode is required",
    },
    TARGET_TEMPERATURE: {
      REQUIRED: "Target temperature is required",
      MIN: "Must be at least 200°C",
      MAX: "Cannot exceed 800°C",
    },
    EFFICIENCY: {
      REQUIRED: "Efficiency is required",
    },
    MIN_STATE_OF_CHARGE: {
      REQUIRED: "Min state of charge is required",
    },
    MAX_STATE_OF_CHARGE: {
      REQUIRED: "Max state of charge is required",
    },
  },

  // Aria Labels
  ARIA: {
    SETTINGS_BUTTON: "Settings",
    CLEAR_API_KEY_BUTTON: "Clear Product Key",
    COLOR_MODE_BUTTON: "Toggle color mode",
  },
}

// Application Configuration Constants
export const APP_CONFIG = {
  DEFAULT_VALUES: {
    CAPACITY: 100,
    MAX_CHARGE_RATE: 50,
    MAX_DISCHARGE_RATE: 50,
    OPERATING_MODE: "auto",
    TARGET_TEMPERATURE: 600,
    EFFICIENCY: 85,
    MIN_STATE_OF_CHARGE: 10,
    MAX_STATE_OF_CHARGE: 95,
  },
  
  LIMITS: {
    CAPACITY: { MIN: 1, MAX: 10000 },
    CHARGE_RATE: { MIN: 1, MAX: 1000 },
    DISCHARGE_RATE: { MIN: 1, MAX: 1000 },
    TEMPERATURE: { MIN: 200, MAX: 800 },
    EFFICIENCY: { MIN: 0, MAX: 100 },
    STATE_OF_CHARGE: { MIN: 0, MAX: 100 },
  },
  
  SLIDER_STEPS: {
    EFFICIENCY: 1,
    STATE_OF_CHARGE: 5,
  },
  
  // Dashboard Configuration
  DASHBOARD: {
    // Update Intervals (in milliseconds)
    UPDATE_INTERVALS: {
      REAL_TIME: 15000,      // 15 seconds
      EFFICIENCY: 60000,     // 60 seconds
      HISTORICAL: 300000,    // 5 minutes
    },
    
    // Chart Configuration
    CHART: {
      MIN_DATA_POINTS: 100,
      MAX_DATA_POINTS: 500,
      ANIMATION_DURATION: 300,
    },
    
    // Time Ranges (in milliseconds)
    TIME_RANGES: {
      ONE_HOUR: 3600000,
      SIX_HOURS: 21600000,
      TWELVE_HOURS: 43200000,
      ONE_DAY: 86400000,
      ONE_WEEK: 604800000,
      ONE_MONTH: 2592000000,
    },
    
    // Temperature Precision
    TEMPERATURE_PRECISION: 0.5,
    
    // Color Scheme
    COLORS: {
      TEMPERATURE: "#FF6B35",
      ENERGY_IN: "#4ECDC4",
      ENERGY_OUT: "#FFE66D",
      EFFICIENCY: "#95E1D3",
      FLOW: "#38A3A5",
      PUMP_ACTIVE: "#00FFA A",
      PUMP_INACTIVE: "#757575",
      WARNING: "#FFA726",
      ERROR: "#EF5350",
      SUCCESS: "#66BB6A",
    },
  },
}
