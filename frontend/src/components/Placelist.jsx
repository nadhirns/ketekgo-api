import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Placelist = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    getPlaces();
  }, []);

  const getPlaces = async () => {
    const response = await axios.get("http://localhost:5000/places");
    setPlaces(response.data.data);
  };

  const deletePlace = async (placeId) => {
    await axios.delete(`http://localhost:5000/places/${placeId}`);
    getPlaces();
  };
  return (
    <div>
      <h1 className="title">Places</h1>
      <h2 className="subtitle">List of Place</h2>
      <Link to="/places/add" className="button is-primary mb-2">
        Add New
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Place Name</th>
            <th>Location</th>
            <th>Description</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {places.map((place, index) => (
            <tr key={place.id}>
              <td>{index + 1}</td>
              <td>{place.place_name}</td>
              <td>{place.location}</td>
              <td>{place.description}</td>
              <td>{place.price}</td>
              <td>{place.rating}</td>
              <td>
                <Link to={`/places/edit/${place.id}`} className="button is-small is-info">
                  Edit
                </Link>{" "}
                &nbsp;
                <button onClick={() => deletePlace(place.id)} className="button is-small is-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Placelist;
