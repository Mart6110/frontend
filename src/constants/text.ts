// Application Text Constants
export const APP_TEXT = {
  // Application Name
  APP_NAME: "Sandbatteri",
  
  // Navigation
  NAV: {
    SIMPLE_VIEW: "Standard Dashboard",
    ADVANCED_VIEW: "Avanceret Dashboard",
    SETTINGS: "Indstillinger",
    LOGOUT: "Log ud",
  },

  // Home Page
  HOME: {
    WELCOME_TITLE: "Velkommen",
    WELCOME_MESSAGE: "Indtast din produktnøgle for at få adgang til kontrolpanelet.",
    API_KEY_PLACEHOLDER: "Produktnøgle",
    SUBMIT_BUTTON: "Anvend",
    VALIDATING: "Validerer...",
    ERROR: {
      INVALID_KEY: "Ugyldig produktnøgle. Tjek venligst og prøv igen.",
      NETWORK_ERROR: "Kan ikke oprette forbindelse til serveren. Tjek venligst din forbindelse og prøv igen.",
      SERVER_ERROR: "Serverfejl. Prøv venligst igen senere.",
      UNKNOWN_ERROR: "Der opstod en uventet fejl. Prøv venligst igen.",
    },
  },

  // Standard Dashboard Page
  SIMPLE_VIEW: {
    TITLE: "Standard Dashboard",
    CONTENT: "Standard dashboard visningsindhold kommer her.",
  },

  // Advanced Dashboard Page
  ADVANCED_VIEW: {
    TITLE: "Avanceret Dashboard",
    CONTENT: "Avanceret dashboard visningsindhold kommer her.",
  },

  // Dashboard Common
  DASHBOARD: {
    // KPI Labels
    KPI: {
      TEMPERATURE: "Temperatur",
      SAND_SIDE: "Sand Side",
      SAND_CORE: "Sand Kerne",
      ENERGY_IN: "Energi Ind",
      ENERGY_OUT: "Energi Ud",
      ENERGY: "Energi",
      EFFICIENCY: "Effektivitet",
      PUMP_STATUS: "Pumpestatus",
      HEATER_STATUS: "Varmerstatus",
      FLOW_RATE: "Flowhastighed",
      STATE_OF_CHARGE: "Ladetilstand",
      POWER: "Effekt",
      WATER_TEMP_IN: "Vandtemp Ind",
      WATER_TEMP_OUT: "Vandtemp Ud",
    },
    
    // Chart Titles
    CHARTS: {
      TEMPERATURE_HISTORY: "Temperaturhistorik",
      ENERGY_TRANSFER: "Energioverførsel",
      FLOW_RATE: "Flowhastighed",
      PUMP_ACTIVITY: "Pumpeaktivitet",
      EFFICIENCY_TREND: "Effektivitetstrend",
      TEMPERATURE_VS_PUMP: "Temperatur vs Pumpeaktivitet",
      SYSTEM_OVERVIEW: "Systemoversigt",
    },
    
    // Status Labels
    STATUS: {
      PUMP_ON: "Kører",
      PUMP_OFF: "Stoppet",
      HEATER_ON: "Tændt",
      HEATER_OFF: "Slukket",
      SYSTEM_ACTIVE: "Aktiv",
      SYSTEM_IDLE: "Inaktiv",
      CHARGING: "Oplader",
      DISCHARGING: "Aflader",
      STANDBY: "Standby",
    },
    
    // Time Range Options
    TIME_RANGE: {
      LIVE: "Live",
      ONE_HOUR: "1 Time",
      SIX_HOURS: "6 Timer",
      TWELVE_HOURS: "12 Timer",
      ONE_DAY: "1 Dag",
      ONE_WEEK: "1 Uge",
      ONE_MONTH: "1 Måned",
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
      PUMP_START: "Pumpe Startet",
      PUMP_STOP: "Pumpe Stoppet",
      TEMPERATURE_HIGH: "Høj Temperatur",
      TEMPERATURE_LOW: "Lav Temperatur",
      CHARGING_START: "Opladning Startet",
      CHARGING_STOP: "Opladning Stoppet",
      DISCHARGING_START: "Afladning Startet",
      DISCHARGING_STOP: "Afladning Stoppet",
      ERROR: "Fejl",
      WARNING: "Advarsel",
    },
    
    // Loading & Error States
    LOADING: "Indlæser data...",
    NO_DATA: "Ingen data tilgængelig",
    ERROR: "Kunne ikke indlæse data",
    UPDATING: "Opdaterer...",
  },

  // Settings
  SETTINGS: {
    TITLE: "Indstillinger",
    SECTION_TITLE: "Sandbatteri Konfiguration",
    SAVE_BUTTON: "Gem Indstillinger",
    LOADING: "Indlæser indstillinger...",
    SUCCESS: "Indstillinger gemt",
    ERROR: "Kunne ikke gemme indstillinger",
    
    // Form Fields
    MAX_SAND_TEMP: {
      LABEL: "Maksimal Sandtemperatur",
      PLACEHOLDER: "70",
      HELPER: "Maksimal sandtemperatur i °C – varmelegeme deaktiveres ved overskridelse (max 70°C)",
    },
    MIN_PUMP_TEMP: {
      LABEL: "Minimum Pumpetemperatur",
      PLACEHOLDER: "50",
      HELPER: "Minimumstemperatur i °C for aktivering af vandpumpe ved automatisk drift",
    },
    PUMP_INTERVAL: {
      LABEL: "Pumpeinterval",
      PLACEHOLDER: "300",
      HELPER: "Interval i sekunder for pulsbaseret pumpeaktivering",
    },
    PRICE_LIMIT: {
      LABEL: "Prisgrænse",
      PLACEHOLDER: "1.50",
      HELPER: "Maksimal elpris i DKK/kWh for automatisk aktivering af varmelegeme",
    },
    AUTO_HEATING: {
      LABEL: "Automatisk Varmestyring",
      HELPER: "Aktivér/deaktivér automatisk styring af varmelegeme",
    },
    AUTO_PUMP: {
      LABEL: "Automatisk Pumpstyring",
      HELPER: "Aktivér/deaktivér automatisk pumpstyring",
    },
  },

  // Dialogs
  DIALOGS: {
    CLEAR_API_KEY: {
      TITLE: "Ryd Produktnøgle",
      MESSAGE: "Er du sikker på, at du vil rydde din produktnøgle? Du vil blive logget ud.",
      CANCEL: "Annuller",
      CONFIRM: "Ryd",
    },
  },

  // Footer
  FOOTER: {
    COPYRIGHT: (year: number) => `© ${year} Sandbatteri`,
  },

  // Validation Messages
  VALIDATION: {
    API_KEY: {
      REQUIRED: "Produktnøgle er påkrævet",
      MIN_LENGTH: "Produktnøgle skal være mindst 10 tegn",
    },
    MAX_SAND_TEMP: {
      REQUIRED: "Maksimal sandtemperatur er påkrævet",
      MIN: "Skal være mindst 1°C",
      MAX: "Kan ikke overstige 70°C (kabelspecifikation)",
    },
    MIN_PUMP_TEMP: {
      REQUIRED: "Minimum pumpetemperatur er påkrævet",
      MIN: "Skal være mindst 1°C",
      LESS_THAN_MAX: "Skal være mindre end maksimal sandtemperatur",
    },
    PUMP_INTERVAL: {
      REQUIRED: "Pumpeinterval er påkrævet",
      MIN: "Skal være mindst 1 sekund",
    },
    PRICE_LIMIT: {
      REQUIRED: "Prisgrænse er påkrævet",
      MIN: "Skal være mindst 0 DKK/kWh",
    },
  },

  // Aria Labels
  ARIA: {
    SETTINGS_BUTTON: "Indstillinger",
    CLEAR_API_KEY_BUTTON: "Ryd Produktnøgle",
    COLOR_MODE_BUTTON: "Skift farvetilstand",
  },

  // Error Page
  ERROR: {
    NOT_FOUND_TITLE: "Side Ikke Fundet",
    NOT_FOUND_MESSAGE: "Den side du leder efter eksisterer ikke eller er blevet flyttet.",
    GENERAL_TITLE: "Noget Gik Galt",
    GENERAL_MESSAGE: "Der opstod en uventet fejl. Prøv venligst igen senere.",
    GO_HOME: "Gå til Hjem",
    GO_BACK: "Gå Tilbage",
    DEBUG_INFO: "Fejldetaljer (Udviklingstilstand):",
  },
}

