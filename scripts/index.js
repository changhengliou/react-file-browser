import { observe, observable } from 'mobx';
import React from 'react';

export var appState = observable({
    timer: 0
});

export class TimerView extends React.Component {
    onReset () {
        this.props.appState.resetTimer();
    }
    render() {
        return (
            <button onClick={this.onReset.bind(this)}>
                Seconds passed: {this.props.appState.timer}
            </button>
        );
    }
}

