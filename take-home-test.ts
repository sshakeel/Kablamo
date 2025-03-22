import * as React from "react";
import * as ReactDOM from "react-dom";
import { Component, ClassAttributes } from "react";

const formattedSeconds = (sec: number) => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

interface StopwatchProps extends ClassAttributes<Stopwatch> {
  initialSeconds: number;
}

class Stopwatch extends Component<StopwatchProps, any> {
  incrementer: any
  state: { secondsElapsed: number; lastClearedIncrementer: null; laps: never[]; }; // move laps within state type
  setState: any;

  constructor(props: StopwatchProps) {
    super(props);
    this.state = {
      secondsElapsed: props.initialSeconds,
      lastClearedIncrementer: null,
      laps: [], // move laps within component state
    }

    // bind event handlers
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleLapClick = this.handleLapClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
  }

  handleStartClick() {
    this.incrementer = setInterval(() =>
      this.setState({
        secondsElapsed: this.state.secondsElapsed + 1,
      }), 1000);
  }

  handleStopClick() {
    clearInterval(this.incrementer);
    this.setState({
      lastClearedIncrementer: this.incrementer,
    });
  }

  handleResetClick() {
    clearInterval(this.incrementer);
      this.setState({
        secondsElapsed: 0,
        laps: [], // update laps as part of state
      });
  }

  handleLapClick() { // fix spelling for 'Lap'
    
    // instead of this...
      // this.laps = this.laps.concat([this.state.secondsElapsed]);
      // this.forceUpdate();

    // ... we should update laps as part of component state
    this.setState((prevState) => ({
      laps: [...prevState.laps, prevState.secondsElapsed],  // instead of concat, let's grab laps from our state and then update it
    }));
  }

  handleDeleteClick(index: number) {  // updated delete handler after moving laps to state
    return () => {
      this.setState((prevState) => ({
        laps: prevState.laps.splice(index, 1),  // I feel laps.filter might also be an option here...
      }));
    };
  }

  render() {
    const {
      secondsElapsed,
      lastClearedIncrementer,
      laps, // access laps from state
    } = this.state;

    const Lap = (props: { index: number, lap: number, onDelete: () => void }) => (  // change onDelete type to 'void'
      <div key={props.index} className="stopwatch-lap">
        <strong>{props.index}</strong>/ {formattedSeconds(props.lap)}
        <button onClick={props.onDelete} > X </button>
      </div>
    );
  
    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
        {(secondsElapsed === 0 || this.incrementer === lastClearedIncrementer
          ? <button type="button" className="start-btn" onClick={this.handleStartClick}>start</button>
          : <button type="button" className="stop-btn" onClick={this.handleStopClick}>stop</button>
        )}
        {(secondsElapsed !== 0 && this.incrementer !== lastClearedIncrementer
          ? <button type="button" onClick={this.handleLapClick}>lap</button>
          : null
        )}
        {(secondsElapsed !== 0 && this.incrementer === lastClearedIncrementer
          ? <button type="button" onClick={this.handleResetClick}>reset</button>
          : null
        )}
        <div className="stopwatch-laps">
          {/* use laps from state */}
          { laps && laps.map((lap, i) => <Lap index={i+1} lap={lap} onDelete={this.handleDeleteClick(i)} />)}
        </div>
      </div>
    );
  }
}

// Think we should be using createRoot() instead of render(). render() is deprecated: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#removed-reactdom-render
ReactDOM.render(
  <Stopwatch initialSeconds={0} />,
  document.getElementById("content"),
);
