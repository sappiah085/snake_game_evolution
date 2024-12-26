import p5 from "p5";
import { variables } from "../common/variables";
import { Population } from "../class/population";
import { Snake } from "../class/snake";
export let snake_population: Population;
export let snake: Snake;
export let food: p5.Vector[] = [];
export function setup(p5: p5): void {
  let pop = 1;
  p5.createCanvas(variables.w_grid, variables.h_grid);
  for (let i = 0; i < pop; i++) {
    food.push(
      p5.createVector(
        Math.floor(Math.random() * variables.n_) * variables.size,
        Math.floor(Math.random() * variables.n_) * variables.size
      )
    );
  }
  snake = new Snake(
    p5.createVector(
      Math.floor(Math.random() * variables.n_) * variables.size,
      Math.floor(Math.random() * variables.n_) * variables.size
    ),
    variables.size
  );
  // snake_population = new Population(pop, 0.01, 1000).mutate();
}
