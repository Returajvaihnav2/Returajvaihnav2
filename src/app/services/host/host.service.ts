import { ContentService } from '@alfresco/adf-core';
import { Injectable, Inject } from '@angular/core';
import { BrowserStorageService } from '../../utility/browser-storage.service';
import { NodeJsService } from '../nodejs/nodejs.service';
import { WINDOW } from './window.provider';
@Injectable()
export class HostService {

  private logo;
  private domainId;
  public domainTitle;
  public domainCopyRight;
  public domainSupportEMail;
  private logoPromise;
  constructor(@Inject(WINDOW) private window: Window, private nodeService: NodeJsService,
    private contentService: ContentService, private browserService: BrowserStorageService) { }


  getHostname(): string {
    //return 'nextgenclearing.com';
    return this.getMainDomin(this.window.location.hostname);
  }

  getLogoSvg() {
    return new Promise((resolve, reject) => {
      if (!this.logoPromise) {
        this.logoPromise = this.getLogo();
      }
      this.logoPromise.then((data: any) => {
        return resolve(data.svg)
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  getLoginLogo() {
    return new Promise((resolve, reject) => {
      if (!this.logoPromise) {
        this.logoPromise = this.getLogo();
      }
      this.logoPromise.then((data: any) => {
        return resolve(data.login_logo)
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  getLogo() {
    return new Promise((resolve, reject) => {
      const hostname = this.getHostname();
      if (this.logo && this.domainId) {
        this.browserService.setLocalStorageItem('DomainID', this.domainId);
        this.browserService.setLocalStorageItem('DomainName', hostname);
        return resolve(this.logo)
      }
      this.nodeService.getLogo(hostname).then((data: any) => {
        this.logo = data.logo;
        this.domainId = data.domainId;
        this.domainTitle = data.domainTitle;
        this.domainCopyRight = data.domainCopyRight;
        this.domainSupportEMail = data.domainSupportEMail;
        this.browserService.setLocalStorageItem('DomainID', data.domainId);
        this.browserService.setLocalStorageItem('DomainName', hostname);
        return resolve(this.logo)
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  getMainDomin(hostname) {
    const arr = hostname.split('.');
    if (arr.length === 1) {
      return arr[0] === 'localhost' ? 'tritexsolutions.com' : arr[0];
    }
    const hostName = arr[arr.length - 2] + '.' + arr[arr.length - 1];
    const domain = this.browserService.getLocalStorageItem('DomainName');
    if (!domain) {
      this.browserService.setLocalStorageItem('DomainName', hostName);
    }
    return hostName;
  }


  loadBase64() {

    if (!this.logoPromise) {
      this.logoPromise = this.getLogo();
    }
    this.logoPromise.then((logo: any) => {
      const nodeRef = logo.logo_ref.replace('workspace://SpacesStore/', '');
      let url = this.contentService.getContentUrl(nodeRef);
      this.getBase64ImageFromUrl(url)
        .then(result => {
          this.logo.base64 = result;
          this.browserService.setLocalStorageItem('logoBase64', this.logo.base64);
        })
        .catch((err) => {
          console.error(err);
        });
    }).catch((err) => {
      console.error(err);
    })
  }

  getlogoBase64() {
    const base64 = this.logo.base64;
    return base64;
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  getBackground() {
    return new Promise((resolve, reject) => {
      if (!this.logoPromise) {
        this.logoPromise = this.getLogo();
      }
      this.logoPromise.then((data: any) => {
        return resolve(data.background)
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  getFavicon() {
    return new Promise((resolve, reject) => {
      if (!this.logoPromise) {
        this.logoPromise = this.getLogo();
      }
      this.logoPromise.then((data: any) => {
        return resolve(data.favicon)
      }).catch((err) => {
        return reject(err);
      });
    });
  }
}