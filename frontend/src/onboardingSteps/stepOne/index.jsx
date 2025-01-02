"use client";

import './stepOne.css';
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const OnboardingStepOne = ({ userRole, selectRole, onboardStep}) => {


  return ( 
    <div className={`step_wrapper_one ${onboardStep == 1 && 'visible'}`}>
      <h1 className="pageTitle_step_one">Select Your Purpose</h1>
      <div className="roleContainer_Wrapper_one">
        <div
          onClick={() => selectRole("client")}
          className={`roleContainer ${userRole == "client" && "selected"} `}
        >
          <Image
            src={`/images/client_card.png`}
            width={240}
            height={240}
            alt="user role icon"
            className={`userRoleIcon`}
          />
          <div className="user_role_text">
            <p>Client</p>
          </div>
          <div className="selectedIndicator">
            {userRole == "client" && <CheckCircleIcon className='checkCircIcon' />}
          </div>
        </div>
        <div
          onClick={() => selectRole("chef")}
          className={`roleContainer ${userRole == "chef" && "selected"} `}
        >
          <Image
            src={`/images/chef_hat.png`}
            width={240}
            height={240}
            alt="user role icon"
            className={`userRoleIcon`}
          />
          <div className="user_role_text">
            <p>Chef</p>
          </div>
          <div className="selectedIndicator">
            {userRole == "chef" && <CheckCircleIcon className='checkCircIcon' />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepOne;
