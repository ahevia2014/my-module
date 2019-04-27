import { NavController } from 'ionic-angular';
import { AcademyProvider } from '../providers/academy-provider';
export declare class AcademyComponent {
    private navCtrl;
    private _ap;
    constructor(navCtrl: NavController, _ap: AcademyProvider);
    leavePage(): void;
}
