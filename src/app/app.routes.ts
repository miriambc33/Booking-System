import { Routes } from '@angular/router';
import { EventListComponent } from './features/events/event-list/event-list.component';
import { EventDetailComponent } from './features/events/event-detail/event-detail.component';

export const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'event/:id', component: EventDetailComponent },
];
