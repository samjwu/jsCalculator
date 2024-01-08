import React from 'react';

import * as constants from './constants.js'

import './App.scss';

class OutputScreen extends React.Component {
  render() {
    return (
      <div className="output-screen">
        {this.props.mathOutput}
      </div>
    );
  }
}

class InputScreen extends React.Component {
  render() {
    return (
      <div className="calculator-input" id="display">
        {this.props.calculatorInput}
      </div>
    );
  }
}

class Buttons extends React.Component {
  render() {
    return (
      <div>
        <button
          className="large-button"
          id="clear"
          onClick={this.props.initialize}
          value="Clear"
        >
          Clear
        </button>
        <button
          id="divide"
          onClick={this.props.operators}
          value="/"
        >
          /
        </button>
        <button
          id="multiply"
          onClick={this.props.operators}
          value="x"
        >
          x
        </button>
        <button id="seven" onClick={this.props.numbers} value="7">
          7
        </button>
        <button id="eight" onClick={this.props.numbers} value="8">
          8
        </button>
        <button id="nine" onClick={this.props.numbers} value="9">
          9
        </button>
        <button
          id="subtract"
          onClick={this.props.operators}
          value="‑"
        >
          ‑
        </button>
        <button id="four" onClick={this.props.numbers} value="4">
          4
        </button>
        <button id="five" onClick={this.props.numbers} value="5">
          5
        </button>
        <button id="six" onClick={this.props.numbers} value="6">
          6
        </button>
        <button
          id="add"
          onClick={this.props.operators}
          value="+"
        >
          +
        </button>
        <button id="one" onClick={this.props.numbers} value="1">
          1
        </button>
        <button id="two" onClick={this.props.numbers} value="2">
          2
        </button>
        <button id="three" onClick={this.props.numbers} value="3">
          3
        </button>
        <button
          className="large-button"
          id="zero"
          onClick={this.props.numbers}
          value="0"
        >
          0
        </button>
        <button id="decimal" onClick={this.props.decimal} value=".">
          .
        </button>
        <button
          class="equals"
          id="equals"
          onClick={this.props.equals}
          value="="
        >
          =
        </button>
      </div>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentValue: '0',
      previousValue: '0',
      mathOutput: '',
      lastClicked: ''
    };

    this.initialize = this.initialize.bind(this);
    this.inputDecimal = this.inputDecimal.bind(this);
    this.inputNumber = this.inputNumber.bind(this);
    this.inputOperator = this.inputOperator.bind(this);
    this.inputEquals = this.inputEquals.bind(this);
    this.digitLimit = this.digitLimit.bind(this);
  }

  initialize() {
    this.setState({
      currentValue: '0',
      previousValue: '0',
      mathOutput: '',
      lastClicked: '',
      calculated: false
    });
  }

  inputNumber(e) {
    if (!this.state.currentValue.includes('Limit')) {
      const { currentValue, mathOutput, calculated } = this.state;
      const value = e.target.value;
      this.setState({ calculated: false });

      if (currentValue.length > 21) {
        this.digitLimit();
      } else if (calculated) {
        this.setState({
          currentValue: value,
          mathOutput: value !== '0' ? value : ''
        });
      } else {
        this.setState({
          currentValue:
            currentValue === '0' || constants.MATH_OPERATORS.test(currentValue)
              ? value
              : currentValue + value,
          mathOutput:
            currentValue === '0' && value === '0'
              ? mathOutput === ''
                ? value
                : mathOutput
              : /([^.0-9]0|^0)$/.test(mathOutput)
                ? mathOutput.slice(0, -1) + value
                : mathOutput + value
        });
      }
    }
  }

  inputDecimal() {
    if (this.state.calculated === true) {
      this.setState({
        currentValue: '0.',
        mathOutput: '0.',
        calculated: false
      });
    } else if (
      !this.state.currentValue.includes('.') &&
      !this.state.currentValue.includes('Limit')
    ) {
      this.setState({ calculated: false });

      if (this.state.currentValue.length > 21) {
        this.digitLimit();
      } else if (
        constants.REGEX_ENDING_IN_OPERATOR.test(this.state.mathOutput) ||
        (this.state.currentValue === '0' && this.state.mathOutput === '')
      ) {
        this.setState({
          currentValue: '0.',
          mathOutput: this.state.mathOutput + '0.'
        });
      } else {
        this.setState({
          currentValue: this.state.mathOutput.match(/(-?\d+\.?\d*)$/)[0] + '.',
          mathOutput: this.state.mathOutput + '.'
        });
      }
    }
  }

  inputOperator(e) {
    if (!this.state.currentValue.includes('Limit')) {
      const value = e.target.value;
      const { mathOutput, previousValue, calculated } = this.state;
      this.setState({ currentValue: value, calculated: false });

      if (calculated) {
        this.setState({ mathOutput: previousValue + value });
      } else if (!constants.REGEX_ENDING_IN_OPERATOR.test(mathOutput)) {
        this.setState({
          previousValue: mathOutput,
          mathOutput: mathOutput + value
        });
      } else if (!constants.REGEX_ENDING_IN_NEGATIVE.test(mathOutput)) {
        this.setState({
          mathOutput:
            (constants.REGEX_ENDING_IN_NEGATIVE.test(mathOutput + value) ? mathOutput : previousValue) +
            value
        });
      } else if (value !== '‑') {
        this.setState({
          mathOutput: previousValue + value
        });
      }
    }
  }

  inputEquals() {
    if (!this.state.currentValue.includes('Limit')) {
      let expression = this.state.mathOutput;

      while (constants.REGEX_ENDING_IN_OPERATOR.test(expression)) {
        expression = expression.slice(0, -1);
      }

      expression = expression
        .replace(/x/g, '*')
        .replace(/‑/g, '-')
        .replace('--', '+0+0+0+0+0+0+');
      let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;

      this.setState({
        currentValue: answer.toString(),
        mathOutput:
          expression
            .replace(/\*/g, '⋅')
            .replace(/-/g, '‑')
            .replace('+0+0+0+0+0+0+', '‑-')
            .replace(/(x|\/|\+)‑/, '$1-')
            .replace(/^‑/, '-') +
          '=' +
          answer,
        previousValue: answer,
        calculated: true
      });
    }
  }

  digitLimit() {
    this.setState({
      currentValue: 'Digit Limit Met',
      previousValue: this.state.currentValue
    });

    setTimeout(() => this.setState({ currentValue: this.state.previousValue }), 1000);
  }

  render() {
    return (
      <div>
        <div className="calculator">
          <OutputScreen mathOutput={this.state.mathOutput.replace(/x/g, '⋅')} />
          <InputScreen calculatorInput={this.state.currentValue} />
          <Buttons
            initialize={this.initialize}
            numbers={this.inputNumber}
            decimal={this.inputDecimal}
            operators={this.inputOperator}
            equals={this.inputEquals}
          />
        </div>
      </div>
    );
  }
}

export default class App extends React.Component {
  render() {
    return <Calculator />
  }
}
