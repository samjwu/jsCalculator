import React from 'react';

export class OutputScreen extends React.Component {
    render() {
        return (
            <div className="output-screen">
                {this.props.mathOutput}
            </div>
        );
    }
}
