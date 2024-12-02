import { Routes } from '@angular/router';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { HomeComponent } from './components/home/home.component'; // Importa il componente Home
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home page

  { path: 'chatbot', component: ChatbotComponent }, // Chatbot page

  {path: 'about', component: AboutComponent}, //pagina dedicata a spiegare il progetto e rispondere alle FAQ

// Route di fallback,cattura tutte le richieste non corrispondenti a quelle definite e reindirizza alla home 
  { path: '**', redirectTo: '' }, 
];
