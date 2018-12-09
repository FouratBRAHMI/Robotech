import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ManageArticlePage } from './manage-article';

@NgModule({
  declarations: [
    ManageArticlePage,
  ],
  imports: [
    IonicPageModule.forChild(ManageArticlePage),
  ],
})
export class ManageDocumentPageModule {}
