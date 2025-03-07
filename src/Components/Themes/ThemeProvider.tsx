import React, { useState, useEffect } from "react";

//type Theme =  string
// const lightimages = [
//   "/sliderImages/day1.png",
//   "/sliderImages/day2.png",
//   "/sliderImages/day3.png",
//   "/sliderImages/day4.png",
//   ]
// const darkimages = [
//   "/sliderImages/night1.png",
//   "/sliderImages/night2.png",
//   "/sliderImages/night3.png",
//   "/sliderImages/night4.png",
//   ]
const darkimages = ["/images/dark.jpg"];
const lightimages = ["/images/light.jpg"];

// public folder is in the same order as the src.
//To import images from public: started the path from inside the public folder.
// ex: /<imagefolder>/image.png
const Theme = {
  light:{
    color6: '#272626',
    color5:'#05f589',
    color4:'white',
    color3:'#A1A1A1',
    color2:'#0096FA',
    color:'#0096FA',
    backgroundColor:'#FFF',
    backgroundColor2:'#06b8eb',
    backgroundColor3:'#CEE1F2',
    rgbBackgroundColor:"255, 255, 255",
    backgroundImage: lightimages,
    transition: "all 1s ease-in-out",

    borderColor: "cyan",
    hoverBackgroundColor: "#F5F5F5",
  },
  dark:{
    color6:'#999a99',
    color5: '#dd05f5',
    color4:'#61dafb',
    color3:'#ECECEC',
    color2:'#EBEBEB',
    color:'#61dafb',
    backgroundColor:'#1a1a2e',
    backgroundColor2:'#1a1a2e',
    backgroundColor3:'#cbe7efe6',
    rgbBackgroundColor:"26, 26, 46",
    backgroundImage: darkimages,
    transition: "all 1s ease-in-out",
    borderColor: "red",
    hoverBackgroundColor: "#302e4d",
  },
};

const initialState = {
  dark: false,
  theme: Theme.light,
  toggleTheme: () => {},
};

const ThemeContext = React.createContext(initialState);

function ThemeProvider({ children }) {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("isDarkMode");
    return savedTheme !== null ? JSON.parse(savedTheme) : false;
  };
  const [dark, SetDark] = useState(getInitialTheme); // Now we get state from function
  useEffect(() => {
    // Update local storage when the theme changes
    localStorage.setItem("isDarkMode", JSON.stringify(dark));
  }, [dark]);
  const toggleTheme = () => {
    SetDark((prevDark) => !prevDark); // Toggles dark mode without a separate state change
  };
  const theme = dark ? Theme.dark : Theme.light;
  return <ThemeContext.Provider value={{ theme, dark, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export { ThemeContext, ThemeProvider };
