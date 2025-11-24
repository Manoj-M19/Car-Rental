import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOwnerCars = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/owner/cars");
      const data = res?.data;

      if (data?.success && Array.isArray(data.cars)) {
        setCars(data.cars);
      } else if (data?.success && data.cars == null) {
        setCars([]);
      } else {
        setCars([]);
        toast.error(data?.message || "Failed to load cars");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const res = await axios.post("/api/owner/toggle-car", { carId });
      const data = res?.data;
      if (data?.success) {
        if (Array.isArray(data.cars)) {
          setCars(data.cars);
        } else {
          await fetchOwnerCars();
        }
        toast.success(data?.message || "Availability updated");
      } else {
        toast.error(data?.message || "Failed to toggle availability");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg);
    }
  };

  const deleteCar = async (carId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this car?"
      );
      if (!confirmDelete) return;

      const res = await axios.post("/api/owner/delete-car", { carId });
      const data = res?.data;
      if (data?.success) {
        if (Array.isArray(data.cars)) {
          setCars(data.cars);
        } else {
          await fetchOwnerCars();
        }
        toast.success(data?.message || "Car deleted");
      } else {
        toast.error(data?.message || "Failed to delete car");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg);
    }
  };

  useEffect(() => {
    if (isOwner) fetchOwnerCars();
  }, [isOwner]);

  const safeCars = Array.isArray(cars) ? cars : [];

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : safeCars.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No cars found.
                </td>
              </tr>
            ) : (
              safeCars.map((car) => (
                <tr
                  key={
                    car?._id || `${car?.brand}-${car?.model}-${Math.random()}`
                  }
                  className="border-t border-borderColor"
                >
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={car?.image || assets.placeholder_image}
                      alt={`${car?.brand || ""} ${car?.model || ""}`}
                      className="h-12 w-12 aspect-square rounded-md object-cover"
                    />
                    <div className="max-md:hidden">
                      <p className="font-medium">
                        {car?.brand} {car?.model}
                      </p>
                      <p className="text-xs text-gray-500">
                        {car?.seating_capacity} · {car?.transmission}
                      </p>
                    </div>
                  </td>

                  <td className="p-3 max-md:hidden">{car?.category}</td>

                  <td className="p-3">
                    {currency}
                    {car?.pricePerDay}/day
                  </td>

                  <td className="p-3 max-md:hidden">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        car?.isAvailable
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {car?.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  <td className="flex items-center gap-3 p-3">
                    <button
                      onClick={() => toggleAvailability(car._id)}
                      aria-label={
                        car?.isAvailable ? "Mark unavailable" : "Mark available"
                      }
                      className="p-1 rounded hover:bg-gray-100"
                      title={
                        car?.isAvailable ? "Mark unavailable" : "Mark available"
                      }
                    >
                      <img
                        src={
                          car?.isAvailable
                            ? assets.eye_close_icon
                            : assets.eye_icon
                        }
                        alt={car?.isAvailable ? "Hide" : "Show"}
                        className="cursor-pointer"
                      />
                    </button>

                    <button
                      onClick={() => deleteCar(car._id)}
                      aria-label="Delete car"
                      className="p-1 rounded hover:bg-gray-100"
                      title="Delete car"
                    >
                      <img
                        src={assets.delete_icon}
                        alt="Delete"
                        className="cursor-pointer"
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;
