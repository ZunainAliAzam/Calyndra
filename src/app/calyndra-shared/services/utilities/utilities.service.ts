import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  constructor() {}

  UrlParams(reqUrl: string, params: { [key: string]: any }): string {
    let queryStr = '';
    Object.keys(params).forEach((key, index) => {
      if (
        typeof params[key] === 'object' &&
        params[key] !== null &&
        Object.keys(params[key]).length
      ) {
        Object.keys(params[key]).forEach((subKey) => {
          queryStr = queryStr ? queryStr + '&' : '';
          queryStr = queryStr + `${key}[${subKey}]=${params[key][subKey]}`;
        });
      } else if (Array.isArray(params[key]) && params[key].length) {
        params[key].forEach((value: string) => {
          queryStr = queryStr ? queryStr + '&' : '';
          queryStr = queryStr + `${key}%5B%5D=${value}`;
        });
      } else {
        if (params[key] !== undefined && typeof params[key] !== 'object') {
          queryStr = queryStr ? queryStr + '&' : '';
          queryStr = queryStr + `${key}=${params[key]}`;
        }
      }
    });
    return reqUrl + '?' + queryStr;
  }
}
