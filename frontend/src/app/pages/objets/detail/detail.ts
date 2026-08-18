import { Component,OnInit,OnDestroy,AfterViewChecked,ViewChild,ElementRef,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,ActivatedRoute   } from '@angular/router';
import { Subscription } from 'rxjs';

import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Object } from '../../../core/service/object';
import { Conversation
 } from '../../../core/service/conversation';
 import { Message } from '../../../core/service/message';
 import{ Auth } from '../../../core/service/auth';
 import { Websocket} from '../../../core/service/websocket';

@Component({
  selector: 'app-detail',
  standalone: true,

  imports: [CommonModule,FormsModule,Navbar,Sidebar],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail {}
