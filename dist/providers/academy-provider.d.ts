import { AlertController, LoadingController } from 'ionic-angular';
import { Geolocation } from "@ionic-native/geolocation";
export declare class AcademyProvider {
    private geolocation;
    private loadingCtrl;
    private alertCtrl;
    config: string;
    constructor(geolocation: Geolocation, loadingCtrl: LoadingController, alertCtrl: AlertController);
    drawPolyline(path: any, color: any, google: any, map: any): any;
    CenterControl(controlDiv: any, map: any, google: any): void;
    createCenter(map: any, google: any): void;
    clearSelection(): void;
    setSelection(shape: any): void;
    deleteSelectedShape(): void;
    selectColor(color: any): void;
    setSelectedShapeColor(color: any, google: any): void;
    makeColorButton(color: any, google: any): HTMLSpanElement;
    buildColorPalette(google: any): void;
    createDrawingTool(map: any, google: any): void;
    calcRoute(start: any, end: any, google: any, map: any, showPeajes: any, showGrifos: any): void;
    highlightRoute(index: any, google: any, map: any): void;
    calcDistance(p1: any, p2: any, google: any): string;
    currentPos(google: any, map: any): void;
    handleLocationError(browserHasGeolocation: any, infoWindow: any, pos: any, map: any): void;
    cargarLocations(google: any): void;
    cargarGrifos(google: any): void;
    buscarGrifos(pos: any, google: any, map: any): void;
    setMapOnAll(map: any): void;
    clearMarkers(): void;
    showMarkers(map: any): void;
    deleteMarkers(): void;
    getCurrentPosition(google: any, map: any): void;
}
