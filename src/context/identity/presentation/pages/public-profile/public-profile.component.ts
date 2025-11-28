import { Component, inject, effect, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { IdentityFacade } from '../../../application/facades/identity.facade';

@Component({
  selector: 'app-public-profile',
  imports: [
    NzCardModule,
    NzTagModule,
    NzDividerModule,
    NzIconModule,
    NzSpinModule,
    NzTypographyModule,
    NzGridModule
  ],
  templateUrl: './public-profile.component.html',
  styleUrl: './public-profile.component.scss'
})
export class PublicProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly identityFacade = inject(IdentityFacade);

  readonly loading = this.identityFacade.loading;
  readonly publicProfile = this.identityFacade.publicProfile;
  readonly error = this.identityFacade.error;

  mockSkills = [
    'JavaScript',
    'TypeScript',
    'Angular',
    'Node.js',
    'Express.js',
    'NestJS',
    'RxJS',
    'Angular Material',
    'PostgreSQL',
    'MongoDB',
    'MySQL',
    'SQL Server',
    'Java',
    'Linux',
    'Nginx',
    'PM2',
    'Git',
    'JWT',
    'REST APIs',
    'Domain-Driven Design (DDD)',
    'Microservices',
    'SOLID Principles',
    'Design Patterns',
    'SCRUM',
    'Power BI',
    'Business Analytics'
  ];

  mockExperience = [
    {
      title: 'Desarrollador de Aplicaciones Web (Full Stack)',
      company: 'CENARES - Lima',
      startDate: '2023',
      endDate: 'Presente',
      description: 'Desarrollo de sistemas con Angular, Express.js y NestJS. Construcción de componentes reutilizables y tablas interactivas. Firma de documentos con certificados digitales usando ReFirma. Despliegue en servidores Linux con Nginx. Consumo de APIs REST, control de acceso con JWT. Mantenimiento de las principales aplicaciones de la entidad.'
    },
    {
      title: 'Analista Programador',
      company: 'Distribuidora Vitanor Sector I SAC - Lima',
      startDate: '2017',
      endDate: '2022',
      description: 'Desarrollo de sistema desktop en Java (Swing) con PostgreSQL. Módulos: facturación electrónica, cuentas por cobrar/pagar, reparto, reportes con Jaspersoft. App móvil en Android Studio: pedidos, visitas, geolocalización. Levantamiento de requerimientos y mejoras continuas.'
    },
    {
      title: 'Soporte Técnico / Desarrollador Junior',
      company: 'Halema SAC - Lima',
      startDate: '2014',
      endDate: '2017',
      description: 'Mantenimiento de equipos y soporte a usuarios. Desarrollo de formularios en PowerBuilder con PostgreSQL. Proyecto BI aplicado a la tesis profesional en Ingeniería de Sistemas.'
    }
  ];

  mockEducation = [
    {
      degree: 'Ingeniero de Sistemas',
      institution: 'Universidad César Vallejo, Perú',
      year: '2010 - 2015'
    },
    {
      degree: 'Técnico en Idioma Extranjero (Inglés)',
      institution: 'ICPNA, Perú',
      year: '2008 - 2011'
    },
    {
      degree: 'Especialización en Ingeniería de Software (192h) - EN CURSO',
      institution: 'IDAT',
      year: '2025'
    },
    {
      degree: 'SCRUM (16h)',
      institution: 'ZegelVirtual',
      year: '2025'
    },
    {
      degree: 'Arquitectura de Software Moderna: DDD, Eventos y Microservicios',
      institution: 'Udemy',
      year: '2025'
    },
    {
      degree: 'Ingeniería de Software y Arquitectura de Software (20h)',
      institution: 'Udemy',
      year: '2025'
    },
    {
      degree: 'Introduction to Data Science',
      institution: 'Cisco Networking Academy',
      year: '2024'
    },
    {
      degree: 'Máster en SQL Server (16h)',
      institution: 'Udemy',
      year: '2024'
    },
    {
      degree: 'Business Analytics & Big Data (120h)',
      institution: 'CTIC-UNI',
      year: '2017'
    }
  ];

  constructor() {
    effect(() => {
      if (this.error()) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
    const domain = this.route.snapshot.paramMap.get('domain');
    if (domain) {
      this.identityFacade.getPublicProfile(domain);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
