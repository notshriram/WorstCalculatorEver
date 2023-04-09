import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import InputNumberButton from "./InputNumberButton";
import * as tf from "@tensorflow/tfjs";
import * as tfrn from "@tensorflow/tfjs-react-native";
import { vectorize, strip, devectorize } from "./utils";

const buttons = [
  ["clear", "del"],
  ["7", "8", "9", "/"],
  ["4", "5", "6", "x"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
];

export default class App extends Component {
  constructor() {
    super();
    this.initialState = {
      displayValue: "0",
      operator: null,
      model: null,
    };
    this.state = this.initialState;
  }

  async componentDidMount() {
    // Wait for tf to be ready.
    await tf.ready();
    const modelJson = require("./assets/model.json");
    const modelWeights = require("./assets/group1-shard1of1.bin");
    this.loadModel(modelJson, modelWeights);
  }

  loadModel = async (modelJson, modelWeights) => {
    // Load the model from assets folder
    const model = await tf.loadLayersModel(
      tfrn.bundleResourceIO(modelJson, modelWeights)
    );
    // Set the model to the state
    this.setState({ model: model });
  };

  renderButtons() {
    let layouts = buttons.map((buttonRows, index) => {
      let rowItem = buttonRows.map((buttonItem, buttonIndex) => {
        return (
          <InputNumberButton
            key={"btn" + buttonIndex}
            value={buttonItem}
            handleOnPress={this.handleInput.bind(this, buttonItem)}
          ></InputNumberButton>
        );
      });
      return (
        <View style={styles.inputRow} key={"row" + index}>
          {rowItem}
        </View>
      );
    });
    return layouts;
  }

  handleInput = (input) => {
    const { displayValue, operator } = this.state;
    switch (input) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.setState({
          displayValue: displayValue === "0" ? input : displayValue + input,
        });
        break;
      case "+":
      case "-":
      case "/":
      case "x":
        this.setState({
          operator: input,
          displayValue: displayValue + input,
        });
        break;

      case ".":
        let dot = displayValue.toString().slice(-1);
        this.setState({
          displayValue: dot !== "." ? displayValue + input : displayValue,
        });
        break;
      case "clear":
        this.setState({
          displayValue: "0",
        });
        break;
      case "del":
        let string = displayValue.toString();
        let deletedString = string.substr(0, string.length - 1);
        let length = string.length;
        this.setState({
          displayValue: length == 1 ? "0" : deletedString,
        });
        break;
      case "=":
        const vectorized_input = vectorize(displayValue);
        if (this.state.model != null) {
          const vectorized_result = this.state.model.predict(
            tf.tensor3d([vectorized_input], [1, 5, 15])
          );
          const result = strip(devectorize(vectorized_result.arraySync()[0]));
          this.setState({
            displayValue: result,
          });
        };
        break;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{this.state.displayValue}</Text>
        </View>
        <View style={styles.inputContainer}>{this.renderButtons()}</View>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    flex: 2,
    backgroundColor: "#000",
  },
  inputContainer: {
    flex: 8,
    backgroundColor: "#121212",
  },
  resultText: {
    color: "orange",
    fontSize: 80,
    fontWeight: "bold",
    padding: 20,
    textAlign: "right",
  },
  inputRow: {
    flex: 1,
    flexDirection: "row",
  },
});
