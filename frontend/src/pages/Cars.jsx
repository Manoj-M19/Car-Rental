import { useSearchParams } from "react-router-dom";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import Title from "../components/Title";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Cars = () => {
  const [searchParams] = useSearchParams();

  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();

  const [input, setInput] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSearchData = pickupLocation && pickupDate && returnDate;


  useEffect(() => {
    console.log("CARS FROM CONTEXT:", cars);
  }, [cars]);


  useEffect(() => {
    if (!isSearchData) return;

    const fetchAvailability = async () => {
      try {
        const { data } = await axios.post(
          "/api/bookings/check-availability",
          {
            location: pickupLocation,
            pickupDate,
            returnDate,
          }
        );

        if (data.success) {
          setFilteredCars(data.availableCars || []);
          if (!data.availableCars?.length) {
            toast("No cars available");
          }
        }
      } catch {
        toast.error("Availability check failed");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [isSearchData]);

  useEffect(() => {
    if (isSearchData) return;
    if (!cars || cars.length === 0) return;

    const result =
      input.trim() === ""
        ? cars
        : cars.filter((car) =>
            `${car.brand} ${car.model} ${car.category} ${car.transmission}`
              .toLowerCase()
              .includes(input.toLowerCase())
          );

    setFilteredCars(result);
    setLoading(false);
  }, [cars, input, isSearchData]);


  if (loading) {
    return (
      <div className="py-40 text-center text-gray-500">
        Loading cars...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles"
        />

        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500"
          />

          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} cars
        </p>

        {filteredCars.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No cars found
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
            {filteredCars.map((car, index) => (
              <CarCard key={index} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;

