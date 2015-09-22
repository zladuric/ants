// Angular 2
import {Component, View} from 'angular2/angular2';

const NUM_ANTS = 1000;
const ANTS_PER_TURN=500;

const MAX_X = 700;
const MAX_Y = 700;
const svgns = "http://www.w3.org/2000/svg";

@Component({
  selector: 'ants'
})
@View({
  
  templateUrl: 'app/components/ants/ants.html'
})
export class Ants {

  constructor() {

    this.title = 'Ants looking for food';   
    this.centerX = Math.floor(MAX_X / 2)
    this.centerY = Math.floor(MAX_Y / 2)

  	// grid is a (sparse) hash map of X coords, each holding a collection of objects
  	// each object contains things like:
  	// - type anthil,
  	// - or type bread (food)
  	// - or type path
  	// - Number:food - food left
  	// - f - feromone level
  	
  	this.grid = {

      [this.centerX]: {

        [Math.floor(MAX_Y / 2)]: {

          type: 'Anthill'
        }
      }
    };

  	for (let i = 0; i < 5; i++) {

  		// add random food sources
  		let x = 100 + Math.floor(Math.random() * MAX_X - 100);
  		let y = 100 + Math.floor(Math.random() * MAX_Y - 100);
  		let food = Math.floor(Math.random() * 300);
  		if (!this.grid[x]) {

  			this.grid[x] = [];
  		}
  		if (this.grid[x][y]) {

  			// make sure we don't overlap
  			i--;
  			continue;
  		}
  		this.grid[x][y] = {

  			type: 'Breadcrumb',
  			food: food
  		};
  	}
  	this.ants = [];
  	for (let i = 0; i < NUM_ANTS; i++) {

  		this.ants.push({

  			loc: [this.centerX, this.centerY],
  			food: 0
  		});
  	}
  	this.currentAnt = 0;
    this.map = document.getElementById('map');
    let turns = 0;      
    while (turns++ < 2) {

      console.log('Drawing map.');
      this.draw();
      console.log('Map drawn. Let\'s make a turn.');
      let start = performance.now();
      this.turn();
      let end = performance.now();

      console.log(`Turn ${turns} made in`, end - start);
    }
  }

  // draw a "map";
  draw() {

    console.log('Drawing ', this);
    let horizontal = Object.keys(this.grid);
    horizontal.forEach(function(x) {
      
      let vertical = Object.keys(this.grid[x]);
      vertical.forEach(function(y) {
        
        let colorVal = Math.max(this.grid[x][y].feromone ? this.grid[x][y].feromone : 0, 254);

        let fill = this.grid[x][y].type === 'Anthill' ? 'red' : this.grid[x][y].type === 'Breadcrumb' ? 'brown' : 'rgb(${colorVal},${colorVal},${colorVal})';
        console.log('Elem:', `<rect x="${x}" y="${y}" height="1" width="1" fill="${fill}" stroke="${fill}"/>`);
        var rect = document.createElementNS(svgns, 'rect');
        rect.setAttributeNS(null, 'x', x)
        rect.setAttributeNS(null, 'x', x);
        rect.setAttributeNS(null, 'y', y);
        rect.setAttributeNS(null, 'height', this.grid[x][y].type === 'Anthill' ? '6' : '3');
        rect.setAttributeNS(null, 'width', this.grid[x][y].type === 'Anthill' ? '6' : '3');
        rect.setAttributeNS(null, 'fill', fill);
        
        this.map.appendChild(rect);
      }.bind(this));
    }.bind(this));

    console.log('Now drawing ants.');
    // now draw ants.
    this.ants.forEach(function(ant) {
      
      if (ant.loc[0] - this.centerX < 3 || ant.loc[1] - this.centerY < 3) {

        return;
      }
      let x = ant.loc[0];
      let y = ant.loc[1];
      var rect = document.createElementNS(svgns, 'rect');
      rect.setAttributeNS(null, 'x', x)
      rect.setAttributeNS(null, 'x', x);
      rect.setAttributeNS(null, 'y', y);
      rect.setAttributeNS(null, 'height', '2');
      rect.setAttributeNS(null, 'width', '2');
      rect.setAttributeNS(null, 'fill', 'black');
    }.bind(this));
  }

  /**
   * Makes a turn.
   */
  turn() {

    if (this.currentAnt + 1 === NUM_ANTS) {

      this.currentAnt = 0;
    }
  	for (let i = 0; i < ANTS_PER_TURN; i++) {

  		this.turnAnt(i);
  	}
    this.currentAnt = this.currentAnt + ANTS_PER_TURN;
  }

