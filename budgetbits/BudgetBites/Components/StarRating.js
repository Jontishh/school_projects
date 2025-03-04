import React from "react";
import { StyleSheet, View, Image } from "react-native";
// This component is taken and changed for our implementation from github, by Hassan Ahmed Khan
//The link to github: https://github.com/ihak/star-rating-react-native/tree/master/StarRating 

const StarRating = ({ ratingObj }) => {
  const { ratings } = ratingObj;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    let path = require("../assets/star-filled.png");

    if (i > Math.ceil(ratings)) {
      path = require("../assets/star-unfilled.png");
    }

    stars.push(<Image style={styles.image} source={path} key={i} />);
  }

  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 20,
    height: 20,
  },
});

export default StarRating;