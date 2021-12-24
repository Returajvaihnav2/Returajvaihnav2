import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class XmlToJsonService {

  constructor() { }
  xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
      // do attributes
      // if (xml.attributes.length > 0) {
      //   obj["@attributes"] = {};
      //   for (var j = 0; j < xml.attributes.length; j++) {
      //     var attribute = xml.attributes.item(j);
      //     obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      //   }
      // }
      if (xml.attributes.length > 0) {
        obj = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj[attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof (obj[nodeName]) == "undefined") {
          if (nodeName == '#text') {
            obj = this.xmlToJson(item);
          } else {
            obj[nodeName] = this.xmlToJson(item);
          }
        } else {
          if (typeof (obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this.xmlToJson(item));
        }
      }
    }
    return obj;
  };


  JsontoXML(obj) {
    var xml = '';
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += "<" + prop + ">";
          xml += this.JsontoXML(new Object(obj[prop][array]));
          xml += "</" + prop + ">";
        }
      } else if (typeof obj[prop] == "object") {
        xml += this.JsontoXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml
  }

  downloadFile(json, tradeID) {
    const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
    FileSaver(blob, tradeID + '.json');
  }

  downloadXMLFile(xml, tradeID) {
    const blob = new Blob([xml], { type: 'application/xml;charset=UTF-8' });
    FileSaver.saveAs(blob, tradeID + '.xml');

  }
}
