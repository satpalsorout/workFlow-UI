import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ActivityComponent } from './activity/activity.component';
import { ConditionComponent } from './condition/condition.component';
import { StartendComponent } from './startend/startend.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CodepannelComponent } from './codepannel/codepannel.component';
import { Template1Component } from './template1/template1.component';
import { Template2Component } from './template2/template2.component';
import { TwodimensionArrowComponent } from './twodimension-arrow/twodimension-arrow.component';
// import { SvgArrowUtilityService } from './services/svg-arrowutility.service';
import { TemplateComponent } from './template/template.component';
import { ComponentSelectorComponent } from './component-selector/component-selector.component';
import { ControlBarComponent } from './control-bar/control-bar.component';
import { PropertyBarComponent } from './property-bar/property-bar.component';
import { LinkBarComponent } from './link-bar/link-bar.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Keys } from './pipes/Keys';

const routes = [{
  path: '',
  component: TemplateComponent
},
{
  path: 'template1',
  component: Template1Component
},
{
  path: 'template2',
  component: Template2Component
},
{
  path: 'template',
  component: TemplateComponent
}];

@NgModule({
  declarations: [
    AppComponent,
    ActivityComponent,
    ConditionComponent,
    StartendComponent,
    NavbarComponent,
    CodepannelComponent,
    Template1Component,
    Template2Component,
    TwodimensionArrowComponent,
    TemplateComponent,
    ComponentSelectorComponent,
    ControlBarComponent,
    PropertyBarComponent,
    LinkBarComponent,
    ActionBarComponent,
    UnderConstructionComponent,
    Keys
  ],
  imports: [
  BrowserModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
