import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import InputNumberButton from "./InputNumberButton";

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
    };
    this.state = this.initialState;
  }

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
          displayValue:
            (operator !== null
              ? displayValue.substr(0, displayValue.length - 1)
              : displayValue) + input,
        });
        break;

      case ".":
        let dot = displayValue.toString().slice(-1);
        this.setState({
          displayValue: dot !== "." ? displayValue + input : displayValue,
        });
        break;
      case "clear":
        this.setState(this.initialState);
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
        let result = Math.random() * parseInt(displayValue.toString(), 10);
        this.setState({
          displayValue: result < 1 ? "yes" : result.toString(),
        });
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
