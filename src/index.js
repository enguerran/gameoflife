import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

const Box = props => (
  <div
    className={props.boxClass}
    id={props.id}
    onClick={props.selectBox(props.row, props.col)}
  />
)

const Grid = props => {
  const width = props.cols * 16
  var rowsArr = []

  var boxClass = ''
  for (var i = 0; i < props.rows; i++) {
    for (var j = 0; j < props.cols; j++) {
      let boxId = i + '_' + j
      boxClass = props.gridFull[i][j] ? 'box on' : 'box off'
      rowsArr.push(
        <Box
          boxClass={boxClass}
          key={boxId}
          boxId={boxId}
          row={i}
          col={j}
          selectBox={props.selectBox}
        />
      )
    }
  }

  return (
    <div className="grid" style={{ width: width }}>
      {rowsArr}
    </div>
  )
}

class Main extends React.Component {
  speed = 100
  rows = 40
  cols = 60

  state = {
    generation: 0,
    gridFull: Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(false))
  }

  selectBox = (rowidx, colidx) => () => {
    const gridCopy = this.state.gridFull.map(
      (row, idx) =>
        idx === rowidx
          ? [
              ...row.slice(0, colidx),
              !this.state.gridFull[rowidx][colidx],
              ...row.slice(colidx + 1)
            ]
          : row
    )
    this.setState(state => ({
      ...state,
      gridFull: gridCopy
    }))
  }

  seed = () => {
    const gridCopy = this.state.gridFull.map(row =>
      row.map(col => Math.floor(Math.random() * 4) === 1)
    )
    this.setState(state => ({
      ...state,
      gridFull: gridCopy
    }))
  }

  playHandler = () => {
    this.pauseHandler()
    this.intervalId = setInterval(this.computeNextGeneration, this.speed)
  }

  pauseHandler = () => {
    clearInterval(this.intervalId)
  }

  seedHandler = () => {
    this.seed()
    this.playHandler()
  }

  clearHandler = () => {
    this.pauseHandler()
    this.setState(state => ({
      ...state,
      gridFull: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(false)),
      generation: 0
    }))
  }

  computeNextGeneration = () => {
    const g = this.state.gridFull
    const gridCopy = g.map((row, i) =>
      row.map((col, j) => {
        let count = 0
        if (i > 0) if (g[i - 1][j]) count++
        if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++
        if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++
        if (j < this.cols - 1) if (g[i][j + 1]) count++
        if (j > 0) if (g[i][j - 1]) count++
        if (i < this.rows - 1) if (g[i + 1][j]) count++
        if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++
        if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++
        if (g[i][j] && (count < 2 || count > 3)) return false
        if (!g[i][j] && count === 3) return true
        return col
      })
    )
    this.setState(state => ({
      ...state,
      gridFull: gridCopy,
      generation: state.generation + 1
    }))
  }

  componentDidMount() {
    this.seedHandler()
  }

  render() {
    return (
      <div>
        <h1>Game of Life</h1>
        <div>
          <button onClick={this.playHandler}>Play</button>
          <button onClick={this.pauseHandler}>Pause</button>
          <button onClick={this.clearHandler}>Clear</button>
          <button onClick={this.seedHandler}>Seed</button>
        </div>
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('root'))
registerServiceWorker()