  /**
   * Single ant turn
   */
   turnAnt(idx) {

   	  let ant = this.ants[idx];

      if (!this.grid[ant.loc[0]]) {

        this.grid[ant.loc] = {};
      }
      if (!this.grid[ant.loc[0]][ant.loc[1]]) {

        this.grid[ant.loc[0]][ant.loc[1]] = {
          feromone: 1
        };
      } else {

        this.grid[ant.loc[0]][ant.loc[1]].feromone = this.grid[ant.loc[0]][ant.loc[1]].feromone || 0;
        this.grid[ant.loc[0]][ant.loc[1]].feromone++;
      }

   	  // ant can cary some food - he's headed home.
   	  // alternatively he'll look for the best source of food he knows of.
   	  if (!ant.food) {

        // go towards food
        // console.log('Ant has no food. Selecting best direction.');
        let dir = this.getBestDirection(ant.loc[0], ant.loc[1]);
        // console.log('Dir: ', dir);

        // leave feromone trail
        console.log('Dir for food source:', dir);
        ant.loc = [dir];
        if (this.grid[dir[0]] && this.grid[dir[0]][dir[1]] && this.grid[dir[0]][dir[1]].type === 'Breadcrumb' && 
            this.grid[dir[0]][dir[1]].food > 0) {

          ant.food = true;
          this.grid[dir[0]][dir[1]].food = this.grid[dir[0]][dir[1]].food - 1;
          ant.goodSource = dir;
        }
   	  } else {

        // we have food, go home.
        let corner = this.selectCorner(ant.loc);
        // move
        ant.loc[0] = ant.loc[0] + corner[0];
        ant.loc[1] = ant.loc[1] + corner[1];

        // we home yet?
        if (ant.loc[0] === this.centerX && ant.loc[1] === this.centerY) {

          ant.food = 0; // head back for more food.

        }
      }
   }

   /**
    * selects random corner towards Anthill
    * example, home is nw, we randomly pick n or w
    *
    */
  selectCorner(loc) {

    if (loc[0] === this.centerX) {

      // no corner.
      if (loc[1] > this.centerY) {

        return [loc[0], loc[1] - 1]
      } else {

        return [loc[0], loc[1] + 1]
      }
    } else if (loc[1] === this.centerY) {

      // no corner.
      if (loc[0] > this.centerX) {

        return [loc[0] - 1, loc[1]]
      } else {

        return [loc[0] + 1, loc[1]]
      }
    }
    // which corner then?
    let horizontal = Math.random();
    let vertical = Math.random();
    let dir;
    if (horizontal > vertical) {

      dir = [1, 0];
    } else {

      dir = [0, 1];
    }
    
    if (loc[0] > this.centerX) {

      dir[0] = dir[0] * - 1;
    }
    if (loc[1] > this.centerY) {

      dir[1] = dir[1] * - 1;
    }
    return dir;
  }

   /**
    * helper
    * determines the best of four directions, by the feromone level.
    * if none, choose random loc, prefer away from last direction.
    */
  getBestDirection(x, y) {

    let hor0 = this.grid[x - 1];
    let hor1 = this.grid[x];
    let hor2 = this.grid[x + 1];
    
    let exitUp;
    let exitDown;
    let exitLeft;
    let exitRight;
    if (hor0) {

      exitUp = hor0[y];
    }
    if (hor1) {

      exitLeft = hor1[y - 1];
      exitRight = hor1[y + 1];
    }
    if (hor2) {

      exitDown = hor2[y];
    }

    let feromoneUp = {
      dir: 'u',
      val: exitUp ? exitUp.feromone || 0 : 0
    };
    let feromoneLeft = {
      dir: 'l',
      val: exitLeft ? exitLeft.feromone || 0 : 0
    };
    let feromoneDown = {
      dir: 'd',
      val: exitDown ? exitDown.feromone || 0 : 0
    };
    let feromoneRight = {
      dir: 'r',
      val: exitRight ? exitRight.feromone || 0 : 0
    };

    let all = [feromoneUp, feromoneDown, feromoneLeft, feromoneRight].sort((r1, r2)=> r1.val - r2.val);
    // do we have a tie?
    let first = all[0];
    let good = all.filter(val => val.val === first.val);
    // console.log('All directions left: ', good);
    // just random for now
    let which = Math.floor(Math.random() * good.length);
    let dir = good.splice(which, 1)[0];
    // console.log('which is ', which, 'so dir is ', dir, dir.dir);
    let best = [];

    while (!best.length) {

      switch(dir.dir) {

        case 'u':
          best = [x - 1, y];
          break;
        case 'l':
          best = [x, y - 1];
          break;
        case 'r':
          best = [x, y + 1];
          break;
        case 'd':
        default:
          best = [x + 1, y];
      }
      if (!(best[0] < 0 || best[0] > 699 || best[1] < 0 || best[1] > 699)) {

        // console.log('Selecting the guy ' , dir.dir);
        return best;
      }

      if (good.length) {

        dir = good.shift();
      } else {

        dir = all.shift();
      }
    }
  }
}