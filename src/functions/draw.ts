import p5 from "p5";
import { variables } from "../common/variables";
import { food, snake, snake_population } from "./setup";
import { Path } from "../common/enum";

export const draw = (p: p5) => {
  p.frameRate(10)
  p.clear();
  // let index_of_food_ate = snake_population.run(food, p);
  p.keyPressed = () => {
    if (p.keyCode === p.DOWN_ARROW) {
      snake.move(1, Path.VERTICAL);
    } else if (p.keyCode === p.UP_ARROW) {
      snake.move(-1, Path.VERTICAL);
    } else if (p.keyCode === p.RIGHT_ARROW) {
      snake.move(1, Path.HORIZONTAL);
    } else if (p.keyCode === p.LEFT_ARROW) {
      snake.move(-1, Path.HORIZONTAL);
    }
  };
  let index_of_food_ate = [snake.eat(food[0], 0)];
  snake.show(p);
  index_of_food_ate.forEach((iofa) => {
    if (iofa != -1) {
      food.splice(iofa, 1);
      food.push(
        p.createVector(
          Math.floor(Math.random() * variables.n_) * variables.size,
          Math.floor(Math.random() * variables.n_) * variables.size
        )
      );
    }
  });

  p.fill(255, 0, 255);
  food.forEach((f) => {
    p.rect(f.x, f.y, variables.size, variables.size);
  });
};
