import { NgModule } from '@angular/core';
import { AcademyComponent } from './components/academy-component';
import { AcademyProvider } from './providers/academy-provider';
import { IonicModule } from 'ionic-angular';
var IonicAcademyModule = /** @class */ (function () {
    function IonicAcademyModule() {
    }
    IonicAcademyModule.forRoot = function () {
        return {
            ngModule: IonicAcademyModule,
            providers: [AcademyProvider]
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