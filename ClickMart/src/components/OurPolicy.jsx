import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faHeadset,
  faHourglassStart,
} from "@fortawesome/free-solid-svg-icons";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-base text-gray-700">
      <div>
        <FontAwesomeIcon
          className="w-12 m-auto mb-5"
          icon={faArrowRightArrowLeft}
          style={{ color: "#000000", fontSize: 30 }}
        />
        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="text-gray-400">We offer hassle free exchange policy</p>
      </div>
      <div>
        <FontAwesomeIcon
          className="w-12 m-auto mb-5"
          icon={faHourglassStart}
          style={{ color: "#000000", fontSize: 30 }}
        />
        <p className="font-semibold">Days Return Policy</p>
        <p className="text-gray-400">We provide 7 days free return policy</p>
      </div>
      <div>
        <FontAwesomeIcon
          className="w-12 m-auto mb-5"
          icon={faHeadset}
          style={{ color: "#000000", fontSize: 30 }}
        />
        <p className="font-semibold">Best costumer support</p>
        <p className="text-gray-400">We provide 24/7 support</p>
      </div>
    </div>
  );
};

export default OurPolicy;
