type CarBrandsObject = Record<string, string[]>;

const HEX_RADIX = 16;
const HEX_COLOR_LENGTH = 6;
const MAX_RGB_COLOR = HEX_RADIX ** HEX_COLOR_LENGTH - 1;

const carBrands: CarBrandsObject = {
  Toyota: [
    "Corolla",
    "Camry",
    "Rav4",
    "Highlander",
    "Prius",
    "Tacoma",
    "Sienna",
    "4Runner",
    "Yaris",
    "Avalon",
  ],
  Honda: [
    "Civic",
    "Accord",
    "CR-V",
    "Pilot",
    "Odyssey",
    "Fit",
    "HR-V",
    "Ridgeline",
    "Insight",
    "Passport",
  ],
  Ford: [
    "F-150",
    "Escape",
    "Explorer",
    "Edge",
    "Fusion",
    "Ranger",
    "Mustang",
    "Expedition",
    "Focus",
    "Bronco",
  ],
  Chevrolet: [
    "Silverado",
    "Equinox",
    "Malibu",
    "Traverse",
    "Tahoe",
    "Suburban",
    "Camaro",
    "Colorado",
    "Blazer",
    "Impala",
  ],
  BMW: [
    "3 Series",
    "5 Series",
    "X3",
    "X5",
    "7 Series",
    "X1",
    "X7",
    "4 Series",
    "i3",
    "8 Series",
  ],
  Mercedes: [
    "C-Class",
    "E-Class",
    "GLC",
    "GLE",
    "S-Class",
    "A-Class",
    "GLA",
    "GLB",
    "CLS",
    "GLS",
  ],
  Audi: ["A4", "Q5", "A6", "Q7", "Q3", "A3", "A5", "Q8", "A7", "E-Tron"],
  Nissan: [
    "Altima",
    "Rogue",
    "Sentra",
    "Pathfinder",
    "Maxima",
    "Murano",
    "Titan",
    "Versa",
    "Frontier",
    "Armada",
  ],
  Hyundai: [
    "Elantra",
    "Tucson",
    "Santa Fe",
    "Sonata",
    "Kona",
    "Accent",
    "Palisade",
    "Veloster",
    "Venue",
    "Nexo",
  ],
  Kia: [
    "Optima",
    "Sorento",
    "Sportage",
    "Forte",
    "Soul",
    "Telluride",
    "Rio",
    "Stinger",
    "Cadenza",
    "K900",
  ],
  Volkswagen: [
    "Jetta",
    "Tiguan",
    "Atlas",
    "Passat",
    "Golf",
    "Arteon",
    "Taos",
    "ID.4",
    "Touareg",
    "Atlas Cross Sport",
  ],
  Subaru: [
    "Outback",
    "Forester",
    "Legacy",
    "Crosstrek",
    "Impreza",
    "Ascent",
    "WRX",
    "BRZ",
    "Crosstrek Hybrid",
    "BRZ tS",
  ],
  Tesla: [
    "Model 3",
    "Model S",
    "Model X",
    "Model Y",
    "Cybertruck",
    "Roadster",
    "Semi",
    "Model 2",
    "Model 4",
    "Model C",
  ],
  Mazda: [
    "Mazda3",
    "CX-5",
    "Mazda6",
    "CX-9",
    "CX-30",
    "MX-5 Miata",
    "CX-3",
    "MX-30",
    "RX-8",
    "RX-9",
  ],
  Lexus: ["RX", "ES", "NX", "UX", "IS", "LS", "GX", "LX", "RC", "LC"],
};

const getRandomInt = (min: number, max: number): number => {
  const minNumber = Math.ceil(min);
  const maxNumber = Math.floor(max);
  return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
};

export const getRandomName = (): string => {
  const brands = Object.keys(carBrands);
  const brand = brands[getRandomInt(0, brands.length - 1)];
  const models = carBrands[brand];
  const model = models[getRandomInt(0, models.length - 1)];
  return `${brand} ${model}`;
};

export const getRandomColor = (): string => {
  const hex = Math.floor(Math.random() * MAX_RGB_COLOR)
    .toString(HEX_RADIX)
    .padStart(HEX_COLOR_LENGTH, "0");
  return `#${hex}`;
};
