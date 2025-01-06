"use client";

import "./exploreDishesPage.css";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ExpandedDishDetails from '@/explorePageComponents/expandedDishDetails';
import useProfilePageStore from "@/store/profilePageStore";
import { getAllDish } from "@/api";
import SnackbarComponent from "../components/snackbarComponent";
import BrowsePageSkeleton from "../components/browsePageSkeleton";
import MenuNav from "../components/menuNav";



const ExploreDishesPage = () => {
  const setExpandedDishDetails = useProfilePageStore((state) => state.setExpandedDishDetails);

  const [searchFilter, setSearchFilter] = useState({
    dishName: "",
  });
  const [allDish, setAllDish] = useState([]);
  const [dishesFilterResult, setDishesFilterResult] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [noSearch, setNoSearch] = useState(false);
  
  const enqueueSnack = useProfilePageStore((state) => state.enqueueSnack);
    
  const enqueueFuncRef = useRef();


  const handleInputChange = (key, value) => {
    setSearchFilter({ ...searchFilter, [key]: value });
  };

  const callEnqueueSnackbar = (message, variant) => {
    if (enqueueFuncRef.current) {
      enqueueFuncRef.current.enqueueSnack(message, variant);
    }
  };

  const applyFilter = () => {
    if(!searchFilter?.dishName) {
      setDishesFilterResult(allDish)
      setNoSearch(false)
      return
    }

    let filterRes = allDish

    if(searchFilter?.dishName) filterRes = filterRes.filter((dishRes) => dishRes?.name?.toLowerCase().includes(searchFilter?.dishName?.toLowerCase()));
    
    if(!filterRes[0]) {
      setNoSearch(true)
    } else {
      setNoSearch(false)
    }

    setDishesFilterResult(filterRes)
  };

  const expandDishDetails = (dish) => {
    setExpandedDishDetails(dish)
  }
 

  useEffect(() => {
    fetchAllDish()
  }, []);

  const fetchAllDish = async() => {
    const fetchResult = await getAllDish()

    if(fetchResult?.status == 200) {
      setAllDish(fetchResult?.allDish)
      setDishesFilterResult(fetchResult?.allDish)
      setShowSkeleton(false)
    } else{
      callEnqueueSnackbar(fetchResult?.errorMessage, "error");
      setShowSkeleton(true)
    }
  }

  useEffect(() => {
    if(enqueueSnack?.message) {
      callEnqueueSnackbar(enqueueSnack?.message, enqueueSnack?.type)
    }
  }, [enqueueSnack])

  return (
    <div className="exploreDishesPage">
      <Navbar />
      <div className="browseChefPage_contentWrapper">
        <div className="searchfilterContainer">
          <h3 className="filterHeader">Filter Search</h3>
          <div className="searchfilterContainer_box">
            <label className="inputLabel addADish" htmlFor="search-location">
              By Name:
            </label>
            <div className="inputBox">
              <input
                type="text"
                placeholder="Search By Dish Name"
                name="name"
                id="search-name"
                className="inputEl"
                value={searchFilter?.dishName}
                onChange={(e) => handleInputChange("dishName", e.target.value)}
              />
            </div>
            <button className="button applyFilterBtn" onClick={applyFilter}>
              <span>Apply filter</span>
            </button>
          </div>
        </div>
        <div
          className={`dishSearchResultContainer ${ 
            !dishesFilterResult[0] && "noSearchRes"
          }`}
        >
          {dishesFilterResult?.map((dish, i) => (
            <div key={i} className="dish_container" onClick={() => expandDishDetails(dish)}>
              <div className="dishImage_container">
                <Image
                  src={dish?.images[0]}
                  width={500}
                  height={500}
                  alt="chef drawing"
                  className={`dishImage`}
                />
              </div>
              <p className="dishName">{dish.name.length > 70 ? dish.name.slice(0, 70) + '...' : dish.name}</p>
            </div>
          ))}
          {noSearch && !showSkeleton && (
            <>
            <div className="noSearchRes_container">
              <Image
                src="/images/noSearch.png"
                width={500}
                height={500}
                alt="chef drawing"
                className={`noSearchRes_icon`}
              />
            </div>
            </>
          )}
          {showSkeleton && <BrowsePageSkeleton />}
        </div>
      </div>
      <ExpandedDishDetails />
      <MenuNav />
      <SnackbarComponent ref={enqueueFuncRef} />
    </div> 
  );
};

export default ExploreDishesPage;
