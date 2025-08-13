import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tables } from '../../calyndra-shared/components/tables/tables';
import { ReplaySubject } from 'rxjs';
import { TableColumn } from '../../calyndra-shared/interface/table-column';
import { EventsModel } from '../../calyndra-shared/models/events';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, Tables],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events implements OnInit {  
  subject$ = new ReplaySubject<EventsModel[]>(1);

  columns: TableColumn<EventsModel>[] = [
    { label: 'Event', property: 'event', type: 'text' },
    { label: 'Location', property: 'location', type: 'text' },
    { label: 'Type', property: 'type', type: 'text' },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}
  config = {
    title: 'Events',
    columns: this.columns,
    data$: this.subject$.asObservable(),
    searchFilter: {
      name: 'search',
      value: '',
      minLength: 3,
    },
    dateFilter: {
      displayName: 'Date',
      name: 'dateRange',
      startValue: null,
      endValue: null,
      min: new Date(2020, 0, 1),
      max: new Date(2030, 11, 31),
    },
    dropdowns: [
      {
        name: 'location',
        width: '200px',
        displayName: 'Location',
        isLoading: false,
        optionList: [
          { key: '1', value: 'Convention Center' },
          { key: '2', value: 'Office HQ' },
          { key: '3', value: 'Tech Hub' },
          { key: '4', value: 'Conference Room A' },
          { key: '5', value: 'Training Center' },
        ],
        value: null,
      },
      {
        name: 'type',
        displayName: 'Type',
        width: '200px',
        isLoading: false,
        optionList: [
          { key: '1', value: 'Upcoming events' },
          { key: '2', value: 'Draft' },
          { key: '3', value: 'Past events' },
          { key: '4', value: 'All events' },
        ],
        value: null,
      },
    ],
    count: 0,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    showLoader: false,
  };

  // Initialize with mock data
  private mockData: EventsModel[] = [
    {
      event: 'Annual Conference 2024',
      date: '2024-03-15',
      location: 'Convention Center',
      type:'Upcoming events'
    },
    {
      event: 'Team Building Workshop',
      date: '2024-02-20',
      location: 'Office HQ',
      type:'Upcoming events'
    },
    {
      event: 'Product Launch',
      date: '2024-04-10',
      location: 'Tech Hub',
      type:'Past Events'
    },
    {
      event: 'Tech Summit 2025',
      date: '2025-01-25',
      location: 'Conference Room A',
      type:'Draft'
    },
    {
      event: 'Training Session Q1',
      date: '2024-05-12',
      location: 'Training Center',
      type:'Past Events'
    },
    {
      event: 'Innovation Hackathon',
      date: '2024-06-30',
      location: 'Tech Hub',
      type:'Draft'
    },
    {
      event: 'Leadership Retreat',
      date: '2024-08-05',
      location: 'Convention Center',
      type:'Draft'
    },
    {
      event: 'Training Session Q1',
      date: '2024-05-12',
      location: 'Training Center',
      type:'Draft'
    },
    {
      event: 'Innovation Hackathon',
      date: '2024-06-30',
      location: 'Tech Hub',
      type:'Upcoming events'
    },
    {
      event: 'Leadership Retreat',
      date: '2024-08-05',
      location: 'Convention Center',
      type:'All events'
    },
    {
      event: 'Training Session Q1',
      date: '2024-05-12',
      location: 'Training Center',
      type:'All events'
    },
    {
      event: 'Innovation Hackathon',
      date: '2024-06-30',
      location: 'Tech Hub',
      type:'All events'
    },
    {
      event: 'Leadership Retreat',
      date: '2024-08-05',
      location: 'Convention Center',
      type:'Draft'
    },
    {
      event: 'Training Session Q1',
      date: '2024-05-12',
      location: 'Training Center',
      type:'Draft'
    },
    {
      event: 'Innovation Hackathon',
      date: '2024-06-30',
      location: 'Tech Hub',
      type:'Draft'
    },
    {
      event: 'Leadership Retreat',
      date: '2024-08-05',
      location: 'Convention Center',
      type:'Draft'
    },
  ];
  ngOnInit() {
    this.route.queryParams.subscribe((query) => {
      this.handleQueryParams(query);
    });
    
    // Load initial data if no query parameters
    if (Object.keys(this.route.snapshot.queryParams).length === 0) {
      this.fetchData();
    }
  }

  handleQueryParams(query: any) {
    const { search, startDate, endDate, pageSize, location, type } = query;

    this.config.searchFilter.value = search || '';

    if (startDate != undefined && endDate != undefined) {
      this.config.dateFilter.startValue = startDate;
      this.config.dateFilter.endValue = endDate;
    }

    if (pageSize != undefined) {
      this.config.pageSize = pageSize;
    }

    this.config.dropdowns.forEach((filter) => {
      if (filter.name === 'location' && location !== undefined) {
        filter.value = location;
      }
      if (filter.name === 'type' && type !== undefined) {
        filter.value = type;
      }
    });

    if (search != undefined || this.config.searchFilter.value != '') {
      this.config.searchFilter.value = search != undefined ? search : '';
    }
    
    // Apply filters and fetch data
    this.applyFilters({
      search: this.config.searchFilter.value,
      dateRange: {
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      },
      dropdowns: this.config.dropdowns
    });
  }

  fetchData() {
    this.config.showLoader = true;
    setTimeout(() => {
      this.config.count = this.mockData.length;
      this.subject$.next(this.mockData);
      this.config.showLoader = false;
    }, 1000);
  }

  applyFilters(filters: any) {
    this.config.showLoader = true;
    setTimeout(() => {
      let filteredData = [...this.mockData];

      // Apply search filter
      if (filters.search && filters.search.trim() !== '') {
        filteredData = filteredData.filter((item) =>
          item.event.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      // Apply date filter
      if (
        filters.dateRange &&
        filters.dateRange.startDate &&
        filters.dateRange.endDate
      ) {
        filteredData = filteredData.filter(
          (item) =>
            new Date(item.date) >= filters.dateRange.startDate &&
            new Date(item.date) <= filters.dateRange.endDate
        );
      }

      // Apply dropdown filters
      if (filters.dropdowns && filters.dropdowns.length > 0) {
        filters.dropdowns.forEach((filter: any) => {
          if (filter.value) {
            if (filter.name === 'location') {
              const selectedLocation = this.config.dropdowns[0].optionList.find(
                (option: any) => option.key === filter.value
              );
              if (selectedLocation) {
                filteredData = filteredData.filter(
                  (item) => item.location === selectedLocation.value
                );
              }
            }
            if (filter.name === 'type') {
              const selectedType = this.config.dropdowns[1].optionList.find(
                (option: any) => option.key === filter.value
              );
              if (selectedType) {
                filteredData = filteredData.filter(
                  (item) => item.type === selectedType.value
                );
              }
            }
          }
        });
      }

      this.config.count = filteredData.length;
      this.subject$.next(filteredData);
      this.config.showLoader = false;
    }, 1000);
  }

  onFilterChange(event: any) {
    this.config.searchFilter.value = event.search;
    if (
      event.search !== undefined ||
      event.dateRange ||
      event.dropdowns
    ) {
      this.applyFilters(event);
    }
  }
}
