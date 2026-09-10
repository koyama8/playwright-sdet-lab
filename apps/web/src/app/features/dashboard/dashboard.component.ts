import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LabDataService } from '../../core/lab-data.service';
import { Person } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  readonly recentPeople = computed(() => this.data.people());
  readonly favorites = computed(() => this.data.movies().filter((movie) => movie.favorite));
  constructor(readonly data: LabDataService) {}

  scrollFavorites(event: WheelEvent, container: HTMLElement): void {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    event.preventDefault();
    container.scrollLeft += event.deltaY;
  }

  initials(person: Person): string {
    return person.name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('');
  }
}
