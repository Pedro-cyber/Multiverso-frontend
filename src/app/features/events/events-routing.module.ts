import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { NewEventComponent } from './components/new-event/new-event.component';

const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'events/:id', component: EventDetailsComponent },
  { path: 'newevent', component: NewEventComponent, canActivate: [AuthGuard] },
  { path: 'newevent/:id', component: NewEventComponent, canActivate: [AuthGuard] },
  { path: 'myevents', component: MyEventsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class EventsRoutingModule { }
