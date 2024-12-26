import { Path } from "../common/enum";
type gen_def = { dir: -1 | 1; path: Path }[];

export class DNA {
  _genes: gen_def = [];
  _avoidance_moves: gen_def = new Array(4);
  constructor(length: number) {
    for (let g = 0; g < length; g++) {
      this._genes.push(this.random_gen());
    }
    for (let i = 0; i < 4; i++) {
      let gen_1 = this.random_gen();
      this._avoidance_moves[i] = gen_1;
    }
  }
  random_gen() {
    let path = [Path.HORIZONTAL, Path.VERTICAL];
    let dir = [-1, 1];
    let gen_dir = Math.floor(Math.random() * 2);
    let gen_path = Math.floor(Math.random() * 2);
    return { dir: dir[gen_dir] as 1 | -1, path: path[gen_path] };
  }
  mutate(mutation_rate: number) {
    for (let g = 0; g < this._genes.length; g++) {
      if (Math.random() < mutation_rate) this._genes[g] = this.random_gen();
    }
    this._avoidance_moves.forEach((_, i) => {
      if (Math.random() < mutation_rate)
        this._avoidance_moves[i] = this.random_gen();
    });
  }
}
