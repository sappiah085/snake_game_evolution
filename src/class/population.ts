import p5 from "p5";
import { Snake } from "./snake";
import { variables } from "../common/variables";
import { DNA } from "./dna";

export class Population {
  _lifespan: number;
  _population: Snake[] = [];
  _mutation_rate: number;
  _span_used: number = 0;
  _gen = 0;
  constructor(n_population: number, mutation_rate: number, lifespan: number) {
    this._lifespan = lifespan;
    this._mutation_rate = mutation_rate;
    for (let i = 0; i < n_population; i++) {
      this._population.push(
        new Snake(
          p5.Vector.random2D().set(variables.w_grid / 2, variables.h_grid / 2),
          variables.size,
          lifespan
        )
      );
    }
  }
  mutate() {
    for (let snake of this._population) {
      snake._dna.mutate(this._mutation_rate);
    }
    return this;
  }
  sorted() {
    this._population.sort((a, b) => b._score - a._score);
  }

  cross() {
    const [A, B] = this.select_parents();
    const new_gen: DNA[] = [];
    this._population.forEach((snake) => {
      for (let i = 0; i < this._lifespan; i++) {
        if (i <= Math.floor(this._lifespan / 2)) {
          snake._dna._genes[i] = A._dna._genes[i];
        } else {
          snake._dna._genes[i] = B._dna._genes[i];
        }
      }
      new_gen.push(snake._dna);
    });
    return new_gen;
  }
  reproduction() {
    let dna = this.cross();
    for (let i = 0; i < this._population.length; i++) {
      let snake = new Snake(
        p5.Vector.random2D().set(variables.w_grid / 2, variables.h_grid / 2),
        variables.size,
        this._lifespan
      );
      snake._dna = dna[i];
      this._population[i] = snake;
    }
  }
  select_parents(): Snake[] {
    this.sorted();
    return [
      this._population[Math.floor(Math.random() * 5)],
      this._population[Math.floor(Math.random() * 5)],
    ];
  }
  run(foods: p5.Vector[], p: p5) {
    p.frameRate(1000);
    p.text(this._gen, 20, 60);
    p.textSize(20);
    p.stroke(255);

    let index_food_ate: number[] = [];

    if (this._span_used < this._lifespan - 1) {
      this._population.forEach((snake) => {
        snake.run(p);
        foods.forEach((food, _i) => {
          index_food_ate.push(snake.eat(food, _i));
        });
        snake.bite_self();
        snake.show(p);
      });
      this._span_used++;
    }
    if (
      this._span_used >= this._lifespan - 1 ||
      this._population.every((s) => !s._run)
    ) {
      this.reproduction();
      this.mutate();
      this._gen++;
      this._span_used = 0;
    }

    return index_food_ate;
  }
}
