[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

# Worst Calculator Ever

AI Calculator App that is rarely ever correct. A gazillion times worse than a broken clock that's correct atleast twice a day. Don't do your taxes with this.

Uses a neural network to predict the result of a mathematical expression. The neural network is trained on a dataset of 5000 binary expressions. The dataset is generated using a basic random expression generator and works with operands between 0 and 99 and returns a prediction of 5 chars.


## Setup

```bash
$ git clone https://github.com/notshriram/WorstCalculatorEver.git WorstCalculatorEver
$ cd WorstCalculatorEver
$ yarn install
$ npx expo install
$ yarn start
```
then scan the QR code from the terminal with the expo app(anroid) or camera app(ios)


### model layers

```python
  model.add(SimpleRNN(hidden_units, input_shape=(None, num_chars)))
  model.add(RepeatVector(max_time_steps))
  model.add(SimpleRNN(hidden_units, return_sequences=True))
  model.add(TimeDistributed(Dense(num_chars, activation='softmax')))

  model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
```
