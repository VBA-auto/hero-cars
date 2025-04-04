"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import VerticalSlider from "@/Components/VerticalSlider";
import Link from "next/link";
import ProductCardSkeleton from "./CardSkeleton";

const Featured = () => {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [gearboxes, setGearboxes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    mileage: "",
    fuel: "",
    gearbox: "",
    price: "",
    location: "",
  });
  const [cardLoad, setCardLoad] = useState(true);

  useEffect(() => {
    setCardLoad(true);
    fetch("/api/get")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setCars(data);
          setBrands([...new Set(data.map((car) => car.brand))]);
          setModels([...new Set(data.map((car) => car.model))]);
          setFuels([...new Set(data.map((car) => car.fuel))]);
          setGearboxes([...new Set(data.map((car) => car.gearbox))]);
          setLocations([...new Set(data.map((car) => car.location))]);
        } else {
          console.error("Invalid data format:", data);
        }
        setCardLoad(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setCardLoad(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      brand: "",
      model: "",
      mileage: "",
      fuel: "",
      gearbox: "",
      price: "",
      location: "",
    });
    setSearchTerm("");
  };

  const filteredCars = cars.filter((car) => {
    return (
      (car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.brand ? car.brand === filters.brand : true) &&
      (filters.model ? car.model === filters.model : true) &&
      (filters.mileage ? car.mileage <= filters.mileage : true) &&
      (filters.fuel ? car.fuel === filters.fuel : true) &&
      (filters.gearbox ? car.gearbox === filters.gearbox : true) &&
      (filters.price ? car.price <= filters.price : true) &&
      (filters.location ? car.location === filters.location : true)
    );
  });

  // ✅ Get similar cars excluding duplicates from filteredCars
  const getSimilarProducts = () => {
    const shownIds = new Set(filteredCars.map((car) => car._id));

    return cars.filter((car) => {
      const matchesFilter =
        (filters.brand && car.brand === filters.brand) ||
        (filters.fuel && car.fuel === filters.fuel) ||
        (filters.location && car.location === filters.location);

      const notAlreadyShown = !shownIds.has(car._id);
      return matchesFilter && notAlreadyShown;
    });
  };

  return (
    <div className="pb-16">
      <div className="bg-gray-0 my-4">
        <VerticalSlider />
      </div>

      {/* Search Bar and Filters */}
      <div className="mb-6">
        <div className="md:w-3/4 mx-auto">
          <input
            type="text"
            placeholder="Search by make, model or keyword (e.g. Renault Clio)"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-orange-300 text-sm rounded-lg p-2 w-full"
          />
        </div>
        <div className="flex justify-center flex-wrap mt-4">
          <select
            name="brand"
            onChange={handleFilterChange}
            value={filters.brand}
            className="border border-orange-300 text-sm rounded-lg px-2 mr-2"
          >
            <option value="">Marque</option>
            {brands.map((brand, index) => (
              <option key={index} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            name="model"
            onChange={handleFilterChange}
            value={filters.model}
            className="border border-orange-300 text-sm rounded-lg px-2 mr-2"
          >
            <option value="">Modèle</option>
            {models.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>

          <select
            name="fuel"
            onChange={handleFilterChange}
            value={filters.fuel}
            className="border border-orange-300 text-sm rounded-lg px-2 mr-2"
          >
            <option value="">Energie</option>
            {fuels.map((fuel, index) => (
              <option key={index} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>

          <select
            name="gearbox"
            onChange={handleFilterChange}
            value={filters.gearbox}
            className="border border-orange-300 text-sm rounded-lg px-2 mr-2"
          >
            <option value="">Transmission</option>
            {gearboxes.map((gearbox, index) => (
              <option key={index} value={gearbox}>
                {gearbox}
              </option>
            ))}
          </select>

          <select
            name="location"
            onChange={handleFilterChange}
            value={filters.location}
            className="border border-orange-300 text-sm rounded-lg px-2 mr-2"
          >
            <option value="">Localisation</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="border border-orange-300 text-sm rounded-lg px-5 bg-orange-300 text-white hover:bg-red-600 transition"
          >
            Remise à 0
          </button>
        </div>
      </div>

      {/* Selected Filters */}
      <div className="text-xs text-gray-600 mb-4">
        Selected Filters:{" "}
        {Object.entries(filters).map(([key, value]) => {
          if (value) {
            return (
              <span key={key} className="mr-2">
                {key}: {value}
              </span>
            );
          }
          return null;
        })}
      </div>

      {/* Main Logic */}
      {cardLoad ? (
        // ⏳ Skeletons while loading
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCars.length > 0 ? (
        // ✅ Filtered car results
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCars.map((car, index) => (
            <Link
              key={index}
              href={`/cars/${car.brand.toLowerCase().replace(/\s+/g, "-")}-${
                car._id
              }`}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="relative w-full mb-4">
                  <Image
                    src={car?.images[0]}
                    alt={`${car.brand} ${car.model}`}
                    width={400}
                    height={400}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{car.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {car.year} - {car.mileage} Km
                    </p>
                    <p className="text-gray-600 text-sm">Fuel: {car.fuel}</p>
                    <p className="text-gray-600 text-sm">
                      Gearbox: {car.gearbox}
                    </p>
                  </div>
                  <p className="text-orange-400 text-sm">{car.price} €</p>
                </div>
                <button className="cursor-pointer mt-4 w-full bg-orange-300 text-white py-2 rounded-lg hover:bg-orange-400 transition text-sm">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // ❌ No match — show similar
        <div className="text-center mt-8">
          <p className="text-lg text-gray-600 mb-4">
            No cars found. Try adjusting your filters or{" "}
            <span
              className="text-orange-300 cursor-pointer"
              onClick={clearFilters}
            >
              search directly
            </span>
            .
          </p>
          <h3 className="text-2xl font-bold mb-4">
            Similar Cars You Might Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getSimilarProducts().map((car, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
                <div className="relative h-40 w-full mb-4">
                  <Image
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model}`}
                    width={400}
                    height={400}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{car.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {car.year} - {car.mileage} Km
                    </p>
                    <p className="text-gray-600 text-sm">Fuel: {car.fuel}</p>
                    <p className="text-gray-600 text-sm">
                      Gearbox: {car.gearbox}
                    </p>
                  </div>
                  <p className="text-orange-400 text-sm">{car.price} €</p>
                </div>
                <button className="cursor-pointer mt-4 w-full bg-orange-300 text-white py-2 rounded-lg hover:bg-orange-400 transition text-sm">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Featured;
