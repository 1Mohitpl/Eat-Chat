import RestaurantCard from "./RestraurantCard";
import { useState, useEffect } from "react";
import Shimmer from "./shimmer";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { filterData } from "../../utils/helper";
import { getRestaurants } from "../services/api";
import useOnline from "../../utils/useOnline";
import { mockRestaurantsList } from "../mocks/restaurants";



const Body = () => {
    // const searchTxt = "kfc"  // this is how created varibale in normla javascript it is hardcoded value,
    // seachText is a local varivable 
    const [allRestaurants, setallRestaurants] = useState([]);
    const [filteredRestaurants, setfilteredRestaurants] = useState([]);
    const [searchText, setSearchText] = useState(""); // to create state variable

    useEffect(()=>{
     //api
     getRestraurants();
     
    }, []);

    async function getRestraurants() {
       try {
         const restaurants = await getRestaurants();
         setallRestaurants(restaurants);
         setfilteredRestaurants(restaurants);
       } catch (error) {
         console.warn("Failed to fetch restaurants from API, using mock data:", error);
         const mockRestaurants = mockRestaurantsList?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants;
         setallRestaurants(mockRestaurants || []);
         setfilteredRestaurants(mockRestaurants || []);
       }
    };
  
 const statusOnline = useOnline();
 if(!statusOnline) {
   return (
      <div>
         <span> Check your Connection !</span>
      </div>
   )
  
      
  
 }
// if(!allRestaurants) 
//   return null;
// if(filteredRestaurants?.length === 0) return (
//   <h1>No records</h1>
// )

 return allRestaurants?.length === 0 ?( <Shimmer /> ): (
        <>
      <div className="search-container"> 
       <input type="text" className="search-input"
        placeholder="Search" 
         value={searchText}
         onChange={(e)=>{
          setSearchText(e.target.value);
             
         }}
       ></input>
        <button  className="search-btn"
        onClick={()=>{
            // need to filter the data form data
            const data = filterData(searchText, allRestaurants);
            setfilteredRestaurants(data);
        }}
         
        ><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
    
      </div>

     
       <div className="Restraulist">
       {filteredRestaurants.map((Restraurent)=>{
         return (
         <Link to={"/restaurant/" + Restraurent.info.id} key={Restraurent.info.id}>
         <RestaurantCard {...Restraurent.info}/>
         </Link>
         )
       })}
       </div>
       </>
     );
   
   };

   export default Body;



   