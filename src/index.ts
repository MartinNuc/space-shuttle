import { Observable } from 'rxjs';

console.log('working');

Observable.interval(1000).subscribe((x: number) => console.log(x));
