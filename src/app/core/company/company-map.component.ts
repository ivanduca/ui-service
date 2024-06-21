import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CompanyService } from './company.service';
import { ResultAggregatorService } from '../result-aggregator/result-aggregator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as Leaflet from 'leaflet';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'company-map',
  templateUrl: './company-map.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: `
    .marker-cluster-small, .marker-cluster-small div{
      background-color: lightblue
    }
    .marker-cluster-medium, .marker-cluster-medium div{
      background-color: blue;
      color: white
    }
    .marker-cluster-large, .marker-cluster-large div {
      background-color: violet
    }

  `
})
export class CompanyMapComponent implements OnInit {
  protected static ZOOM: number = 18;
  protected isGEOLoaded: boolean = false;  
  protected options: Leaflet.MapOptions
  protected center;
  protected zoom;
  protected currentMarker: Leaflet.Marker;
  protected map: Leaflet.Map  
  markerClusterData: Leaflet.Marker[] = [];
  markerClusterOptions: Leaflet.MarkerClusterGroupOptions = {
    iconCreateFunction: function(cluster) {
      var childCount = cluster.getChildCount();
      var c = ' marker-cluster-';
      if (childCount < 10) {
        c += 'small';
      } else if (childCount < 100) {
        c += 'medium';
      } else {
        c += 'large';
      }
  
      return new Leaflet.DivIcon({ 
        html: `<div><span>${childCount}</span></div>`, 
        className: `marker-cluster${c}`, 
        iconSize: new Leaflet.Point(40, 40) 
      });
    }
  };

  constructor(
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private resultAggregatorService: ResultAggregatorService,
    protected router: Router) {
  }

  onMapReady(map: Leaflet.Map): void {
    this.map = map;
  }
  
  markerClusterReady(markerCluster: Leaflet.MarkerClusterGroup) {
    if (this.currentMarker) {
      const parent = this.currentMarker.__parent;
      if (parent && parent._zoom == CompanyMapComponent.ZOOM){
        parent.spiderfy();
      }
      this.currentMarker.openPopup();
    }
  }
  public getGeoJson(queryParams: any): Observable<any> {
    if (queryParams.workflowId && queryParams.ruleName) {
      let params = new HttpParams()
        .set(`workflowId`, queryParams.workflowId)
        .set(`ruleName`, queryParams.ruleName);
      return this.resultAggregatorService.getAny(`/v1/aggregator/geojson/nocache`, params);
    } else {
      return this.companyService.getAny(`/v1/geo/geojson`);
    } 
  }

  ngOnInit(): void {
    this.center = new Leaflet.LatLng(42.00, 11.50);
    this.zoom = 6;
    this.route.queryParams.subscribe((queryParams) => {
      this.getGeoJson(queryParams).subscribe((geo: any) => {
        this.isGEOLoaded = true;
        let codiceIpa = queryParams.codiceIpa;
        geo.features.forEach((element: any) => {
          let coordinates = element.geometry.coordinates;
          let lat = coordinates[1];
          let lng = coordinates[0];
          element.properties.companies.forEach((company: any) => {
            let description = `
              <div>
                <strong>
                  <a href="${environment.baseHref}#/search?workflowId=&codiceIpa=${company.codiceIpa}">${company.denominazioneEnte}</a>
                </strong>
              </div>
            `;
            let icon = new Leaflet.divIcon({
              html: `
                <svg class="icon icon-primary icon-sm">
                  <use href="assets/vendor/sprite.svg#it-pa"></use>
                </svg>
              `,
              iconSize: [25, 25],
              iconAnchor: [13, 7]            
            });
            let marker = new Leaflet.marker(new Leaflet.LatLng(lat, lng), {
              icon: icon,
              codiceIpa: company.codiceIpa
            } as Leaflet.MarkerOptions);
            marker.bindPopup(description);
            this.markerClusterData.push(marker);
            if (codiceIpa && codiceIpa == company.codiceIpa) {
              this.center = new Leaflet.LatLng(lat, lng);
              this.zoom = CompanyMapComponent.ZOOM;
              this.currentMarker = marker;
            }
          });
        });
        this.options = {
          layers: this.getLayers(),
          preferCanvas: true
        };
        if (!codiceIpa) {
          this.getCurrentLocation();
        }
      });
    });
  }

  getLayers(): Leaflet.Layer[] {
    return [
      new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      } as Leaflet.TileLayerOptions),
    ] as Leaflet.Layer[];
  };

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position) {
              let lat = position.coords.latitude;
              let lng = position.coords.longitude;
              this.center = new Leaflet.LatLng(lat, lng);
              this.zoom = 15;
              const location = {
                lat,
                lng,
              };
              resolve(location);
            }
          },
          (error) => console.log(error)
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }
}
