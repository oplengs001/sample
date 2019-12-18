import { NgModule } from '@angular/core';
import { SortPipe ,OrderByPipe,FilterPipe} from './sort.pipe';

@NgModule({
declarations: [SortPipe,OrderByPipe,FilterPipe],
imports: [],
exports: [SortPipe,OrderByPipe,FilterPipe],
})

export class PipesModule {}