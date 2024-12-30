import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return(
     <div>
        <div className="text-2xl text-center pt-8 border-t">
          <Title text1={"About "} text2={"Us"} />
        </div>

        <div className="my-10 flex flex-col md:flex-row gap-16">
          <img className="w-full md:max-w-[450px]" src={assets.aboutImage} alt="About image" />
          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
            <p>
              At Click Mart, we are committed to providing you with an exceptional online shopping experience, making every click count. As a modern destination for everything you need, Click Mart aims to offer high-quality products, competitive prices, and excellent customer service, making your shopping easier and more enjoyable.
            </p>
            <p>
              We understand that every customer is unique, which is why we offer a wide range of products to meet every need. Whether you're looking for the latest tech gadgets, stylish clothing, or home and office essentials, Click Mart is the perfect place to find everything in one convenient location.
            </p>
            <b className="text-gray-800">Our Mission</b>
            <p>
              At Click Mart, our mission is to revolutionize the online shopping experience by offering unparalleled convenience, exceptional quality, and outstanding customer service. We are dedicated to providing a diverse range of products that meet the ever-changing needs of our customers, ensuring that every purchase is both simple and rewarding.
            </p>
          </div>
        </div>

        <div className="text-4xl py-4">
          <Title  text1={"Why "} text2={"Choose Us"}/>
        </div>

        <div className="flex flex-col md:flex-row text-sm mb-20">
            <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
              <b>Quality Assurance:</b>
              <p className="text-gray-600">
              At Click Mart, we prioritize quality above all else. Every product in our store is carefully selected and tested to meet the highest standards, ensuring that you receive only the best. We work with trusted suppliers and brands to offer reliable products that meet your needs and exceed your expectations.
              </p>
            </div>
            <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
              <b>Convience:</b>
              <p className="text-gray-600">
              We know that your time is valuable, which is why Click Mart is designed for maximum convenience. With a user-friendly interface, easy navigation, and a seamless checkout process, shopping has never been simpler.
              </p>
            </div>
            <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
              <b>Exceptional Customer Service:</b>
              <p className="text-gray-600">
              At Click Mart, our customers are at the heart of everything we do. Our dedicated support team is always ready to assist you, whether you have a question, need help with an order, or require personalized product recommendations.
              </p>
            </div>
        </div>

        <NewsletterBox/>
        
    </div>
    )
  ;
};

export default About;