// Application Configuration Constants
export const APP_CONFIG = {
  DEFAULT_VALUES: {
    MAX_SAND_TEMP: 70,
    MIN_PUMP_TEMP: 50,
    PUMP_INTERVAL_SECONDS: 300,
    PRICE_LIMIT_DKK: 1.50,
    AUTO_HEATING_ENABLED: true,
    AUTO_PUMP_ENABLED: true,
  },
  
  LIMITS: {
    MAX_SAND_TEMP: { MIN: 1, MAX: 70 },
    MIN_PUMP_TEMP: { MIN: 1, MAX: 69 },
    PUMP_INTERVAL_SECONDS: { MIN: 1, MAX: 3600 },
    PRICE_LIMIT_DKK: { MIN: 0, MAX: 10 },
  },
  
  // Dashboard Configuration
  DASHBOARD: {
    // Update Intervals (in milliseconds)
    UPDATE_INTERVALS: {
      REAL_TIME: 5000,      // 5 seconds
      EFFICIENCY: 60000,     // 60 seconds
      HISTORICAL: 300000,    // 5 minutes
    },
    
    // Chart Configuration
    CHART: {
      MIN_DATA_POINTS: 100,
      MAX_DATA_POINTS: 500,
      ANIMATION_DURATION: 0,  // Disabled for better performance
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
    
    // Color Scheme (using logo colors: #D4A373 tan/brown, #0d9488 teal)
    COLORS: {
      TEMPERATURE: "#D4A373",
      ENERGY_IN: "#0d9488",
      ENERGY_OUT: "#D4A373",
      EFFICIENCY: "#0d9488",
      FLOW: "#D4A373",
      PUMP_ACTIVE: "#0d9488",
      PUMP_INACTIVE: "#757575",
      WARNING: "#FFA726",
      ERROR: "#EF5350",
      SUCCESS: "#66BB6A",
    },
  },
}
