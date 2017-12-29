import { Observable } from 'rxjs';
import { animationFrame } from 'rxjs/scheduler/animationFrame';
import { Shuttle } from './shuttle';
import { Game } from './game';
import { Positionable } from './positionable';
import { GameState } from './game-state';
import { Shot } from './shot';
import { MovementDirection } from './movement';
import { moveShuttle, moveShots } from './move-functions';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const INITIAL_STATE: GameState = {
  shuttle: new Positionable<Shuttle>(new Shuttle(0, 45), 50, 50),
  shots: []
}
const game = new Game(ctx, canvas.width, canvas.height);

const keyDown$: Observable<KeyboardEvent> = Observable.fromEvent(document, 'keydown');
const keyUp$: Observable<KeyboardEvent> = Observable.fromEvent(document, 'keyup');

const moveRight$ = keyDown$.filter(event => event.code === 'ArrowRight').mapTo(13);
const moveLeft$ = keyDown$.filter(event => event.code === 'ArrowLeft').mapTo(-13);
const moveUp$ = keyDown$.filter(event => event.code === 'ArrowUp').mapTo(1);
const moveDown$ = keyDown$.filter(event => event.code === 'ArrowDown').mapTo(-1);

const spaceDown$ = keyDown$.filter(event => event.code === 'Space').mapTo(1);
const spaceUp$ = keyUp$.filter(event => event.code === 'Space').mapTo(0);
const spacePressed$ = Observable.merge(spaceDown$, spaceUp$).startWith(0);

const tick$ = Observable.interval(17, animationFrame);

const angle$ = Observable.merge(moveLeft$, moveRight$)
  .scan((acc, curr) => {
    let sum = (acc + curr) % 360;
    sum = sum < 0 ? 360 + sum : sum;
    return sum
  }, INITIAL_STATE.shuttle.object.angle)
  .startWith(INITIAL_STATE.shuttle.object.angle)

const velocity$ = Observable.merge(moveUp$, moveDown$)
  .scan((acc, curr) => Math.max(0, acc + curr), 0)
  .startWith(INITIAL_STATE.shuttle.object.velocity)

const movement$: Observable<MovementDirection> =
  Observable.combineLatest(angle$, velocity$, (angle, velocity) => ({ angle, velocity }));

const game$ = tick$
  .withLatestFrom(movement$, spacePressed$)
  .scan(({shots, shuttle}, [_, movement, shotsFired]) => {
    if (shotsFired > 0) {
      shots.push(new Positionable<Shot>(new Shot(movement.angle, movement.velocity + 30), shuttle.x, shuttle.y));
    }
    return {
      shuttle: moveShuttle(canvas, shuttle, movement),
      shots: moveShots(canvas, shots)
    };
  }, INITIAL_STATE)
  .sample(tick$);

game$.subscribe((state: GameState) => game.draw(state));
