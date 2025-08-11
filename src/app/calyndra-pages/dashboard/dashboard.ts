import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "../../calyndra-shared/material.module";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  user = {
    name: 'John Doe'
  };

  // Sample data for dashboard
  stats = [
    { title: 'Total Projects', value: '24', change: '+12%', icon: '📁' },
    { title: 'Active Tasks', value: '156', change: '+8%', icon: '✅' },
    { title: 'Team Members', value: '12', change: '+2', icon: '👥' },
    { title: 'Revenue', value: '$45.2K', change: '+23%', icon: '💰' }
  ];

  recentActivities = [
    { action: 'New project created', user: 'John Doe', time: '2 hours ago', icon: '➕' },
    { action: 'Task completed', user: 'Jane Smith', time: '4 hours ago', icon: '✅' },
    { action: 'Comment added', user: 'Mike Johnson', time: '6 hours ago', icon: '💬' },
    { action: 'File uploaded', user: 'Sarah Wilson', time: '1 day ago', icon: '📎' }
  ];
} 