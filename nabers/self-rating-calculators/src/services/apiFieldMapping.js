const apiInputsMapping = {
  'TotalArea': 'floorspace',
  'TotalHours': 'hoursOccupiedPerWeek',
  'TotalComputerCount': 'numberOfComputers',
  'AAAStarRating': 'qualityStarRating',
  'TotalGuestRooms': 'numberOfRooms',
  'GuestRoomsLaunderService': 'roomsFullService',
  'FunctionRoomSeats': 'functionRoomSeats',
  'HeatedPoolsSurfaceArea': 'surfaceAreaHeatedPools',
  'FloorConfiguration': 'multiStorey',
  'TotalShoppingGLAR': 'grossLettableAreaRetail',
  'CentralServicedArea': 'totalCentrallyServicedArea',
  'TradingDays': 'tradingDays',
  'HoursofService': 'hoursOperatedPerWeek',
  'ParkingSpacesMechanical': 'mechanicallyVentilatedCarSpaces',
  'ParkingSpacesNatural': 'naturallyVentilatedCarSpaces',
  'ProcessingCapacity': 'processingCapacity',
  'StorageCapacity': 'StorageCapacity',
  'NoOfDays': 'daysOfEnergyData',
  'FoodCourtSeats': 'foodCourtSeats',
  'CinemaTheatres': 'cinemaTheatrettes',
  'TotalGymGLAR': 'totalAreaGymnasiums',
  'EnergyInputs': {
    'Electricity': 'totalElectricityUse',
    'GreenPower': 'greenPowerPercentage',
    'Gas': 'totalNaturalGas',
    'Diesel': 'totalDieselUse',
    'Coal': 0,
    'LPG': 0,
    'HeatRejection': 0,
    'ITEnergy': 'total_energy_consumed'
  },
  'WaterInputs': {
    'Water': 'totalWaterUse',
    'RecycledWater': 'recycledWaterPercentage'
  },
  'IEInputs': {
    'ThermalComfortAnnualMonitoring': 'annualMonitoring',
    'ThermalComfortSpotMeasurements': 'spotMeasurements',
    'IndoorAirQualityParticulateMatter': 'particulateMatter',
    'IndoorAirQualityVentilationEffectivness': 'ventilationEffectiveness',
    'IndoorAirQualityCarbonMonoxide': 'carbonMonoxide',
    'IndoorAirQualityTotalVOCs': 'totalVolatileOrganicCompounds',
    'IndoorAirQualityFormaldehyde': 'formaldehyde',
    'LightingHorizontalIlluminance': 'horizontalIlluminance',
    'AcousticMeasurementTenancyWholeBenchmark': 'acousticMeasurementPercentage',
    'AcousticMeasurementBaseBenchmark': 'acousticMeasurementDB',
    'OccupantSurveyThermalComfort': 'thermalComfort',
    'OccupantSurveyIndoorAirQuality': 'indoorAirQuality',
    'OccupantSurveyLighting': 'lighting',
    'OccupantSurveyAcoustics': 'acoustics',
    'OccupantSurveyOfficeLayout': 'officeLayout'
  },
}

export default apiInputsMapping
