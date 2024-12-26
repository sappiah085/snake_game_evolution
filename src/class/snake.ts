import p5 from "p5";
import { Path } from "../common/enum";
import { DNA } from "./dna";
import { variables } from "../common/variables";

export class Snake {
  _dna: DNA;
  _head_position: p5.Vector;
  _size: number;
  _velocity: p5.Vector;
  _tail: p5.Vector[] = [];
  _score: number = 0;
  _run: boolean = true;
  _next_gene_index: number = 0;
  constructor(position: p5.Vector, s: number, lifespan: number = 0) {
    this._dna = new DNA(lifespan);
    this._head_position = position;
    this._size = s;
    this._velocity = p5.Vector.random2D().set(0, 0);
    this._tail.push(this._head_position.copy());
  }

  eat(food: p5.Vector, i: number) {
    let dis = this._head_position.dist(food);
    let gen = dis < 12;
    if (gen) {
      this._tail.push(this._head_position.copy());
      this._score *= 10;
    }
    if (dis < 50) this._score += 1 / (dis * dis);
    return gen ? i : -1;
  }
  move(dir: -1 | 1, p: Path) {
    if (
      p === Path.HORIZONTAL &&
      (this._velocity.x === 0 || this._tail.length === 1)
    ) {
      this._velocity.x = this._size * dir;
      this._velocity.y = 0;
    } else if (
      p === Path.VERTICAL &&
      (this._velocity.y === 0 || this._tail.length === 1)
    ) {
      this._velocity.y = this._size * dir;
      this._velocity.x = 0;
    }
  }
  reset() {
    this._head_position = p5.Vector.random2D().set(
      10 * this._size,
      10 * this._size
    );
    this._tail = [this._head_position];
    this._velocity.set(0, 0);
  }
  bite_self() {
    return this._tail.slice(1).some((t) => t.dist(this._head_position) < 2);
  }
  dis(point: p5.Vector) {
    return this._head_position.dist(point);
  }
  create_vector(x: number, y: number, p: p5) {
    return p.createVector(x, y);
  }
  run(p: p5) {
    //top wall
    if (this.dis(this.create_vector(this._head_position.x, 0, p)) <= 3) {
      this.move(
        this._dna._avoidance_moves[0].dir,
        this._dna._avoidance_moves[0].path
      );
    }
    //left wall
    if (
      this._head_position.dist(
        this.create_vector(0, this._head_position.y, p)
      ) <= 3
    )
      this.move(
        this._dna._avoidance_moves[1].dir,
        this._dna._avoidance_moves[1].path
      );
    // right wall
    if (
      this._head_position.dist(
        this.create_vector(this._head_position.x, variables.w_grid, p)
      ) <= 3
    )
      this.move(
        this._dna._avoidance_moves[2].dir,
        this._dna._avoidance_moves[2].path
      );
    // bottom wall
    if (
      this._head_position.dist(
        this.create_vector(this._head_position.x, variables.h_grid, p)
      ) <= 3
    )
      this.move(
        this._dna._avoidance_moves[3].dir,
        this._dna._avoidance_moves[3].path
      );
    this.move(
      this._dna._genes[this._next_gene_index].dir,
      this._dna._genes[this._next_gene_index].path
    );
    this._next_gene_index++;
  }
  show(p: p5) {
    if (this._run) {
      p.fill(255);
      this._head_position.add(this._velocity);
      if (
        this._head_position.x + this._size > p.width ||
        this._head_position.y + this._size > p.height ||
        this._head_position.x < 0 ||
        this._head_position.y < 0
      ) {
        this._run = false;
        this._score *= 0.2;
        this.reset();
      }
      if (this._tail.length > 0) {
        // Shift all tail positions backwards
        for (let i = this._tail.length - 1; i > 0; i--) {
          this._tail[i] = this._tail[i - 1].copy();
        }
        // First tail segment follows the head
        this._tail[0] = this._head_position.copy();
      }
      if (this.bite_self()) {
        this._run = false;
        this.reset();
        this._score *= 0.2;
      } else {
        this._score += 0.1;
        for (let t of this._tail) {
          p.rect(t.x, t.y, this._size, this._size);
        }
      }
    }
  }
}
