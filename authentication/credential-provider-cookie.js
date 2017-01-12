/**
 * Created by:   Lijian
 * Created on:   2016-11-02
 * Descriptions:
 */
'use strict';

const Encryptor = require('./encryptor');

class CookieCredentialProvider {
  constructor({password, name = 'auth', options = {httpOnly: true, maxAge: 315360000000/*10years*/}} = {}) {
    this.encryptor = new Encryptor({password, algorithm: 'aes192', encoding: 'base64'});
    this.name = name;
    this.options = options;
  }

  getCredential(req) {
    if (!req || !req.cookies) {
      return null;
    }
    let src = this.encryptor.decrypt(req.cookies[this.name]);
    if (!src) {
      return null;
    }
    try {
      return JSON.parse(src);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  setCredential(res, credential) {
    if (!res || typeof res.cookie !== 'function') {
      return;
    }
    if (credential) {
      let value = this.encryptor.encrypt(JSON.stringify(credential));
      value = value ? value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '') : '';
      res.cookie(this.name, value, this.options);
    } else {
      res.clearCookie(this.name, this.options);
    }
  }
}

module.exports = CookieCredentialProvider;
