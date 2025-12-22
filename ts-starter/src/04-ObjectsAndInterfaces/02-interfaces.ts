interface Car {
  make: string;
  model: string;
}

type Bike = {
  make: string;
  gears: number;
};

const car: Car = { make: "Tesla", model: "Model 3" };
const bike: Bike = { make: "Yamaha", gears: 6 };

interface ElectricCar extends Car {
  batteryCapacity: number;
}

const eCar: ElectricCar = {
  make: "Tesla",
  model: "Model S",
  batteryCapacity: 100,
};

type ElectricBike = Bike & {
  battery: number;
};

const eBike: ElectricBike = {
  make: "Ather",
  gears: 1,
  battery: 2.9,
};
