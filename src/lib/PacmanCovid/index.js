import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogContentText, DialogContent } from "@mui/material";
import { KEY_COMMANDS } from "./constants";
import getInitialState from "./state";
import { animate, changeDirection } from "./game";
import Stage from "./Stage";
import TopBar from "./TopBar";
import AllFood from "./Food/All";
import Monster from "./Monster";
import Player from "./Player";
import { bigFoodStrategy, findNextDecisionPoint } from "./ai";

import tracks from "./game/tracks";
import { adjacencyList } from "./adjacency_list";

let next_direction = 0;
let strategy_used = "Eat food"

export default class PacmanCovid extends Component {
  constructor(props) {
    super(props);

    this.props = props;
    this.state = {
      ...getInitialState(),
      isShowDialog: false,
      // isRunning: props.isRunning
      suggestedDirection: 0,
    };

    this.handleTheEnd = this.handleTheEnd.bind(this);

    this.onKey = (evt) => {
      console.log('evt', evt.key);
      // console.log(this.state);
      if (KEY_COMMANDS[evt.key] !== undefined) {
        return this.changeDirection(KEY_COMMANDS[evt.key]);
      }
      return -1;
    };
  }

  componentDidMount() {
    this.timers = {
      start: null,
      animate: null,
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", this.onKey);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isRunning !== this.props.isRunning && this.props.isRunning) {
      this.setState({ stepTime: Date.now() });
      this.step();
    }
    if (prevProps.predictions !== this.props.predictions) {
      console.log("predictions", this.props.predictions);
      this.changeDirection(this.props.predictions);
    }
  }
  getKeyFromDirectionValue(value) {
    const keyMap = {
      1: "ArrowUp",    // NORTH
      3: "ArrowDown",  // SOUTH
      2: "ArrowLeft",  // WEST
      0: "ArrowRight", // EAST
    };
    return keyMap[value];
  }
  simulateKeyPress(directionValue) {
    const key = this.getKeyFromDirectionValue(directionValue);
    if (key) {
      const event = new KeyboardEvent("keydown", { key });
      window.dispatchEvent(event);
    }
  }
  isValidMove(position, gridSize, monsters, track) {
    const [x, y] = position;
  
    // Check out-of-bounds
    if (x < 0 || x >= gridSize[0] || y < 0 || y >= gridSize[1]) return false;
  
    // Check track validity
    const rowRanges = track[0][x]; // Get valid ranges for the row
    if (!this.isWithinRanges(y, rowRanges)) return false;
  
    // Check for monsters
    return !monsters.some(({ position: monsterPos }) =>
      monsterPos[0] === x && monsterPos[1] === y
    );
  }

  isWithinRanges(value, ranges = []) {
    return ranges.some(([start, end]) => value >= start && value <= end);
  }

  heuristic(position, food, monsters) {
    const bigFood = food.filter(f => !f.eaten && f.big);
    const smallFood = food.filter(f => !f.eaten && !f.big);
  
    const bigFoodDistances = bigFood.map(f =>
      Math.abs(f.position[0] - position[0]) + Math.abs(f.position[1] - position[1])
    );
  
    const smallFoodDistances = smallFood.map(f =>
      Math.abs(f.position[0] - position[0]) + Math.abs(f.position[1] - position[1])
    );
  
    const monsterDistances = monsters.map(m =>
      Math.abs(m.position[0] - position[0]) + Math.abs(m.position[1] - position[1])
    );
  
    const nearestBigFood = bigFoodDistances.length ? Math.min(...bigFoodDistances) : Infinity;
    const nearestSmallFood = Math.min(...smallFoodDistances);
    const nearestMonster = Math.min(...monsterDistances);
  
    return -nearestBigFood * 2 - nearestSmallFood + narestMonster * 2;
  }

// findBestDirection(player, food, monsters, track) {
//   const directions = [
//     { direction: 'NORTH', delta: [0, -1], value: 1 },
//     { direction: 'SOUTH', delta: [0, 1], value: 3 },
//     { direction: 'WEST', delta: [-1, 0], value: 2 },
//     { direction: 'EAST', delta: [1, 0], value: 0 },
//   ];

//   const gridSize = [track[0].length, track[1].length];
//   let bestDirectionValue = player.direction;
//   let bestScore = -Infinity;

//   directions.forEach(({ delta, value }) => {
//     const newPosition = [
//       player.position[0] + delta[0],
//       player.position[1] + delta[1],
//     ];

//     if (this.isValidMove(newPosition, gridSize, monsters, track)) {
//       const score = this.heuristic(newPosition, food, monsters);

//       // Tiebreaker: prioritize current direction and proximity to food
//       if (score > bestScore || 
//          (score === bestScore && value === player.direction)) {
//         bestScore = score;
//         bestDirectionValue = value;
//       }
//     }
//   });

//   return bestDirectionValue;
// }


  step() {

    const { player, food, monsters } = this.state;

      const position = findNextDecisionPoint(player.position, player.direction)
      const suggestedDirection = bigFoodStrategy(position, food);
      const current_direction = player.direction;
      strategy_used = "Eat Big Food";
      if (suggestedDirection !== current_direction) {
        next_direction = suggestedDirection;
      }


      const result = animate(this.state);
      this.setState({
        ...result,
      });
      console.log("this state suggestedDirectionß", this.state.suggestedDirection)
    // console.log('suggestedDirection', this.state.suggestedDirection);
    
    clearTimeout(this.timers.animate);
    this.timers.animate = setTimeout(() => this.step(), 20);
  }

  componentWillUnmount() {
    document.body.style.overflow = "unset";
    window.removeEventListener("keydown", this.onKey);

    clearTimeout(this.timers.start);
    clearTimeout(this.timers.animate);
  }

  changeDirection(direction) {
    this.setState(changeDirection(this.state, { direction }));
  }

  handleTheEnd() {
    this.props.setIsRuning(false);
    this.setState({ isShowDialog: true });
  }

  render() {
    if (this.state.hasError) {
      // renderizar qualquer UI como fallback
      return <h1>Something went wrong.</h1>;
    }

    // const { player, food, monsters_ } = this.state;
    // const position = findNextDecisionPoint(player.position, player.direction)
    // const suggestedDirection = bigFoodStrategy(position, food);
    // next_direction = suggestedDirection;
    const props = { gridSize: 12, ...this.props };

    const monsters = this.state.monsters.map(({ id, ...monster }) => (
      <Monster key={id} {...props} {...monster} />
    ));

    return (
      <div className="wrapper-container">
        <Stage {...props} />
        <TopBar score={this.state.score} lost={this.state.lost} strategy={strategy_used}/>
        <AllFood {...props} food={this.state.food} />
        {monsters}
        <Player
          {...props}
          {...this.state.player}
          lost={this.state.lost}
          isRunning={this.props.isRunning}
          onEnd={this.handleTheEnd}
          suggestedDirection={next_direction}
        />
        <Dialog
          open={this.state.isShowDialog}
          onClose={() => {
            this.setState({ isShowDialog: false });
            this.componentWillUnmount();
            this.setState(getInitialState());
            this.componentDidMount();
          }}
          // open={true}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>You have been infected! </p>
              <p> Score: {this.state.score}</p>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

PacmanCovid.propTypes = {
  isRunning: PropTypes.bool.isRequired,
  setIsRuning: PropTypes.func.isRequired,
  gridSize: PropTypes.number.isRequired,
  onEnd: PropTypes.func,
};
