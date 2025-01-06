"use client";

import { useEffect, useRef, useState } from "react";
import "./browseChefPage.css";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { getAllChefs } from "@/api";
import SnackbarComponent from "../components/snackbarComponent";
import BrowsePageSkeleton from "../components/browsePageSkeleton";
import MenuNav from "../components/menuNav";
import useAuthStore from "@/store/authStore";
import { calculateDistanceApart } from "@/utils/functions";



const BrowseChefPage = () => {
  const router = useRouter()

  const [searchFilter, setSearchFilter] = useState({
    location: "",
    chefName: "",
  });
  const [allChefs, setAllChefs] = useState([]);
  const [chefFilterResult, setchefFilterResult] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [noSearch, setNoSearch] = useState(false);

  
  const userInfo = useAuthStore((state) => state.user);
  const enqueueFuncRef = useRef();

  const handleInputChange = (key, value) => {
    setSearchFilter({ ...searchFilter, [key]: value });
  };
 
  const applyFilter = () => {

    if(!searchFilter?.location && !searchFilter?.chefName) {
      setchefFilterResult(allChefs)
      setNoSearch(false)
      return
    }

    let filterRes = allChefs


    if(searchFilter?.location) filterRes = filterRes.filter((chefRes) => chefRes?.location?.toLowerCase().includes(searchFilter?.location.toLowerCase()))
    if(searchFilter?.chefName) filterRes = filterRes.filter((chefRes) => chefRes?.name?.toLowerCase().includes(searchFilter?.chefName.toLowerCase()));

    if(!filterRes[0]) {
      setNoSearch(true)
    } else {
      setNoSearch(false)
    }
    setchefFilterResult(filterRes)
  };

  const goToChefProfile = (chefId) => {
    router.push(`/browse/${chefId}`)
  }
  
  const callEnqueueSnackbar = (message, variant) => {
    if (enqueueFuncRef.current) {
      enqueueFuncRef.current.enqueueSnack(message, variant);
    }
  };

  useEffect(() => {
    fetchAllChefs()
  }, []);
 
  const fetchAllChefs = async() => {
    const fetchResult = await getAllChefs()

    if(fetchResult?.status == 200) {
      setAllChefs(fetchResult?.allChefs)
      setchefFilterResult(fetchResult?.allChefs)
      setShowSkeleton(false)
    } else{
      callEnqueueSnackbar(fetchResult?.errorMessage, "error");
      setShowSkeleton(true)
    }
  }
  

  return (
    <div className="browseChefPage">
      <Navbar />
      <div className="browseChefPage_contentWrapper">
        <div className="searchfilterContainer">
          <h3 className="filterHeader">Filter Search</h3>
          <div className="searchfilterContainer_box">
            <label className="inputLabel addADish" htmlFor="search-location">
              By Location:
            </label>
            <div className="inputBox">
              <input
                type="text"
                placeholder="Search By Chef location"
                name="location"
                id="search-location"
                className="inputEl"
                value={searchFilter.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
            <label className="inputLabel addADish" htmlFor="search-location">
              By Name:
            </label>
            <div className="inputBox">
              <input
                type="text"
                placeholder="Search By Chef Name"
                name="name"
                id="search-name"
                className="inputEl"
                value={searchFilter.chefName}
                onChange={(e) => handleInputChange("chefName", e.target.value)}
              />
            </div>
            <button className="button applyFilterBtn" onClick={applyFilter}>
              <span>Apply filter</span>
            </button>
          </div>
        </div>
        <div className={`searchResultContainer ${!chefFilterResult[0] && 'noSearchRes'}`}>
          {chefFilterResult?.map((res, i) => (
            <div key={i} className="searchResult_chefContainer" onClick={() => goToChefProfile(res?._id || '234')}>
              <div className="searchRes_imageBox">
                <Image
                  src={
                    res?.profilePic
                      ? res?.profilePic
                      : `/images/chef_drawing_one.png`
                  }
                  width={500}
                  height={500}
                  alt="chef drawing"
                  className={`searchRes_chefPicture`}
                />
              </div>
              <div className="searchRes_DetailsBox">
                <h3 className="chefName">{res?.name}</h3>
                <p className="chefTitle">{res?.title.length > 60 ? res?.title.slice(0, 60) + '...' : res?.title}</p>
                <div className="locationContainer">
                  <p>{res?.location}</p>
                  <p className="distanceAway">({calculateDistanceApart(userInfo?.position, res?.position) || '__'} away)</p>
                </div>
              </div>
            </div>
          ))}
          {noSearch && !showSkeleton && (
            <div className="noSearchRes_container">
              <Image
                src='/images/noSearch.png'
                width={500}
                height={500}
                alt="chef drawing"
                className={`noSearchRes_icon`}
              />
            </div>
          )}
          {showSkeleton && <BrowsePageSkeleton />}
        </div>
      </div>
      <MenuNav />
      <SnackbarComponent ref={enqueueFuncRef} />
    </div>
  );
};

export default BrowseChefPage;
