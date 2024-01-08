import React from 'react';

export class InputScreen extends React.Component {
    render() {
        return (
            <div className="calculator-input" id="display">
                {this.props.calculatorInput}
            </div>
        );
    }
}
