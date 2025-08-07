import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage {
  features = [
    {
      icon: '🚀',
      title: 'Lightning Fast',
      description: 'Built with modern technologies for optimal performance'
    },
    {
      icon: '🛡️',
      title: 'Secure',
      description: 'Enterprise-grade security and data protection'
    },
    {
      icon: '📱',
      title: 'Responsive',
      description: 'Works seamlessly across all devices and screen sizes'
    },
    {
      icon: '⚡',
      title: 'Scalable',
      description: 'Designed to grow with your business needs'
    }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CTO, TechCorp',
      content: 'Calyndra transformed our workflow completely. The performance improvements are incredible.',
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager, InnovateLab',
      content: 'The best solution we\'ve found. Easy to use and incredibly powerful.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emily Rodriguez',
      role: 'CEO, StartupXYZ',
      content: 'Calyndra helped us scale from 10 to 1000 users without any issues.',
      avatar: '👩‍💼'
    }
  ];

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}