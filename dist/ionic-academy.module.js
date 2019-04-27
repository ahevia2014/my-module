import { NgModule } from '@angular/core';
import { AcademyComponent } from './components/academy-component';
import { AcademyProvider } from './providers/academy-provider';
import { IonicModule } from 'ionic-angular';
import { Geolocation } from "@ionic-native/geolocation";
var IonicAcademyModule = /** @class */ (function () {
    function IonicAcademyModule() {
    }
    IonicAcademyModule.forRoot = function () {
        return {
            ngModule: IonicAcademyModule,
            providers: [AcademyProvider, Geolocation]
        };
    };
    IonicAcademyModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        IonicModule
                    ],
                    declarations: [
                        AcademyComponent
                    ],
                    exports: [
                        AcademyComponent
                    ]
                },] },
    ];
    return IonicAcademyModule;
}());
export { IonicAcademyModule };
//# sourceMappingURL=ionic-academy.module.js.map